USE [GLOBALSAAI]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultaAPINOMSSGCE]    Script Date: 01/07/2026 11:09:03 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<ANA.PIMENTEL>
-- Create date: <21/03/2024>
-- Description:	<SP UTILIZADO PARA LA TAREA QUE CONSULTA A LA API DE SGCE>
-- =============================================
ALTER PROCEDURE [dbo].[sp_ConsultaAPINOMSSGCE]
	-- Add the parameters for the stored procedure here
	@Opcion					AS  TINYINT = 0,
	@IDPedimento			AS	BIGINT = 0,
	@IDFactura				AS	BIGINT = 0,
	@NumeroFactura			AS	VARCHAR(50)	= '',
	@NumeroParte			AS	VARCHAR(50) = '',
	@FraccionArancelaria	AS	VARCHAR(10)	= '',
	@DescripcionArancelaria	AS  VARCHAR(250)= '',
	@IDUsuario				AS	SMALLINT	= 0,
	@JsonEnvio				AS	TEXT		= '',
	@EstatusAPI				AS	SMALLINT	= 0,
	@JsonRespuesta			AS	TEXT		= '',
	@DatosXML				AS	XML			= NULL,
	@IDBloque				AS BIGINT		= 0,
	@PathS3					AS VARCHAR(250) = 0,
	@NombreArchivo			AS VARCHAR(100)	= '',
	@TipoArchivo			AS CHAR(1)		= '',
	@NOM					AS VARCHAR(100)	= '',
	@IDBloqueAgrupados		AS VARCHAR(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	set dateformat 'ymd'
	SET LANGUAGE Spanish; 
	DECLARE
	@FechaActual		AS DATETIME  = dbo.GETDATEGSWII(),
	@IDNoParteA			AS BIGINT	  = 0,
	@IDArchivo			AS BIGINT	  = 0,
	@FilasAfectadas		AS SMALLINT	  = 0,
	@IDAplicacionA		AS TINYINT	  = 8,
	@IdGrupoProv		AS BIGINT	  = 0,
	@count				AS SMALLINT	  = 0,
	@MensajeSQL			AS VARCHAR(100) = '',
	@IDClienteA			AS SMALLINT		= 136,
	@OrigenA			AS VARCHAR(10)	= 'APISGCE',
	@CvePermisoA		AS VARCHAR(5)	= '',
	@ID					AS BIGINT		= 0,
	@CveIdentificadorA	VARCHAR(5)		= '',
	@Complemento1A		VARCHAR(50)		= '',
	@Complemento2A		VARCHAR(50)		= '',
	@Complemento3A		VARCHAR(50)		= '',
	@IDUsuarioA			AS	SMALLINT	= 5662,
	@IDFacturaA			BIGINT			= 0,
	@CveUnidadComercial	VARCHAR(2)		= '',
	@DescripcionFactura VARCHAR(260)	= '',
	@CvePaisOD			VARCHAR(3)		= '',
	@PrecioUnitario		NUMERIC(24,6)  = 0,
	@FechaInicioA		DATETIME		= NULL,
	@FechaFinA			DATETIME		= NULL,
	@estado				BIT				= 0

	SET NOCOUNT ON;
	IF OBJECT_ID('tempdb..#TempPedimentos') IS NOT NULL
		DROP TABLE #TempPedimentos

	IF OBJECT_ID('tempdb..#TempPlantas') IS NOT NULL
		DROP TABLE #TempPlantas

	IF OBJECT_ID('tempdb..#TempFinal') IS NOT NULL
		DROP TABLE #TempFinal

	IF OBJECT_ID('tempdb..#TempDatos') IS NOT NULL
		DROP TABLE #TempDatos
		
	IF OBJECT_ID('tempdb..#DatosProcesar') IS NOT NULL
		DROP TABLE #DatosProcesar

	IF OBJECT_ID('tempdb..#IDBloquesAgrupados') IS NOT NULL
		DROP TABLE #IDBloquesAgrupados

	IF OBJECT_ID('tempdb..#TempVolverAConsultar') IS NOT NULL
		DROP TABLE #TempVolverAConsultar

	IF OBJECT_ID('tempdb..#TempPedimentoFacturas') IS NOT NULL
		DROP TABLE #TempPedimentoFacturas


   IF @Opcion = 1 --[]
	BEGIN

		CREATE TABLE #TempPedimentos (IDPedimento				BIGINT			NOT NULL DEFAULT 0)
		
		CREATE TABLE #TempPedimentoFacturas (
			IDPedimento				BIGINT			NOT NULL DEFAULT 0,
			IDFactura				BIGINT			NOT NULL DEFAULT 0,
			NumeroFactura			VARCHAR(50)		NOT NULL DEFAULT '')

		CREATE TABLE #TempFinal (
			IDPedimento				BIGINT			NOT NULL DEFAULT 0,
			IDFactura				BIGINT			NOT NULL DEFAULT 0,
			NumeroFactura			VARCHAR(50)		NOT NULL DEFAULT '',
			NumeroParte				VARCHAR(50)		DEFAULT '',
			FraccionArancelaria		VARCHAR(10)		DEFAULT '',
			DescripcionArancelaria	VARCHAR(250)	DEFAULT ''
		)
		CREATE INDEX I_TempFinal ON #TempFinal(IDPedimento)
		CREATE INDEX II_TempFinal ON #TempFinal(IDPedimento,NumeroParte,FraccionArancelaria,DescripcionArancelaria)

		--Obtengo las plantas que aplican para este proceso que son las FCSD
		SELECT * INTO #TempPlantas FROM dbo.ctCLIENTESPlantas WHERE IDCliente = 136 AND NombrePlanta like '%FCSD%' and Vigente=1

		--Aplica sólo para el cliente FORD, operaciones de Importación F2 y F3 individuales y consolidados. Aplica para todas las aduanas (incluido terrestre). Responsable: Gabi y Andy.
		--Obtengo los pedimentos de la t501 y verificamos que usen la planta FCSD

		--Obtiendo pedimentos normales/individuales normales fecha de pago t506 tipofecha2
		INSERT INTO #TempPedimentos (IDPedimento)
		SELECT a.IDPedimento
		--SELECT ad.Trafico,t6.Fecha[fechat506],b.TipoPedimento,c.NombrePlanta,a.*
		FROM dbo.T501 a
		INNER JOIN dbo.T501C b ON a.IDPedimento=b.IDPedimento AND b.TipoPedimento='N' 
		INNER JOIN #TempPlantas c ON b.IDPlantaDestino = c.IDPlanta
		INNER JOIN dbo.T506 t6 ON a.idpedimento=t6.idpedimento and t6.CveTipoFecha='2'
		INNER JOIN dbo.CTADUANASNAD ad ON a.CveAduanaDespacho=ad.CveAduana
		LEFT JOIN dbo.T001 t1 ON a.IDPedimento = t1.IDPedimento
		WHERE a.IDCliente=136 AND a.Operacion='I' AND a.CvePedimento IN ('F2','F3') AND ISNULL(t1.FirmaBanco,'') = '' AND ISNULL(a.LineaCaptura,'')='' AND	ad.Trafico not in ('T','') AND t6.Fecha=CONVERT(DATE,@FechaActual)--'2024-05-30'

		UNION ALL

		--Obtienedo pedimentos Consolidados fecha de apertura t506 tipo 100
		SELECT a.IDPedimento
		--SELECT ad.Trafico,t6.Fecha[fechat506],b.TipoPedimento,c.NombrePlanta,a.*
		FROM dbo.T501 a
		INNER JOIN dbo.T501C b ON a.IDPedimento=b.IDPedimento AND b.TipoPedimento='C'
		INNER JOIN #TempPlantas c ON b.IDPlantaDestino = c.IDPlanta
		INNER JOIN dbo.T506 t6 on a.idpedimento=t6.idpedimento and t6.CveTipoFecha='100'
		INNER JOIN dbo.CTADUANASNAD ad ON a.CveAduanaDespacho=ad.CveAduana
		LEFT JOIN dbo.T001 t1 ON a.IDPedimento = t1.IDPedimento
		WHERE a.IDCliente=136 AND a.Operacion='I' AND a.CvePedimento IN ('F2','F3') AND ISNULL(t1.FirmaBanco,'') = '' AND ISNULL(a.LineaCaptura,'')='' AND	ad.Trafico not in ('T','') AND t6.Fecha=CONVERT(DATE,@FechaActual)--'2024-05-30'


		--Obtenemos las facturas del pedimento
		INSERT INTO #TempPedimentoFacturas (IDPedimento,IDFactura,NumeroFactura)
		SELECT a.IDPedimento,a.IDFactura,a.NumeroFactura
		FROM dbo.FacturasPrincipal a
		INNER JOIN #TempPedimentos b ON a.IDPedimento = b.IDPedimento

		--Eliminar las que ya fueron consultadas y se completaron
	
		DELETE A FROM #TempPedimentoFacturas A
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log B ON A.IDFactura=B.IDFactura
		INNER JOIN GSWIntegraciones.dbo.SGCE_NOMS C ON B.IDBloque=C.IDBloque 
		WHERE C.isProcesado=1 and b.isIntegrado=1


		--Completamos los datos
		INSERT INTO #TempFinal (IDPedimento,IDFactura,NumeroFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria)
		SELECT a.IDPedimento,a.IDFactura,a.NumeroFactura,
		CASE WHEN ISNULL(b.NumeroParte,'') <> '' THEN b.NumeroParte ELSE mp.NumeroParte END,
		CASE WHEN ISNULL(b.FraccionArancelaria,'') <> '' THEN b.FraccionArancelaria ELSE mp.Fraccion END,
		CASE WHEN ISNULL(b.DescripcionArancelaria,'') <> '' THEN b.DescripcionArancelaria ELSE mp.DescripcionArancelaria END
		FROM #TempPedimentoFacturas a
		INNER JOIN dbo.FacturasDetalle b ON a.IDFactura = b.IDFactura
		LEFT JOIN dbo.Mapar_0136 mp ON b.NumeroParte = mp.NumeroParte AND b.FraccionArancelaria = mp.Fraccion AND b.DescripcionArancelaria = mp.DescripcionArancelaria
		and mp.Eliminado=0

		--SELECT a.IDPedimento,a.IDFactura,a.NumeroFactura,a.NumeroParte,a.FraccionArancelaria,a.DescripcionArancelaria,@IDUsuarioA[IDUsuario],@FechaActual[Fecha]
		--FROM #TempFinal a
		--WHERE ISNULL(a.NumeroParte,'') <>'' AND ISNULL(a.FraccionArancelaria,'') <>'' AND ISNULL(a.DescripcionArancelaria,NULL) <>''

		INSERT GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log(IDPedimento,IDFactura,NumeroFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria,IDUsuario,Fecha)
		SELECT a.IDPedimento,a.IDFactura,a.NumeroFactura,a.NumeroParte,a.FraccionArancelaria,a.DescripcionArancelaria,@IDUsuarioA,@FechaActual
		FROM #TempFinal a
		WHERE ISNULL(a.NumeroParte,'') <>'' AND ISNULL(a.FraccionArancelaria,'') <>'' AND ISNULL(a.DescripcionArancelaria,NULL) <>''

		--Los pedimentos candidatos a consultar en la api son los que tengan NP, fracción y descripción arancelaria.
		SELECT a.IDPedimento,a.IDFactura,a.NumeroFactura,a.NumeroParte,a.FraccionArancelaria,a.DescripcionArancelaria,B.IDBloque
		FROM #TempFinal a
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log b ON a.NumeroParte = b.NumeroParte COLLATE Modern_Spanish_CI_AS AND a.FraccionArancelaria = b.FraccionArancelaria COLLATE Modern_Spanish_CI_AS AND a.DescripcionArancelaria = b.DescripcionArancelaria COLLATE Modern_Spanish_CI_AS
		WHERE ISNULL(a.NumeroParte,'') <>'' AND ISNULL(a.FraccionArancelaria,'') <>'' AND ISNULL(a.DescripcionArancelaria,NULL) <>'' AND B.isIntegrado = 0;


	END
ELSE IF @Opcion = 2 --[agregamos en el log]
	BEGIN


		INSERT GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log(IDPedimento,IDFactura,NumeroFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria,IDUsuario,JsonEnvio,Fecha)
		SELECT @IDPedimento,@IDFactura,@NumeroFactura,@NumeroParte,@FraccionArancelaria,@DescripcionArancelaria,@IDUsuarioA,@JsonEnvio,@FechaActual

		SET @IDBloque = SCOPE_IDENTITY()

		select @IDBloque


	END
	ELSE IF @Opcion = 3
	BEGIN

		SELECT 
		E.value('@NumeroParte','VARCHAR(50)') [NumeroParte],
		E.value('@FraccionArancelaria', 'VARCHAR(10)') [FraccionArancelaria],
		E.value('@DescripcionArancelaria','VARCHAR(250)') [DescripcionArancelaria],
		E.value('@NOM','VARCHAR(100)')[NOM],
		E.value('@Categoria','VARCHAR(15)')[Categoria],
		E.value('@Estatus','VARCHAR(20)')[Estatus],
		E.value('@FechaInicio','VARCHAR(25)')[FechaInicio],
		E.value('@FechaFin','VARCHAR(25)')[FechaFin],
		E.value('@Documento','VARCHAR(50)')[Documento],
		E.value('@DocumentoBase64','VARCHAR(500)')[DocumentoBase64],
		E.value('@Identificador','VARCHAR(5)')[Identificador],
		E.value('@Complemento1','VARCHAR(50)')[Complemento1],
		E.value('@Complemento2','VARCHAR(50)')[Complemento2],
		E.value('@Complemento3','VARCHAR(50)')[Complemento3],
		E.value('@Permiso','VARCHAR(5)')[Permiso],
		E.value('@NumCertificacion','VARCHAR(50)')[NumCertificacion],
		E.value('@Observaciones','VARCHAR(150)')[Observaciones],
		E.value('@RutaS3','VARCHAR(150)') [RutaS3]
		INTO #TempDatos
		FROM @DatosXML.nodes('DatosAPI/Info') X(E)

		--idbloques agrupados
		SELECT A.Data INTO #IDBloquesAgrupados FROM dbo.Split(@IDBloqueAgrupados,',') A

		--se eliminan los que se tendran que volver a consultar(ya no poque tenemos el campo isCompleto)
		--DELETE #TempDatos WHERE UPPER(Categoria)='SEGURIDAD' AND UPPER(Estatus) = 'SIN CERTIFICADO'
		--DELETE #TempDatos WHERE UPPER(Categoria)='ETIQUETADO' AND UPPER(Estatus) IN ('N/A','NA','','NULL')

		UPDATE #TempDatos SET FechaInicio=NULL WHERE FechaInicio='N/A'
		UPDATE #TempDatos SET FechaFin=NULL WHERE FechaFin='N/A'
		
		ALTER TABLE #TempDatos ADD FechaInicioReset DATETIME DEFAULT NULL
		ALTER TABLE #TempDatos ADD FechaFinReset DATETIME DEFAULT NULL

		UPDATE #TempDatos SET FechaInicioReset= CONVERT(DATETIME,FechaInicio,103) WHERE FechaInicio<>'N/A'
		UPDATE #TempDatos SET FechaFinReset= CONVERT(DATETIME,FechaFin,103) WHERE FechaFin<>'N/A'

	BEGIN TRY
		BEGIN TRANSACTION

		--insertar en la tabla de trabajo mediante un ciclo
		SET @count = (SELECT COUNT(1) FROM #IDBloquesAgrupados)

		WHILE @count > 0
		BEGIN

			SET @IDBloque = (SELECT TOP 1 Data FROM #IDBloquesAgrupados ORDER BY Data DESC)
			--esta es mi tabla de trabajo
			INSERT INTO GSWIntegraciones.dbo.SGCE_NOMS(IDBloque,NumeroParte,FraccionArancelaria,DescripcionArancelaria,NOM,Categoria,Estatus,FechaInicio,FechaFin,Documento,DocumentoBase64,Identificador,Complemento1,Complemento2,Complemento3,Permiso,NumCertificacion,Observaciones,RutaS3)
			SELECT @IDBloque,A.NumeroParte,A.FraccionArancelaria,A.DescripcionArancelaria,A.NOM,A.Categoria,A.Estatus
			,A.FechaInicioReset [FechaInicio]
			,A.FechaFinReset [FechaFin]
			,A.Documento,'',A.Identificador,A.Complemento1,A.Complemento2,A.Complemento3,A.Permiso,A.NumCertificacion,A.Observaciones,A.RutaS3
			FROM #TempDatos A

			--LEFT JOIN GSWIntegraciones.dbo.SGCE_NOMS B ON A.NumeroParte = B.NumeroParte AND A.NOM = B.NOM
			--WHERE B.ID IS NULL
			SET @ID = SCOPE_IDENTITY()
			SET @FilasAfectadas = @@ROWCOUNT

			IF @FilasAfectadas <> 0
			BEGIN
				--ACTUALIZAMOS EN EL LOG QUE FUE INTEGRACIÓN CON ÉXITO
				UPDATE A SET A.Mensaje = 'INTEGRADO EN GSWIntegraciones.dbo.SGCE_NOMS',A.isIntegrado=1
				FROM GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log A
				INNER JOIN GSWIntegraciones.dbo.SGCE_NOMS B ON A.IDBloque = B.IDBloque
				WHERE A.IDBloque = @IDBloque

				--ACTUALIZAMOS LOS REGISTROS QUE YA NO SE VAN A VOLVER A CONSULTAR ACORDE A LA TAREA NADG-456
				UPDATE A SET A.isCompleto=1
				FROM GSWIntegraciones.dbo.SGCE_NOMS A
				WHERE A.ID =@ID 

				UPDATE A SET A.isCompleto=0
				FROM GSWIntegraciones.dbo.SGCE_NOMS A
				WHERE A.ID =@ID AND A.Categoria IN ('SEGURIDAD','ETIQUETADO') AND A.Estatus IN ('SIN CERTIFICADO','N/A','')


			END
			--ELSE
			--BEGIN
			--	--ACTUALIZAMOS EN EL LOG
			--	UPDATE A SET A.Mensaje = 'EL NUMERO DE PARTE Y NOM YA EXISTEN EN GSWIntegraciones.dbo.SGCE_NOMS'
			--	FROM GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log A
			--	WHERE A.IDBloque = @IDBloque
			--END
			DELETE FROM #IDBloquesAgrupados WHERE Data = @IDBloque
			SET @count = (SELECT COUNT(1) FROM #IDBloquesAgrupados)
		END


		COMMIT TRANSACTION 
				
	END TRY
	BEGIN CATCH
			ROLLBACK TRANSACTION
	        			PRINT 
	         				'Error ' + CONVERT(varchar(50), ERROR_NUMBER()) +
	           				', Severity ' + CONVERT(varchar(5), ERROR_SEVERITY()) +
	           				', State ' + CONVERT(varchar(5), ERROR_STATE()) +
	           				', Line ' + CONVERT(varchar(5), ERROR_LINE())
	 
	 			
	         			--SET @ErrSql =ERROR_MESSAGE();

						UPDATE GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log SET Mensaje =SUBSTRING(ERROR_MESSAGE(),1,99)	WHERE IDBloque = @IDBloque
	           
	           			--RAISERROR (@ErrSql,16,1)
	END CATCH
	
	DROP TABLE #IDBloquesAgrupados

	END
	ELSE IF @Opcion = 4
	BEGIN
		
		UPDATE GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log SET JsonEnvio=@JsonEnvio,JsonRespuestaS3 = @PathS3 WHERE IDBloque = @IDBloque

	END
	ELSE IF	@Opcion = 5 --[OBTENEMOS LOS DATOS QUE FALTAN POR PROCESAR]
	BEGIN

		CREATE TABLE #DatosProcesar(
			ID							BIGINT			PRIMARY KEY 
			,IDBloque					BIGINT			NOT NULL DEFAULT 0
			,IDFactura					BIGINT			NOT NULL DEFAULT 0
			,NumeroParte				VARCHAR(50)		NOT NULL DEFAULT ''
			,FraccionArancelaria		VARCHAR(10)		NOT NULL DEFAULT ''
			,DescripcionArancelaria		VARCHAR(250)	NOT NULL DEFAULT ''
			,NOM						VARCHAR(100)	NOT NULL DEFAULT ''
			,Identificador				VARCHAR(5)		NOT NULL DEFAULT ''
			,Complemento1				VARCHAR(50)		NOT NULL DEFAULT ''
			,Complemento2				VARCHAR(50)		NOT NULL DEFAULT ''
			,Complemento3				VARCHAR(50)		NOT NULL DEFAULT ''
			,Permiso					VARCHAR(5)		NOT NULL DEFAULT ''
			,NumCertificacion			VARCHAR(50)		NOT NULL DEFAULT ''
			,RutaS3						VARCHAR(250)	NOT NULL DEFAULT ''
			,FechaInicio				DATETIME		NULL
			,FechaFin					DATETIME		NULL
			--,ExisteMapar				BIT				NOT NULL DEFAULT 0
		)
		CREATE INDEX I_DatosProcesar ON #DatosProcesar(NOM,NumeroParte)

		INSERT INTO #DatosProcesar (ID,IDBloque,IDFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria,NOM,Identificador,Complemento1,Complemento2,Complemento3,Permiso,NumCertificacion,RutaS3,FechaInicio,FechaFin)
		--obtenemos los identificadores
		SELECT A.ID,A.IDBloque,B.IDFactura,A.NumeroParte,A.FraccionArancelaria,A.DescripcionArancelaria,A.NOM,A.Identificador,A.Complemento1,A.Complemento2,A.Complemento3,A.Permiso,A.NumCertificacion,A.RutaS3,A.FechaInicio,A.FechaFin
		FROM GSWIntegraciones.dbo.SGCE_NOMS A
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log B ON A.IDBloque=B.IDBloque
		WHERE A.isProcesado = 0 AND A.isSave=0 AND A.isCompleto=1 AND A.Identificador not in ('','N/A') AND A.Permiso in ('','N/A') AND A.NOM NOT IN ('','N/A')
		UNION ALL
		--obtenemos los permisos pensdienets a procesar
		SELECT A.ID,A.IDBloque,B.IDFactura,A.NumeroParte,A.FraccionArancelaria,A.DescripcionArancelaria,A.NOM,A.Identificador,A.Complemento1,A.Complemento2,A.Complemento3,A.Permiso,A.NumCertificacion,A.RutaS3,A.FechaInicio,A.FechaFin
		FROM GSWIntegraciones.dbo.SGCE_NOMS A
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log B ON A.IDBloque=B.IDBloque
		WHERE A.isProcesado = 0 AND A.isSave=0 AND A.isCompleto=1 AND A.Identificador in ('','N/A') AND A.Permiso not in ('','N/A') AND A.NOM NOT IN ('','N/A')

		--Siempre se va a respetar lo que consultó gsw
		UPDATE A SET A.NumeroParte = B.NumeroParte, A.FraccionArancelaria = B.FraccionArancelaria, A.DescripcionArancelaria = B.DescripcionArancelaria
		FROM #DatosProcesar A
		INNER JOIN globalsaai_log.dbo.ConsultaAPINOMSSGCE_Log B ON A.IDBloque = B.IDBloque


		--select * from #DatosProcesar
		--OBTENEMOS EL IDPROVEEDOR
		SET @IdGrupoProv =(SELECT IdGrupoProv FROM ctClientesProvHomologado where idcliente=@IDClienteA)

		--INICIO DEL CICLO PARA AGREGAR LOS NUMEROS DE PARTE QUE NO EXISTAN EN MAPAR
		SET @count = (SELECT count(1) FROM #DatosProcesar)

		WHILE @count > 0
		BEGIN

			BEGIN TRY
				BEGIN TRANSACTION
					SET @ID = (SELECT TOP 1 ID FROM #DatosProcesar ORDER BY ID)
					SELECT @IDBloque = IDBloque,
							@IDFacturaA = IDFactura,
							@NOM = NOM,
							@NumeroParte =NumeroParte,
							@DescripcionArancelaria = DescripcionArancelaria,
							@FraccionArancelaria = FraccionArancelaria,
							@CvePermisoA = UPPER(Permiso),
							@CveIdentificadorA = UPPER(Identificador),
							@Complemento1A = Complemento1,
							@Complemento2A = Complemento2,
							@Complemento3A = Complemento3,
							@PathS3 = RutaS3,
							@FechaInicioA = FechaInicio,
							@FechaFinA	= FechaFin
							FROM #DatosProcesar WHERE ID=@ID

					PRINT @NOM
					PRINT @NumeroParte
					PRINT @DescripcionArancelaria
					PRINT @FraccionArancelaria

					--===[VERIFICAMOS SI EXISTE EL NUMERO DE PARTE EN dbo.MAPAR_0136]===
					--se le da prioridad a la tabla de dbo.MAPAR_0136
					--validamos si esta activo en mapar_0136
					SET @IDNoParteA = (SELECT IdNoParte FROM dbo.MAPAR_0136 WHERE IdGrupoProv=@IdGrupoProv AND NumeroParte = @NumeroParte AND Eliminado=0) 
					

					IF isnull(@IDNoParteA,'') in (0,'')
					BEGIN
						--validamos si esta activo en MaparEtiquetas_0136 y que este activo
						SET @IDNoParteA = (SELECT IdNoParte FROM dbo.MaparEtiquetas_0136 WHERE NpAlias = @NumeroParte AND Eliminado=0)
						IF isnull(@IDNoParteA,'') not in (0,'')
						BEGIN
							--esto significa que si lo encontró en maparetiquetas_0136 entonces continua el proceso
							GOTO ContinuarProceso
						END

						--Verificamos si existe pero en inactivo
						SET @IDNoParteA = (SELECT IdNoParte FROM dbo.MAPAR_0136 WHERE IdGrupoProv=@IdGrupoProv AND NumeroParte = @NumeroParte AND Eliminado=1)

						IF isnull(@IDNoParteA,'') not in (0,'')
						BEGIN
							--esto significa que si lo encontró en MAPAR_0136 como inactivo, entonces procedemos a activarlo
							UPDATE dbo.MAPAR_0136 SET Eliminado=0, IdUsuarioModif=@IDUsuarioA,FechaModif=@FechaActual WHERE IdGrupoProv=@IdGrupoProv AND									NumeroParte = @NumeroParte
							SET @FilasAfectadas = @@ROWCOUNT

							if @FilasAfectadas <> 0
									BEGIN
									PRINT 'ACTIVADOOOOO '
										EXEC sp_Mapar_Log 
										@Id_Aplicacion=@IDAplicacionA,
										@Id_Pagina=0,
										@Id_Evento=30,
										@Id_Cliente=@IDClienteA,
										@NombreTabla='Mapar_0136',
										@NombreCampoLLave1='IdNoParte',
										@ValorCampoLlave1=@IDNoParteA,
										@NombreCampoLLave2='NumeroParte',
										@ValorCampoLlave2=@NumeroParte,
										@NombreCampo='',
										@ValorAnterior=1,
										@ValorNuevo=0,
										@Usuario=@IDUsuarioA,
										@NombreCampoLLave3='Fraccion',
										@ValorCampoLlave3=@FraccionArancelaria,
										@OrigenCambio=@OrigenA,
										@UsuarioOriginalGSW= ''
									END
							GOTO ContinuarProceso
						END
						
					END
					ELSE
					BEGIN
						GOTO ContinuarProceso
					END
					


					--print @IDNoParteA
					
					--PROCESO PARA DAR DE ALTA EN EL dbo.MAPAR_0136 UN NUEVO NP
					SELECT TOP 1 
					@CveUnidadComercial = CveUnidadComercial,
					@DescripcionFactura = DescripcionFactura,
					@DescripcionArancelaria = DescripcionArancelaria,
					@CvePaisOD	= CvePaisOD,
					@PrecioUnitario = PrecioUnitario
					FROM dbo.FacturasDetalle WHERE IDFactura=@IDFacturaA AND NumeroParte=@NumeroParte

					INSERT INTO dbo.MAPAR_0136(IdGrupoProv,	NumeroParte,DescripcionArancelaria,DescripcionFactura,Fraccion,PaisOD,PrecioUnitario,UnidadComercial,IdUsuario,FechaAlta,Eliminado,UsuarioOriginal,IdUsuarioClasif,FechaClasif)
		SELECT @IdGrupoProv,@NumeroParte,@DescripcionArancelaria,@DescripcionFactura,@FraccionArancelaria,@CvePaisOD,@PrecioUnitario,@CveUnidadComercial,@IDUsuarioA,@FechaActual,0,@OrigenA,@IDUsuarioA,@FechaActual

					SET @IDNoParteA = SCOPE_IDENTITY()

					IF @IDNoParteA <> 0
						BEGIN
							EXEC sp_Mapar_Log 
								@Id_Aplicacion=@IDAplicacionA,
								@Id_Pagina=0,
								@Id_Evento=143,
								@Id_Cliente=@IDClienteA,
								@NombreTabla='Mapar_0136',
								@NombreCampoLLave1='IdNoParte',
								@ValorCampoLlave1=@IDNoParteA,
								@NombreCampoLLave2='NumeroParte',
								@ValorCampoLlave2=@NumeroParte,
								@NombreCampo='',
								@ValorAnterior='',
								@ValorNuevo='',
								@Usuario=@IDUsuarioA,
								@NombreCampoLLave3='Fraccion',
								@ValorCampoLlave3=@FraccionArancelaria,
								@OrigenCambio=@OrigenA,
								@UsuarioOriginalGSW= ''
						END

					
					ContinuarProceso:
					--==========================================================================================

					--===[PROCESO PARA GUARDAR LA INFO DE LOS PERMISOS EN dbo.MaparRRNA_Permisos553]===
					IF @CvePermisoA NOT IN ('','N/A')
					BEGIN

						--Guardamos el permiso
						--se tiene que editar el sp para agregar el cliente y el usuario de la api para permitir registrar
						EXEC sp_MaparRRNA_Permisos553
							@Opcion = 0,
							@IdCliente = @IDClienteA,
							@IdNoParte = @IDNoParteA,
							@CvePermiso = @CvePermisoA,
							@FirmaElectronica = '',
							@NumeroPermiso = @NOM,
							@IdUsuario = @IDUsuarioA,
							@OrigenCambio = @OrigenA,
							@IDAPLICACION = @IDAplicacionA,
							@IDPAGINA = 0,
							@RutaS3 = @PathS3

						--UPDATE B SET B.FechaInicio=@FechaInicioA,B.FechaFin=@FechaFinA 
						--FROM GSWIntegraciones.dbo.SGCE_NOMS A WITH (NOLOCK)
						--INNER JOIN dbo.MaparRRNA_Permisos553 B WITH (NOLOCK) ON B.IdNoParte=@IDNoParteA AND B.IdCliente=@IDClienteA AND B.CvePermiso = @CvePermisoA AND B.NumeroPermiso = @NOM
						--WHERE B.Activo=1 AND IDUsuarioAlta=@IDUsuarioA AND Origen=@OrigenA AND A.ID=@ID

						UPDATE A SET A.isSave = 1
						FROM GSWIntegraciones.dbo.SGCE_NOMS A WITH (NOLOCK)
						INNER JOIN dbo.MaparRRNA_Permisos553 B WITH (NOLOCK) ON B.IdNoParte=@IDNoParteA AND B.IdCliente=@IDClienteA AND B.CvePermiso = @CvePermisoA AND B.NumeroPermiso = @NOM
						WHERE B.Activo=1 AND IDUsuarioAlta=@IDUsuarioA AND Origen=@OrigenA AND A.ID=@ID
						
					END
					
					--==========================================================================================
					--===[PROCESO PARA GUARDAR LA INFO DE LOS PERMISOS EN dbo.MaparRRNA_Identificadores554]===
					IF @CveIdentificadorA NOT IN ('','N/A')
					BEGIN
						--select 'entro al de identificador'
						--select @IDClienteA,@IDNoParteA,@CveIdentificadorA,@NOM,@IDUsuarioA,@Origen,@IDAplicacionA
					
						--Guardamos el permiso
						--se tiene que editar el sp para agregar el cliente y el usuario de la api para permitir registrar
						EXEC sp_MaparRRNA_Identificadores554
								@Opcion = 0,
								@IdCliente = @IDClienteA,
								@IdNoParte = @IDNoParteA,
								@CveIdentificador = @CveIdentificadorA,
								@Complemento1 = @Complemento1A,
								@Complemento2 = @Complemento2A,
								@Complemento3 = @Complemento3A,
								@IdUsuario = @IDUsuarioA,
								@OrigenCambio = @OrigenA,
								@Referencia ='',
								@IdAplicacion = @IDAplicacionA,
								@IdPagina=0,
								@RutaS3 = @PathS3

						--UPDATE GSWIntegraciones.dbo.SGCE_NOMS SET isSave = 1 WHERE ID = @ID
						--UPDATE B SET B.FechaInicio=@FechaInicioA,B.FechaFin=@FechaFinA  
						--FROM GSWIntegraciones.dbo.SGCE_NOMS A WITH (NOLOCK)
						--INNER JOIN dbo.MaparRRNA_Identificadores554 B WITH (NOLOCK) ON B.IdNoParte=@IDNoParteA AND B.IdCliente=@IDClienteA AND B.CveIdentificador = @CveIdentificadorA AND B.Complemento1 = @Complemento1A AND B.Complemento2 = @Complemento2A AND B.Complemento3 = @Complemento3A
						--WHERE B.Activo=1 AND IDUsuarioAlta=@IDUsuarioA AND Origen=@OrigenA AND A.ID=@ID

						UPDATE A SET A.isSave = 1
						FROM GSWIntegraciones.dbo.SGCE_NOMS A WITH (NOLOCK)
						INNER JOIN dbo.MaparRRNA_Identificadores554 B WITH (NOLOCK) ON B.IdNoParte=@IDNoParteA AND B.IdCliente=@IDClienteA AND B.CveIdentificador = @CveIdentificadorA AND B.Complemento1 = @Complemento1A AND B.Complemento2 = @Complemento2A AND B.Complemento3 = @Complemento3A
						WHERE B.Activo=1 AND IDUsuarioAlta=@IDUsuarioA AND Origen=@OrigenA AND A.ID=@ID

					END
								
					--==========================================================================================
					fin:
					--DELETE #DatosProcesar where NOM=@NOM AND NumeroParte = @NumeroParte
					DELETE #DatosProcesar  WHERE ID = @ID

					SET @count =  (SELECT count(1) FROM #DatosProcesar)

				COMMIT TRANSACTION 
				
				UPDATE GSWIntegraciones.dbo.SGCE_NOMS SET isProcesado = 1 WHERE ID = @ID

			END TRY
				BEGIN CATCH
					ROLLBACK TRANSACTION
	        					PRINT 
	         						'Error ' + CONVERT(varchar(50), ERROR_NUMBER()) +
	           						', Severity ' + CONVERT(varchar(5), ERROR_SEVERITY()) +
	           						', State ' + CONVERT(varchar(5), ERROR_STATE()) +
	           						', Line ' + CONVERT(varchar(5), ERROR_LINE())
	 
	 			
	         					SET @MensajeSQL =ERROR_MESSAGE();
	           
	           					RAISERROR (@MensajeSQL,16,1)
				END CATCH
		END

		
	

		--select * from dbo.Mapar_0136
		--SELECT * FROM #DatosProcesar
		DROP TABLE #DatosProcesar
		SELECT 'OK'

	END
	ELSE IF @Opcion = 6 --[Se vuelven a consultar las que se marcaron para este evento, consultar nuevamente a la api]
	BEGIN
		
		SELECT  B.IDPedimento,B.IDFactura,B.NumeroFactura,B.NumeroParte,B.FraccionArancelaria,B.DescripcionArancelaria,@IDUsuarioA[IDUsuario],@FechaActual[FechaActual],B.IDBloque[IDBloqueOrigen],A.ID
		INTO #TempVolverAConsultar
		FROM GSWINTEGRACIONES.dbo.SGCE_NOMS A
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log B ON A.IDBloque=B.IDBloque
		WHERE A.IsCompleto=0 


		INSERT GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log(IDPedimento,IDFactura,NumeroFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria,IDUsuario,Fecha,IDBloqueOrigen)
		SELECT IDPedimento,IDFactura,NumeroFactura,NumeroParte,FraccionArancelaria,DescripcionArancelaria,IDUsuario,FechaActual,IDBloqueOrigen FROM #TempVolverAConsultar


		UPDATE A set A.isCompleto=1
		FROM GSWINTEGRACIONES.dbo.SGCE_NOMS A
		INNER JOIN #TempVolverAConsultar B ON A.ID = B.ID


		--select * from #TempVolverAConsultar
		SELECT A.IDPedimento,A.IDFactura,A.NumeroFactura,A.NumeroParte,A.FraccionArancelaria,A.DescripcionArancelaria,B.IDBloque[IDBloque] FROM #TempVolverAConsultar A
		INNER JOIN GLOBALSAAI_LOG.dbo.ConsultaAPINOMSSGCE_Log B ON a.IDBloqueOrigen = b.IDBloqueOrigen
		

		DROP TABLE #TempVolverAConsultar

	END
	ELSE IF	@Opcion = 100
	BEGIN
		--exec sp_ConsultaAPINOMSSGCE @Opcion=5
		--select top 10 IdGrupoProv from Mapar_Archivos WHERE IDCLIENTE=136 GROUP BY IdGrupoProv
		--obtenemos el id del numero de parte
		SELECT @IDNoParteA = IdNoParte, @IDGrupoProv = IDGrupoProv
		FROM dbo.Mapar_0136 WHERE NumeroParte = @NumeroParte AND Eliminado = 0

		SET @IDArchivo = (SELECT MAX(IdArchivo) FROM dbo.Mapar_Archivos)
		
		INSERT INTO dbo.Mapar_Archivos (IdCliente,IDGrupoProv,IdNoParte,IdArchivo,RutaArchivo,NombreArchivo,TipoArchivo,Descripcion,Eliminado,IdUsuario,FechaAlta)
			SELECT 136,@IDGrupoProv,@IDNoParteA,(@IDArchivo+1),@PathS3,@NombreArchivo,@TipoArchivo,'APISGCE',0,5662,@FechaActual

	END

END
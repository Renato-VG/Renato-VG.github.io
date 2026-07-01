Imports System.Configuration
Imports System.IO
Imports System.Net
Imports System.Net.Http
Imports System.Net.Http.Headers
Imports System.Reflection
Imports System.Text
Imports capaComun.CConsultaAPISGCE
Imports Newtonsoft.Json
Imports Newtonsoft.Json.Linq

Module Module1
    Dim URL As String = ""
    Dim _sAPIUsuario As String = ""
    Dim _sAPIPassword As String = ""
    Dim TipoInicio As String = ""
    Dim RutaLOG As String = ""
    Dim RutaTempJson As String = ""
    Sub Main()
        Try
            URL = ConfigurationManager.AppSettings.Get("URL")
            _sAPIUsuario = ConfigurationManager.AppSettings.Get("UserAPI")
            _sAPIPassword = ConfigurationManager.AppSettings.Get("PassAPI")
            TipoInicio = ConfigurationManager.AppSettings.Get("TIPO_INICIO")
            RutaLOG = ConfigurationManager.AppSettings.Get("RutaLOG")
            RutaTempJson = ConfigurationManager.AppSettings.Get("TempRutaJson")

            Console.Title = ".::PROCESO CONSULTA API SGCE::."
            Console.WriteLine("INICIO PROCESO")

            Console.WriteLine("ESPECIFIQUE LOS PARAMETROS PARA EJECUTAR LA TAREA")
            Console.WriteLine("CONSULTA A LA API..........: [ ""1"" ] EJEMPLO: 1 ")
            Console.WriteLine("PROCESAR RESPUESTAS DE LA API..........: [ ""2"" ] EJEMPLO: 2 ")
            Console.WriteLine("REGISTROS QUE SE REQUIEREN VOLVER A CONSULTAR.........: [ ""3"" ] EJEMPLO: 3 ")
            Console.WriteLine("VERIFICACION DE CERTIFICADOS.........: [ ""4"" ] EJEMPLO: 3 ")
            Console.WriteLine("SALIR DE LA APLICACION...................: [ ""S"" ] ")
            Console.WriteLine("ESCRIBA EL PARAMETRO A EJECUTAR")

            Dim _Parametros = Console.ReadLine()

            If _Parametros.Count = 0 Then
                Console.WriteLine("DEBE ESPECIFICAR AL MENOS UN PARAMETRO")
                GoTo FinProceso
            End If

            If _Parametros.Equals("1") Then
                EnviarDatosConsulta(1)
            ElseIf _Parametros.Equals("2") Then
                ProcesarRespuestas()
            ElseIf _Parametros.Equals("3") Then
                EnviarDatosConsulta(6)
            ElseIf _Parametros.Equals("4") Then
                'EnviarDatosConsulta(6)
            End If




FinProceso:
        Catch ex As Exception
            Console.WriteLine(ex.Message)
        Finally
            Console.WriteLine("PROCESO CONCLUIDO...")
            Console.ReadLine()
        End Try
    End Sub


    Public Async Sub EnviarDatosConsulta(ByVal opcion As Integer)

        Try
            'Dim bContinuar As Boolean = True
            Dim o As New CapaLogica.LConsultaAPISGCE

            Console.WriteLine(Now.ToString + "Consultando Números de Partes pendientes de envío")
            GrabarLog(String.Format("{0} Consultando Números de Partes pendientes de envío", Now.ToString))

            Dim miListaNumPartes As New List(Of capaComun.CConsultaAPISGCE.SolicitudAPI)
            miListaNumPartes = o.ConsultaPendientes(opcion)

            If miListaNumPartes.Count = 0 Then
                Console.WriteLine(Now.ToString + "No hay números de parte para consultar")
                GrabarLog("No hay números de parte para consultar")
                Exit Sub
            End If

            Console.WriteLine(Now.ToString + " Total de Números de Partes pendientes: " + miListaNumPartes.Count.ToString)
            GrabarLog(String.Format("{0} Total de Números de Partes pendientes: {1}", Now.ToString, miListaNumPartes.Count.ToString))

            Dim sToken = String.Empty


            'Generacion de Token, tiene una duracion de 30 minutos
            Console.WriteLine(Now.ToString + " Solicitando Token de Autorización...")
            GrabarLog(String.Format("{0} Solicitando Token de Autorización...", Now.ToString))

            Dim TokenAutorizacion As Task(Of String) = SolicitarToken()
            sToken = Await TokenAutorizacion
            Console.WriteLine(Now.ToString + " Token de Autorización:" + sToken)
            GrabarLog(String.Format("{0} Token de Autorización:{1}", Now.ToString, sToken))

            For Each item In (From A In miListaNumPartes Select A.sNumeroParte, A.sFraccion, A.sDecripcion).Distinct
                'Dim _LtsAgrupada As New List(Of SolicitudAPI)

                '_LtsAgrupada = miListaNumPartes.Where(Function(bb) bb.sNumeroParte = item.sNumeroParte And bb.sFraccion = item.sFraccion And bb.sDecripcion = item.sDecripcion)
                Dim _LtsAgrupada = miListaNumPartes.Where(Function(bb) bb.sNumeroParte = item.sNumeroParte And bb.sFraccion = item.sFraccion And bb.sDecripcion = item.sDecripcion)

                Dim IDBloque = _LtsAgrupada.Where(Function(bb) bb.sNumeroParte = item.sNumeroParte And bb.sFraccion = item.sFraccion And bb.sDecripcion = item.sDecripcion).First.IDBloque

                Console.WriteLine(String.Format("{0} Agrupando  NumParte:{1} Fraccion:{2} Descripcion:{3} IDBloque:{4} Total:{5}", Now.ToString, item.sNumeroParte, item.sFraccion, item.sDecripcion, IDBloque, _LtsAgrupada.Count))
                GrabarLog(String.Format("{0} Agrupando  NumParte:{1} Fraccion:{2} Descripcion:{3} IDBloque:{4} Total:{5}", Now.ToString, item.sNumeroParte, item.sFraccion, item.sDecripcion, IDBloque, _LtsAgrupada.Count))

                'Variables/objetos generales
                Dim sResponseBody As String = ""
                ''Objeto para solicitud
                Dim objRequest As HttpWebRequest
                Dim URLRequest = String.Format("{0}{1}", URL, "ConsultaDocumentoPorNPFraccion")
                Dim sJsonCarga As String = ""
                Dim LtsResponse As New List(Of ResponseAPI)

                Try

                    Console.WriteLine(Now.ToString + String.Format("Consultando API NumParte:{0} Fraccion:{1} Descripcion:{2} IDBloque:{3}", item.sNumeroParte, item.sFraccion, item.sDecripcion, IDBloque))

                    GrabarLog(String.Format("{3} Consultando API NumParte:{0} Fraccion:{1} Descripcion:{2} IDBloque:{4}", item.sNumeroParte, item.sFraccion, item.sDecripcion, Now.ToString, IDBloque))



                    'Crear URL
                    Dim obj_web As WebRequest = WebRequest.Create(URLRequest)

                    'SE CREA LA PETICIÓN
                    objRequest = obj_web
                    objRequest.Method = "GET"
                    objRequest.ContentType = "application/json"
                    objRequest.Accept = "application/json"
                    objRequest.Headers.Add("Authorization", "Bearer " + sToken)

                    Dim type = objRequest.GetType()
                    Dim currentMethod = type.GetProperty("CurrentMethod", BindingFlags.NonPublic Or BindingFlags.Instance).GetValue(objRequest)

                    Dim methodType = currentMethod.GetType()
                    methodType.GetField("ContentBodyNotAllowed", BindingFlags.NonPublic Or BindingFlags.Instance).SetValue(currentMethod, False)

                    'Asigna los valores del JSON
                    'Dim numparteTest = "27208647486"
                    'Dim FraccionTest = "8517621702"
                    'Dim DescripcionTest = "Set of seals/gaskets / E-transmission"
                    sJsonCarga = "[{""sNumeroParte"":""" & item.sNumeroParte & ""","
                    sJsonCarga += """sFraccion"":""" & item.sFraccion & ""","
                    sJsonCarga += """sDescripcion"":""" & item.sDecripcion & """}]"

                    'item.JsonEnvio = sJsonCarga


                    'Convierte a Bytes
                    Dim byteArray = Encoding.UTF8.GetBytes(sJsonCarga)
                    'Asinga el contenido
                    objRequest.ContentLength = byteArray.Length
                    'SE COLOCA EL USING DE DATOS
                    Using requestStream = objRequest.GetRequestStream
                        requestStream.Write(byteArray, 0, byteArray.Length)
                        requestStream.Close()

                    End Using

                    'SE COLOCA EL USING DE DATOS
                    Using objWebResponse As WebResponse = objRequest.GetResponse()
                        'SE COLOCA EL USING DE STREAM
                        Using objStrReader As Stream = objWebResponse.GetResponseStream()
                            If Not objStrReader Is Nothing Then
                                Using objReader As StreamReader = New StreamReader(objStrReader)
                                    sResponseBody = objReader.ReadToEnd()
                                End Using
                            End If
                        End Using
                    End Using

                    ' Parse JSON array
                    Dim jsonArray As JArray = JArray.Parse(sResponseBody)
                    'item.JsonRespuesta = sResponseBody.ToString

                    'se agregan a las demás facturas que compartan el mismo numero de parte, fracción y descripción
                    For Each a In _LtsAgrupada
                        a.JsonEnvio = sJsonCarga
                        a.JsonRespuesta = sResponseBody.ToString
                    Next

                    ' Get the count of arrays within the JSON array
                    Dim numberOfArrays As Integer = jsonArray.Count

                    For i As Integer = 0 To numberOfArrays - 1
                        Dim ObjResponse As New ResponseAPI
                        Dim JArrayR As JObject = CType(jsonArray(i), JObject)

                        With ObjResponse
                            .sNumeroParte = JArrayR("sNumeroParte").ToString()
                            .sDescripcion = JArrayR("sDescripcion").ToString()
                            .sFraccion = JArrayR("sFraccion").ToString()
                            .sNOM = JArrayR("sNOM").ToString()
                            .sCategoria = JArrayR("sCategoria").ToString()
                            .sEstatus = JArrayR("sEstatus").ToString()
                            .sClave = JArrayR("sClave").ToString()
                            .sFechaInicio = JArrayR("sFechaInicio").ToString()
                            .sFechaFin = JArrayR("sFechaFin").ToString()
                            .sDocumento = JArrayR("sDocumento").ToString()
                            .sDocumentoBase64 = JArrayR("sDocumentoBase64").ToString()
                            .sJustificacion = JArrayR("sJustificacion").ToString()
                            .sIdentificador = JArrayR("sIdentificador").ToString()
                            .sComplemento1 = JArrayR("sComplemento1").ToString()
                            .sComplemento2 = JArrayR("sComplemento2").ToString()
                            .sComplemento3 = JArrayR("sComplemento3").ToString()
                            .sPermiso = JArrayR("sPermiso").ToString()
                            .sNumCertificacion = JArrayR("sNumCertificacion").ToString()
                            .sObservacion = JArrayR("sObservacion").ToString()
                        End With

                        LtsResponse.Add(ObjResponse)

                    Next
                    Console.WriteLine(Now.ToString + String.Format("Guardando Respuesta NumParte:{0} Fraccion:{1} Descripcion:{2} IDBloque:{3}", item.sNumeroParte, item.sFraccion, item.sDecripcion, IDBloque))
                    GrabarLog(String.Format("{3} Guardando Respuesta NumParte:{0} Fraccion:{1} Descripcion:{2} IDBloque{4}", item.sNumeroParte, item.sFraccion, item.sDecripcion, Now.ToString, IDBloque))

                    Dim LtsDatosGuardar As New List(Of SolicitudAPI)
                    For Each n In _LtsAgrupada
                        LtsDatosGuardar.Add(n)
                    Next
                    ' Dim guardar = o.GuardarDatos(item, LtsResponse, RutaTempJson)
                    Dim guardar = o.GuardarDatos(LtsDatosGuardar, LtsResponse, RutaTempJson, IDBloque)

                Catch ex As Exception
                    Console.WriteLine(Now.ToString + "Error en EnviarDatosConsulta():Obteniedo una respuesta de la api,ERROR: " + ex.Message.ToString)
                    GrabarLog("Error en EnviarDatosConsulta():Obteniedo una respuesta de la api ,ERROR: " + ex.Message.ToString)
                End Try




            Next

        Catch ex As Exception
            Console.WriteLine(Now.ToString + "Error en EnviarDatosConsulta():Obteniedo una respuesta de la api,ERROR: " + ex.Message.ToString)
            GrabarLog("Error en EnviarDatosConsulta():Obteniedo una respuesta de la api ,ERROR: " + ex.Message.ToString)
        End Try


    End Sub


    Public Async Function SolicitarToken() As Task(Of String)
        Try
            Dim TokenAutorizacion As String = String.Empty

            Dim client As New Net.Http.HttpClient
            Dim URLRequest = String.Format("{0}{1}", URL, "token")
            client.BaseAddress = New Uri(URLRequest)

            '//specify to use TLS 1.2 as default connection
            System.Net.ServicePointManager.SecurityProtocol = System.Net.ServicePointManager.SecurityProtocol Or SecurityProtocolType.Tls12 Or SecurityProtocolType.Tls11 Or SecurityProtocolType.Tls

            Dim body As String = "grant_type=client_credentials&scope=public"
            Dim request As HttpRequestMessage = New HttpRequestMessage(HttpMethod.Post, client.BaseAddress)
            request.Content = New StringContent(body, Encoding.UTF8, "application/x-www-form-urlencoded")


            Dim postData As List(Of KeyValuePair(Of String, String)) = New List(Of KeyValuePair(Of String, String))()
            postData.Add(New KeyValuePair(Of String, String)("username", _sAPIUsuario))
            postData.Add(New KeyValuePair(Of String, String)("password", _sAPIPassword))
            request.Content = New FormUrlEncodedContent(postData)

            Dim response As HttpResponseMessage = client.PostAsync(URLRequest, New FormUrlEncodedContent(postData)).Result
            Dim status As String = response.IsSuccessStatusCode
            If status Then
                Dim Json = response.Content.ReadAsStringAsync().Result
                Dim jsonObject As JObject = JObject.Parse(Json)
                TokenAutorizacion = jsonObject.SelectToken("access_token").ToString()
                Return TokenAutorizacion
            Else
                Dim Json = response.Content.ReadAsStringAsync().Result
                Return String.Empty
            End If
        Catch ex As Exception
            Console.WriteLine(Now.ToString + "Error en SolicitarToken() ,ERROR: " + ex.Message.ToString)
            GrabarLog("Error en SolicitarToken() ,ERROR: " + ex.Message.ToString)
            Throw New Exception(ex.Message)
        End Try
    End Function

    Public Sub ProcesarRespuestas()
        Try
            GrabarLog("INICIANDO MÉTODO DE PROCESAMIENTO DE LAS RESPUESTAS")
            Dim o As New CapaLogica.LConsultaAPISGCE
            Dim isProcesado = o.ProcesarRespuestas()

            If isProcesado.Equals("OK") Then
                Console.WriteLine(Now.ToString + "SE PROCESARON LOS PENDIENTES CORRECTAMENTE")
                GrabarLog("FIN DEL MÉTODO DE PROCESAMIENTO")
            End If

        Catch ex As Exception
            Console.WriteLine(Now.ToString + "Error en ProcesarRespuestas(): {0}" + ex.Message.ToString)
            GrabarLog("Error en ProcesarRespuestas(): {0}" + ex.Message.ToString)
        End Try

    End Sub

    Private Sub GrabarLog(ByVal _Mensaje As String)
        Try
            Dim log As StreamWriter
            Dim sNombreArchivo As String
            Dim sRutaFile As String
            sNombreArchivo = Now.Date.ToString("dd-MM-yyyy")
            sRutaFile = RutaLOG + "\" + sNombreArchivo + ".txt"

            If Not Directory.Exists(RutaLOG) Then
                Directory.CreateDirectory(RutaLOG)
            End If

            If Not File.Exists(sRutaFile) Then
                log = New StreamWriter(sRutaFile)
            Else
                log = File.AppendText(sRutaFile)
            End If

            log.WriteLine(Now & " --> " & _Mensaje)

            ' Close the stream:
            log.Close()
        Catch ex As Exception
        End Try
    End Sub

End Module

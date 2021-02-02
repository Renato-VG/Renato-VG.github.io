/**
 * Created by usuario on 25/10/2017.
 */
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    var contador = 0;
    var spinner;

    $(window).ready(function () {

        spinner = new RouletteWheel($('.roulette'), data);
        spinner.render();
        spinner.bindEvents();
        // $(".ruleta").popover('toggle');

        spinner.on('spin:start', function (r) {
            // console.log('spin start!')
            switch(contador){
                case 0:
                    nuevosColores("#E5177B","#BE107F");

                    //sustituir iconos
                    $(".icon-problema").addClass("icon-personaje");
                    $(".icon-personaje").removeClass("icon-problema");
                    break;
                case 1:
                    nuevosColores("#2362A9","#249FD5");

                    //sustituir iconos
                    $(".icon-personaje").addClass("icon-escenario");
                    $(".icon-escenario").removeClass("icon-personaje");

                    $(".ruleta").popover('destroy');
                    break;
                case 2:
                    nuevosColores("#402C7B","#87217B");

                    //sustituir iconos
                    $(".icon-escenario").addClass("icon-problema");
                    $(".icon-problema").removeClass("icon-escenario");

                    //bloquear ruleta
                    $(".roulette-over").css("display","inline");

                    $(".ruleta").popover('destroy');
                    break;
            }
        });
        spinner.on('spin:end', function (r) {
            var tiro = r._index + 1;

            switch (contador) {
                case 0:
                    if (tiro >= 1 && tiro <= 3) {
                        $("#personajes").text("Un hibou, un serpent et un hamster");
                    }
                    if (tiro >= 4 && tiro <= 6) {
                        $("#personajes").text("Un corbeau, un renard et une hyène");
                    }
                    if (tiro >= 7 && tiro <= 9) {
                        $("#personajes").text("Un chien, un chat et une souris");
                    }
                    if (tiro >= 10 && tiro <= 12) {
                        $("#personajes").text("Un Cerf, un zèbre et une panthère");
                    }

                    setNormalBg();
                    $("#th-personajes").css("background-color","#F39C6B");
                    $(".personajes").popover('toggle');
                    break;
                case 1:
                    if (tiro >= 1 && tiro <= 3) {
                        $("#escenario").text("Un cabinet vétérinaire");
                    }
                    if (tiro >= 4 && tiro <= 6) {
                        $("#escenario").text("Une forêt gigantesque appartenant à une réserve naturelle");
                    }
                    if (tiro >= 7 && tiro <= 9) {
                        $("#escenario").text("Une île avec un seul arbre");
                    }
                    if (tiro >= 10 && tiro <= 12) {
                        $("#escenario").text("Une grotte au milieu de la forêt");
                    }

                    setNormalBg();
                    $("#th-escenario").css("background-color","#F39C6B");
                    $(".escenario").popover('toggle');
                    break;
                case 2:
                    if (tiro >= 1 && tiro <= 3) {
                        $("#problema").text("L’arrivée d’un hiver froid");
                    }
                    if (tiro >= 4 && tiro <= 6) {
                        $("#problema").text("L’un menace de manger l’autre");
                    }
                    if (tiro >= 7 && tiro <= 9) {
                        $("#problema").text("La nourriture se fait rare");
                    }
                    if (tiro >= 10 && tiro <= 12) {
                        $("#problema").text("Poursuivi par un prédateur vorace");
                    }

                    setNormalBg();
                    $("#th-problema").css("background-color","#F39C6B");
                    $(".problema").popover('toggle');
                    $(".fabula").popover('toggle');

                    break;
                default:
                    break;
            }

            iluminar(tiro);
            contador++;
            if (contador > 2) contador = 0;
        });

        function iluminar(tiro){
            switch(tiro){
                case 0:
                    $(".item:nth-child(0)").css("border-top-color","#F39C6B");
                    break;
                case 1:
                    $(".item:nth-child(1)").css("border-top-color","#F39C6B");
                    break;
                case 2:
                    $(".item:nth-child(2)").css("border-top-color","#F39C6B");
                    break;
                case 3:
                    $(".item:nth-child(3)").css("border-top-color","#F39C6B");
                    break;
                case 4:
                    $(".item:nth-child(4)").css("border-top-color","#F39C6B");
                    break;
                case 5:
                    $(".item:nth-child(5)").css("border-top-color","#F39C6B");
                    break;
                case 6:
                    $(".item:nth-child(6)").css("border-top-color","#F39C6B");
                    break;
                case 7:
                    $(".item:nth-child(7)").css("border-top-color","#F39C6B");
                    break;
                case 8:
                    $(".item:nth-child(8)").css("border-top-color","#F39C6B");
                    break;
                case 9:
                    $(".item:nth-child(9)").css("border-top-color","#F39C6B");
                    break;
                case 10:
                    $(".item:nth-child(10)").css("border-top-color","#F39C6B");
                    break;
                case 11:
                    $(".item:nth-child(11)").css("border-top-color","#F39C6B");
                    break;
                case 12:
                    $(".item:nth-child(12)").css("border-top-color","#F39C6B");
                    break;
            }
        }

        function nuevosColores(color1,color2){
            $(".item:nth-child(0)").css("border-top-color",color1);
            $(".item:nth-child(1)").css("border-top-color",color2);
            $(".item:nth-child(2)").css("border-top-color",color1);
            $(".item:nth-child(3)").css("border-top-color",color2);
            $(".item:nth-child(4)").css("border-top-color",color1);
            $(".item:nth-child(5)").css("border-top-color",color2);
            $(".item:nth-child(6)").css("border-top-color",color1);
            $(".item:nth-child(7)").css("border-top-color",color2);
            $(".item:nth-child(8)").css("border-top-color",color1);
            $(".item:nth-child(9)").css("border-top-color",color2);
            $(".item:nth-child(10)").css("border-top-color",color1);
            $(".item:nth-child(11)").css("border-top-color",color2);
            $(".item:nth-child(12)").css("border-top-color",color1);
        }

        function setNormalBg(){
            $("#th-personajes").css("background-color","#BE107F");
            $("#th-escenario").css("background-color","#BE107F");
            $("#th-problema").css("background-color","#BE107F");
        }

    })

    var bandera1=false;
    $(window).scroll(function() {
        var hT = $('#roulette').offset().top,
            hH = $('#roulette').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
        if (wS > (hT+hH-wH) && bandera1==false){
            $(".ruleta").popover('toggle');
            bandera1=true;
        }
    });


    ///////////////ANGULAR QUESTIONS/////////////////////////
    $("#restart").css({display:'none'});

    $scope.selected1="";
    $scope.selected2="";
    $scope.selected3="";
    $scope.selected4="";
    $scope.selected5="";

    $scope.respuesta1 = ["Elles voulaient vivre une existence sans crainte.", "Elles pensaient qu’il les protégerait d’une menace extérieure.",
        "Le lion chasserait pour qu’elles puissent manger à leur faim.", "L’union fait la force."];
    $scope.respuesta2 = ["Le lion les a dévorées toutes les trois, au mépris de leur accord.","Le lion a dévoré leur part et les a dévorées elles-mêmes.",
        "Le cerf revenait au lion dans sa totalité.","La part du lion était insuffisante au regard de son appétit."];
    $scope.respuesta3 = ["… Comme un tyran faisant fi des accords passés.","… Conformément à l’accord souscrit avec les autres animaux.","… Comme un gouvernement démocrate.","… Selon son instinct."];
    $scope.respuesta4 = ["L’abus de pouvoir.","L’injustice de la chaine alimentaire.","Le carnivore mangera toujours les pauvres herbivores.","Il faut se défier de son ennemi."];
    $scope.respuesta5 = ["Morale","Conte","Dicton","Satire"];

    $scope.revolver = function(){
        $scope.respuesta1 = shuffle($scope.respuesta1);
        $scope.respuesta2 = shuffle($scope.respuesta2);
        $scope.respuesta3 = shuffle($scope.respuesta3);
        $scope.respuesta4 = shuffle($scope.respuesta4);
        $scope.respuesta5 = shuffle($scope.respuesta5);
    };
    $scope.revolver();


    $(".question").css({display:'none'});
    $(".question:nth-child(1)").css({display:'inline'});

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    var contador1 = 1;
    $scope.resultado = "";
    $scope.correctas = [];


    $scope.evaluar = function(){
        $scope.bandera=true;
        switch(contador1){
            case 1:
                if($scope.selected1=="Elles voulaient vivre une existence sans crainte."){
                    $("#correcta1").modal();
                    $scope.correctas[0] = true;
                } else{
                    $("#incorrecta1").modal();
                    $scope.correctas[0] = false;
                }
                break;
            case 2:
                if($scope.selected2=="Le lion les a dévorées toutes les trois, au mépris de leur accord."){
                    $("#correcta2").modal();
                    $scope.correctas[1] = true;
                } else{
                    $("#incorrecta2").modal();
                    $scope.correctas[1] = false;
                }
                break;
            case 3:
                if($scope.selected3=="… Comme un tyran faisant fi des accords passés."){
                    $("#correcta3").modal();
                    $scope.correctas[2] = true;
                } else{
                    $("#incorrecta3").modal();
                    $scope.correctas[2] = false;
                }
                break;
            case 4:
                if($scope.selected4=="L’abus de pouvoir."){
                    $("#correcta4").modal();
                    $scope.correctas[3] = true;
                } else{
                    $("#incorrecta4").modal();
                    $scope.correctas[3] = false;
                }
                break;
            case 5:
                if($scope.selected5=="Morale"){
                    $("#correcta5").modal();
                    $scope.correctas[4] = true;
                } else{
                    $("#incorrecta5").modal();
                    $scope.correctas[4] = false;
                }
                break;
        }
    };

    $(".modal-questions").on("hidden.bs.modal", function () {

        switch(contador1){
            case 1:
                $(".question:nth-child(1)").css({display:'none'});
                $(".question:nth-child(2)").fadeIn();
                break;
            case 2:
                $(".question:nth-child(2)").css({display:'none'});
                $(".question:nth-child(3)").fadeIn();
                break;
            case 3:
                $(".question:nth-child(3)").css({display:'none'});
                $(".question:nth-child(4)").fadeIn();
                break;
            case 4:
                $(".question:nth-child(4)").css({display:'none'});
                $(".question:nth-child(5)").fadeIn();
                break;
            case 5:
                $(".question:nth-child(5)").css({display:'none'});
                $(".question:nth-child(6)").fadeIn();
                $("#next").css({display:'none'});
                $("#restart").fadeIn();
                break;
        }
        contador1++;
    });

    $scope.bandera=true;

    $scope.bandClick = function () {
        $scope.bandera=false;
    };


    $scope.reiniciar = function(){
        contador1 = 1;
        $scope.revolver();
        $(".question").css({display:'none'});
        $(".question:nth-child(1)").fadeIn();

        $("#restart").css({display:'none'});
        $("#next").fadeIn();

        $scope.selected1="";
        $scope.selected2="";
        $scope.selected3="";
        $scope.selected4="";
        $scope.selected5="";
    };

    //////////////////MORALEJA/////////////

    $scope.moraleja="";
    $scope.comment="";

    var specialElementHandlers = {
        '#hidediv' : function(element,render) {return true;}
    };

    $('#cmd').click(function(){
        // doc.addHTML(document.getElementById('testdiv'), function() {
        //     pdf.save('pdfTable.pdf');
        // });

        var doc = new jsPDF();

        var margin = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };

        var imgData = 'data:image/jpeg;base64,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AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADUwAAAAYAAAAAAAAAAAAAAJEAAAB2AAAADwBwAHIAaQBuAHQALQBpAGQAZQBuAHQAaQBkAGEAZAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAdgAAAJEAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAJEAAAAAUmdodGxvbmcAAAB2AAAABnNsaWNlc1ZsTHMAAAABT2JqYwAAAAEAAAAAAAVzbGljZQAAABIAAAAHc2xpY2VJRGxvbmcAAAAAAAAAB2dyb3VwSURsb25nAAAAAAAAAAZvcmlnaW5lbnVtAAAADEVTbGljZU9yaWdpbgAAAA1hdXRvR2VuZXJhdGVkAAAAAFR5cGVlbnVtAAAACkVTbGljZVR5cGUAAAAASW1nIAAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAACRAAAAAFJnaHRsb25nAAAAdgAAAAN1cmxURVhUAAAAAQAAAAAAAG51bGxURVhUAAAAAQAAAAAAAE1zZ2VURVhUAAAAAQAAAAAABmFsdFRhZ1RFWFQAAAABAAAAAAAOY2VsbFRleHRJc0hUTUxib29sAQAAAAhjZWxsVGV4dFRFWFQAAAABAAAAAAAJaG9yekFsaWduZW51bQAAAA9FU2xpY2VIb3J6QWxpZ24AAAAHZGVmYXVsdAAAAAl2ZXJ0QWxpZ25lbnVtAAAAD0VTbGljZVZlcnRBbGlnbgAA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QQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAAAATAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwACAAQwBTADUAAAABADhCSU0EBgAAAAAABwABAAEAAQEA/+EN+mh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTEyLTI2VDEyOjM1OjU0LTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wMS0wNFQxMDozMzoxNS0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMS0wNFQxMDozMzoxNS0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNDODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNCODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Q0I4ODBCRUQ2Q0YxRTcxMUFFNDVGRDYxNEE0M0FCMTYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkNCODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTI2VDEyOjM1OjU0LTA2OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Q0M4ODBCRUQ2Q0YxRTcxMUFFNDVGRDYxNEE0M0FCMTYiIHN0RXZ0OndoZW49IjIwMTgtMDEtMDRUMTA6MzM6MTUtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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';
        doc.addImage(imgData, 'JPEG', 15, 5, 20, 25);

        var imgData = 'data:image/jpeg;base64,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YkBv4AAAAAAAAAAAAEdybiBkb3ViQG/gAAAAAAAAAAAAQmwgIGRvdWJAb+AAAAAAAAAAAABCcmRUVW50RiNSbHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAV/8kgAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAOEJJTQPtAAAAAAAQAF/8kgABAAIAX/ySAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADTQAAAAYAAAAAAAAAAAAAAFUAAACkAAAADABwAHIAaQBuAHQALQBjAG8AZABhAGUAcwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAApAAAAFUAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAFUAAAAAUmdodGxvbmcAAACkAAAABnNsaWNlc1ZsTHMAAAABT2JqYwAAAAEA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AAATAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwACAAQwBTADUAAAABADhCSU0EBgAAAAAABwABAAEAAQEA/+EN+mh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTEyLTI2VDEyOjM2OjEwLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wMS0wNFQxMDozMjo1OS0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMS0wNFQxMDozMjo1OS0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM5ODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Qzk4ODBCRUQ2Q0YxRTcxMUFFNDVGRDYxNEE0M0FCMTYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkM5ODgwQkVENkNGMUU3MTFBRTQ1RkQ2MTRBNDNBQjE2IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTI2VDEyOjM2OjEwLTA2OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Q0E4ODBCRUQ2Q0YxRTcxMUFFNDVGRDYxNEE0M0FCMTYiIHN0RXZ0OndoZW49IjIwMTgtMDEtMDRUMTA6MzI6NTktMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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';
        doc.addImage(imgData, 'JPEG', 180, 10, 30, 15);

        doc.addFont('ArialMS', 'Arial', 'normal', 'Latto');
        doc.setFont('Latto');

        doc.setFontSize(25);
        // doc.setFontType("bold");
        doc.text(40, 22, 'Ma fable');


        doc.setFontSize(12);

        var y = 40, lengthOfPage = 170, text = $scope.comment.split("\n");

        //looping thru each text item
        for(var i = 0, textlength = text.length ; i < textlength ; i++) {
            var splitTitle = doc.splitTextToSize(text[i], lengthOfPage);
            // loop thru each line and output while increasing the vertical space
            for(var c = 0, stlength = splitTitle.length ; c < stlength ; c++){
                doc.text(20, y, splitTitle[c]);
                y = y + 7.5;
            }
        }

        y=y+10;

        doc.setFontSize(18);
        doc.text(20, y, 'Morale');

        doc.setFontSize(12);

        text = $scope.moraleja.split("\n");
        y=y+7.5;

        //looping thru each text item
        for(var i = 0, textlength = text.length ; i < textlength ; i++) {
            var splitTitle = doc.splitTextToSize(text[i], lengthOfPage);
            // loop thru each line and output while increasing the vertical space
            for(var c = 0, stlength = splitTitle.length ; c < stlength ; c++){
                doc.text(20, y, splitTitle[c]);
                y = y + 7.5;
            }
        }

        doc.save('ma-fable.pdf');

        // var html=$("#testdiv").html();
        // doc.fromHTML(html,20,30, {
        //     'width': 150,
        //     'elementHandlers': specialElementHandlers
        // }, function(bla) {   doc.save('mi-fábula.pdf');
        // }, margin);
        // html = "";
    });
});
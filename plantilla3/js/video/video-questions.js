/**
 * Created by usuario on 25/10/2017.
 */
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    var contador = 0;


    ///////////////ANGULAR QUESTIONS/////////////////////////
    $("#restart").css({display:'none'});

    $scope.selected1="";
    $scope.selected2="";

    $scope.respuesta1 = ["Labores forensibus rationibus1", "Labores forensibus rationibus2", "Labores forensibus rationibus3", "Labores forensibus rationibus4"];
    $scope.respuesta2 = ["Labores forensibus rationibus1", "Labores forensibus rationibus2", "Labores forensibus rationibus3", "Labores forensibus rationibus4"];
      
    $scope.revolver = function(){
        $scope.respuesta1 = shuffle($scope.respuesta1);
        $scope.respuesta2 = shuffle($scope.respuesta2);
      
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
                if($scope.selected1=="Labores forensibus rationibus1"){
                    $("#correcta1").modal();
                    $scope.correctas[0] = true;
                } else{
                    $("#incorrecta1").modal();
                    $scope.correctas[0] = false;
                }
                break;
            case 2:
                if($scope.selected2=="Labores forensibus rationibus2"){
                    $("#correcta2").modal();
                    $scope.correctas[1] = true;
                } else{
                    $("#incorrecta2").modal();
                    $scope.correctas[1] = false;
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
    };
    $scope.moraleja="";
    $scope.comment="";
   
});
/**
 * Created by usuario on 26/09/2017.
 */

var autorSelected = 1;
$("#left-arrow").css({ opacity: 0 });
selectA1();
function sliderDerecha(){
    if(autorSelected!=4){
        autorSelected++;

        switch(autorSelected){
            case 2:
                selectA2();
                break;
        }
    }
}

function sliderIzquierda(){
    if(autorSelected!=1){
        autorSelected--;

        switch(autorSelected){
            case 1:
                selectA1();
                break;
            case 2:
                selectA2();
                break;
        }
    }
}

function selectA1(){
    autorSelected = 1;
    $('#autor1').addClass('img-selected');
    $('#autor2').addClass('img-unselected');
 
    $('#autor1').removeClass('img-unselected');
    $('#autor2').removeClass('img-selected');
 
    $('#autorName1').removeClass('hidden');
    $('#autorName2').addClass('hidden');
    $("#left-arrow").css({ opacity: 0});
    $("#right-arrow").css({ opacity: 1 });

}

function selectA2(){
    autorSelected = 2;
    $('#autor1').addClass('img-unselected');
    $('#autor2').addClass('img-selected');
    
    $('#autor1').removeClass('img-selected');
    $('#autor2').removeClass('img-unselected');
    
    $('#autorName1').addClass('hidden');
    $('#autorName2').removeClass('hidden');
    $("#left-arrow").css({ opacity: 1 });
    $("#right-arrow").css({ opacity: 0 });
}
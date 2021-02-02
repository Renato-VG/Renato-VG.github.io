$(document).ready(function () {
    $(document).on("scroll", onScroll);
});
// var marginNav=50;

//smoothscroll
$('.right-icons[href^="#"]').on('click', function (e) {
    e.preventDefault();
    $(document).off("scroll");

    $('a').each(function () {
        $(this).removeClass('elemento-activo');
    })
    $(this).addClass('elemento-activo');

    var target = this.hash,
        menu = target;
    $target = $(target);
    // console.log("troll: ",$target.offset().top,",",$target.offset().top-50);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-50 //antes +2
    }, 500, 'swing', function () {
        window.location.hash = target-50;
        $(document).on("scroll", onScroll);
    });
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#right-bar a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top-200 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#right-bar ul li a').removeClass("elemento-activo");
            currLink.addClass("elemento-activo");
        }
        else{
            currLink.removeClass("elemento-activo");
        }
    });
}
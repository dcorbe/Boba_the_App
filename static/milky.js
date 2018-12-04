// this is the fade graphics to turn the page into milk tea

console.log("loaded")
var fadeStart = 100, // 100px scroll or less will equiv to 1 opacity
    fadeUntil = 600, // 200px scroll or more will equiv to 0 opacity
    fading = $('#scroll-space');

$(window).bind('scroll', function() {
    var offset = $(document).scrollTop();
    var opacity = 0

    if (offset <= fadeStart) {
        opacity = 0;
    } else if (offset < fadeUntil) {
        opacity = 0 + offset / fadeUntil;
        console.log('opacity: ', offset, opacity);
    } else if (offset >= fadeUntil) {
        opacity = 1;
    }
    // fading.css('opacity', opacity).html(opacity);
    $('#scroll-space').css('opacity', opacity);
});


// Get the navbar
var navbar = document.getElementById("navbar");

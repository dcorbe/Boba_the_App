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




// When the user scrolls the page, execute letsGetSticky
window.onscroll = function() {letsGetSticky()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function letsGetSticky() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

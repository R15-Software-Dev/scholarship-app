$(function () {
  // Check the initial position of the sticky header
  $(window).on("scroll", () => {
    // Just add a class to the header when we scroll down
    if ($(window).scrollTop() > 0) {
      $("banner-sticky").addClass("sticky-shadow");
    }
    // and remove it when we scroll up
    else {
      $("banner-sticky").removeClass("sticky-shadow");
    }
  });
});


window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementsByClassName("banner-sticky").item(0).classList.add("sticky-shadow");
  } else {
    document.getElementsByClassName("banner-sticky").item(0).classList.remove("sticky-shadow");
  }
}

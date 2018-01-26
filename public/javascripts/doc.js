$(function() {
  if($(window).width() < 1200) {
    $("div#navbarSupportedContent").addClass("collapse");
    $("div#navbarSupportedContent").addClass("navbar-collapse");
    $("div#navbarSupportedContent > ul").removeClass("nav");
    $("div#navbarSupportedContent > ul").addClass("navbar-nav");
  }

  $(window).resize(function() {
    if($(window).width() < 1200) {
      $("div#navbarSupportedContent").addClass("collapse");
      $("div#navbarSupportedContent").addClass("navbar-collapse");
      $("div#navbarSupportedContent > ul").removeClass("nav");
      $("div#navbarSupportedContent > ul").addClass("navbar-nav");
    } else {
      $("div#navbarSupportedContent").removeClass("collapse");
      $("div#navbarSupportedContent").removeClass("navbar-collapse");
      $("div#navbarSupportedContent > ul").removeClass("navbar-nav");
      $("div#navbarSupportedContent > ul").addClass("nav");
    }
  });

  $('[data-toggle="tooltip"]').tooltip();

  $("#curricularButton").click(function() {
    $("#extra-curricularInput").css("display", "none");
    $("#backgroundInput").css("display", "none");
    $("#curricularInput").css("display", "");
    $("#extra-curricularButton").removeClass("active");
    $("#backgroundButton").removeClass("active");
    $(this).addClass("active");
  });

  $("#extra-curricularButton").click(function() {
    $("#curricularInput").css("display", "none");
    $("#backgroundInput").css("display", "none");
    $("#extra-curricularInput").css("display", "");
    $("#curricularButton").removeClass("active");
    $("#backgroundButton").removeClass("active");
    $(this).addClass("active");
  });

  $("#backgroundButton").click(function() {
    $("#curricularInput").css("display", "none");
    $("#extra-curricularInput").css("display", "none");
    $("#backgroundInput").css("display", "");
    $("#curricularButton").removeClass("active");
    $("#extra-curricularButton").removeClass("active");
    $(this).addClass("active");
  });

  $(".form-control").each(function() {
    if(($(this).prop("tagName") != "SELECT" && $(this).is(":valid")) || ($(this).prop("tagName") == "SELECT" && $(this).prop("selectedIndex") > 0))
      $(this).siblings("label").css("color", "#000000");
  });

  $(".form-control").focus(function() {
    $(this).siblings("label").animate({
      "color": "#000000",
    }, 100);
  });

  $(".form-control").focusout(function() {
    if(($(this).prop("tagName") != "SELECT" && !$(this).is(":valid")) || ($(this).prop("tagName") == "SELECT" && $(this).prop("selectedIndex") <= 0)) {
      $(this).siblings("label").animate({
        "color": "#CECECE",
      }, 100);
    }
  });

  $(".btn-group button").not(".btn-toggle").click(function() {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
  });

  $(".btn-group button.btn-toggle").click(function() {
    $(this).toggleClass("active");
  });

  $(".resultContainer tbody tr").click(function() {
    if($(this).hasClass("selected")) $(this).removeClass("selected");
    else {
      $(this).siblings().removeClass("selected");
      $(this).addClass("selected");
    }
  });
})

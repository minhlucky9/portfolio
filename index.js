$(document).ready(function () {
    $(".overview").addClass("active");
    
    var options = $(".overview .navigator p");
    for(var i = 0; i < options.length; i ++) {
        let index = i;
        setTimeout(function () { 
            options.eq(index).css("opacity", 1);
            options.eq(index).css("transform", "translateY(0)");
        }, 1500 + index * 100);
    }

    //about
    options.eq(0).click(function (e) { 
        $([document.documentElement, document.body]).animate({
             scrollTop: $(".about").offset().top
         }, 500);
     });

    //main proj
    options.eq(1).click(function (e) { 
        $([document.documentElement, document.body]).animate({
             scrollTop: $(".list-project").eq(0).offset().top
         }, 500);
     });

    //test proj
    options.eq(2).click(function (e) { 
        $([document.documentElement, document.body]).animate({
             scrollTop: $(".list-project").eq(1).offset().top
         }, 500);
     });

    //contact
    options.eq(3).click(function (e) { 
        $([document.documentElement, document.body]).animate({
             scrollTop: $(".contact").offset().top
        }, 500);
     });
});

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = windowHeight * 40 / 100;
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

window.addEventListener("scroll", reveal);
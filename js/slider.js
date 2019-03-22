var Slider = {
    // Define current slide
    currentIndex: 0,

    init: function () {
        Slider.autoSlide();
        Slider.playAutoClick();
        Slider.nextSlideOnClick();
        Slider.prevSlideOnClick();
        Slider.changeSlideOnKeypress();
    },

    // Display the current slide
    activeSlide: function () {
        var slides = $('.fade');
        var slide = slides.eq(Slider.currentIndex);
        slides.hide();
        slide.css('display', 'flex');
    },

    // Define the next slide as the current slide
    indexPlus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex += 1;
        if (Slider.currentIndex > slidesNumber - 1) {
            Slider.currentIndex = 0;
        }
    },

    // Define the previous slide as the the current slide
    indexMinus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex -= 1;
        if (Slider.currentIndex < 0) {
            Slider.currentIndex = slidesNumber - 1;
        }
    },

    // automatic and controllable slide function
    autoSlide: function () {
        var play = $('.play');
        var stop = $('.stop');
        play.click(function () {
          play.css("visibility", "hidden");
          stop.css("visibility", "visible");
            var timer = setInterval(function () {
                Slider.indexPlus();
                Slider.activeSlide();
            }, 5000);
            stop.click(function () {
                clearInterval(timer);
                play.css("visibility", "visible");
                stop.css("visibility", "hidden");
            });
        });

    },

    // automatic slider on load
    playAutoClick: function () {
        var play = $('.play');
        play.trigger('click');
        play.css("visibility", "hidden");
    },

    // next slide on click on the ">" button
    nextSlideOnClick: function () {
        var next = $('.next');
        next.click(function () {
            Slider.indexPlus();
            Slider.activeSlide();
        });
    },

    // previous slide on click on the "<" button
    prevSlideOnClick: function () {
        var prev = $('.prev');
        prev.click(function () {
            Slider.indexMinus();
            Slider.activeSlide();
        });
    },

    // previous / next slide with keyboard
    changeSlideOnKeypress: function () {
        $('body').keydown(function (e) {
            if (e.which === 39) {
                Slider.indexPlus();
                Slider.activeSlide();
            } else if (e.which === 37) {
                Slider.indexMinus();
                Slider.activeSlide();
            }
        })
    },
}


$(function () {
    Slider.init();
});

var Slider = {
    // Définit le slide actuel
    currentIndex: 0,

    init: function () {
        Slider.autoSlide();
        Slider.playAutoClick();
        Slider.nextSlideOnClick();
        Slider.prevSlideOnClick();
        Slider.changeSlideOnKeypress();
    },

    // Affiche le slide en cours
    activeSlide: function () {
        var slides = $('.fade');
        var slide = slides.eq(Slider.currentIndex);
        slides.hide();
        slide.css('display', 'flex');
    },

    // Définit le prochain slide
    indexPlus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex += 1;
        if (Slider.currentIndex > slidesNumber - 1) {
            Slider.currentIndex = 0;
        }
    },

    // Définit le précédent slide
    indexMinus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex -= 1;
        if (Slider.currentIndex < 0) {
            Slider.currentIndex = slidesNumber - 1;
        }
    },

    // Rend le slider automatique gère les bouton play/pause
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

    // Démarre le slider au chargement
    playAutoClick: function () {
        var play = $('.play');
        play.trigger('click');
        play.css("visibility", "hidden");
    },

    // Prochaine slide au clique sur le chevron
    nextSlideOnClick: function () {
        var next = $('.next');
        next.click(function () {
            Slider.indexPlus();
            Slider.activeSlide();
        });
    },

    // précedente slide au clique sur le chevron
    prevSlideOnClick: function () {
        var prev = $('.prev');
        prev.click(function () {
            Slider.indexMinus();
            Slider.activeSlide();
        });
    },

    // Ajoute les controles clavier sur le slider
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

var Play = function(target) {
    var element = $(target),
        observer = Observer(),
        playing = false,
        init = false;

    element.on('click touchstart', function() {
        toggle();
        observer.emit('click');
    });

    var play = function() {
        if (!playing) {
            observer.emit('play');
            playing = true;
            element.removeClass('on').addClass('off');
        }
    };

    var pause = function() {
        if (playing) {
            observer.emit('pause');
            playing = false;
            element.removeClass('off').addClass('on');
        }
    };

    var toggle = function() {
        if (playing) {
            pause();
        } else {
            play();
        }
    };

    var hide = function() {
        element.addClass('hide-block');
    };

    return {
        play: play,
        pause: pause,
        toggle: toggle,
        hide: hide,
        on: observer.on,
        off: observer.off
    };
};

var Mute = function(target) {
    var element = $(target),
        observer = Observer(),
        muted = false;

    element.on('click touchstart', function() {
        toggle();
        observer.emit('click');
    });

    var mute = function() {
        if (!muted) {
            observer.emit('mute');
            muted = true;
            element.removeClass('off').addClass('on');
        }
    };

    var unmute = function() {
        if (muted) {
            observer.emit('unmute');
            muted = false;
            element.removeClass('on').addClass('off');
        }
    };

    var toggle = function() {
        if (muted) {
            unmute();
        } else {
            mute();
        }
    };

    return {
        mute: mute,
        unmute: unmute,
        toggle: toggle,
        on: observer.on,
        off: observer.off
    };
};

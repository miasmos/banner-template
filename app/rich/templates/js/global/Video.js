var Video = function(id, player, shouldMute, shouldLoop) {
    var observer = Observer(),
        element = $('iframe#yt-' + id),
        playbackInterval = undefined,
        initInterval = undefined,
        playback = 0, //tracks the current playback time
        ready = false,
        unstarted = false,
        paused = true,
        duration = undefined,
        playing = false,
        buffering = false,
        hasPlayedOnce = false,
        init = false,
        cued = false;

    observer.on(YT.PlayerState.ENDED, function() {
        if (!!player && shouldLoop) {
            reset();
        }
    });
    observer.on(YT.PlayerState.READY, function() {
        if (!!player && shouldMute) {
            player.mute();
        }
    });
    observer.on(YT.PlayerState.PLAYING, function() {
        if (!init) {
            init = true;
            initInterval = setInterval(_initInterval, 100);
        }
        _startPlayback();
    });
    observer.on(YT.PlayerState.PAUSED, function() {
        _pausePlayback();
    });

    var pause = function() {
        if (!!player && playing) {
            player.pauseVideo();
            playing = false;
            paused = true;
        }
    };

    var reset = function() {
        if (!!player) {
            restart();
            duration = player.getDuration();
            player.pauseVideo();
            playing = false;
            paused = true;
        }
    };

    var restart = function() {
        if (!!player) {
            _resetPlayback();
            player.seekTo(0);
        }
    };

    var play = function() {
        if (!!player && !playing) {
            player.playVideo();
            playing = true;
            paused = false;
        }
    };

    var mute = function() {
        if (!!player) {
            player.mute();
        }
    };

    var unmute = function() {
        if (!!player) {
            player.unMute();
        }
    };

    var percentPlayed = function() {
        if (typeof duration === 'undefined') return false;
        return playback / 1000 / duration;
    };

    var _resetPlayback = function() {
        _pausePlayback();
        playback = 0;
    };

    var _pausePlayback = function() {
        clearInterval(playbackInterval);
        playbackInterval = undefined;
    };

    var _startPlayback = function() {
        _pausePlayback();
        playbackInterval = setInterval(_tick, 100);
    };

    var _initInterval = function() {
        var _duration = player.getDuration();
        if (_duration > 0) {
            clearInterval(initInterval);
            initInterval = undefined;
            reset();
            observer.emit(YT.PlayerState.INIT);
        }
    };

    var _tick = function() {
        playback += 100;
        observer.emit('playback', { time: playback, id: id });
        if ((playback / 1000) % 10 === 0) {
            observer.emit('playback-seconds', playback);
        }
    };

    return {
        id: id,
        player: player,
        element: element,
        shouldMute: shouldMute,
        ready: ready,
        unstarted: unstarted,
        paused: paused,
        playing: playing,
        buffering: buffering,
        cued: cued,
        pause: pause,
        play: play,
        mute: mute,
        unmute: unmute,
        reset: reset,
        restart: restart,
        percentPlayed: percentPlayed,
        on: observer.on,
        off: observer.off,
        emit: observer.emit
    };
};

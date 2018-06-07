var Youtube = function(target) {
    var observer = Observer(),
        parent = $(target),
        activeVideo = undefined,
        lastActiveVideo = undefined,
        animating = false,
        previewHidden = false,
        init = false,
        videos = {},
        playerStateEnum = {
            100: 'Init',
            99: 'Ready',
            '-1': 'Unstarted',
            0: 'Ended',
            1: 'Playing',
            2: 'Paused',
            3: 'Buffering',
            5: 'Video Cued'
        };

    var waitForYoutubeAPI = setInterval(function() {
        if ('YT' in window && 'PlayerState' in window.YT) {
            YT.PlayerState.READY = 99;
            YT.PlayerState.INIT = 98;
            init = true;
            clearInterval(waitForYoutubeAPI);
            observer.emit('initialized');
        }
    });

    /* player events */
    var onPlaying = function(event, id) {
        var video = videos[id];
        video.playing = true;
        video.unstarted = false;
        sendEvent(YT.PlayerState.PLAYING, event, id);
    };
    var onEnded = function(event, id) {
        var video = videos[id];
        video.playing = false;
        video.ended = true;
        video.paused = true;
        sendEvent(YT.PlayerState.ENDED, event, id);
    };
    var onPaused = function(event, id) {
        var video = videos[id];
        video.playing = false;
        video.paused = true;
        sendEvent(YT.PlayerState.PAUSED, event, id);
    };
    var onBuffering = function(event, id) {
        var video = videos[id];
        video.buffering = true;
        sendEvent(YT.PlayerState.BUFFERING, event, id);
    };
    var onUnstarted = function(event, id) {
        var video = videos[id];
        video.unstarted = true;
        sendEvent(YT.PlayerState.UNSTARTED, event, id);
    };
    var onCued = function(event, id) {
        var video = videos[id];
        video.cued = true;
        video.buffering = false;
        sendEvent(YT.PlayerState.CUED, event, id);
    };
    var onReady = function(event, id) {
        var video = videos[id];
        video.ready = true;
        sendEvent(YT.PlayerState.READY, event, id);
    };
    /* end player events */

    var sendEvent = function(eventId, event, id) {
        if (
            playerStateEnum[eventId] === 'Playing' ||
            playerStateEnum[eventId] === 'Paused'
        ) {
            console.log(playerStateEnum[eventId], id, videos[id]);
        }
        var payload = { event: event, id: id };
        videos[id].emit(eventId, payload);
        observer.emit(eventId, payload);
    };

    var onStateChange = function(event) {
        var id = event.target.h.id;

        switch (event.data) {
            case YT.PlayerState.UNSTARTED:
                onUnstarted(event, id);
                break;
            case YT.PlayerState.PLAYING:
                onPlaying(event, id);
                break;
            case YT.PlayerState.ENDED:
                onEnded(event, id);
                break;
            case YT.PlayerState.PAUSED:
                onPaused(event, id);
                break;
            case YT.PlayerState.BUFFERING:
                onBuffering(event, id);
                break;
            case YT.PlayerState.CUED:
                onCued(event, id);
                break;
        }
    };

    var create = function(videoId, mute, loop) {
        if (typeof mute === 'undefined') {
            mute = true;
        }
        if (typeof loop === 'undefined') {
            loop = true;
        }
        var elementId = 'yt-' + videoId,
            element = $('<div>', {
                id: elementId,
                class: 'video'
            });

        parent.append(element);
        var player = new YT.Player(elementId, {
            videoId: videoId,
            playerVars: {
                modestbranding: 1,
                autoplay: 1,
                controls: 0,
                rel: 0,
                showinfo: 0,
                autohide: 1,
                loop: 0,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3
            },
            events: {
                onReady: function(event) {
                    onReady(event, event.target.h.id);
                },
                onStateChange: onStateChange
            }
        });

        videos[elementId] = Video(videoId, player, mute, loop);
        return videos[elementId];
    };

    var get = function(videoId) {
        if ('yt-' + videoId in videos) {
            return videos['yt-' + videoId];
        } else {
            return false;
        }
    };

    var setActive = function(videoId, start) {
        if (typeof start === 'undefined') {
            start = true;
        }
        if (!!activeVideo && videoId === activeVideo.id) {
            return;
        }
        var video;
        for (var key in videos) {
            video = videos[key];

            if (video.id === videoId) {
                video.element.addClass('active');
                lastActiveVideo = activeVideo;
                activeVideo = video;

                if (start) {
                    activeVideo.restart();
                    activeVideo.play();
                }

                if (typeof lastActiveVideo !== 'undefined') {
                    lastActiveVideo.pause();
                }
            } else {
                video.element.removeClass('active');
            }
        }
    };

    var hidePreview = function() {
        if (previewHidden) {
            return;
        }
        previewHidden = true;
        $(parent)
            .closest('.video')
            .find('.preview')
            .addClass('hide');
    };

    var showPreview = function() {
        if (!previewHidden) {
            return;
        }
        previewHidden = false;
        $(parent)
            .closest('.video')
            .find('.preview')
            .removeClass('hide');
    };

    var pause = function() {
        if (typeof activeVideo !== 'undefined') {
            activeVideo.pause();
        }
    };

    var play = function() {
        if (typeof activeVideo !== 'undefined') {
            activeVideo.play();
        }
    };

    var mute = function() {
        if (typeof activeVideo !== 'undefined') {
            activeVideo.mute();
        }
    };

    var unmute = function() {
        if (typeof activeVideo !== 'undefined') {
            activeVideo.unmute();
        }
    };

    var percentElapsed = function() {
        if (typeof activeVideo !== 'undefined') {
            return activeVideo.percentPlayed();
        }
        return false;
    };

    return {
        on: observer.on,
        off: observer.off,
        create: create,
        videos: videos,
        pause: pause,
        play: play,
        get: get,
        mute: mute,
        unmute: unmute,
        percentElapsed: percentElapsed,
        setActive: setActive,
        hidePreview: hidePreview,
        showPreview: showPreview
    };
};

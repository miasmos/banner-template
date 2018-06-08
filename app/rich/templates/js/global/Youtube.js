const playerStateEnum = {
    100: 'Init',
    99: 'Ready',
    '-1': 'Unstarted',
    0: 'Ended',
    1: 'Playing',
    2: 'Paused',
    3: 'Buffering',
    5: 'Video Cued'
}

class Youtube extends Observer {
    constructor(target) {
        super()
        this.parent = $(target)
        this.activeVideo = undefined
        this.lastActiveVideo = undefined
        this.animating = false
        this.previewHidden = false
        this.init = false
        this.videos = {}
        this._waitForYoutubeAPI = setInterval(() => {
            if ('YT' in window && 'PlayerState' in window.YT) {
                this._youtubeAPIReady()
            }
        })
    }

    _youtubeAPIReady() {
        YT.PlayerState.READY = 99
        YT.PlayerState.INIT = 98
        this.init = true
        clearInterval(this._waitForYoutubeAPI)
        this.emit('initialized')
    }

    onPlaying(event, id) {
        const video = this.videos[id]
        video.playing = true
        video.unstarted = false
        this.sendEvent(YT.PlayerState.PLAYING, event, id)
    }

    onEnded(event, id) {
        const video = this.videos[id]
        video.playing = false
        video.ended = true
        video.paused = true
        this.sendEvent(YT.PlayerState.ENDED, event, id)
    }

    onPaused(event, id) {
        const video = this.videos[id]
        video.playing = false
        video.paused = true
        this.sendEvent(YT.PlayerState.PAUSED, event, id);
    }

    onBuffering(event, id) {
        const video = this.videos[id]
        video.buffering = true
        this.sendEvent(YT.PlayerState.BUFFERING, event, id)
    }

    onUnstarted(event, id) {
        const video = this.videos[id]
        video.unstarted = true
        this.sendEvent(YT.PlayerState.UNSTARTED, event, id)
    }

    onCued(event, id) {
        const video = this.videos[id]
        video.cued = true
        video.buffering = false
        this.sendEvent(YT.PlayerState.CUED, event, id)
    }

    onReady(event, id) {
        const video = this.videos[id]
        video.ready = true
        this.sendEvent(YT.PlayerState.READY, event, id)
    }

    sendEvent(eventId, event, id) {
        const payload = { event: event, id: id }
        this.videos[id].emit(eventId, payload)
        this.emit(eventId, payload)
    }

    onStateChange(event) {
        const id = event.target.h.id;

        switch (event.data) {
            case YT.PlayerState.UNSTARTED:
                this.onUnstarted(event, id)
                break
            case YT.PlayerState.PLAYING:
                this.onPlaying(event, id)
                break
            case YT.PlayerState.ENDED:
                this.onEnded(event, id);
                break
            case YT.PlayerState.PAUSED:
                this.onPaused(event, id)
                break
            case YT.PlayerState.BUFFERING:
                this.onBuffering(event, id)
                break
            case YT.PlayerState.CUED:
                this.onCued(event, id)
                break
        }
    }

    create(videoId, mute, loop) {
        if (typeof mute === 'undefined') {
            mute = true
        }
        if (typeof loop === 'undefined') {
            loop = true
        }
        const elementId = 'yt-' + videoId,
            element = $('<div>', {
                id: elementId,
                class: 'video'
            })

        this.parent.append(element);
        const self = this
        const player = new YT.Player(elementId, {
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
                onReady: event => {
                    this.onReady(event, event.target.h.id)
                },
                onStateChange: this.onStateChange.bind(this)
            }
        })

        this.videos[elementId] = new Video(videoId, player, mute, loop)
        return this.videos[elementId]
    }

    get(videoId) {
        if ('yt-' + videoId in this.videos) {
            return this.videos['yt-' + videoId]
        } else {
            return false
        }
    }

    setActive(videoId, start = true) {
        if (!!this.activeVideo && videoId === activeVideo.id) {
            return
        }
        let video;
        for (const key in this.videos) {
            video = this.videos[key]

            if (video.id === videoId) {
                video.element.addClass('active')
                this.lastActiveVideo = this.activeVideo
                this.activeVideo = video

                if (start) {
                    this.activeVideo.restart()
                    this.activeVideo.play()
                }

                if (typeof this.lastActiveVideo !== 'undefined') {
                    this.lastActiveVideo.pause()
                }
            } else {
                video.element.removeClass('active')
            }
        }
    }

    hidePreview() {
        if (this.previewHidden) {
            return;
        }
        this.previewHidden = true;
        $(this.parent)
            .closest('.video')
            .find('.preview')
            .addClass('hide')
    }

    showPreview() {
        if (!this.previewHidden) {
            return;
        }
        this.previewHidden = false;
        $(this.parent)
            .closest('.video')
            .find('.preview')
            .removeClass('hide')
    }

    pause() {
        if (typeof this.activeVideo !== 'undefined') {
            this.activeVideo.pause()
        }
    }

    play() {
        if (typeof this.activeVideo !== 'undefined') {
            this.activeVideo.play()
        }
    }

    mute() {
        if (typeof this.activeVideo !== 'undefined') {
            this.activeVideo.mute()
        }
    }

    unmute() {
        if (typeof this.activeVideo !== 'undefined') {
            this.activeVideo.unmute()
        }
    }

    percentElapsed() {
        if (typeof this.activeVideo !== 'undefined') {
            return this.activeVideo.percentPlayed()
        }
        return false;
    }
}
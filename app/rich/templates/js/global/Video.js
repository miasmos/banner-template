class Video extends Observer {
    constructor(id, player, shouldMute, shouldLoop) {
        super()
        this.element = $('iframe#yt-' + id)
        this.playbackInterval = undefined
        this.initInterval = undefined
        this.playback = 0 //tracks the current playback time
        this.ready = false
        this.unstarted = false
        this.paused = true
        this.duration = undefined
        this.playing = false
        this.buffering = false
        this.hasPlayedOnce = false
        this.init = false
        this.cued = false
        this.player = player
        this.shouldMute = shouldMute
        this.shouldLoop = shouldLoop

        this.on(YT.PlayerState.ENDED, () => {
            if (!!this.player && this.shouldLoop) {
                this.reset()
            }
        });

        this.on(YT.PlayerState.READY, () => {
            if (!!this.player && this.shouldMute) {
                this.player.mute()
            }
        });

        this.on(YT.PlayerState.PLAYING, () => {
            if (!this.init) {
                this.init = true;
                this.initInterval = setInterval(this._initInterval.bind(this), 50)
            }
            this._startPlayback()
        });

        this.on(YT.PlayerState.PAUSED, () => {
            this._pausePlayback()
        });
    }

    pause() {
        if (!!this.player && this.playing) {
            this.player.pauseVideo()
            this.playing = false
            this.paused = true
        }
    }

    reset() {
        if (!!this.player) {
            this.restart();
            this.duration = this.player.getDuration();
            this.player.pauseVideo()
            this.playing = false
            this.paused = true
        }
    }

    restart() {
        if (!!this.player) {
            this._resetPlayback()
            this.player.seekTo(0)
        }
    }

    play() {
        if (!!this.player && !this.playing) {
            this.player.playVideo()
            this.playing = true
            this.paused = false
        }
    }

    mute() {
        if (!!this.player) {
            this.player.mute()
        }
    }

    unmute() {
        if (!!this.player) {
            this.player.unMute()
            this.player.setVolume(25)
        }
    }

    percentPlayed() {
        if (typeof this.duration === 'undefined') {
            return false;
        }
        return this.playback / 1000 / this.duration;
    }

    _resetPlayback() {
        this._pausePlayback()
        this.playback = 0
    }

    _pausePlayback() {
        clearInterval(this.playbackInterval)
        this.playbackInterval = undefined
    }

    _startPlayback() {
        this._pausePlayback()
        this.playbackInterval = setInterval(this._tick.bind(this), 100)
    }

    _initInterval() {
        const _duration = this.player.getDuration()
        if (_duration > 0) {
            clearInterval(this.initInterval)
            this.initInterval = undefined
            this.reset()
            this.emit(YT.PlayerState.INIT)
        }
    }

    _tick() {
        this.playback += 100
        this.emit('playback', { time: this.playback, id: this.id })
        if ((this.playback / 1000) % 10 === 0) {
            this.emit('playback-seconds', this.playback)
        }
    }
}
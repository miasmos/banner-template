class Play extends Observer {
    constructor(target) {
        super()
        this.element = $(target)
        this.playing = false
        this.init = false

        this.element.on('click touchstart', () => {
            this.toggle()
            this.emit('click')
        });
    }

    play() {
        if (!this.playing) {
            this.emit('play')
            this.playing = true
            this.element.removeClass('on').addClass('off')
        }
    }

    pause() {
        if (this.playing) {
            this.emit('pause')
            this.playing = false
            this.element.removeClass('off').addClass('on')
        }
    }

    toggle() {
        if (this.playing) {
            this.pause()
        } else {
            this.play()
        }
    }

    hide() {
        this.element.addClass('hide-block')
    }
}
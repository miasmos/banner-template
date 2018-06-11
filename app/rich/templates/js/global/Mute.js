class Mute extends Observer {
    constructor(target) {
        super()
        this.element = $(target)
        this.muted = false

        this.element.on('click touchstart', () => {
            this.toggle()
            this.emit('click')
        })
    }

    mute() {
        if (!this.muted) {
            this.emit('mute')
            this.muted = true
            this.element.removeClass('off').addClass('on')
        }
    }

    unmute() {
        if (this.muted) {
            this.emit('unmute')
            this.muted = false
            this.element.removeClass('on').addClass('off')
        }
    }

    toggle() {
        if (this.muted) {
            this.unmute()
        } else {
            this.mute()
        }
    }
}
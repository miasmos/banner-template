class Duration {
    constructor(target) {
        this.element = $(target)
    }

    set(percent) {
        this.element.css('width', percent + '%')
    }
}

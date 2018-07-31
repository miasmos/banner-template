class BackgroundClass extends Observer {
    constructor(selector, isHorizontal = false) {
        super();
        this.index = 0;
        this.selector = selector;
        this.isHorizontal = isHorizontal;
        window.addEventListener('load', this.init.bind(this));
    }

    init() {
        const parent = $(this.selector);
        const img = [];
        const frames = $(this.selector).find('.frames img')
        parent.find('>img').each((index, item) => img.push(item));

        this.$elements = {
            parent,
            img,
            frames
        };
        this.currentImage = img[this.index];
        this.initial = this.isHorizontal ? parent.width() : parent.height();
        this.emit('ready');
    }

    slideUp(duration) {
        const {parent} = this.$elements;
        const property = this.isHorizontal ? 'Width' : 'Height';
        return TweenLite.to(parent, duration, {
            ['max' + property]: this.initial,
            ease: Power2.easeOut,
            onComplete: this.next.bind(this)
        });
    }

    next() {
        const {img} = this.$elements;
        let {index, currentImage} = this;

        if (index + 1 > img.length - 1) {
            index = 0;
        } else {
            index++;
        }

        $(currentImage).removeClass('active');
        this.$elements.frames.css('opacity', 0)
        $(img[index]).addClass('active');
        this.index = index;
        this.currentImage = img[index];
    }

    slideDown(duration) {
        const {parent, img} = this.$elements;
        const property = this.isHorizontal ? 'Width' : 'Height';
        return TweenLite.to(parent, duration, {
            ['max' + property]: this.isHorizontal
                ? $(this.currentImage).width()
                : $(this.currentImage).height(),
            ease: Power2.easeOut
        });
    }
}

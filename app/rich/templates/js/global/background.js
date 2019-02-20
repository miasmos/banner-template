class BackgroundClass extends Observer {
    constructor(selector, isHorizontal = false, margin = 0) {
        super();
        this.index = -1;
        this.selector = selector;
        this.isHorizontal = isHorizontal;
        this.margin = margin;
        this.init();
    }

    init() {
        const parent = $(this.selector);
        const img = [];
        parent.find('>img').each((index, item) => img.push(item));

        this.$elements = {
            parent,
            img
        };
        this.currentImage = img[this.index];
        this.initial = this.isHorizontal ? parent.width() : parent.height();
        this.emit('ready');
    }

    slideUp(duration) {
        const { parent } = this.$elements;
        const property = this.isHorizontal ? 'Width' : 'Height';
        return TweenLite.to(parent, duration, {
            ['max' + property]: this.initial,
            ease: Power2.easeOut
        });
    }

    next() {
        const { img } = this.$elements;
        let { index, currentImage } = this;

        if (index + 1 > img.length - 1) {
            index = 0;
        } else {
            index++;
        }

        $(currentImage).removeClass('active');
        $(img[index]).addClass('active');
        this.index = index;
        this.currentImage = img[index];
    }

    slideDown(duration) {
        this.next();
        const { parent, img } = this.$elements;
        const property = this.isHorizontal ? 'Width' : 'Height';
        return TweenLite.to(parent, duration, {
            ['max' + property]: this.isHorizontal
                ? $(this.currentImage).width() + this.margin
                : $(this.currentImage).height() + this.margin,
            ease: Power2.easeOut
        });
    }
}

class Typewriter {
    constructor(target, opts) {
        this.$elements = {
            parent: $(target),
            lettersParent: $(target).find('.letters'),
            letters: []
        };
        this.opts = opts;
        this.letters = opts.text.split('').map((letter, index) => {
            const $element = $('<div/>', {
                html: letter,
                class: `letter letter${index}`
            });
            this.$elements.lettersParent.append($element);
            return $element;
        });
    }

    animate() {
        const timeline = new TimelineLite();
        const { appearDelay, appearDelayVariance } = this.opts;
        this.letters.map(letter =>
            timeline.to(
                letter,
                0,
                { display: 'block' },
                `+=${(appearDelay +
                    this.numberBetween(0, appearDelayVariance)) /
                    1000}`
            )
        );
        return timeline;
    }

    numberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    reset() {
        $(this.letters).css('display', 'none');
    }
}

class Element {
    constructor(id) {
        if (typeof id !== 'undefined') {
            this.setElement(document.getElementById(id));
        }

        this.classes = undefined;
    }

    setElement(element) {
        this.element = element;
    }

    css(prop, value) {
        const styles = window.getComputedStyle(this.element, null);

        if (typeof prop === 'object') {
            for (let key in prop) {
                const value1 = prop[key];

                if (typeof key === 'string' && typeof value1 === 'string') {
                    this.element.style[key] = value1;
                }
            }
            return;
        }

        if (typeof value === 'undefined') {
            const propValue = styles.getPropertyValue(prop);
            return propValue || undefined;
        } else if (typeof value === 'string') {
            this.element.style[prop] = value;
        }
    }

    click(fn) {
        this.element.addEventListener('click', fn);
        this.element.addEventListener('touchstart', fn);
    }

    html(value) {
        const html = value.replace(/\\n/g, '<br>');
        this.element.innerHTML = html;
    }

    hide() {
        this.addClass('hide');
        this.removeClass('show');
    }

    show() {
        this.removeClass('hide');
        this.addClass('show');
    }

    append(element) {
        if (element.constructor.name === 'Element') {
            this.element.appendChild(element.element);
        } else {
            this.element.appendChild(element);
        }
    }

    width() {
        return Number(this.element.offsetWidth);
    }

    height() {
        return Number(this.element.offsetHeight);
    }

    _initClass() {
        if (typeof this.classes === 'undefined') {
            const classes = this.element.getAttribute('class');
            if (!!classes) {
                this.classes = classes.split(' ');
            } else {
                this.classes = [];
            }
        }
    }

    _setClass() {
        this.element.setAttribute('class', this.classes.join(' '));
    }

    addClass(value) {
        this._initClass();
        if (this.classes.indexOf(value) === -1) {
            this.classes.push(value);
            this._setClass();
        }
    }

    removeClass(value) {
        this._initClass();
        if (this.classes.indexOf(value) > -1) {
            this.classes.splice(this.classes.indexOf(value), 1);
            this._setClass();
        }
    }
}

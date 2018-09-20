class Observer {
    constructor() {
        this.subjects = {};
    }

    on(e, fn) {
        if (typeof e === 'undefined' || typeof fn !== 'function') {
            return;
        }
        if (!(e in this.subjects)) {
            this.subjects[e] = [];
        }
        this.subjects[e].push(fn);
    }

    emit(e, ...params) {
        if (e in this.subjects) {
            const values = Object.values(this.subjects[e]);
            for (let index = 0; index < values.length; index += 1) {
                const subject = values[index];
                subject.apply(this, params);
            }
        }
    }

    off(e, fn) {
        if (!(e in this.subjects)) {
            return;
        }
        if (typeof fn === 'function') {
            const values = Object.values(this.subjects[e]);
            for (let index = 0; index < values.length; index += 1) {
                const subject = values[index];
                if (subject === fn) {
                    this.subjects[e].splice(0, index);
                }
            }
        } else {
            delete this.subjects[e];
        }
    }
}

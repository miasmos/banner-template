class Observer {
    constructor() {
        this.subjects = {}
    }

    on(e, fn, args) {
        if (
            (typeof e !== 'string' && typeof e !== 'number') ||
            typeof e === 'undefined' ||
            typeof fn !== 'function'
        ) {
            return;
        }
        if (!(e in this.subjects)) {
            this.subjects[e] = []
        }
        this.subjects[e].push({ event: e, fn: fn, args: args })
    }

    off(e, fn) {
        if (!(e in this.subjects)) {
            return;
        }
        if (typeof fn === 'function') {
            for (var index in this.subjects[e]) {
                var subject = this.subjects[e][index]
                if (subject.fn === fn) {
                    this.subjects[e].splice(0, index)
                }
            }
        } else {
            delete this.subjects[e]
        }
    }

    emit(e, args) {
        if (e in this.subjects) {
            for (var index in this.subjects[e]) {
                var subject = this.subjects[e][index]
                if ('debug' in window && window.debug === true) {
                    console.log(subject, args)
                }
                subject.fn.call(this, args)
            }
        }
    }
}
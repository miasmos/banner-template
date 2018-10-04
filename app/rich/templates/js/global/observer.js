class Observer {
    constructor() {
        this.subjects = {};
    }

    on(event, fn) {
        const {subjects} = this
        if (typeof event === 'undefined' || typeof fn !== 'function') {
            return;
        }
        if (!(event in subjects)) {
            subjects[event] = [];
        }
        subjects[event].push(fn);
    }

    emit(event, ...params) {
        const {subjects} = this
        if (event in subjects) {
            Object.values(subjects[event]).map(subject => subject.apply(this, params))
        }
    }

    off(event, fn) {
        const {subjects} = this
        if (!(event in subjects)) {
            return;
        }
        if (typeof fn === 'function') {
            Object.values(subjects[event]).map((subject, index) => {
                if (subject === fn) subjects[event].splice(0, index)  
            })
        } else {
            delete subjects[event];
        }
    }
}

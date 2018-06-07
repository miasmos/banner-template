var Observer = function() {
    var subjects = {};
    return {
        subjects: subjects,
        on: function(e, fn, args) {
            if (
                (typeof e !== 'string' && typeof e !== 'number') ||
                typeof e === 'undefined' ||
                typeof fn !== 'function'
            ) {
                return;
            }
            if (!(e in subjects)) {
                subjects[e] = [];
            }
            subjects[e].push({ event: e, fn: fn, args: args });
        },
        emit: function(e, args) {
            if (e in subjects) {
                for (var index in subjects[e]) {
                    var subject = subjects[e][index];
                    if ('debug' in window && window.debug === true) {
                        console.log(subject, args);
                    }
                    subject.fn.call(this, args);
                }
            }
        },
        off: function(e, fn) {
            if (!(e in subjects)) {
                return;
            }
            if (typeof fn === 'function') {
                for (var index in subjects[e]) {
                    var subject = subjects[e][index];
                    if (subject.fn === fn) {
                        subjects[e].splice(0, index);
                    }
                }
            } else {
                delete subjects[e];
            }
        }
    };
};

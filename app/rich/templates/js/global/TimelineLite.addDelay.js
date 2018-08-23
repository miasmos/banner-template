/**
 * Add a delay at the end of the timeline (or at any label)
 * @param {number} delay    Seconds to wait
 * @param {string} position Label name where to start the delay
 */
TimelineLite.prototype.addDelay = function(delay, position) {
    var delayAttr;
    if (typeof delay === 'undefined' || isNaN(delay)) {
        return this; //skip if invalid parameters
    }
    if (typeof position === 'undefined') {
        delayAttr = '+=' + delay; //add delay at the end of the timeline
    } else if (typeof position === 'string') {
        delayAttr = position + '+=' + delay; //add delay after label
    } else if (!isNaN(position)) {
        delayAttr = delay + position; //if they're both numbers, assume absolute position
    } else {
        return this; //nothing done
    }

    return this.set({}, {}, delayAttr);
};
var Duration = function(target) {
    var element = $(target);

    var set = function(percent) {
        element.css('width', percent + '%');
    };

    return {
        set: set
    };
};

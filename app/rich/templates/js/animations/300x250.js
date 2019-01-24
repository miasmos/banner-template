const Background = new BackgroundClass('.backgrounds');
var repeatCount = 0;
var repeatTotal = 1;
var timeline = new TimelineMax({ repeat: repeatTotal });

timeline
    .add('frame1')
    .add(Background.slideDown.bind(Background, 1))
    .to('.copy1', 1.1, { opacity: 1 })
    .addDelay(3, 'frame2');
timeline
    .add('frame2')
    .add(Background.slideUp.bind(Background, 1))
    .addDelay(0.2, 'frame2-copy')
    .to('.copy1', 1.1, { opacity: 0 })
    .add('frame2-copy')
    .add(Background.slideDown.bind(Background, 1))
    .to('.copy2', 1, { opacity: 1 })
    .addDelay(3, 'frame3');
timeline
    .add('frame3')
    .add(Background.slideUp.bind(Background, 1))
    .addDelay(0.2, 'frame3-copy')
    .to('.copy2', 1.1, { opacity: 0 })
    .add('frame3-copy')
    .to('.copy3,.cta,.details,.legal-trigger,.legal-exit-trigger', 1, {
        opacity: 1
    })
    .addDelay(5, 'frame4')
    .add(function() {
        if (repeatCount++ >= repeatTotal) {
            timeline.pause();
        }
    });
timeline
    .add('frame4')
    .addDelay(0.2, 'frame4-hide')
    .to('.cta,.copy3,.details,.legal-trigger,.legal-exit-trigger', 1, {
        opacity: 0
    })
    .add('frame4-hide')
    .addDelay(0.5, 'frame5');
timeline.add('frame5');

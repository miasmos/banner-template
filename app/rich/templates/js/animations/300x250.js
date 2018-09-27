var repeatTotal = 1;
var repeatCount = 0;
var timeline = new TimelineMax({ repeat: repeatTotal });
var typewriter = new Typewriter('.typewriter', {
    text: 'WBANV13508BZ47041',
    appearDelay: 200,
    appearDelayVariance: 75
});

timeline
    .add('frame1')
    .to('.copy1', 0.5, { opacity: 1 })
    .addDelay(3, 'frame2');
timeline
    .add('frame2')
    .to('.copy1,.background1', 0.5, { opacity: 0 })
    .to('.copy2,.background2', 0.5, { opacity: 1 })
    .to('.copy2', 0, { opacity: 0 })
    .to('.typewriter', 0, { opacity: 1 })
    .addDelay(1, 'typewriter')
    .add('typewriter')
    .add(typewriter.animate())
    .addDelay(3, 'frame3');
timeline
    .add('frame3')
    .to('.copy2,.background2,.typewriter', 0.5, { opacity: 0 })
    .to('.background3,.copy3', 0.5, {
        opacity: 1
    })
    .to('.cta', 0.5, { opacity: 1 })
    .addDelay(5, 'frame4')
    .call(() => {
        if (repeatCount++ >= repeatTotal) {
            timeline.pause();
        }
    });
timeline
    .add('frame4')
    .to('.copy3,.background3,.cta', 0.5, {
        opacity: 0
    })
    .to('.background1', 0.5, {
        opacity: 1
    });
timeline.add('frame5');

var repeatCount = 0;
var repeatTotal = 1;
var timeline = new TimelineMax({ repeat: repeatTotal });

timeline
    .add('frame1')
    .to('.copy1', 0.5, { opacity: 1 })
    .addDelay(2, 'frame2');
timeline
    .add('frame2')
    .to('.background1', 0.5, { opacity: 0 })
    .to('.copy2,.background2', 0.5, { opacity: 1 })
    .addDelay(2, 'frame3');
timeline
    .add('frame3')
    .to('.background2', 0.5, { opacity: 0 })
    .to('.copy3,.background3', 0.5, { opacity: 1 })
    .add('frame2-copy')
    .addDelay(2, 'frame4');
timeline
    .add('frame4')
    .to('.copy1,.copy2,.copy3,.background2,.background3', 0.5, { opacity: 0 })
    .to(
        '.background4,.copy4,.details,.legal-trigger,.legal-exit-trigger',
        0.5,
        {
            opacity: 1
        }
    )
    .to('.cta', 0.5, { opacity: 1 })
    .addDelay(3, 'frame5')
    .call(() => {
        if (repeatCount++ >= repeatTotal) {
            timeline.pause();
        }
    });
timeline
    .add('frame5')
    .to('.copy4,.details,.background4,.cta', 0.5, {
        opacity: 0
    })
    .to('.background1', 0.5, {
        opacity: 1
    });
timeline.add('frame6');

var repeatCount = 0;
var repeatTotal = 1;
var timeline = new TimelineMax({ repeat: repeatTotal });

timeline
    .add('frame1')
    .to('.copy1', 0.5, { opacity: 1 })
    .addDelay(2, 'frame2');
timeline
    .add('frame2')
    .to('.copy1,.background1', 0.5, { opacity: 0 })
    .to('.copy2,.background2', 0.5, { opacity: 1 })
    .addDelay(1, 'frame2-copy')
    .to('.copy3', 0.5, { opacity: 1 })
    .add('frame2-copy')
    .addDelay(2, 'frame3');
timeline
    .add('frame3')
    .to('.copy2,.copy3,.background2', 0.5, { opacity: 0 })
    .to(
        '.background3,.copy4,.copy5,.details,.legal-trigger,.legal-exit-trigger',
        0.5,
        {
            opacity: 1
        }
    )
    .to('.cta', 0.5, { opacity: 1 })
    .addDelay(2, 'frame3-copy')
    .to('.copy4', 0.5, { top: '-116px' })
    .to('.copy5', 0.5, { opacity: 0 }, '-=0.5')
    .add('frame3-copy')
    .to('.copy6', 0.5, { opacity: 1 })
    .addDelay(3, 'frame4')
    .call(() => {
        if (repeatCount++ >= repeatTotal) {
            timeline.pause();
        }
    });
timeline
    .add('frame4')
    .to('.copy4,.copy5,.copy6,.details,.background3,.cta', 0.5, {
        opacity: 0
    })
    .to('.background1', 0.5, {
        opacity: 1
    });
timeline.add('frame5');

const isHorizontal = data.size === '970x250';
const lineWidth = 18;
const Background = new BackgroundClass('.backgrounds', isHorizontal, lineWidth);
var repeatCount = 0;
var repeatTotal = 1;
var timeline = new TimelineMax({ repeat: repeatTotal });
var frameCount = 0;

timeline
    .add(`frame1`)
    .add(Background.slideDown.bind(Background, 1))
    .to('.background1 .animated', 3, { top: -40, ease: Power2.easeOut })
    .to(`.copy1`, 1.1, { opacity: 1 })
    .addDelay(3, `frame2`);
timeline
    .add(`frame2`)
    .add(Background.slideUp.bind(Background, 1))
    .to(`.copy1`, 1.1, { opacity: 0 })
    .to('.background1 .animated', 0, { top: 0 })
    .add(`frame2-copy`)
    .to(`.copy2`, 1, { opacity: 1 })
    .addDelay(3, `frame3`);
timeline
    .add(`frame3`)
    .to(`.copy2`, 1, { opacity: 0 })
    .add('frame3-copy')
    .addDelay(0.5, 'frame3-copy')
    .add(Background.slideDown.bind(Background, 1))
    .to(`.copy3,.cta`, 1, { opacity: 1 })
    .add(() => (repeatCount++ >= repeatTotal ? timeline.pause() : undefined))
    .addDelay(5, `frame4`);
timeline
    .add(`frame4`)
    .add(Background.slideUp.bind(Background, 1.5))
    .addDelay(0.5, `frame4-hide`)
    .to(`.cta,.copy3`, 1, { opacity: 0 })
    .add(`frame4-hide`)
    .addDelay(0.5, `frame4`);
timeline.add(`frame5`);

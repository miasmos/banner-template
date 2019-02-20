const isHorizontal = data.size === '728x90';
const lineWidth = 9;
const Background = new BackgroundClass('.backgrounds', isHorizontal, lineWidth);
var repeatCount = 0;
var repeatTotal = 1;
var timeline = new TimelineMax({ repeat: repeatTotal });
var frameCount = 0;

timeline
    .add(`frame1`)
    .add(Background.slideDown.bind(Background, 1))
    .to(`.copy1`, 1.1, { opacity: 1 })
    .addDelay(3, `frame2`);

timeline
    .add(`frame2`)
    .add(Background.slideUp.bind(Background, 1))
    .addDelay(0.2, `frame2-copy`)
    .to(`.copy1`, 1.1, { opacity: 0 })
    .add(`frame2-copy`)
    .add(Background.slideDown.bind(Background, 1))
    .to(`.copy2,.cta`, 1, { opacity: 1 })
    .addDelay(5, `frame3`)
    .add(() => (repeatCount++ >= repeatTotal ? timeline.pause() : undefined));
timeline
    .add(`frame3`)
    .add(Background.slideUp.bind(Background, 1.5))
    .addDelay(0.2, `frame3-hide`)
    .to(`.cta,.copy2`, 1, { opacity: 0 })
    .add(`frame3-hide`)
    .addDelay(0.5, `frame4`);
timeline.add(`frame4`);

const Background = new BackgroundClass('.backgrounds', data.size === '728x90');
var repeatCount = 0;
var repeatTotal = data.revision === 'CO4' || data.revision === 'CL4' ? 0 : 1;
var timeline = new TimelineMax({ repeat: repeatTotal });
var frameCount = 0;

timeline
    .add(`frame${++frameCount}`)
    .add(Background.slideDown.bind(Background, 1))
    .to(`.copy${frameCount}`, 1.1, { opacity: 1 })
    .add(() => {
        if (data.revision === 'CO4' || data.revision === 'CL4') {
            return new TimelineMax()
                .to('.copy2', 1, { opacity: 1 })
                .to('.cta', 1, { opacity: 1 });
        }
    })
    .addDelay(3, `frame${frameCount + 1}`);

if (data.revision !== 'CO4' && data.revision !== 'CL4') {
    timeline
        .add(`frame${++frameCount}`)
        .add(Background.slideUp.bind(Background, 1))
        .addDelay(0.2, `frame${frameCount}-copy`)
        .to(`.copy${frameCount - 1}`, 1.1, { opacity: 0 })
        .add(`frame${frameCount}-copy`)
        .add(
            () =>
                data.revision === 'CL2'
                    ? Background.slideDown.call(Background, 1)
                    : undefined
        )
        .to(`.copy${frameCount}`, 1, { opacity: 1 })
        .addDelay(3, `frame${frameCount + 1}`);

    if (data.revision === 'CL2') {
        timeline
            .add(`frame${++frameCount}`)
            .add(Background.slideUp.bind(Background, 1))
            .addDelay(0.2, `frame${frameCount}-copy`)
            .to(`.copy${frameCount - 1}`, 1.1, { opacity: 0 })
            .add(`frame${frameCount}-copy`)
            .to(`.copy${frameCount}`, 1, { opacity: 1 })
            .addDelay(3, `frame${frameCount + 1}`);
    }
    timeline
        .add(`frame${++frameCount}`)
        .add(Background.slideUp.bind(Background, 1))
        .addDelay(0.2, `frame${frameCount}-copy`)
        .to(`.copy${frameCount - 1}`, 1.1, { opacity: 0 })
        .add(`frame${frameCount}-copy`)
        .add(Background.slideDown.bind(Background, 1))
        .to(`.copy${frameCount},.cta`, 1, { opacity: 1 })
        .addDelay(5, `frame${frameCount + 1}`)
        .add(
            () => (repeatCount++ >= repeatTotal ? timeline.pause() : undefined)
        );
    timeline
        .add(`frame${++frameCount}`)
        .add(Background.slideUp.bind(Background, 1.5))
        .addDelay(0.2, `frame${frameCount}-hide`)
        .to(`.cta,.copy${frameCount - 1}`, 1, { opacity: 0 })
        .add(`frame${frameCount}-hide`)
        .addDelay(0.5, `frame${frameCount + 1}`);
    timeline.add(`frame${++frameCount}`);
}

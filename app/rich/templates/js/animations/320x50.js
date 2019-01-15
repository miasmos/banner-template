var timeline = new TimelineMax();

timeline
    .add('frame1')
    .to('.copy1', 0.5, { opacity: 1 })
    .to('.cta', 0.5, { opacity: 1 });
timeline
    .add('frame2')
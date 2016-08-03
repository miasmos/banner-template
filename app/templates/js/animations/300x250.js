var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.masks .top', 1, {width:301,left:0}, 'start')
            .to('.masks .left', 1, {height:251}).add('mask-left')
            .to('.masks .bottom-bottom', 1, {width:207}, 'start')
            .to('.masks .bottom-right', 0.8, {width:94})
            .addDelay(1, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 1.7, {opacity:1, ease:easeOut}).add('frame2-animate')
            .to('.backgrounds,.copy1', 1, {left: "-=282", ease:easeOut}, 'frame2-animate+=2')
            .to('.bottom-bottom', 1, {width:301, ease:easeOut}, 'frame2-animate+=2')
            .to('.copy2', 0, {opacity:1, left:282}, 'frame2-animate+=2')
            .to('.copy2', 1, {left:0, ease:easeOut}, 'frame2-animate+=2')
            .addDelay(1.5, 'frame3')
        timeline.add('frame3')
            .to('.backgrounds,.copy2', 1, {top:"-=30", ease:easeOut}, 'frame3')
            .to('.logo,.cta', 2, {opacity:1, ease:easeOut}, 'frame3+=0.3')
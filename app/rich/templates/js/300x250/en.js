var timeline = new TimelineMax(); 
 
timeline 
    .add('frame1') 
    .to('.background1', 0.4, {opacity: 1})
    .to('.copy1', 0.7, {opacity: 1})
    .to('.copy2', 0.7, {opacity: 1})
    .addDelay(3, 'frame2'); 
timeline 
    .add('frame2') 
    .to('.background1,.copy1,.copy2', 1.1, {opacity: 0}) 
    .to('.background2', 0.4, {opacity: 1}) 
    .to('.copy3,.copy4,.copy5', 0.7, {opacity: 1}) 
    .to('.cta,.cta-trigger', 0.7, {opacity: 1})
    .addDelay(5, 'frame3') 
timeline 
    .add('frame3') 
    .to('.background2,.copy3,.copy4,.cta,.cta-trigger', 1.1, {opacity: 0}) 
    .to('.background3', 0.4, {opacity: 1}) 
    .to('.copy6,.copy7', 0.7, {opacity: 1})
    .to('.cta,.cta-trigger', 0.7, {opacity: 1})  
    .addDelay(0.5, 'frame4'); 
timeline.add('frame4'); 
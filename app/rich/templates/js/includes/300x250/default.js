var l = 0;
var imageHeight = 140;
var ctaMargin = 0;
var TweenMax = TweenMax;
var tl = new TimelineMax({ paused: false });
var textTweenTime = 0.5;
var zoomTime = 5;
var transitionTime = 0.5;
var maskEase = Sine.easeInOut;
var maskEaseIn = Power1.easeIn;
var maskEaseOut,
    imageEase = Power1.easeOut;
var zoomMax = 1.075;

function initMask() {
    TweenMax.set(mask, { height: 0 });
    TweenMax.set(bar, { top: 0 });
}

function openMask(myElement, pY) {
    showElement(myElement);
    TweenMax.fromTo(
        mask,
        transitionTime,
        { height: 0 },
        { height: pY, ease: maskEase }
    );
    moveBar(pY);
}

function closeMask(myElement, pY) {
    TweenMax.fromTo(
        mask,
        transitionTime,
        { height: pY },
        { height: 0, ease: maskEase }
    );
    moveBar(0);
    //TweenMax.delayedCall(transitionTime, removeElement, [myElement])
}

function moveBar(pY) {
    TweenMax.to(bar, transitionTime, { top: pY, ease: maskEase, delay: 0.0 });
}

function removeElement(myElement) {
    TweenMax.set(myElement, { autoAlpha: 0 });
}

function showElement(myElement) {
    TweenMax.set(myElement, { autoAlpha: 1 });
}

function resumeTL(t) {
    tl.pause();
    TweenMax.delayedCall(t, function() {
        tl.resume();
    });
}

function fadeOut() {
    l++;
    if (l < 2) {
        tl.addLabel('fadeOut')
            //.to(text1a, .5, {autoAlpha: 0, ease:maskEaseIn}, "fadeOut")
            //.to(text1b, .5, {autoAlpha: 0, ease:maskEaseIn}, "fadeOut")
            .to(cta, 0.5, { autoAlpha: 1, ease: maskEaseIn }, 'fadeOut')
            .addCallback(
                closeMask,
                'fadeOut',
                [video, imageHeight - ctaMargin],
                this
            )
            .addCallback(restartBanner, '+=0', [], this);
    } else {
        tl.pause();
    }
}

function zoomFromBig(myElement) {
    TweenMax.set(myElement, { scale: zoomMax, rotationZ: 0.001, z: 0.01 });
    TweenMax.to(myElement, zoomTime, {
        scale: 1,
        ease: imageEase,
        force3D: true,
        transformOrigin: '50% 50%'
    });
}

function zoomToBig(myElement) {
    TweenMax.set(myElement, { scale: 1.01, rotationZ: 0.001, z: 0.01 });
    TweenMax.to(myElement, zoomTime, {
        scale: zoomMax,
        ease: imageEase,
        force3D: true,
        transformOrigin: '50% 50%'
    });
}

function restartBanner() {
    var mediaElement = document.getElementById('video');
    mediaElement.currentTime = 0;
    mediaElement.play();

    tl.play('start');
}

function initBanner() {
    TweenMax.set(bannerContent, { autoAlpha: 1 });
    TweenMax.set(mask, { css: { height: 0 } });
    TweenMax.set(bar, { top: 0 });

    initMask();

    tl.addLabel('start')

        .addCallback(openMask, 'start', [video, imageHeight], this)
        //.from(text1a, textTweenTime, {autoAlpha: 0}, "+=.4")
        //.from(text1b, textTweenTime, {autoAlpha: 0}, "+=2")

        .addCallback(resumeTL, '+=4.5', [0])

        .addLabel('finalFrame')
        // .from(cta, textTweenTime, {autoAlpha: 0}, "+=0")

        .addCallback(fadeOut, '+=4', [], this);
}

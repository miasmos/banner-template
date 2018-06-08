const videoController = new Youtube('.video .video-inner');
let muteToggle = undefined,
    playToggle = undefined,
    duration = undefined,
    video = undefined

videoController.on('initialized', () => {
    video = videoController.create($('.video-inner').attr('data-video'), true, false);
    videoController.setActive(video.id, false)

    video.on(YT.PlayerState.INIT, () => {
        muteToggle = new Mute('#ad > .mute')
        playToggle = new Play('#ad > .play, .play-icon, .preview')
        duration = new Duration('#ad > .duration')
        muteToggle.mute()

        playToggle.on('play', () => {
            videoController.play()
        })

        playToggle.on('pause', () => {
            videoController.pause()
        })

        muteToggle.on('mute', () => {
            videoController.mute()
        })

        muteToggle.on('unmute', () => {
            videoController.unmute()
        })

        $('.button').click(() => {
            videoController.play()
        })

        video.on('playback', () => {
            duration.set(video.percentPlayed() * 100)
        })

        video.on(YT.PlayerState.PLAYING, () => {
            videoController.hidePreview()
            playToggle.play()
        })

        video.on(YT.PlayerState.PAUSED, () => {
            videoController.showPreview()
            playToggle.pause()
        })

        video.on(YT.PlayerState.ENDED, () => {
            videoController.showPreview()
            playToggle.pause()
            video.reset()
            duration.set(0)
        })
    })
})
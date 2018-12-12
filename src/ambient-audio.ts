import * as THREE from 'three'
import webAudioTouchUnlock from 'web-audio-touch-unlock';

export class FOAmbisonics { 
    constructor(audioName) {  

        // Set up an audio element to feed the ambisonic source audio feed.
        // Input audio should contain 4 channels (foa)
        var audioElement = document.createElement('audio');
        audioElement.src = 'assets/audio/' + audioName;

        // Create AudioContext, MediaElementSourceNode and FOARenderer.
        var audioContext = new AudioContext();
        var audioElementSource =
            audioContext.createMediaElementSource(audioElement);
        // @ts-ignore: Unreachable code error
        var foaRenderer = Omnitone.createFOARenderer(audioContext);

        // Make connection and start play.
        foaRenderer.initialize().then(function() {
            audioElementSource.connect(foaRenderer.input);
            foaRenderer.output.connect(audioContext.destination);
            audioElement.volume = 0.3;
            webAudioTouchUnlock(audioContext)
                .then(function (unlocked) {
                    if(unlocked) {
                        console.log("need ambient");
                        // AudioContext was unlocked from an explicit user action, sound should start playing now
                    } else {
                        console.log("no need ambient");
                        // There was no need for unlocking, devices other than iOS
                    }
                    audioElement.play();
                }, function(reason) {
                    console.error(reason);
                });
        });
    }
}
import * as THREE from 'three'

export class PositionalAudio { 
    private analyser: THREE.AudioAnalyser;

    constructor(scene, camera, audioName, distance) {        

        // create an AudioListener and add it to the camera
        var listener = new THREE.AudioListener();
        camera.add( listener );

        // create the PositionalAudio object (passing in the listener)
        let audioLeft = new THREE.PositionalAudio( listener );
        let audioRight = new THREE.PositionalAudio( listener );

        // Create analyser to analyse song frequencies
        // We only need to analyse one audio since they play the same song
        this.analyser = new THREE.AudioAnalyser(audioLeft, 512);

        // load a sound and set it as the PositionalAudio object's buffer
        var audioLoader = new THREE.AudioLoader();

        // load a resource
        audioLoader.load(
            '../assets/audio/' + audioName,
            (function ( audioBuffer ) {
                // set the audio object buffer to the loaded object
                audioLeft.setBuffer( audioBuffer );
                audioLeft.setRefDistance( 20 );
                audioLeft.setLoop(true);
                audioRight.setBuffer( audioBuffer );
                audioRight.setRefDistance( 20 );
                audioRight.setLoop(true);
                audioLeft.play();
                audioRight.play();
            }),
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function ( err ) {
                console.log( 'Error: Could not load audio:' + audioName );
            }
        );

        // create an object for the sound to play from
        // Make this transparent when positioning is complete
        let sphere = new THREE.SphereGeometry( 1, 10, 10 );
        const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
        let leftSpeaker = new THREE.Mesh( sphere, material );
        let rightSpeaker = new THREE.Mesh( sphere, material );

        leftSpeaker.position.set(-18, 6.5, distance/2 + 7);
        rightSpeaker.position.set(-18, 6.5, -distance/2 + 7);

        scene.add( leftSpeaker );
        scene.add( rightSpeaker );

        // Add the sound to the meshes
        leftSpeaker.add( audioLeft );
        rightSpeaker.add( audioRight );

    }

    getIntensity() {
        return this.analyser.getAverageFrequency() / 100;
    }
}
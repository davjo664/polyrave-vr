import * as THREE from 'three'
import { Speaker } from './speaker';

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
        this.analyser = new THREE.AudioAnalyser(audioLeft, 512*4);

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
        let sphere = new THREE.BoxGeometry( 1, 3, 2 );
        const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
        // let leftSpeaker = new THREE.Mesh( sphere, material );
        // let rightSpeaker = new THREE.Mesh( sphere, material );

        // // TESTING TESTING //
        // let a = new Poly('fhFGDsv5jje');
        // this.scene.add(a);

        let leftSpeaker = new Speaker();
        let rightSpeaker = new Speaker();

        //leftSpeaker.rotateY(Math.PI/2);
        //rightSpeaker.rotateY(Math.PI/2);

        leftSpeaker.position.set(-26, 0, distance/2 );
        rightSpeaker.position.set(-26, 0, -distance/2 );

        // leftSpeaker.rotation.set(0,180,0);
        // rightSpeaker.rotation.set(0,0,0);

        scene.add( leftSpeaker );
        scene.add( rightSpeaker );

        // Add the sound to the meshes
        leftSpeaker.add( audioLeft );
        rightSpeaker.add( audioRight );

    }

    getIntensity() {
        // Get frequency data 
        let frequencyData = this.analyser.getFrequencyData();
        let lowFrequenciesEnd = frequencyData.length/4;
        let sum = 0;
        // Iterate part of frequencies and sum
        for (let i = 0; i < lowFrequenciesEnd; i++) {
            sum += frequencyData[i];
        }

        // Return frequency average
        return (sum/lowFrequenciesEnd)/100;
    }
}
import * as THREE from 'three'

export class PositionalAudio {
    constructor(scene, camera, audioName, position) {
        
        // create an AudioListener and add it to the camera
        var listener = new THREE.AudioListener();
        camera.add( listener );

        // create the PositionalAudio object (passing in the listener)
        var audio = new THREE.PositionalAudio( listener );

        // load a sound and set it as the PositionalAudio object's buffer
        var audioLoader = new THREE.AudioLoader();

        // load a resource
        audioLoader.load(
            '../assets/audio/' + audioName,
            function ( audioBuffer ) {
                // set the audio object buffer to the loaded object
                audio.setBuffer( audioBuffer );
                audio.setRefDistance( 20 );
                audio.setLoop(true);
                audio.play();
            },
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function ( err ) {
                console.log( 'Error: Could not load audio:' + audioName );
            }
        );

        // create an object for the sound to play from
        // Make this transparent when positioning is complete
        var sphere = new THREE.SphereGeometry( 1, 10, 10 );
        var material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
        var mesh = new THREE.Mesh( sphere, material );
        mesh.position.set(position[0], position[1], position[2]);
        scene.add( mesh );

        // Add the sound to the mesh
        mesh.add( audio );

    }
}
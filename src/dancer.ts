// three.js
import * as THREE from 'three'

export default class Dancer {
    private mixer: THREE.AnimationMixer;
    constructor(scene) {
        var loader = window['loader'];
        loader.load( 'assets/models/samba.fbx', ( object:THREE.Group ) => {
            object.scale.set(0.05,0.05,0.05);
            object.position.setY(1);
            console.log("OBJ");
            console.log(object);
            this.mixer = new THREE.AnimationMixer( object );
             // @ts-ignore: Unreachable code error
            var action = this.mixer.clipAction( object.animations[ 0 ] );
            action.play();
            scene.add( object );
        } );
    }

    update(delta) {
        if(this.mixer) {
            this.mixer.update( delta );
        }
    }
}

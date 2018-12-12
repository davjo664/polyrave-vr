// three.js
import * as THREE from 'three'

export default class DiscJockey {
    private mixer: THREE.AnimationMixer;
    constructor(scene) {
        var loader = window['loader'];
        loader.load( 'assets/models/DJ/lumberJack.fbx', ( object:THREE.Group ) => {
            object.scale.set(0.027, 0.027, 0.027);
            object.position.set(-25, 8, 0);
            object.rotateY(Math.PI/2);

            // Assign texture to DJ mesh
            var textureUrl	= 'assets/models/DJ/lumberJack_diffuse.png';
            var texture = new THREE.TextureLoader().load(textureUrl);
            let mesh = object.children[1];
            // @ts-ignore
            mesh.material.map = texture;
            
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

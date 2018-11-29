// three.js
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js';

export class Player extends THREE.Object3D {
    private newPos: THREE.Vector3 = new THREE.Vector3(0,0,0);
    constructor(scene, camera) {
        super();
        scene.add( this );
        this.add( camera );
        this.lookAt( 0, 0, -1 );
    }

    setEndPos(newPos: THREE.Vector3, duration) {
        this.newPos = newPos;
        new TWEEN.Tween( this.position ).to( this.newPos, duration ).start();
    }

    update() {
        TWEEN.update( performance.now());
    }
}
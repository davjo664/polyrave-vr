// three.js
import * as THREE from 'three'

export class Camera extends THREE.PerspectiveCamera {
    constructor(aspectRatio) {
        super(60, aspectRatio,0.01, 100);

        // this.position.set( 50, 40, 50 );
        // this.lookAt( 0, 0, 0 );
    }

    update() {
        var time = performance.now() / 5000;

        this.position.x = Math.sin( time ) * 3;
        this.position.z = Math.cos( time ) * 3;
        this.lookAt( 0, 1.5, 0 );
    }
}
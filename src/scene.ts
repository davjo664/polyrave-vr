// three.js
import * as THREE from 'three'

export class Scene extends THREE.Scene {
    constructor() {
        super();

        const sceneRadius = 50;
        // add axis to the scene
        let axis = new THREE.AxesHelper(2)
        this.add(axis);

        this.background = new THREE.Color( 0x222222 );

        this.add( new THREE.GridHelper( 100, 100 ) );

        // add lights
        let light = new THREE.DirectionalLight(0xffffff, 1.0)
        light.position.set(100, 100, 100)
        this.add(light)

        var ambient = new THREE.HemisphereLight( 0xbbbbff, 0x886666, 0.75 );
        ambient.position.set( -0.5, 0.75, -1 );
        this.add( ambient );

        var geometry = new THREE.SphereGeometry(sceneRadius, 32, 32, 0, Math.PI );
        var skyMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        var sky = new THREE.Mesh( geometry, skyMaterial );
        skyMaterial.side = THREE.BackSide;
        sky.rotateX(-Math.PI/2);
        this.add( sky );

    }
}
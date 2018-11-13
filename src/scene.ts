// three.js
import * as THREE from 'three'

export class Scene extends THREE.Scene {
    constructor() {
        super();

        const sceneRadius = 50;
        // add axis to the scene
        let axis = new THREE.AxesHelper(20)
        this.add(axis);

        this.background = new THREE.Color( 0x222222 );

        this.add( new THREE.GridHelper( 100, 100 ) );

        // add lights
        let light = new THREE.DirectionalLight(0xffffff, 1.0)
        light.position.set(100, 100, 100)
        this.add(light)

        let ambient = new THREE.HemisphereLight( 0xbbbbff, 0x886666, 0.75 );
        ambient.position.set( -0.5, 0.75, -1 );
        this.add( ambient );

        // Add sky base 
        const geometry = new THREE.SphereGeometry(sceneRadius, 32, 32, 0, Math.PI );
        let skyMaterial = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
        let sky = new THREE.Mesh( geometry, skyMaterial );
        skyMaterial.side = THREE.BackSide;
        sky.rotateX(-Math.PI/2);
        this.add( sky );

        // Add ground
        const groundGeometry = new THREE.BoxGeometry(120, 0.5, 120);
        let groundMaterial = new THREE.MeshLambertMaterial( {color: 'gray', transparent: true, opacity: 0} );
        let groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
        groundMesh.translateY(-0.5);
        groundMesh.name = "ground";
        this.add(groundMesh);

    }

    addStage = (width, height) => {
        const geometry0 = new THREE.CylinderGeometry(width + 0.5, width, height, 30, 5, false, 0);
        let baseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        let stageBase = new THREE.Mesh( geometry0, baseMaterial );
        stageBase.position.set(0, height/2, 50);

        this.add(stageBase);
    }
}
// three.js
import * as THREE from 'three'
import * as FBXLoader from 'three-fbx-loader'
import { OBJLoader } from 'three-obj-mtl-loader'
import { Booth } from '../booth'
import { Grass } from '../grass'
import { ModelLoader } from '../model-loader'

export class IntroScene extends THREE.Scene {
    constructor() {
        super();

        // add axis to the scene
        let axis = new THREE.AxesHelper(20)
        // this.add(axis);

        const fogColor = 0x424242;
        this.background = new THREE.Color(fogColor);
        this.fog = new THREE.Fog(fogColor, 30, 150);

        // add lights
        let light = new THREE.DirectionalLight(0xffffff, 0.7)
        light.position.set(100, 100, 100)
        this.add(light)

        let ambient = new THREE.HemisphereLight( 0xbbbbff, 0x886666, 0.75 );
        ambient.position.set( -0.5, 0.75, -1 );
        this.add( ambient );

        // Add intro-text
        var loader = new THREE.FontLoader();
        loader.load( 'assets/fonts/helvetiker_bold.json', font => {

            var geometry = new THREE.TextGeometry( 'Welcome', {
                font: font,
                size: 3,
                height: 3,
                curveSegments: 3,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            } );
            var material = new THREE.MeshStandardMaterial({ color: 'red' });
            var textMesh = new THREE.Mesh(geometry, material);

            //Position the text
            textMesh.position.set(35, 1, 50);
            textMesh.rotateY(1.1*Math.PI);
            this.add(textMesh);
        } );

        // Add ground
        let groundWidth = 220;
        let groundDepth = 250;
        
        const groundGeometry = new THREE.BoxGeometry(groundWidth, 0.5, groundDepth);
        // let groundMaterial = new THREE.MeshLambertMaterial( {color: 'gray', transparent: true} );
        var floorMaterial = new THREE.MeshStandardMaterial( { 
            color: 'rgb(3, 76, 2)', roughness: 0, metalness: 0
        } );
        

        /*
        let ground = new ModelLoader("../assets/models/ground.obj","../assets/models/ground.mtl", 400);   
        this.add(ground);
        ground.position.set(40, -5, 25);
        
        let trees = new ModelLoader("../assets/models/trees.obj","../assets/models/trees.mtl", 400);
        this.add(trees);
        trees.position.set(40, 0, 25);
        */

        let ally = new ModelLoader("assets/models/alle.obj","assets/models/trees.mtl", 400);
        this.add(ally);
        ally.position.set(-20, 0, 0);

        // Grass
        const grassRadius = 80;
        const numberOfGrassTushes = 6000;
        const grass = new Grass(this, grassRadius, numberOfGrassTushes);

        let groundMesh = new THREE.Mesh( groundGeometry, floorMaterial );
        groundMesh.translateY(-0.5);
        groundMesh.name = "ground";
        this.add(groundMesh);

    }

}
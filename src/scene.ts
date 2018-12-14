// three.js
import * as THREE from 'three'
import * as FBXLoader from 'three-fbx-loader'
import webAudioTouchUnlock from 'web-audio-touch-unlock';
import { OBJLoader } from 'three-obj-mtl-loader'
import { Booth } from './booth'
import { Grass } from './grass'
import { ModelLoader } from './model-loader'

export class Scene extends THREE.Scene {
    private rectLight: any;
    private rectLightMesh: any;
    private textMesh: THREE.Mesh;
    constructor() {
        super();

        // add axis to the scene
        let axis = new THREE.AxesHelper(20)
        // this.add(axis);

        this.background = new THREE.Color( 0x222222 );

        const fogColor = 0x000;
        // this.fog = new THREE.Fog(fogColor, 40, 100);

        let ambient = new THREE.HemisphereLight( 0xbbbbff, 0x886666, 0.5 );
        ambient.position.set( -0.5, 0.75, -1 );
        this.add( ambient );

        // Add sky base 
        var geometry = new THREE.SphereBufferGeometry(400,32,32, Math.PI );

        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( '../assets/textures/sky.jpg' ) // equirectangular image
        } );
        // material.side = THREE.BackSide;
        var mesh = new THREE.Mesh( geometry, material );
        mesh.translateY(100);
        this.add( mesh );

        // Add ground
        let groundWidth = 300;
        let groundDepth = 300;
        
        const groundGeometry = new THREE.BoxGeometry(groundWidth, 0.5, groundDepth);
        var floorMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

        const groundGeometry2 = new THREE.BoxGeometry(800, 0.5, 800);
        let groundMesh2 = new THREE.Mesh( groundGeometry2, new THREE.MeshLambertMaterial( { 
            color: 'rgb(3, 76, 2)'
        }));
        this.add(groundMesh2);
        groundMesh2.receiveShadow = true;
        groundMesh2.castShadow = false;
        
        let trees = new ModelLoader("assets/models/optskog.obj","assets/models/trees.mtl", 400);
        this.add(trees);
        trees.position.set(40, -2, 25);

        // Grass
        const grassRadius = 80;
        const numberOfGrassTushes = 6000;
        // const grass = new Grass(this, grassRadius, numberOfGrassTushes);

        let groundMesh = new THREE.Mesh( groundGeometry, floorMaterial );
        groundMesh.translateY(-0.5);
        groundMesh.translateX(50);
        groundMesh.translateZ(20);
        groundMesh.name = "ground";
        this.add(groundMesh);

        this.addStage();
        this.addDJBooth();
        this.addBackgroundScreen();
        this.addScenePanel();

        // Only add text on iOS devices
        const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (isIOS) {
            this.addInfoText();
        }
    }

    addStage() {
        const stage = new THREE.BoxGeometry(30, 4, 70);
        var stageMaterial = new THREE.MeshLambertMaterial( { color: 0x808080 } );
        let stageMesh = new THREE.Mesh( stage, stageMaterial );
        stageMesh.position.set(-15, 2, 0);
        this.add(stageMesh);
    }

    addScenePanel() {
        const geometry = new THREE.CylinderGeometry(1, 1, 50, 5, 5, false, 0, Math.PI);
        const material = new THREE.MeshStandardMaterial( { color: 0x444444, roughness: 0, metalness: 0 } );
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-30, 24, 0);
        mesh.rotateX(Math.PI/2);
        this.add(mesh);
    }

    addBackgroundScreen() {
        var width = 70;
        var height = 40;
        var intensity = 0.1;
        // @ts-ignore: Unreachable code error
        this.rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        this.rectLight.position.set( -30, 5, 0 );
        this.rectLight.lookAt( 0, 5, 0 );
        this.add( this.rectLight )
        // @ts-ignore: Unreachable code error
        var rectLightHelper = new THREE.RectAreaLightHelper( this.rectLight );
        this.add( rectLightHelper );

        this.rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial() );
        this.rectLightMesh.scale.x = this.rectLight.width;
        this.rectLightMesh.scale.y = this.rectLight.height;
        this.rectLight.add( this.rectLightMesh );
        var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
        rectLightMeshBack.rotation.y = Math.PI;
        this.rectLightMesh.add( rectLightMeshBack );
        this.updateLightIntensity(0.11);
    }

    updateLightIntensity(val) {
        if (val > 0.52) val = 0.6;
        if (val > 0.1) {
            this.rectLight.intensity = val;
            this.rectLightMesh.material.color.copy( this.rectLight.color ).multiplyScalar( this.rectLight.intensity );
        } 
    }

    addDJBooth = () => {
        // Not working properly
        let DjTable = new Booth();
        DjTable.position.set(-20, 4, 0);
        this.add( DjTable );
    }

    // Add info text on iOS devices
    // User need to click to start audio (auto audio play disabled)
    addInfoText() {
        // Add intro-text
        var loader = new THREE.FontLoader();
        loader.load( 'assets/fonts/helvetiker_bold.json', font => {

            var geometry = new THREE.TextGeometry( 'Press to start \n     the gig!', {
                font: font,
                size: 3,
                height: 1.5,
                curveSegments: 3,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            } );

            var material = new THREE.MeshStandardMaterial({ emissive: 'red', emissiveIntensity: 0.7 });
            this.textMesh = new THREE.Mesh(geometry, material);

            //Position the text
            this.textMesh.position.set(85, 6, 80);
            this.textMesh.rotateY(0.4*Math.PI);
            this.add(this.textMesh);

        } );

        // @ts-ignore: Unreachable code error
        var context = new (window.AudioContext || window.webkitAudioContext)();
        webAudioTouchUnlock(context)
        .then(() => {
            this.remove(this.textMesh);       
        }, function(reason) {
            console.error(reason);
        });
        
    }

}
// three.js
import * as THREE from 'three'

// local imports
import { Renderer } from './renderer';
import { Camera } from './camera';
import { Scene } from './scene';
import { Poly } from './poly';
import { Player } from './player';
import { PositionalAudio } from './positional-audio';
import { BoxGeometry } from 'three';
import { FOAmbisonics } from './ambient-audio';

export class Main {
    private scene: Scene;
    private camera: Camera;
    private renderer: Renderer;
    private container: any;
    private player: Player;
    private positionalSceneAudio: PositionalAudio;
    private ambientAudio: FOAmbisonics;
    private raycaster: THREE.Raycaster;
    private mouse: any = {x:0, y:0};
    private crosshair: THREE.Mesh;
    private stats: any;
    constructor(container) {

        // // the HTML container
        this.container = container;

        // create the renderer
        this.renderer = new Renderer(this.container);

        // @ts-ignore: Unreachable code error
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
        
        // create the scene
        this.scene = new Scene();

        // create the camera
        const aspectRatio = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera = new Camera(aspectRatio);

        this.player = new Player(this.scene, this.camera);

        this.positionalSceneAudio = new PositionalAudio(this.scene, this.camera, 'deadmau5.mp3', 30);
        this.ambientAudio = new FOAmbisonics('forest_FOA.flac');

        this.raycaster = new THREE.Raycaster();

        this.crosshair = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )
        );
        this.crosshair.position.z = - 2;
        this.camera.add( this.crosshair );

        // Initial size update set to canvas container
        this.updateSize();

        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
        
        this.render()

        container.addEventListener( 'mousemove', (event) => this.onMouseMove(event), false );

        // For testing in browser
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.camera.rotation.y += 0.5
            }
            else if (event.key === "ArrowRight") {
                this.camera.rotation.y -= 0.5
            }
        });

        // POLY REST API
        /*
        let randomAssets = ['7Rr7j8S0q6C','fsUd856ZJZM']
        let poly = new Poly(randomAssets[Math.floor(Math.random()*randomAssets.length)]);
        this.scene.add( poly );
        */

        this.scene.addStage(25, 2);

        // Hide loading text
        this.container.querySelector('#loading').style.display = 'none';
    
    }
    updateSize() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.camera.updateProjectionMatrix();
    }

    render(): void {
        this.player.update();
        this.stats.update();
        this.raycaster.setFromCamera(this.renderer.vr.getDevice() ? {x: 0, y:0} : this.mouse, this.camera );
        var intersects = this.raycaster.intersectObject(this.scene.getObjectByName("ground"));
        if (intersects.length > 0) {
            this.player.setEndPos(intersects[ 0 ].point);
            this.crosshair.visible = true;
        } else {
            this.crosshair.visible = false;
            this.player.setEndPos(this.player.position);
        }
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
    }

    onMouseMove( event ) {
        // For testing in browser
        event.preventDefault();
        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
    }
}
    



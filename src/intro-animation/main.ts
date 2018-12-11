// three.js
import * as THREE from 'three'

// local imports
import { Renderer } from '../renderer';
import { Camera } from '../camera';
import { IntroScene } from './intro-scene';
import { Poly } from '../poly';
import { Player } from '../player';
import { PositionalAudio } from '../positional-audio';
import { BoxGeometry } from 'three';
import { FOAmbisonics } from '../ambient-audio';
import { VolumetricLight } from '../volumetric-light';
import { Arrow } from '../arrow';
import { ModelLoader } from '../model-loader';

export class Intro {
    private scene: IntroScene;
    private camera: Camera;
    private renderer: Renderer;
    private container: any;
    private player: Player;
    private positionalSceneAudio: PositionalAudio;
    private ambientAudio: FOAmbisonics;
    private mouse: any = {x:0, y:0};
    private stats: any;
    private animationFrameId: any;
    constructor(container) {

        // // the HTML container
        this.container = container;

        // create the renderer
        this.renderer = new Renderer(this.container);
        this.renderer.shadowMap.enabled = true;

        // @ts-ignore: Unreachable code error
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
        
        // create the scene
        this.scene = new IntroScene();

        // create the camera
        const aspectRatio = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera = new Camera(aspectRatio*1.2);

        this.player = new Player(this.scene, this.camera);
        this.player.position.y = 3;

        //const goal = new THREE.Vector3(10, 3, 18);
        //const animationDuration = 10000;
        //this.player.setEndPos(goal, animationDuration);

        //this.positionalSceneAudio = new PositionalAudio(this.scene, this.camera, 'deadmau5.mp3', 40);
        this.ambientAudio = new FOAmbisonics('forest_FOA.flac');

        // Initial size update set to canvas container
        this.updateSize();

        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        
        this.render()

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

        this.renderer.render(this.scene, this.camera)
        this.animationFrameId = requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
    }

    destroy() {
        var element = document. getElementById('introSceneContainer');
        element.parentNode.removeChild(element);
        cancelAnimationFrame(this.animationFrameId);
        this.scene.children.forEach((child: THREE.Mesh) => {
            if (child.isMesh) {
                child.geometry.dispose();
                // @ts-ignore: Unreachable code error
                child.material.dispose();
                this.scene.remove(child);
            }
        })
        this.scene = null;
        this.camera = null;
        this.player = null;
        this.renderer = null;
        this.stats = null;
    }
}
    



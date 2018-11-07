// three.js
import * as THREE from 'three'

// local imports
import { Renderer } from './renderer';
import { Camera } from './camera';
import { Scene } from './scene';
import { Poly } from './poly';
import { Player } from './player';
import { PositionalAudio } from './positional-audio';

export class Main {
    private scene: Scene;
    private camera: Camera;
    private renderer: Renderer;
    private container: any;
    private player: Player;
    private positionalAudioLeft: PositionalAudio;
    private positionalAudioRight: PositionalAudio;   
    constructor(container) {

        // // the HTML container
        this.container = container;

        // create the renderer
        this.renderer = new Renderer(this.container);
        
        // create the scene
        this.scene = new Scene();

        // create the camera
        const aspectRatio = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera = new Camera(aspectRatio);

        this.player = new Player(this.scene, this.camera);

        this.positionalAudioLeft = new PositionalAudio(this.scene, this.camera, 'test.wav', [15, 3, 40]);
        this.positionalAudioRight = new PositionalAudio(this.scene, this.camera, 'test.wav', [-15, 3, 40]);


        // Initial size update set to canvas container
        this.updateSize();

        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
        
        this.render()

        // POLY REST API
        /*
        let randomAssets = ['7Rr7j8S0q6C','fsUd856ZJZM']
        let poly = new Poly(randomAssets[Math.floor(Math.random()*randomAssets.length)]);
        this.scene.add( poly );
        */

        this.scene.addStage(30, 1.5);

        // Hide loading text
        this.container.querySelector('#loading').style.display = 'none';
    
    }
    updateSize() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.camera.updateProjectionMatrix();
    }

    render(): void {
        this.camera.update();
        this.player.update();
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
    }
}
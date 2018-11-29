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
import { VolumetricLight } from './volumetric-light';
import { Arrow } from './arrow';
import { ModelLoader } from './model-loader';
import Dancer from './dancer';

export class Main {
    private scene: Scene;
    private camera: Camera;
    private renderer: Renderer;
    private container: any;
    private player: Player;
    private positionalSceneAudio: PositionalAudio;
    private ambientAudio: FOAmbisonics;
    private volumetricLight1: VolumetricLight;
    private volumetricLight2: VolumetricLight;
    private volumetricLight3: VolumetricLight;
    private raycaster: THREE.Raycaster;
    private mouse: any = {x:0, y:0};
    private crosshair: THREE.Mesh;
    private stats: any;
    private arrow: Arrow;
    private walkTimer: number = 0.0;
    private clock: THREE.Clock;
    private dancer: Dancer;
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
        this.scene = new Scene();

        // create the camera
        const aspectRatio = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera = new Camera(aspectRatio*1.2);

        this.player = new Player(this.scene, this.camera);

        this.player.position.set(130, 3, 90);
        this.player.rotateY(1.4*Math.PI);

        this.positionalSceneAudio = new PositionalAudio(this.scene, this.camera, 'deadmau5.mp3', 40);
        //this.ambientAudio = new FOAmbisonics('forest_FOA.flac');

        // Add scene light beams 
        // constructor: scene, xyz position, color, animation path
        var path1 = (angle) => { return new THREE.Vector3(8 * Math.cos(angle), 0, 6 * Math.sin(angle)) };
        var path2 = (angle) => { return new THREE.Vector3(-6 * Math.cos(angle), 0, -8 * Math.sin(angle)) };
        var path3 = (angle) => { return new THREE.Vector3(2 * Math.cos(angle), 0, -2 * Math.sin(angle)) };
        this.volumetricLight1 = new VolumetricLight(this.scene, -30, 24, -20, 'blue', path1);
        this.volumetricLight2 = new VolumetricLight(this.scene, -30, 24, 0, 'lightblue', path2);
        this.volumetricLight3 = new VolumetricLight(this.scene, -30, 24, 20, 'blue', path3);

        this.raycaster = new THREE.Raycaster();

        this.crosshair = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )
        );
        this.crosshair.position.z = -4;
        this.camera.add( this.crosshair );
        this.clock = new THREE.Clock();
        this.dancer = new Dancer(this.scene);
        
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
            } else if (event.key === "ArrowUp") {
                this.camera.rotation.x += 0.5
            } else if (event.key === "ArrowDown") {
                this.camera.rotation.x -= 0.5
            }
        });

        this.arrow = new Arrow();
        this.scene.add( this.arrow );

        var dj = new Poly('73ky2Ggv_r_');
        dj.position.set(-25, 3, 0);
        this.scene.add(dj);

        //let c = new ModelLoader("../assets/models/test.obj","../assets/models/test.mtl", 10);
        //this.scene.add(c);
        /////////////////

        // load fbx model and texture    
        //this.scene.importStaticFBXModel("../assets/models/scene.FBX");      
    
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

        const sound_intensity = this.positionalSceneAudio.getIntensity();
        this.volumetricLight1.update(sound_intensity);
        this.volumetricLight2.update(sound_intensity);
        this.volumetricLight3.update(sound_intensity);

        this.scene.updateLightIntensity(sound_intensity/2);

        this.raycaster.setFromCamera(this.renderer.vr.getDevice() ? {x: 0, y:0} : this.mouse, this.camera );
        var intersects = this.raycaster.intersectObject(this.scene.getObjectByName("ground"));
        if (intersects.length > 0) {
            this.walkTimer += 1;
            if(this.walkTimer > 90) {
                this.player.setEndPos(new THREE.Vector3(intersects[ 0 ].point.x,4,intersects[ 0 ].point.z), 2000);
                // @ts-ignore: Unreachable code error
                this.arrow.position.set(intersects[ 0 ].point.x,intersects[ 0 ].point.y+1,intersects[ 0 ].point.z);
                this.walkTimer = 0.0
            } else {
                 // @ts-ignore: Unreachable code error
                this.crosshair.material.opacity = (this.walkTimer/90);
                
            }
            
        } else {
            this.walkTimer = 0.0;
            this.player.setEndPos(this.player.position, 2000);
             // @ts-ignore: Unreachable code error
             this.crosshair.material.opacity = 0;
        }

        this.dancer.update(this.clock.getDelta());

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
    



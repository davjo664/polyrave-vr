// three.js
import * as THREE from 'three'
import * as FBXLoader from 'three-fbx-loader'
import { Poly } from './poly'

export class Scene extends THREE.Scene {
    constructor() {
        super();

        const sceneRadius = 100;
        // add axis to the scene
        let axis = new THREE.AxesHelper(20)
        this.add(axis);

        this.background = new THREE.Color( 0x222222 );

        //this.add( new THREE.GridHelper( 100, 100 ) );

        // add lights
        let light = new THREE.DirectionalLight(0xffffff, 0.7)
        light.position.set(100, 100, 100)
        this.add(light)


        let ambient = new THREE.HemisphereLight( 0xbbbbff, 0x886666, 0.75 );
        ambient.position.set( -0.5, 0.75, -1 );
        this.add( ambient );

        // Add sky base 
        var geometry = new THREE.SphereBufferGeometry(sceneRadius,32,32, Math.PI );

        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( '../assets/textures/sky.jpg' ) // equirectangular image
        } );
        // material.side = THREE.BackSide;
        var mesh = new THREE.Mesh( geometry, material );
        mesh.translateY(18);
        this.add( mesh );

        // Add ground
        const groundGeometry = new THREE.BoxGeometry(120, 0.5, 120);
        let groundMaterial = new THREE.MeshLambertMaterial( {color: 'gray', transparent: true, opacity: 0} );
        let groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
        groundMesh.translateY(-0.5);
        groundMesh.name = "ground";
        this.add(groundMesh);

    }

    importStaticFBXModel(path) {

        const loader = new FBXLoader();
        loader.load(path, group => {
            
            console.log(group);

            // Iterate model and assign colors
            group.children.forEach((child) => {
                if (child.name == 'scenModel') {
                    child.material.color = new THREE.Color(0.5, 0.5, 0.5);
                    /*
                    child.children.forEach((grandChild) => {
                        grandChild.material.color = new THREE.Color(0.3, 0.3, 0.3);
                    });
                    */
                // Ground
                } else if (child.name == 'markModel') {
                    // Create material with bump mapping
                    var texture = new THREE.TextureLoader().load('../assets/textures/grass.jpg');
                    child.material = new THREE.MeshPhongMaterial();

                    child.material.bumpMap = texture;
                    child.material.bumpScale = 50;
                    child.material.shininess = 5;
                    child.material.color = new THREE.Color(0, 0.1, 0);
                }
                // Small trees
                else if (child.name.includes('stam')) {
                    let crown = child.children[0];
                    child.material.color = new THREE.Color(77/255, 38/255, 0);
                    crown.material.color = new THREE.Color(0, 0.8, 0);
                }
                // Big trees
                else if (child.name == 'big_treeModel' || child.name == 'stort_trdModel') {
                    let treeBase = child.children[0];
                    child.material.color = new THREE.Color(0, 0.8, 0);
                    treeBase.material.color = new THREE.Color(77/255, 38/255, 0);
                }
            });

            group.scale.set(0.1,0.1,0.1);
            group.rotateY(0.16973888889 * Math.PI);
            this.add(group);
        });
    }

    addDJBooth = () => {
        // Not working properly
        let DjTableID = '082e6B-a6or';
        let DjTable = new Poly(DjTableID);
        this.add( DjTable );
        //DjTable.position.set(-5, 4, 0);
        //DjTable.rotateY(Math.PI/2);
        DjTable.scale.set(0.01, 0.01, 0.01);
    }

}
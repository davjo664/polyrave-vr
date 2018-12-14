// three.js
import * as THREE from 'three'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'

export class ModelLoader extends THREE.Group{
    constructor(objPath, mtlPath, scale) {
        //"../assets/models/scene.FBX"
        // model

        super();

        var loader = new MTLLoader();
        loader.setMaterialOptions( { ignoreZeroRGBs: true } );
        loader.load( mtlPath,  ( materials ) => {

            var loader = new OBJLoader();
            
            loader.setMaterials( materials );
            loader.load( objPath, ( object ) => {
                // console.log(object);
                var box = new THREE.Box3();
                box.setFromObject( object );

                // Add casting tree shadows
                object.children.forEach((child) => {
                    child.castShadow = true;
                    child.receiveShadow = false;
                });

                // re-center
                var center = box.getCenter(new THREE.Vector3());
                center.y = box.min.y;
                object.position.sub( center );

                // scale

                this.add( object );
                this.scale.setScalar( scale / box.getSize(new THREE.Vector3()).length() );
            } );
        } );
    }

}
// three.js
import * as THREE from 'three'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import { API_KEY } from './apikey'

export class Arrow extends THREE.Group{
    constructor() {
        super();

        if(!API_KEY) {
            console.warn("No Poly API KEY found. Add it to src/apikey.ts.");
            return;
        }

        fetch(`https://poly.googleapis.com/v1/assets/dJNY2d6MSO2/?key=${API_KEY}`)
        .then(response => response.json())
        .then(asset =>  {
            var format = asset.formats.find( format => { return format.formatType === 'OBJ'; } );

            if ( format !== undefined ) {

                var obj = format.root;
                var mtl = format.resources.find( resource => { return resource.url.endsWith( 'mtl' ) } );

                var path = obj.url.slice( 0, obj.url.indexOf( obj.relativePath ) );

                var loader = new MTLLoader();
                loader.setCrossOrigin( true );
                loader.setMaterialOptions( { ignoreZeroRGBs: true } );
                loader.setTexturePath( path );
                loader.load( mtl.url,  ( materials ) => {

                    var loader = new OBJLoader();
                    
                    // loader.setMaterials( materials );
                    loader.load( obj.url, ( object ) => {
                        var box = new THREE.Box3();
                        box.setFromObject( object );
                        // re-center

                        var center = box.getCenter(new THREE.Vector3());
                        center.y = box.min.y;
                        object.position.sub( center );

                        // scale
                        this.add( object );
                        this.scale.setScalar( 4 / box.getSize(new THREE.Vector3()).length() );
                        
                        let a:THREE.Mesh = object.children[0];
                        a.rotation.set(0,0,180*0.0174532925);

                    } );

                } );

            }

        } );
    }
}
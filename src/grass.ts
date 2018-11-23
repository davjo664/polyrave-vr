import * as THREE from 'three'

export class Grass extends THREE.Mesh {
    constructor(scene, groundWidth, groundDepth) {
        super();
        // load the texture
        var textureUrl	= '../assets/textures/grass_tuft.png'
        var texture = new THREE.TextureLoader().load(textureUrl);
        //var texture	= THREE.ImageUtils.loadTexture(textureUrl)
        // build the material
        var material	= new THREE.MeshPhongMaterial({
            map		: texture,
            color		: 'grey',
            emissive	: 'darkgreen',
            alphaTest	: 0.7,
        })
        // create the mesh
        let positions = [];
        let numberOfGrassTushes = 15000;
        // Add random positions to grass tushes
        for (let i = 0; i < numberOfGrassTushes; i++) {
            positions.push(new THREE.Vector3(
                Math.floor(Math.random() * groundWidth) + 1,
                0,
                Math.floor(Math.random() * groundDepth) + 1
            ));
        }
        var geometry = this.createGrassGeometry(positions, material);
        var mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh);

        // Translate merged mesh
        mesh.position.set(-30, 1, -120);
    }

    createGrassGeometry(positions, material) {
        // create the initial geometry
        let width = 3;
        let height = 1;
        var geometry	= new THREE.PlaneGeometry(width, height)
        geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, height/2, 0 ) );


        // Tweat the normal for better lighting
        // - normals from http://http.developer.nvidia.com/GPUGems/gpugems_ch07.html
        // - normals inspired from http://simonschreibt.de/gat/airborn-trees/
        geometry.faces.forEach(function(face){
            face.vertexNormals.forEach(function(normal){
                normal.set(0.0,1.0,0.0).normalize()
            })
        })
	
        // create each tuft and merge their geometry for performance
        var mergedGeo	= new THREE.Geometry();
        for(var i = 0; i < positions.length; i++){
            var position	= positions[i]			
            var baseAngle	= Math.PI*2*Math.random()

            var nPlanes	= 2
            for(var j = 0; j < nPlanes; j++){
                var angle	= baseAngle+j*Math.PI/nPlanes

                // First plane
                var object3d	= new THREE.Mesh(geometry, material)
                object3d.rotateY(angle)
                object3d.position.copy(position)
                THREE.GeometryUtils.merge( mergedGeo, object3d );

                // The other side of the plane
                // - impossible to use ```side : THREE.BothSide``` as 
                //   it would mess up the normals
                var object3d	= new THREE.Mesh(geometry, material)
                object3d.rotateY(angle+Math.PI)
                object3d.position.copy(position)
                THREE.GeometryUtils.merge( mergedGeo, object3d );
            }
        }

        return mergedGeo;
    }
}
import * as THREE from 'three'

export class VolumetricLight {
    private vertexShader: any;
    private fragmentShader: any;
    private light: THREE.SpotLight = new THREE.SpotLight;
    private lightMesh: THREE.Mesh = new THREE.Mesh;
    private animation: any;

    constructor(scene, x, y, z, color, animation) {

        this.animation = animation;

        this.vertexShader = [
            'varying vec3 vNormal;',
            'varying vec3 vWorldPosition;',
            
            'void main(){',
                '// compute intensity',
                'vNormal		= normalize( normalMatrix * normal );',

                'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
                'vWorldPosition		= worldPosition.xyz;',

                '// set gl_Position',
                'gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}',
        ].join('\n');

        this.fragmentShader	= [
            'varying vec3		vNormal;',
            'varying vec3		vWorldPosition;',

            'uniform vec3		lightColor;',

            'uniform vec3		spotPosition;',

            'uniform float		attenuation;',
            'uniform float		anglePower;',

            'void main(){',
                'float intensity;',

                //////////////////////////////////////////////////////////
                // distance attenuation					//
                //////////////////////////////////////////////////////////
                'intensity	= distance(vWorldPosition, spotPosition)/attenuation;',
                'intensity	= 1.0 - clamp(intensity, 0.0, 1.0);',

                //////////////////////////////////////////////////////////
                // intensity on angle					//
                //////////////////////////////////////////////////////////
                'vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));',
                'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',
                'intensity	= intensity * (angleIntensity);',		
                // 'gl_FragColor	= vec4( lightColor, intensity );',

                //////////////////////////////////////////////////////////
                // final color						//
                //////////////////////////////////////////////////////////

                // set the final color
                'gl_FragColor	= vec4( lightColor, intensity);',
            '}',
        ].join('\n');

        var gg = new THREE.CylinderGeometry(0, 30, 100, 32*2, 20, false)
        var mm	= new THREE.ShaderMaterial({
            uniforms: { 
                attenuation	: {
                    type	: "f",
                    value	: 30.0
                },
                anglePower	: {
                    type	: "f",
                    value	: 10.0
                },
                spotPosition		: {
                    type	: "v3",
                    value	: new THREE.Vector3( 0, 0, 0 )
                },
                lightColor	: {
                    type	: "c",
                    value	: new THREE.Color('cyan')
                },
            },
            vertexShader	: this.vertexShader,
            fragmentShader	: this.fragmentShader,
            side		: THREE.DoubleSide,
            transparent	: true,
            depthWrite	: false,
        });

        gg.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -gg.parameters.height/2, 0 ) );
        gg.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
        this.lightMesh = new THREE.Mesh( gg, mm );
        this.lightMesh.position.set(x, y, z);
        this.lightMesh.lookAt(new THREE.Vector3(0, 0, 0));
        mm.uniforms.lightColor.value.set( color );
        mm.uniforms.spotPosition.value	= this.lightMesh.position;
        scene.add( this.lightMesh );
        
        this.light = new THREE.SpotLight();
        this.light.position.copy(this.lightMesh.position);
        this.light.color = mm.uniforms.lightColor.value;
        this.light.castShadow = true;
        this.light.penumbra = 0.6;
        this.light.angle = Math.PI/5;
        this.light.intensity = 2;
        scene.add( this.light );
        scene.add( this.light.target );
        
    }

    update() {
        //Update direction of light beam
        let angle = 0.05 * Math.PI * 2 * Date.now() / 100;
        // Animate volumetric beams in circular motion
        //var target = new THREE.Vector3(6 * Math.cos(angle), 0, 6 * Math.sin(angle));
        let target = this.animation(angle);
		this.lightMesh.lookAt(target);
        this.light.target.position.copy(target);
    }
}
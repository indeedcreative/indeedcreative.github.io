			if ( WEBGL.isWebGLAvailable() === false ) {
				document.body.appendChild( WEBGL.getWebGLErrorMessage() );
			}
			var container, stats;
			var cam, cameraTarget, scene, renderer;
			var object;

			init();
			animate();
			/*
			var loader = new THREE.FontLoader();
			loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {
								init( font );
								animate();
							} );
			*/
			function init() {

				/*
				cam = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
				cam.position.set( 3, 0.15, 3 );
				cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );
				*/
				cam = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
				cam.position.z = 250;
				cameraTarget = new THREE.Vector3( 0, 0, 0 );

				scene = new THREE.Scene();
				//scene.background = new THREE.Color( 0x72645b );
				scene.background = new THREE.Color( 0x050505 );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 );
				
				// Ground
				
				var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40 ),
					new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
				);
				plane.rotation.x = - Math.PI / 2;
				plane.position.y = - 0.5;
				scene.add( plane );
				plane.receiveShadow = true;
				
				/*
				uniforms = {
					amplitude: { value: 5.0 },
					opacity: { value: 0.3 },
					color: { value: new THREE.Color( 0xffffff ) }
				};
				//shader material 
				var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true
				} );
				*/
				// ASCII file
				
				var loader = new THREE.STLLoader();
				loader.load( './models/machine.stl', function ( geometry ) {
					var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
					var mesh = new THREE.Mesh( geometry, material );
					/*
					object = new THREE.Line( geometry, shaderMaterial );
					object.rotation.x = 0.2;
					scene.add( object );
					*/
					mesh.position.set( 0, - 0.25, 0.6 );
					mesh.rotation.set( 0, - Math.PI / 2, 0 );
					mesh.scale.set( 0.5, 0.5, 0.5 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					scene.add( mesh );
					
				} );


				/*
				var geometry = new THREE.TextBufferGeometry( 'INDEED', {
				font: font,
				size: 50,
				height: 15,
				curveSegments: 10,
				bevelThickness: 5,
				bevelSize: 1.5,
				bevelEnabled: true,
				bevelSegments: 10,
				} );

				object = new THREE.Line( geometry, shaderMaterial );
				object.rotation.x = 0.2;
				scene.add( object );
				*/
				// Lights
				
				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
				addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
				addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
				

				// renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				/*
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
				renderer.shadowMap.enabled = true;
				*/
				container = document.getElementById( 'container' );
				container.appendChild( renderer.domElement );
				// stats
				stats = new Stats();
				container.appendChild( stats.dom );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function addShadowedLight( x, y, z, color, intensity ) {
				var directionalLight = new THREE.DirectionalLight( color, intensity );
				directionalLight.position.set( x, y, z );
				scene.add( directionalLight );
				directionalLight.castShadow = true;
				var d = 1;
				directionalLight.shadow.camera.left = - d;
				directionalLight.shadow.camera.right = d;
				directionalLight.shadow.camera.top = d;
				directionalLight.shadow.camera.bottom = - d;
				directionalLight.shadow.camera.near = 1;
				directionalLight.shadow.camera.far = 4;
				directionalLight.shadow.mapSize.width = 1024;
				directionalLight.shadow.mapSize.height = 1024;
				directionalLight.shadow.bias = - 0.002;
			}
			function onWindowResize() {
				cam.aspect = window.innerWidth / window.innerHeight;
				cam.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
				stats.update();
			}
			function render() {
				
				var timer = Date.now() * 0.0005;
				
				cam.position.x = Math.cos( timer )*3;
				cam.position.z = Math.sin( timer )*3;

				cam.lookAt( cameraTarget );
				renderer.render( scene, cam );
				

				/*
				var time = Date.now() * 0.001;
				object.rotation.y = 0.25 * time;
				uniforms.amplitude.value = Math.sin( 0.5 * time );
				uniforms.color.value.offsetHSL( 0.0005, 0, 0 );
				var attributes = object.geometry.attributes;
				var array = attributes.displacement.array;
				for ( var i = 0, l = array.length; i < l; i += 3 ) {
					array[ i ] += 0.3 * ( 0.5 - Math.random() );
					array[ i + 1 ] += 0.3 * ( 0.5 - Math.random() );
					array[ i + 2 ] += 0.3 * ( 0.5 - Math.random() );
				}
				attributes.displacement.needsUpdate = true;

				renderer.render( scene, cam );
				*/
				}

var uniforms;
if ( WEBGL.isWebGLAvailable() === false ) {
			document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		}
		
		var renderer, scene, cam, stats; //use different naming that camera : clash with P5.js camera

		/*
		var controls;
		var mesh;

		var WIDTH = window.innerWidth,
			HEIGHT = window.innerHeight;
		*/

		var object, uniforms;



		var loader = new THREE.FontLoader();
		loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {
			init( font );
			animate();
		} );

		//integrate brain.js
		//initBrain();
		/*
		function init( font ) {
			cam = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
			cam.position.set( - 100, 100, 200 );
			controls = new THREE.TrackballControls( cam );
			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x050505 );
			//
			var geometry = new THREE.TextGeometry( "THREE.JS", {
				font: font,
				size: 40,
				height: 5,
				curveSegments: 3,
				bevelThickness: 2,
				bevelSize: 1,
				bevelEnabled: true
			} );


			geometry.center();
			var tessellateModifier = new THREE.TessellateModifier( 8 );
			for ( var i = 0; i < 6; i ++ ) {
				tessellateModifier.modify( geometry );
			}
			//
			geometry = new THREE.BufferGeometry().fromGeometry( geometry );
			var numFaces = geometry.attributes.position.count / 3;
			var colors = new Float32Array( numFaces * 3 * 3 );
			var displacement = new Float32Array( numFaces * 3 * 3 );
			var color = new THREE.Color();
			for ( var f = 0; f < numFaces; f ++ ) {
				var index = 9 * f;
				var h = 0.2 * Math.random();
				var s = 0.5 + 0.5 * Math.random();
				var l = 0.5 + 0.5 * Math.random();
				color.setHSL( h, s, l );
				var d = 10 * ( 0.5 - Math.random() );
				for ( var i = 0; i < 3; i ++ ) {
					colors[ index + ( 3 * i ) ] = color.r;
					colors[ index + ( 3 * i ) + 1 ] = color.g;
					colors[ index + ( 3 * i ) + 2 ] = color.b;
					displacement[ index + ( 3 * i ) ] = d;
					displacement[ index + ( 3 * i ) + 1 ] = d;
					displacement[ index + ( 3 * i ) + 2 ] = d;
				}
			}
			geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
			//
			uniforms = {
				amplitude: { value: 0.0 }
			};
			var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent
			} );
			//
			mesh = new THREE.Mesh( geometry, shaderMaterial );
			scene.add( mesh );
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( WIDTH, HEIGHT );
			var container = document.getElementById( 'container' );
			container.appendChild( renderer.domElement );
			stats = new Stats();
			container.appendChild( stats.dom );
			//
			window.addEventListener( 'resize', onWindowResize, false );
		}

		*/

		function init( font ) {
			
			cam = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
			cam.position.z = 400;
			
			/*
			cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
			cam.position.z = 250;
			*/
			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x050505 );
			uniforms = {
				amplitude: { value: 5.0 },
				opacity: { value: 0.3 },
				color: { value: new THREE.Color( 0xffffff ) }
			};

			var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true
			} );

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

			geometry.center();
			var count = geometry.attributes.position.count;
			var displacement = new THREE.Float32BufferAttribute( count * 3, 3 );
			geometry.addAttribute( 'displacement', displacement );
			var customColor = new THREE.Float32BufferAttribute( count * 3, 3 );
			geometry.addAttribute( 'customColor', customColor );
			var color = new THREE.Color( 0xffffff );
			for ( var i = 0, l = customColor.count; i < l; i ++ ) {
				color.setHSL( i / l, 0.5, 0.5 );
				color.toArray( customColor.array, i * customColor.itemSize );
			}
			object = new THREE.Line( geometry, shaderMaterial );
			object.rotation.x = 0.2;
			scene.add( object );
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			var container = document.getElementById( 'container' );
			container.appendChild( renderer.domElement );
			stats = new Stats();
			container.appendChild( stats.dom );
			//
			window.addEventListener( 'resize', onWindowResize, false );
		}

		function onWindowResize() {
			cam.aspect = window.innerWidth / window.innerHeight;
			cam.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		function animate() {
			requestAnimationFrame( animate );
			render();
			//updateParamValues();
			stats.update();
		}

		function render() {
			var time = Date.now() * 0.001;
			object.rotation.y = 0.25 * time;
			//uniforms.amplitude.value = Math.sin( 0.5 * time );
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
		}

		/*
		function render() {
			var time = Date.now() * 0.001;
			//uniforms.amplitude.value = 1.0 + Math.sin( time * 0.5 );
			controls.update();
			renderer.render( scene, cam );
		}*/
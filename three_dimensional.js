var uniforms;

if ( WEBGL.isWebGLAvailable() === false ) {
			document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		}
		
		var renderer, scene, cam, stats; //use different naming that camera : clash with P5.js camera
		var object, uniforms;
		var geometry;
		var group;
		var shaderMaterial;
		var text = "INDEED",
				height = 20,
				size = 70,
				hover = 30,
				curveSegments = 4,
				bevelThickness = 2,
				bevelSize = 1.5,
				bevelEnabled = true,
				font = undefined,
				fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
				fontWeight = "bold"; // normal bold

		var init_time = Date.now() * 0.001;
		var prev_duration = 0;
		var rotation_variable = 4;
		var loader = new THREE.FontLoader();
		loader.load( 'fonts/helvetiker_bold.typeface.json', function ( response ) {
			font = response;
			init( font );
			animate();
		} );

		
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

			shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true
			} );

			group = new THREE.Group();
			scene.add(group);

			createText();


			//scene.add( object );
			
		//Here, add object to the scene
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			var container = document.getElementById( 'container' );
			container.appendChild( renderer.domElement );
			stats = new Stats();
			//container.appendChild( stats.dom ); //To remove frame speed 
			//
			window.addEventListener( 'resize', onWindowResize, false );
		}
		
		function createText(){
			geometry = new THREE.TextBufferGeometry( text, {
				font: font,
				size: 50,
				height: 15,
				curveSegments: 10,
				bevelThickness: 5,
				bevelSize: 1.5,
				bevelEnabled: true,
				bevelSegments: 10,
			} );
			
			
			// ASCII file
			geometry.center();
			var count = geometry.attributes.position.count;
			var displacement = new THREE.Float32BufferAttribute( count * 3, 3 );
			geometry.addAttribute( 'displacement', displacement );
			//console.log("count: "+count); //27672
			var customColor = new THREE.Float32BufferAttribute( count * 3, 3 );
			geometry.addAttribute( 'customColor', customColor );
			var color = new THREE.Color( 0xffffff );
			
			
			for ( var i = 0, l = customColor.count; i < l; i ++ ) {
				color.setHSL( i / l, 0.5, 0.5 );
				//color.setHSL( 0.7 + 0.1*Math.sin(i/l), 0.5, 0.5);
				color.toArray( customColor.array, i * customColor.itemSize );
			}

			object = new THREE.Line( geometry, shaderMaterial );
			object.rotation.x = 0.2;
			group.add(object);

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

		function refreshText(string) {
				text = string;
				group.remove(object);
				createText();
		}

		function resetRoutine() {
		  console.log("reset routine");
		  init_time = Date.now() * 0.001;
		  refreshText("INDEED");
		  rotation_variable = 4;

		}

		function render() {
			
			var time = Date.now() * 0.001;

			var cur_duration = Math.round(time - init_time);

            //console.log("duration: "+ duration);

            if(prev_duration == 4 && cur_duration == 5 )//2 seconds
            {
                refreshText("MUSIC");
                rotation_variable = 0.25;
                //cam.updateProjectionMatrix();
                 
            }

			prev_duration = cur_duration;
			//prev = Math.sin( 0.5 * time );
			object.rotation.y = rotation_variable * time;
			//uniforms.amplitude.value = Math.sin( 0.5 * time ); //comment this part 
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

		
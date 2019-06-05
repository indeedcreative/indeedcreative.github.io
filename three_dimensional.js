var uniforms;
var keywords = ["MUSIC", "IDEA", "BRAIN", "WAVE", "PUNCH"];
if ( WEBGL.isWebGLAvailable() === false ) {
			document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		}
		
		var renderer, scene, cam, stats; //use different naming that camera : clash with P5.js camera
		var object, uniforms;
		var geometry;
		var group;
		var shaderMaterial;
		//var radius = 60; 
		var sigmoid_time = -10;
		var zoomValue = 80;
		var controls;
		var mouseX = 0, mouseY = 0;
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
		var theta = 0;
		var rotation_variable = 4;
		var word_index = 0;
		var loader = new THREE.FontLoader();

		loader.load( 'fonts/helvetiker_bold.typeface.json', function ( response ) {
			font = response;
			init( font );
			animate();
		} );

		
		function init( font ) {
			
			cam = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
			//cam.position.x = 400;
			//cam.position.y = 400;
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

			word_index = Math.floor(Math.random() * keywords.length-2);     // returns a random integer from 0 to 9

			createText();


			//scene.add( object );
			
		//Here, add object to the scene
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			var container = document.getElementById( 'container' );
			container.appendChild( renderer.domElement );

			
			controls = new THREE.OrbitControls( cam, renderer.domElement );
			controls.screenSpacePanning = true;
			
			controls.minDistance = 50;
			controls.maxDistance = 400;
			controls.target.set( 0, 1, 0 );
			controls.update();

			
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
		  //word_index = Math.floor(Math.random() * keywords.length-2);     // returns a random integer from 0 to 9
		  //radius = 50; 
		  sigmoid_time = -10;


		}

		function sigmoid(t) {
		    return 1/(1+Math.pow(Math.E, -t));
		}

		function render() {
			
			var time = Date.now() * 0.001;
			theta += 0.1;
			sigmoid_time += 0.1;
			//radius += 2;

			var cur_duration = Math.round(time - init_time);


            //console.log("duration: "+ duration);
            if(cur_duration < 4 ){
            	
            	
            	var word = keywords[word_index];
            	cam.position.z = 500;
            	/*
				cam.position.z = (700 * sigmoid(sigmoid_time) +80); // * Math.cos( THREE.Math.degToRad( theta ) );
				//end value : 100-500
				cam.lookAt( scene.position );
				*/

            }
            if(prev_duration == 4 && cur_duration == 5 )//2 seconds
            {
            	//word_index = Math.floor(Math.random() * keywords.length-2);     // returns a random integer from 0 to 9
            	word_index = Math.floor(Math.random() * keywords.length-2);     // returns a random integer from 0 to 9
                refreshText(keywords[word_index]);
                rotation_variable = 0.25;
                zoomValue = 80;
                //cam.updateProjectionMatrix();
                 
            }

            
            if( 5<= cur_duration && cur_duration <= 35){
            	//cam.position.z = (700 * sigmoid(sigmoid_time) +80); // * Math.cos( THREE.Math.degToRad( theta ) );
            	if(zoomValue < 500)
            		zoomValue = zoomValue + 1;

            	cam.position.z = zoomValue;
				//end value : 100-500
				cam.lookAt( scene.position );
            }

            if(cur_duration > 35)// change this time
            {
            	refreshText("ID: "+ clientID+"\n\nNow move to the \n next station to see the result");
            	cam.position.z = (800 * sigmoid(sigmoid_time) + zoomValue); 
            	cam.position.z = 3000;
            	cam.lookAt( scene.position );
            	rotation_variable = 0;
            	cam.lookAt(0,1,0);

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

		
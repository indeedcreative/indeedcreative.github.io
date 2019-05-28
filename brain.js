let incomingValues = [];
let channels = [];
let globalMax = 0;
let channelSize = 4;

function setup(){

	createChannels();
	//socket = io.connect('http://localhost:5000/');
	socket = io.connect('http://192.168.9.142:5000/');
  	socket.on('brain_signal', readSignal);
}

function createChannels(){
  
  channels[0] = new Channel("Signal Quality", "");
  channels[1] = new Channel("Attention", "");
  channels[2] = new Channel("Meditation", "");
  channels[3] = new Channel("Delta", "Dreamless Sleep");
  channels[4] = new Channel("Theta",  "Drowsy");
  channels[5] = new Channel("Low Alpha", "Relaxed");
  channels[6] = new Channel("High Alpha", "Relaxed");
  channels[7] = new Channel("Low Beta", "Alert");
  channels[8] = new Channel("High Beta", "Alert");
  channels[9] = new Channel("Low Gamma", "Multi-sensory processing");
  channels[10] = new Channel("High Gamma", "???");
  
  //channels[0].addDataPoint(0);

  // Manual override for a couple of limits.
  channels[0].minValue = 0;
  channels[0].maxValue = 200;
  channels[1].minValue = 0;
  channels[1].maxValue = 100;
  channels[2].minValue = 0;
  channels[2].maxValue = 100;
  channels[0].allowGlobal = false;
  channels[1].allowGlobal = false;
  channels[2].allowGlobal = false;
}

function readSignal(data){
	incomingValues = split(data, ",");
 	var m = match(incomingValues[0], "ERROR");

 	if(m != null) return;

 	for (let i = 0; i < channels.length; i++){
	    stringValue = incomingValues[i].trim();
	    let newValue = parseInt(stringValue, 10);

	    //Zero the EEG poser calues if we don't have a signal 

	    if ((parseInt(incomingValues[0], 10)== 200) && (i > 2)){
	      newValue = 0;
	    }
	    console.log("incomingValues["+i+"] ="+newValue);
	    channels[i].addDataPoint(newValue);
	}
}


function draw(){

	
	for(let i = 0; i < channelSize; i++){
		if(channels[i].points.length == 0)
			break;
	
		var length = channels[i].points.length;
		let targetPoint = channels[i].points[channels[i].points.length -1];
		//console.log("length : "+ channels[i].points.length);
		//console.log(channels[i].points);
		//var targetValue = 0;
		var min, max;
		if(i == 1){
			//attention : id = 1
			/*
			min = 20;
			max = 500;
			*/
			min = 0.0;
			max = 2.0;
			//open to read values
			uniforms.amplitude.value = max - round(map(targetPoint.value, channels[i].minValue , channels[i].maxValue , min, max));
			//sphereRad = max - round(map(targetPoint.value, channels[i].minValue , channels[i].maxValue , min, max));
			
		}else if(i == 2){
			//concentration
			min = 1;
			max = 2;
			//uniforms.amplitude.value = max - map(targetPoint.value, channels[i].minValue , channels[i].maxValue, min, max);
			//radius_sp = max - map(targetPoint.value, channels[i].minValue , channels[i].maxValue, min, max);
		}
		//console.log("uniform_amplitude: "+uniforms.amplitude.value);
		//console.log("shereRad: "+sphereRad+", radius_sp: "+radius_sp);
	}
}

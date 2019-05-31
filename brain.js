let incomingValues = [];
let channels = [];
let globalMax = 0;
let channelSize = 4;

let IP_address = 'http://192.168.0.100:5000/';
//http://localhost:5000/
//http://192.168.9.142:5000/

function setup(){

	createChannels();
	//socket = io.connect('http://localhost:5000/');
	socket = io.connect(IP_address);
  	socket.on('brain_signal', readSignal);

  	/*
  	createCanvas(710, 400);
  	canvas.parent('IP_address');
  	var inputText  = createInput(IP_address);
  	inputText.input(myInputEvent);
  	*/

}

function myInputEvent(){
	console.log('you are typing', this.value());
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

function changeIPAddress(){
	console.log("change IP");

	var IP_value = document.getElementById("ip_addr");
	IP_address = IP_value.value;
	reconnect(IP_address);
}

function reconnect(addr){
	socket = io.connect(addr);
  	socket.on('brain_signal', readSignal);
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.body.style.backgroundColor = "rgba(0,0,0,255)";
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
		if(i == 3){
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
			
		}else if(i == 4){
			//concentration
			min = 1;
			max = 2;
			uniforms.amplitude.value = max - map(targetPoint.value, channels[i].minValue , channels[i].maxValue, min, max);
			//radius_sp = max - map(targetPoint.value, channels[i].minValue , channels[i].maxValue, min, max);
		}
		//console.log("uniform_amplitude: "+uniforms.amplitude.value);
		//console.log("shereRad: "+sphereRad+", radius_sp: "+radius_sp);
	}
}

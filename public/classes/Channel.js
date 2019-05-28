class Channel {
	
  	constructor(name, description){
  		this.name = name;
  		this.description = description;

  		//other variables
  		this.allowGlobal = true;
  		this.points = [];
  		this.maxValue = 0;
  		this.minValue= 0;
  	}

  	anyfunction(){
  		console.log("any function");
  	}

  	addDataPoint(value){
  		let time = millis();

  		if(value > this.maxValue) this.maxValue = value;
  		if(value < this.minValue) this.minValue = value;

  		this.points.push(new Point(time, value));
  	}

  	getLatestPoint(){
  		let array_size = this.points.length;
  		if(array_size > 0){
  			return this.points[array_size - 1];
  		}
  		else{
  			return new Point(0, 0);
  		}
  	}
  }

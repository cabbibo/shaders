  
  function TextParticles( string , stringTexture ,  params ){
  
    var params = params || {};

    this.letterSize = params.letterSize || 1;
    this.lineLength = params.lineLength || 100;

    this.width = this.letterSize * this.lineLength; 



  }

  TextParticles.prototype.createGeometry = function(){

    var geometry = new THREE.BufferGeometry();
    
    geometry.addAttribute( 'position', Float32Array, particles.length , 3 );
	geometry.addAttribute( 'textCoord', Float32Array, particles.length, 4 );

    var positions   = geometry.attributes.position.array;
  	var textCoords  = geometry.attributes.textCoord.array;



    
    for( var i = 0; i < this.particles.length; i++ ){




    }

  }


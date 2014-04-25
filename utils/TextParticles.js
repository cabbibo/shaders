 

// TODO: Later Version, create texture to place particles 
// If you are using your own texture, 
// make sure that you are using your own letter indicies
var letterIndicies = {A:[1,2],B:[2,2],C:[3,2],D:[4,2],E:[5,2],F:[6,2],G:[7,2],H:[8,2],I:[9,2],J:[10,2],K:[11,2],L:[12,2],M:[13,2],N:[14,2],O:[15,2],P:[0,3],Q:[1,3],R:[2,3],S:[3,3],T:[4,3],U:[5,3],V:[6,3],W:[7,3],X:[8,3],Y:[9,3],Z:[10,3],a:[1,4],b:[2,4],c:[3,4],d:[4,4],e:[5,4],f:[6,4],g:[7,4],h:[8,4],i:[9,4],j:[10,4],k:[11,4],l:[12,4],m:[13,4],n:[14,4],o:[15,4],p:[0,5],q:[1,5],r:[2,5],s:[3,5],t:[4,5],u:[5,5],v:[6,5],w:[7,5],x:[8,5],y:[9,5],z:[10,5],"!":[1,0],'"':[2,0],'#':[3,0],'$':[4,0],'%':[5,0],'&':[6,0],"'":[7,0],"(":[8,0],")":[9,0],"*":[10,0],"+":[11,0],",":[12,0],"-":[13,0],".":[14,0],"/":[15,0],"0":[0,1],"1":[1,1],"2":[2,1],"3":[3,1],"4":[4,1],"5":[5,1],"6":[6,1],"7":[7,1],"8":[8,1],"9":[9,1],":":[10,1],";":[11,1],"<":[12,1],"=":[13,1],">":[14,1],"?":[15,1],"@":[0,2],"[":[11,3],"]":[13,3],"^":[14,3],"_":[15,3],"{":[11,5],"|":[12,5],"}":[13,5],"~":[14,5],}
 
  
  
  function TextParticles( params ){ 
   
    var params = params || {};

    this.pathToTexture  = params.pathToTexture  || "img/signDistance.png";
    this.letterWidth    = params.letterWidth    || 10;
    this.lineHeight     = params.lineHeight     || 12;
    this.lineLength     = params.lineLength     || 80;

    this.vertexShader   = params.vertexShader   || null;// TODO: default
    this.fragmentShader = params.fragmentShader || null;// TODO: default
    
    this.color          = params.color          || new THREE.Color(0xc0ffee);

    this.texture = THREE.ImageUtils.loadTexture( this.pathToTexture );
    this.texture.flipY = false;

    this.width = this.letterSize * this.lineLength; 

  }

  TextParticles.prototype.createTextParticles = function( string, params ){

    var particles = this.createParticles( string );

    var geometry  = this.createGeometry( particles );
    var material  = this.createMaterial( params );

    var particleSystem = new THREE.ParticleSystem( geometry , material );

    particleSystem.width = this.width;

    return particleSystem;

  }




  // TODO: Make it so that you can pass letter width here

  TextParticles.prototype.createParticles = function( string ){

    var particles = [];

    var lineArray = string.split("\n");
    var counter = [0,0]; // keeps track of where we are

    for( var i = 0; i < lineArray.length; i++ ){

      counter[0] = 0;
      counter[1] ++;

      var wordArray = lineArray[i].split(" ");

      for( var j = 0; j < wordArray.length; j++ ){

        var word = wordArray[j];
        var letters = word.split("");
        var l = letters.length;

        // Makes sure we don't go over line width
        var newL = counter[0] + l;
        if( newL > this.lineLength ){
          counter[0] = 0;
          counter[1] ++;
        }

        // Push a new particle for each place
        for( var k = 0; k < letters.length; k ++ ){
          particles.push( [letters[k] , counter[0] , counter[1]] );
          counter[0] ++;
        }

        counter[0] ++;
      }
    }


    return particles;

  }
 
  // Should it be centered?
  TextParticles.prototype.createGeometry = function( particles ){

    var geometry = new THREE.BufferGeometry();
    
    geometry.addAttribute( 'position', Float32Array, particles.length , 3 );
	geometry.addAttribute( 'textCoord', Float32Array, particles.length, 4 );

    var positions   = geometry.attributes.position.array;
  	var textCoords  = geometry.attributes.textCoord.array;

    for( var i = 0; i < particles.length; i++ ){
    

      positions[ i * 3 + 0 ] = particles[i][1] * this.letterWidth;
      positions[ i * 3 + 1 ] = -particles[i][2] * this.lineHeight; 
      positions[ i * 3 + 2 ] = 0; 

      tc = this.getTextCoordinates( particles[i][0] );

      textCoords[ i * 4 + 0 ] = tc[0];
      textCoords[ i * 4 + 1 ] = tc[1];
      textCoords[ i * 4 + 2 ] = tc[2];
      textCoords[ i * 4 + 3 ] = tc[3];

    }

    return geometry;

  }

  //TODO: Make with and height of letter, for later use
  TextParticles.prototype.getTextCoordinates = function( letter ){
    
    var index;

    for( var l in letterIndicies ){
      if( l == letter )
        index = letterIndicies[l];  
    }

    if( !index )
      index = [0,0];

    var left = (32 * (index[0]) ) / 512; 
    var top  = (32 * (index[1]) ) / 256;

    var bottom = top + ( 16 / 512 );
    var right = left + ( 16 / 512 );

    var array = [ left , top , bottom , right ];
    return array

  }

  
  TextParticles.prototype.createMaterial = function( params ){

    var params = params || {};

    var color = params.color          || this.color;
    var vert  = params.vertexShader   || this.vertexShader;
    var frag  = params.fragmentShader || this.fragmentShader;

    var attributes = {
      textCoord: { type:"v4" , value: null }
    }

    uniforms = {

      t_text:{ type:"t" , value: this.texture },
      color:{ type:"c" , value:new THREE.Color( color ) },
  
    }
        
    var vert = params.vertShader || this.vertexShader;
    var frag = params.fragShader || this.fragmentShader;

    material = new THREE.ShaderMaterial({

      uniforms:uniforms,
      attributes: attributes,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending:THREE.AdditiveBlending

    });


    return material;


  }
 




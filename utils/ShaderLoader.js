
  // Shader Loader will Load any shader you want,
  // And be able to add in large functions ( such as noise )
  // with regex inside the shader
  function ShaderLoader( pathToShaders , pathToChunks ){

    this.fragmentShaders    = {};
    this.vertexShaders      = {};
    this.simulationShaders  = {};

    this.pathToShaders    = pathToShaders || "/" ;
    this.pathToChunks     = pathToChunks || pathToShaders;

    this.shaderChunks = {};

   // this.loadShaderChunks( pathToChunks );

  }



  /*
   
     Loads in a shader chunk when told to by
     onShaderLoaded.

     it is important to know that the title of the
     chunk needs to be the same as the reference in the shader

     AKA, if I use:

     $simplexNoise

     I will need to create a file in the pathToChunks directory
     called

     simplexNoise.js


  */
  ShaderLoader.prototype.loadShaderChunk = function( type ){

    var path = this.pathToChunks + "/" + type + ".js";

    var self = this;
    $.ajax({
      url:path,
      dataType:'text',
      context:{
        title:type,
        path: path
      },
      complete: function( r ){
        self.onChunkLoaded( r.responseText , this.title );
      },
      error:function( r ){
        console.log( 'ERROR: Unable to Load Shader' + this.path );
        self.onChunkLoaded( " NO SHADER LOADED " , this.title );
      }
    });

  }
  
  ShaderLoader.prototype.onChunkLoaded = function( chunk , title ){

    this.shaderChunks[title] = chunk;
    
  }
  
  /*
  
     This function Loads a shader with whatever title/
     type we prefer. 

  */
  ShaderLoader.prototype.load = function( shader , title , type ){
 
    var self = this;

        this.beginLoad();


    // request the file over AJAX
    $.ajax({
      url: self.pathToShaders +"/" + shader + ".js" ,
      dataType: 'text',
      context: {
        type: type 
      },
      complete: function(r){
        self.onShaderLoaded( r.responseText , title , this.type );
      }
    });

  }

  /*
   
     Once a Shader is loaded, check to see if there are any extra chunks 
     we need to find and pull in. 

     Will recall itself, until the chunk has been loaded in

  */
  ShaderLoader.prototype.onShaderLoaded = function( shaderText , title , type ){

    var finalShader = shaderText;
    
    var readyToLoad = true;


    var array = finalShader.split( "$" );

    for( var i = 1; i < array.length; i++ ){

      var chunkName = array[i].split("\n")[0];

      if( this.shaderChunks[chunkName] ){

        var tmpShader = finalShader.split( "$" + chunkName );

        finalShader = tmpShader.join( this.shaderChunks[chunkName] );

      }else{

        readyToLoad = false;
        this.loadShaderChunk( chunkName );

      }

    }

    if( readyToLoad ){    
     
      if( type == 'vertex' ){
        this.vertexShaders[ title ] = finalShader;
      }else if( type == 'fragment' ){
        this.fragmentShaders[ title ] = finalShader;
      }else if( type == 'simulation' ){
        this.simulationShaders[ title ] = finalShader;
      }

      this.endLoad();

    }else{

      var self = this;
      setTimeout( function(){
        self.onShaderLoaded( finalShader , title , type )
      }, 300 );

    }

  }

  ShaderLoader.prototype.endLoad = function(){}
  ShaderLoader.prototype.beginLoad = function(){}

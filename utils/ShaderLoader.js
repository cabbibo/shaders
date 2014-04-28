
  // Shader Loader will Load any shader you want,
  // And be able to add in large functions ( such as noise )
  // with regex inside the shader
  function ShaderLoader( pathToShaders , pathToChunks ){

    this.fragmentShaders  = {};
    this.vertexShaders    = {};

    this.pathToShaders    = pathToShaders;
    this.pathToChunks     = pathToChunks;

    this.loadShaderChunks( pathToChunks );

  }

  /*
   
     Good god, this is uncouth.

     Does the following:
     
     - Ajax Calls a folder, which returns a string of html
     - that string is parsed for the chunk path names
     - Each chunk than gets an ajax call
     - once it gets loaded, we call an 'onChunkLoaded'
     - this adds it to our shaderChunks, and lets us know
       when we are prepared to start loading shaders

  */
  ShaderLoader.prototype.loadShaderChunks = function( pathToDir ){

    this.readyToLoad = false;
    this.loadedChunks= 0;
 
    if( !pathToDir ){

      this.readyToLoad = true;
      return

    }
    var self = this;
    $.ajax({
      url:pathToDir,
      dataType:'text',
      complete: function(r){

        var newText = r.responseText.split( '<li>' );

        // Saves the total number of shaderChunks
        // we are going to load
        self.numberOfShaderChunks = newText.length - 2;
        
        if( self.numberOfShaderChunks == 0 ){

          console.log( 'no shader chunks loaded' );

        }

        for( var i = 2; i < newText.length; i++ ){

          var path = newText[i].split('href="/'+pathToDir)[1];
          var path = path.split('" class')[0];

          var title = path.split('/')[1].split('.js')[0];

          $.ajax({
            url:pathToDir+path,
            dataType:'text',
            context: {
              title: title
            },
            complete: function(r){
              self.onChunkLoaded( r.responseText , this.title ); 
            }
          });

        }

      }
    });

    this.shaderChunks = {};

  }

  ShaderLoader.prototype.onChunkLoaded = function( chunk , title ){

    this.shaderChunks[title] = chunk;
    this.loadedChunks ++;

    if( this.loadedChunks == this.numberOfShaderChunks ){
      this.readyToLoad = true;
    }

  }
  
  /*
  
     This function Loads a shader with whatever title/
     type we prefer. It is important to note that if the 
     shader chunks have not been loaded, the function will
     set a timeout to refire until the shaders are ready


  */
  ShaderLoader.prototype.load = function( shader , title , type ){
 
    var self = this;

    if( !this.readyToLoad ){
      setTimeout(function(){
        self.load( shader , title , type ) 
      }, 100 );
      return;
    }

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

  ShaderLoader.prototype.onShaderLoaded = function( shaderText , title , type ){

    var finalShader = shaderText;

    for( propt in this.shaderChunks ){

      var parse = "$" + propt;

      var array = finalShader.split( parse );
      
      if( array.length > 1 ){
        finalShader = array.join( this.shaderChunks[propt] );
      }

    }
    
    if( type == 'vertex' ){
      this.vertexShaders[ title ] = finalShader;
    }else{
      this.fragmentShaders[ title ] = finalShader;
    }

    this.endLoad();

  }

  ShaderLoader.prototype.endLoad = function(){}
  ShaderLoader.prototype.beginLoad = function(){}

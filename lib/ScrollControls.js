THREE.ScrollControls = function ( object, domElement ) {

    var _this = this;
	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.object.velocity = new THREE.Vector3();
    
    // API
    this.dampening = .9;
    this.speed     =  1;
    this.scrollForce = .1;

    this.scrollX = true;
    this.scrollY = true;

    this.lowerY = -100;
    this.upperY = 100;
    this.lowerX = -100;
    this.upperX = 100;

    this.update = function(){

      var speed =  this.object.velocity.clone().multiplyScalar( this.speed ) ;
      this.object.position.add( speed );

      if( this.object.position.y <= this.lowerY )
        this.object.position.y = this.lowerY

      if( this.object.position.y >= this.upperY )
        this.object.position.y = this.upperY

      if( this.object.position.x <= this.lowerX )
        this.object.position.x = this.lowerX

      if( this.object.position.x >= this.upperX )
        this.object.position.x = this.upperX






      this.object.velocity.multiplyScalar( this.dampening ); 

    }

    mousewheel = function( e ){

      if( _this.scrollY ){
        _this.object.velocity.y +=  e.wheelDeltaY * _this.scrollForce;
      }

      if( _this.scrollX ){
        _this.object.velocity.x -=  e.wheelDeltaX * _this.scrollForce;
      }
    
    }
    
    window.addEventListener( 'mousewheel', mousewheel, false );

};

THREE.ScrollControls.prototype = Object.create( THREE.EventDispatcher.prototype );

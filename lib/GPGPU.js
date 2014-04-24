/**
 * @author mrdoob / http://www.mrdoob.com
 */

var GPGPU = function ( renderer ) {


  var gl = renderer.context;

  if ( gl.getExtension( "OES_texture_float" ) === null ) {

    alert( "No OES_texture_float support for float textures!" );
    return;

  }

  if ( gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) === 0 ) {

    alert( "No support for vertex shader textures!" );
    return;

  }

  var camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );

  var scene = new THREE.Scene();

  var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ) );
  scene.add( mesh );

  this.render = function ( _scene, _camera, target ) {

    renderer.render( _scene, _camera, target, false );

  };

  this.pass = function ( shader , target ) {

    mesh.material = shader;
    renderer.render( scene, camera, target, false );

  };

  this.out = function ( shader ) {

      mesh.material = shader.material;
      renderer.render( scene, camera );

  };

};

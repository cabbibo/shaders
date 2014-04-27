uniform sampler2D t_text;
uniform sampler2D t_lookup;
uniform sampler2D t_textCoord;

uniform float textureSize;

varying vec4 vLookup;
varying vec4 vTextCoord;

void main(){

  vec2 uv     = position.xy + .5/textureSize;
  vLookup     = texture2D( t_lookup , uv );
  vTextCoord = texture2D( t_textCoord , uv );

  vec3 pos = vec3( vLookup.xy , 0.0);
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
  gl_PointSize = 10000. / length( mvPos );
  gl_Position = projectionMatrix * mvPos;

}

uniform sampler2D t_text;
uniform sampler2D t_lookup;
uniform sampler2D t_textCoord;
uniform float textureSize;
uniform float dpr;
uniform float letterWidth;
uniform vec2 windowSize;

varying vec4 vLookup;
varying vec4 vTextCoord;

void main(){

  vec2 uv     = position.xy + .5/textureSize;
  vLookup     = texture2D( t_lookup , uv );
  vTextCoord  = texture2D( t_textCoord , uv );

  vec3 pos =vLookup.xyz;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
  gl_PointSize = ( letterWidth * 2. * dpr);// length( mvPos );
  gl_Position = projectionMatrix * mvPos;

}

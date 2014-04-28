uniform vec3 color;
uniform sampler2D t_text;

varying vec4 vTextCoord;
varying vec4 vLookup;

uniform float textureSize;

const vec2 textSize = vec2( 16. / 512. , 16./256.);
const float smoothing = 1. / 16.0;

void main(){

  vec2 newCoord = vTextCoord.xy;//+  .5/textureSize;;
  vec2 sCoord =  newCoord + gl_PointCoord * vec2( .05 , .1 );

  float distance = texture2D(t_text , sCoord ).g;
  float lum = smoothstep( 0.5 - smoothing , 0.5 + smoothing , distance );
  float alpha = 1. - lum;
  gl_FragColor = vec4(color* vec3( gl_PointCoord , 1.0 ) , alpha );

}

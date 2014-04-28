uniform sampler2D t_to;
uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform float timer;

varying vec2 vUv;

//$simplex

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos  , vUv );
  vec4 to   = texture2D( t_to   , vUv );

  vec2 offset = vec2( timer * 10. , timer * 10.  );
  //float displace = snoise( (to.xy + offset ) * .01 );

  float displace = .4;
  vec3 newTo = to.xyz + vec3( 0. , 0. , displace * 5. );

  vec3 dif = newTo.xyz - pos.xyz;

  vec3 newPos = pos.xyz + dif * .1;

  gl_FragColor= vec4( newPos , .0);

}

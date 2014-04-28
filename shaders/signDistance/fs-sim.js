uniform sampler2D t_to;
uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform float timer;
uniform vec3 speed;

varying vec2 vUv;

$simplex

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos  , vUv );
  vec4 to   = texture2D( t_to   , vUv );

  vec2 offset = vec2( timer * 10. , timer * 10.  );
  float displace = snoise( (to.xy + offset ) * .01 );
  //float displace = snoise( to.xy * .1 );

  vec3 newTo = to.xyz; //+ vec3( 0. , 0. , displace * 20. );

  vec3 vel = pos.xyz - oPos.xyz;
  vec3 dif = newTo.xyz - pos.xyz;
 
  //vec3 vel 
  
 // dif.y += speed.y * 1.;


  vel += dif * .1 ;
  vel.y += abs( displace ) * speed.y;
  //vel.y += (((displace * .4)+.5)/5.) * ( speed.y ) ;
  //vel.y += (((abs(displace) * .2)+.1)/3.) * speed.y;


  vec3 newPos = pos.xyz + vel * (( displace + 5.)/10.);
  newPos.z = displace * 5.;

  gl_FragColor= vec4( newPos , displace );

}

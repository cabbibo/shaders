  uniform sampler2D t_to;
  uniform sampler2D t_oPos;
  uniform sampler2D t_pos;

  varying vec2 vUv;

  void main(){

    vec4 oPos = texture2D( t_oPos , vUv );
    vec4 pos  = texture2D( t_pos  , vUv );
    vec4 to   = texture2D( t_to   , vUv );

    vec3 dif = to.xyz - pos.xyz;

    vec3 newPos = pos.xyz + dif * .01;

    gl_FragColor= vec4( newPos , .0);

  }

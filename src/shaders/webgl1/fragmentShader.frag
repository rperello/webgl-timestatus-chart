  precision mediump float;
  
  varying vec3 fragColor;
  uniform float screenWidth;
  
  void main()
  {
    gl_FragColor = vec4(fragColor, 1);
  }
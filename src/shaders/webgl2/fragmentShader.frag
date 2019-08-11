#version 300 es
precision mediump float;

in vec3 fragColor;
out vec4 myOutputColor;
uniform float screenWidth;

void main()
{
  myOutputColor = vec4(fragColor, 1);
}
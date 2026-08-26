// src/utils/shaders.js

/* =========================================
   DEMO 1 SHADERS (Galaxy Effect)
   Extracted directly from original index.html
   ========================================= */

export const demo1VertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
    // Original formula from index.html: gl_PointSize = size * ( 350.0 / - mvPosition.z );
    gl_PointSize = size * ( 350.0 / -mvPosition.z );
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const demo1FragmentShader = `
  precision mediump float;
  varying vec3 vColor;
  uniform sampler2D uTexture; 
  
  void main(){
    // Original logic from index.html
    vec4 textureColor = texture2D( uTexture, gl_PointCoord );
    
    // Alpha discard threshold from original
    if ( textureColor.a < 0.3 ) discard;
    
    // Multiply vertex color with texture color
    vec4 color = vec4(vColor.xyz, 1.0) * textureColor;
    gl_FragColor = color;
  }
`;

/* =========================================
   DEMO 2 SHADERS (Interactive Sphere)
   ========================================= */

export const demo2VertexShader = `
  attribute float size;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const demo2FragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  void main(){
    vec4 textureColor = texture2D( uTexture, gl_PointCoord );
    if ( textureColor.a < 0.3 ) discard;
    vec4 dotColor = vec4(0.06, 0.18, 0.36, 1.0); 
    gl_FragColor = dotColor * textureColor;
  }
`;
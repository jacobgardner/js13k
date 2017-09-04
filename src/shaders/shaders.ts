export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;

    /**
     * The location of uniform mat4 modelMat.
     */
    modelMat: WebGLUniformLocation;
    /**
     * The location of uniform mat4 viewMat.
     */
    viewMat: WebGLUniformLocation;
    /**
     * The location of uniform mat4 projMat.
     */
    projMat: WebGLUniformLocation;
    /**
     * The location of uniform ivec4 squareType.
     */
    squareType: WebGLUniformLocation;
    /**
     * The location of uniform int squareState.
     */
    squareState: WebGLUniformLocation;
    /**
     * The location of uniform float t.
     */
    t: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;

    /**
     * The location of attribute vec2 vertPos.
     */
    vertPos: number;
}

export type Variables = Uniforms|Attributes;

export let vertex = "precision mediump float;attribute vec2 h;uniform mat4 l,i,j;varying vec2 b;void main(){gl_Position=j*i*l*vec4(h,0,1),b=h;}";
export let playerFrag = "precision mediump float;varying vec2 b;float g(float a){return 1.-a*a*a;}void main(){vec2 a=b-.5;float c=g(distance(vec2(0,0),a/.1));gl_FragColor=vec4(1,0,0,c);}";
export let hallFrag = "precision mediump float;uniform ivec4 d;uniform int f;uniform float k;varying vec2 b;float g(float a){return 1.-a*a*a;}void main(){vec4 c=vec4(0,0,0,1),e=vec4(1,1,1,1);e=f==0?vec4(0,.5,0,1):f==1?vec4(.5,0,0,1):f==2?vec4(.5,.5,.5,1):e;vec4 a=mix(vec4(.5,.5,.5,1),e,1.-g(f<2?1.:k));a=d.x==0&&b.x<.01?c:a,a=d.z==0&&b.x>.99?c:a,a=d.y==0&&b.y<.01?c:a,a=d.w==0&&b.y>.99?c:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"l","viewMat":"i","projMat":"j","squareType":"d","squareState":"f","t":"k"};
export let AttributeRenaming = {"vertPos":"h"};

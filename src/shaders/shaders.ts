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
}

export interface Attributes {
    readonly [name: string]: number;

    /**
     * The location of attribute vec2 vertPos.
     */
    vertPos: number;
}

export type Variables = Uniforms|Attributes;

export let vertex = "precision mediump float;attribute vec2 e;uniform mat4 j,f,g;varying vec2 b;void main(){gl_Position=g*f*j*vec4(e,0,1),b=e;}";
export let playerFrag = "precision mediump float;varying vec2 b;float i(float a){return 1.-a*a*a;}void main(){vec2 a=b-.5;float c=i(distance(vec2(0,0),a/.4));gl_FragColor=vec4(1,0,0,c);}";
export let hallFrag = "precision mediump float;uniform ivec4 d;varying vec2 b;void main(){vec4 c=vec4(0,0,0,1),h=vec4(1,1,1,1),a=h;a=d.x==0&&b.x<.1?c:a,a=d.z==0&&b.x>.9?c:a,a=d.y==0&&b.y<.1?c:a,a=d.w==0&&b.y>.9?c:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"j","viewMat":"f","projMat":"g","squareType":"d"};
export let AttributeRenaming = {"vertPos":"e"};

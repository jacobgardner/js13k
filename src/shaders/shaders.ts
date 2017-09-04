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

export let vertex = "precision mediump float;attribute vec2 e;uniform mat4 f,g,i;varying vec2 b;void main(){gl_Position=i*g*f*vec4(e,0,1),b=e;}";
export let frag = "precision mediump float;uniform ivec4 c;varying vec2 b;void main(){vec4 d=vec4(0,0,0,1),h=vec4(1,1,1,1),a=h;a=c.x==0&&b.x<.1?d:a,a=c.z==0&&b.x>.9?d:a,a=c.y==0&&b.y<.1?d:a,a=c.w==0&&b.y>.9?d:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"f","viewMat":"g","projMat":"i","squareType":"c"};
export let AttributeRenaming = {"vertPos":"e"};

export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;

    /**
     * The location of uniform mat4 uMVMatrix.
     */
    uMVMatrix: WebGLUniformLocation;
    /**
     * The location of uniform mat4 uPMatrix.
     */
    uPMatrix: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;

    /**
     * The location of attribute vec3 aVertexPosition.
     */
    aVertexPosition: number;
}

export type Variables = Uniforms|Attributes;

export let vertex = "attribute vec3 a;uniform mat4 b,c;void main(){gl_Position=c*b*vec4(a,1.);}";
export let UniformRenaming = {"uMVMatrix":"b","uPMatrix":"c"};
export let AttributeRenaming = {"aVertexPosition":"a"};

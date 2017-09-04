import { gl } from './gl';

export function buildShader(isFragShader: number, shaderContents: string) {
    const shader = gl.createShader(
        isFragShader ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER
    );
    gl.shaderSource(shader, shaderContents);
    gl.compileShader(shader);

    // @if DEBUG
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
    }
    // @endif

    return shader as WebGLShader;
}

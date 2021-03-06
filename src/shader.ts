export function buildShader(
    gl: WebGLRenderingContext,
    isFragShader: number,
    shaderContents: string
) {
    const shader = gl.createShader(
        isFragShader ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER
    );
    gl.shaderSource(shader, shaderContents);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
    }

    return shader as WebGLShader;
}

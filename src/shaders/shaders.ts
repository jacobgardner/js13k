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
     * The location of uniform float t.
     */
    t: WebGLUniformLocation;
    /**
     * The location of uniform ivec4 squareType.
     */
    squareType: WebGLUniformLocation;
    /**
     * The location of uniform int squareState.
     */
    squareState: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;

    /**
     * The location of attribute vec2 vertPos.
     */
    vertPos: number;
}

export type Variables = Uniforms|Attributes;

export let vertex = "precision mediump float;attribute vec2 i;uniform mat4 k,l,j;varying vec2 c;void main(){gl_Position=j*l*k*vec4(i,0,1),c=i;}";
export let playerFrag = "precision mediump float;uniform float h;varying vec2 c;float d(float a){return 1.-a*a*a;}void main(){vec2 b=c-.5;float a=d(distance(vec2(0,0),b/.1));gl_FragColor=mix(vec4(1,0,0,a),vec4(0,1,0,a),h);}";
export let enemyFrag = "precision mediump float;varying vec2 c;float d(float a){return 1.-a*a*a;}void main(){vec2 a=c-.5;float b=d(distance(vec2(0,0),a/.1));gl_FragColor=vec4(1,0,0,b);}";
export let bulletFrag = "precision mediump float;varying vec2 c;float d(float a){return 1.-a*a*a;}void main(){vec2 a=c-.5;float b=d(distance(vec2(0,0),a/.1));gl_FragColor=vec4(0,0,0,b);}";
export let hallFrag = "precision mediump float;uniform ivec4 f;uniform int g;uniform float h;varying vec2 c;float d(float a){return 1.-a*a*a;}void main(){vec4 b=vec4(0,0,0,1),e=vec4(1,1,1,1);e=g==0?vec4(0,.5,0,1):g==1?vec4(.5,0,0,1):g==2?vec4(.5,.5,.5,1):e;vec4 a=mix(vec4(.5,.5,.5,1),e,1.-d(g<2?1.:h));a=f.x==0&&c.x<.01?b:a,a=f.z==0&&c.x>.99?b:a,a=f.y==0&&c.y<.01?b:a,a=f.w==0&&c.y>.99?b:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"k","viewMat":"l","projMat":"j","t":"h","squareType":"f","squareState":"g"};
export let AttributeRenaming = {"vertPos":"i"};

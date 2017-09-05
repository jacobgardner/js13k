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

export let vertex = "precision mediump float;attribute vec2 j;uniform mat4 k,l,m;varying vec2 c;void main(){gl_Position=m*l*k*vec4(j,0,1),c=j;}";
export let playerFrag = "precision mediump float;uniform float e;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 b=c-.5;float a=f(distance(vec2(0,0),b/.1));gl_FragColor=mix(vec4(1,0,0,a),vec4(0,1,0,a),e);}";
export let enemyFrag = "precision mediump float;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float b=f(distance(vec2(0,0),a/.1));gl_FragColor=vec4(1,0,0,b);}";
export let shadowFrag = "precision mediump float;void main(){gl_FragColor=vec4(0,0,0,1);}";
export let bulletFrag = "precision mediump float;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float b=f(distance(vec2(0,0),a/.1));gl_FragColor=vec4(0,0,0,b);}";
export let flashlightFrag = "precision mediump float;uniform float e;varying vec2 c;float i(float a){return 1.-a*a;}void main(){vec2 a=c-.5;float b=1.-i(distance(vec2(0,0),a/(.4*e+.2)));gl_FragColor=vec4(0,0,0,b);}";
export let hallFrag = "precision mediump float;uniform ivec4 h;uniform int g;uniform float e;varying vec2 c;float i(float a){return 1.-a*a;}void main(){vec4 b=vec4(0,0,0,1),d=vec4(1,1,1,1);d=g==0?vec4(0,.5,0,1):g==1?mod(c.x*10.,2.)>1.&&mod(c.y*10.,2.)>1.||mod(c.x*10.,2.)<1.&&mod(c.y*10.,2.)<1.?vec4(1,1,1,1):vec4(0,0,0,1):g==2?vec4(.5,.5,.5,1):d;vec4 a=mix(vec4(.5,.5,.5,1),d,1.-i(g<2?1.:e));a=h.x==0&&c.x<.01?b:a,a=h.z==0&&c.x>.99?b:a,a=h.y==0&&c.y<.01?b:a,a=h.w==0&&c.y>.99?b:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"k","viewMat":"l","projMat":"m","t":"e","squareType":"h","squareState":"g"};
export let AttributeRenaming = {"vertPos":"j"};

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
     * The location of uniform float hp.
     */
    hp: WebGLUniformLocation;
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

export let vertex = "precision mediump float;attribute vec2 k;uniform mat4 n,o,l;varying vec2 c;void main(){gl_Position=l*o*n*vec4(k,0,1),c=k;}";
export let playerFrag = "precision mediump float;uniform float h;varying vec2 c;float e(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 b=c-.5;float a=e(distance(vec2(0,0),b/.1));gl_FragColor=mix(vec4(1,0,0,a),vec4(0,1,0,a),h);}";
export let enemyFrag = "precision mediump float;varying vec2 c;float e(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float b=e(distance(vec2(0,0),a/.1));gl_FragColor=vec4(1,0,0,b);}";
export let shadowFrag = "precision mediump float;void main(){gl_FragColor=vec4(0,0,0,1);}";
export let bulletFrag = "precision mediump float;varying vec2 c;float e(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float b=e(distance(vec2(0,0),a/.1));gl_FragColor=vec4(0,0,0,b);}";
export let flashlightFrag = "precision mediump float;uniform float j,h;varying vec2 c;float i(float a){return 1.-a*a;}float m(float a){return (1.+.2*sin(5e-3*a)+.05*sin(.8*a)+.1*sin(.025*a)+.1*sin(.1*a))/10.;}void main(){vec2 b=c-.5;float a=1.-i(distance(vec2(0,0),b/(.55*h)));a+=m(j),gl_FragColor=vec4(0,0,0,a);}";
export let hallFrag = "precision mediump float;uniform ivec4 g;uniform int f;uniform float j;varying vec2 c;float i(float a){return 1.-a*a;}void main(){vec4 b=vec4(0,0,0,1),d=vec4(1,1,1,1);d=f==0?vec4(0,.5,0,1):f==1?mod(c.x*10.,2.)>1.&&mod(c.y*10.,2.)>1.||mod(c.x*10.,2.)<1.&&mod(c.y*10.,2.)<1.?vec4(1,1,1,1):vec4(0,0,0,1):f==2?vec4(.5,.5,.5,1):d;vec4 a=mix(vec4(.5,.5,.5,1),d,1.-i(f<2?1.:j));a=g.x==0&&c.x<.01?b:a,a=g.z==0&&c.x>.99?b:a,a=g.y==0&&c.y<.01?b:a,a=g.w==0&&c.y>.99?b:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"n","viewMat":"o","projMat":"l","hp":"h","t":"j","squareType":"g","squareState":"f"};
export let AttributeRenaming = {"vertPos":"k"};

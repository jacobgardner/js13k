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

export let vertex = "precision mediump float;attribute vec2 k;uniform mat4 o,p,l;varying vec2 c;void main(){gl_Position=l*p*o*vec4(k,0,1),c=k;}";
export let playerFrag = "precision mediump float;uniform float e;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 b=c-.5;float a=f(distance(vec2(0,0),b/.1));gl_FragColor=mix(vec4(1,0,0,a),vec4(0,1,0,a),e);}";
export let enemyFrag = "precision mediump float;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float b=f(distance(vec2(0,0),a/.1));gl_FragColor=vec4(1,0,0,b);}";
export let shadowFrag = "precision mediump float;uniform float e;void main(){gl_FragColor=mix(vec4(0,0,0,1),vec4(1,1,1,1),e>1.?(e-1.)*2.:0.);}";
export let bulletFrag = "precision mediump float;varying vec2 c;float f(float a){float b=a<.45?1.:a>.55?0.:1.-(a-.45)/.1;return b*b;}void main(){vec2 a=c-.5;float d=distance(vec2(0,0),a/.1),b=f(d),n=(atan(a.y/a.x)+1.)/2.;gl_FragColor=mix(vec4(.1,.1,.1,b),vec4(.2,.3,.8,b),n);}";
export let flashlightFrag = "precision mediump float;uniform float j,e;varying vec2 c;float i(float a){return 1.-a*a;}float m(float a){return (1.+.2*sin(5e-3*a)+.05*sin(.8*a)+.4*sin(.024*a)+.2*sin(.1*a))/10.;}void main(){vec2 b=c-.5;float a=1.-i(distance(vec2(0,0),b/(.55*e)));a+=m(j),gl_FragColor=mix(vec4(0,0,0,a),vec4(1,1,1,1),e>1.?(e-1.)*2.:0.);}";
export let hallFrag = "precision mediump float;uniform ivec4 h;uniform int g;uniform float j;varying vec2 c;float i(float a){return 1.-a*a;}void main(){vec4 b=vec4(0,0,0,1),d=vec4(1,1,1,1);d=g==0?mod((c.x-c.y)*10.,2.)>1.?vec4(1,1,0,1):vec4(.2,.2,.2,1):g==1?mod(c.x*10.,2.)>1.&&mod(c.y*10.,2.)>1.||mod(c.x*10.,2.)<1.&&mod(c.y*10.,2.)<1.?vec4(1,1,1,1):vec4(0,0,0,1):g==2?vec4(.5,.5,.5,1):d;vec4 a=mix(vec4(.5,.5,.5,1),d,1.-i(g<2?1.:j));a=h.x==0&&c.x<.01?b:a,a=h.z==0&&c.x>.99?b:a,a=h.y==0&&c.y<.01?b:a,a=h.w==0&&c.y>.99?b:a,gl_FragColor=a;}";
export let UniformRenaming = {"modelMat":"o","viewMat":"p","projMat":"l","hp":"e","t":"j","squareType":"h","squareState":"g"};
export let AttributeRenaming = {"vertPos":"k"};

export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;

    /**
     * The location of uniform float fade.
     */
    fade: WebGLUniformLocation;
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
     * The location of uniform int squareState.
     */
    squareState: WebGLUniformLocation;
    /**
     * The location of uniform int isMinimap.
     */
    isMinimap: WebGLUniformLocation;
    /**
     * The location of uniform int playerSpace.
     */
    playerSpace: WebGLUniformLocation;
    /**
     * The location of uniform float pulse.
     */
    pulse: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;

    /**
     * The location of attribute vec2 vertPos.
     */
    vertPos: number;
}

export type Variables = Uniforms|Attributes;

export const dropShadowFrag = "precision mediump float;uniform float f;void main(){gl_FragColor=vec4(0,0,0,1.-f);}";
export const vertex = "precision mediump float;attribute vec2 n;uniform mat4 q,s,t;varying vec2 d;void main(){gl_Position=t*s*q*vec4(n,0,1),d=n;}";
export const playerShieldFrag = "precision mediump float;varying vec2 d;float h(float a){return 1.-a*a;}float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 c=d-.5;float p=distance(c,vec2(0,0)),i=e(distance(vec2(0,0),c)*2.,.05),a=h((p-.8)/.5);a=a<0.?0.:a;vec4 b=mix(vec4(0,0,0,0),vec4(0,1,1,1),a);b.a=b.a<i?b.a:i,gl_FragColor=b;}";
export const playerFrag = "precision mediump float;uniform float g;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 b=d-.5;float c=e(distance(vec2(0,0),b)*2.,.05);vec4 a=mix(vec4(1,0,0,1),vec4(0,1,0,1),g);a.a=c,gl_FragColor=a;}";
export const enemyFrag = "precision mediump float;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 a=d-.5;float b=e(distance(vec2(0,0),a)*2.,.05);gl_FragColor=vec4(1,0,0,b);}";
export const proximityFrag = "precision mediump float;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 a=d-.5;float b=e(distance(vec2(0,0),a)*2.,.02);gl_FragColor=vec4(.3,.3,.7,b);}";
export const explosionFrag = "precision mediump float;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 a=d-.5;float b=e(distance(vec2(0,0),a)*2.,.02);gl_FragColor=vec4(.8,0,0,b);}";
export const shadowFrag = "precision mediump float;uniform float g;void main(){gl_FragColor=mix(vec4(0,0,0,1.),vec4(1,1,1,1.),g>1.?(g-1.)*2.:0.);}";
export const bulletFrag = "precision mediump float;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 a=d-.5;float c=distance(vec2(0,0),a)*2.,b=e(c,.05)*2.,i=(atan(a.y/a.x)+1.)/2.;gl_FragColor=mix(vec4(.1,.1,.1,b),vec4(.2,.3,.8,b),i);}";
export const indicatorFrag = "precision mediump float;uniform float j;varying vec2 d;float e(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 a=d-.5;float b=e(distance(vec2(0,0),a)*2.,.05);gl_FragColor=vec4(0,.75,.75,b*.85*j);}";
export const flashlightFrag = "precision mediump float;uniform float j,g;varying vec2 d;float h(float a){return 1.-a*a;}float r(float a){return (1.+.2*sin(5e-3*a)+.05*sin(.8*a)+.4*sin(.024*a)+.2*sin(.1*a))/10.;}void main(){vec2 b=d-.5;float a=1.-h(distance(vec2(0,0),b/(.55*g)));a+=r(j),gl_FragColor=mix(vec4(0,0,0,a),vec4(1,1,1,1),g>1.?(g-1.)*2.:0.);}";
export const shieldFrag = "precision mediump float;uniform float f;varying vec2 d;float h(float a){return 1.-a*a;}void main(){vec2 c=d-.5;float i=distance(vec2(0,0),c)*2.1;vec2 a=d-vec2(.5,.8);a.x*=23.,a.y*=-36.;bool b=false;b=a.x>-7.&&a.x<7.&&a.y>a.x*a.x/2.5?a.y<(a.x<-3.5?pow(a.x+3.5,2.)/6.+17.5:a.x<0.?pow(a.x+3.5,2.)/1.7+17.5:a.x<3.5?pow(a.x-3.5,2.)/1.7+17.5:pow(a.x-3.5,2.)/6.+17.5):b,gl_FragColor=b?mix(vec4(0,1,1,1.-f),vec4(0,0.,0.,1.-f),1.-h(i+f)):vec4(0,0,0,0);}";
export const hallFrag = "precision mediump float;uniform int k,m,o;uniform float j,l,f;varying vec2 d;float h(float a){return 1.-a*a;}void main(){vec4 i=vec4(0,0,0,f),b=vec4(1,1,1,f);b=k==0?m==1?vec4(1,0,0,1):mod((d.x-d.y)*10.,2.)>1.?vec4(1,1,0,1):vec4(.2,.2,.2,1):k==1?m==1?vec4(0,1,0,1):mod(d.x*10.,2.)>1.&&mod(d.y*10.,2.)>1.||mod(d.x*10.,2.)<1.&&mod(d.y*10.,2.)<1.?vec4(1,1,1,1):vec4(0,0,0,1):k==2?vec4(.5,.5,.5,1):b;vec4 a=mix(vec4(.5,.5,.5,1),b,1.-h(k<2?1.:j));if(m==1&&o==1){float c=l<.5?l/.5:1.-(l-.5)/.5;a=mix(a,vec4(.5,.5,.5,1),c);}a.a=1.-f,gl_FragColor=a;}";
export const UniformRenaming = {"fade":"f","modelMat":"q","viewMat":"s","projMat":"t","hp":"g","t":"j","squareState":"k","isMinimap":"m","playerSpace":"o","pulse":"l"};
export const AttributeRenaming = {"vertPos":"n"};

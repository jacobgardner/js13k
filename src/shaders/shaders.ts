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

export const dropShadowFrag = "precision mediump float;uniform float g;void main(){gl_FragColor=vec4(0,0,0,1.-g);}const vec3 e=vec3(.858824,.266667,.215686);";
export const vertex = "precision mediump float;attribute vec2 o;uniform mat4 r,t,u;varying vec2 d;void main(){gl_Position=u*t*r*vec4(o,0,1),d=o;}const vec3 e=vec3(.858824,.266667,.215686);";
export const playerShieldFrag = "precision mediump float;varying vec2 d;float i(float a){return 1.-a*a;}float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 c=d-.5;float q=distance(c,vec2(0,0)),j=f(distance(vec2(0,0),c)*2.,.05),a=i((q-.8)/.5);a=a<0.?0.:a;vec4 b=mix(vec4(0,0,0,0),vec4(0,1,1,1),a);b.a=b.a<j?b.a:j,gl_FragColor=b;}const vec3 e=vec3(.858824,.266667,.215686);";
export const playerFrag = "precision mediump float;uniform float h;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}void main(){vec2 b=d-.5;float c=f(distance(vec2(0,0),b)*2.,.05);vec4 a=mix(vec4(1,0,0,1),vec4(0,1,0,1),h);a.a=c,gl_FragColor=a;}const vec3 e=vec3(.858824,.266667,.215686);";
export const enemyFrag = "precision mediump float;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 a=d-.5;float b=f(distance(vec2(0,0),a)*2.,.05);gl_FragColor=vec4(e,b);}";
export const proximityFrag = "precision mediump float;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 c=d-.5;float a=distance(vec2(0,0),c)*2.,b=f(a,.02);gl_FragColor=a<.25?vec4(e,b):vec4(.3,.3,.6,b);}";
export const explosionFrag = "precision mediump float;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 a=d-.5;float b=f(distance(vec2(0,0),a)*2.,.02);gl_FragColor=vec4(.8,0,0,b);}";
export const shadowFrag = "precision mediump float;uniform float h;const vec3 e=vec3(.858824,.266667,.215686);void main(){gl_FragColor=mix(vec4(0,0,0,1.),vec4(1,1,1,1.),h>1.?(h-1.)*2.:0.);}";
export const bulletFrag = "precision mediump float;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 a=d-.5;float c=distance(vec2(0,0),a)*2.,b=f(c,.05)*2.,j=(atan(a.y/a.x)+1.)/2.;gl_FragColor=mix(vec4(1,0,0,b),vec4(.6,0.,0.,b),j);}";
export const indicatorFrag = "precision mediump float;uniform float k;varying vec2 d;float f(float a,float b){float c=a<1.-2.*b?1.:a>1.?0.:1.-(a-(1.-2.*b))/.1;return c*c;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 a=d-.5;float b=f(distance(vec2(0,0),a)*2.,.05);gl_FragColor=vec4(0,.75,.75,b*.85*k);}";
export const flashlightFrag = "precision mediump float;uniform float k,h;varying vec2 d;float i(float a){return 1.-a*a;}const vec3 e=vec3(.858824,.266667,.215686);float s(float a){return (1.+.2*sin(5e-3*a)+.05*sin(.8*a)+1.2*sin(.024*a)+.8*sin(.1*a))/10.;}void main(){vec2 b=d-.5;float a=1.-i(distance(vec2(0,0),b/(.55*h)));a+=s(k);float c=h>1.?(h-1.)*2.:0.;gl_FragColor=mix(vec4(0,0,0,a),vec4(1,1,1,1),c);}";
export const shieldFrag = "precision mediump float;uniform float g;varying vec2 d;float i(float a){return 1.-a*a;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec2 c=d-.5;float j=distance(vec2(0,0),c)*2.1;vec2 a=d-vec2(.5,.8);a.x*=23.,a.y*=-36.;bool b=false;b=a.x>-7.&&a.x<7.&&a.y>a.x*a.x/2.5?a.y<(a.x<-3.5?pow(a.x+3.5,2.)/6.+17.5:a.x<0.?pow(a.x+3.5,2.)/1.7+17.5:a.x<3.5?pow(a.x-3.5,2.)/1.7+17.5:pow(a.x-3.5,2.)/6.+17.5):b,gl_FragColor=b?mix(vec4(0,1,1,1.-g),vec4(0,0.,0.,1.-g),1.-i(j+g)):vec4(0,0,0,0);}";
export const hallFrag = "precision mediump float;uniform int l,m,p;uniform float k,n,g;varying vec2 d;float i(float a){return 1.-a*a;}const vec3 e=vec3(.858824,.266667,.215686);void main(){vec4 j=vec4(0,0,0,g),b=vec4(1,1,1,g);b=l==0?m==1?vec4(1,0,0,1):mod((d.x-d.y)*10.,2.)>1.?vec4(1,1,0,1):vec4(.2,.2,.2,1):l==1?m==1?vec4(0,1,0,1):mod(d.x*10.,2.)>1.&&mod(d.y*10.,2.)>1.||mod(d.x*10.,2.)<1.&&mod(d.y*10.,2.)<1.?vec4(1,1,1,1):vec4(0,0,0,1):l==2?vec4(.5,.5,.5,1):b;vec4 a=mix(vec4(.5,.5,.5,1),b,1.-i(l<2?1.:k));if(m==1&&p==1){float c=n<.5?n/.5:1.-(n-.5)/.5;a=mix(a,vec4(.5,.5,.5,1),c);}a.a=1.-g,gl_FragColor=a;}";
export const UniformRenaming = {"fade":"g","modelMat":"r","viewMat":"t","projMat":"u","hp":"h","t":"k","squareState":"l","isMinimap":"m","playerSpace":"p","pulse":"n"};
export const AttributeRenaming = {"vertPos":"o"};

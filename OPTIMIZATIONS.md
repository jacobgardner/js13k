 * All global variables that are used more than once can be renamed so they get name mangled in minified version.
 * ^^^ Minifier appears to do this.  We might be wasting time.
 * Use `with` when bytes can be saved. Note: With could potentially break code due to name mangling.  Use with care.  It may not be worth the bugs and confusion.
 * Inline any functions that are only called once.
 * Change `function() {}` to `() => {}` where applicable.  NOTE: Actually it looks like the minifier is already doing this.
 * Change opengl constants to their actual value (e.g. gl.FRAGMENT_SHADER = 35632)
 * Use ++ instead of += 1
 * Convert !== and === to != and ==
 * Rename some prototype methods .  `Array.prototype.push = Array.prototype.p` (same with length, splice, etc.)
 * ~~Use GLSLX: Minifies the input names (and allows for imports/exports).~~
 * ~~Rename index.html => i.htm for final build. (assuming rules allow) Exception: Checked the rules and they expect `index.html`~~
 * ~~Store the shaders in `.glsl` files then use string templates in the typescript files to reference the the glsl files so that they are bundled into the source without doing anything extra.~~
 * ~~Rename const => let on final build.~~
 * ~~`(() => {/* All Code Here */})()`  is being used to make sure the outer function names are all mangled, we can trim off the containing functions on final build.~~
 * ~~Embed the javascript directly into the html.~~
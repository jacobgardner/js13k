 * Embed the javascript directly into the html.
 * ~~`(() => {/* All Code Here */})()`  is being used to make sure the outer function names are all mangled, we can trim off the containing functions on final build.~~
 * All global variables that are used more than once can be renamed.
 * ~~Rename const => let on final build.~~
 * Change `function() {}` to `() => {}` where applicable
 * Use `with` when bytes can be saved.
 * Inline any functions that are only called once.
 * Store the shaders in `.glsl` files then use string templates in the typescript files to reference the the glsl files so that they are bundled into the source without doing anything extra.
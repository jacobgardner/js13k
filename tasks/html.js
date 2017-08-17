const htmlMinifier = require("html-minifier").minify;
const through = require("through2");
const fs = require("fs");

module.exports = {
    generateHTML() {
        return through.obj(function(file, enc, cb) {
            let contents = fs.readFileSync("index.html").toString();

            contents = contents.replace(
                /<script src=".*"><\/script>/,
                `<script>${file.contents.toString()}</script>`
            );

            // TODO: Minify HTML
            file.contents = new Buffer(
                htmlMinifier(contents, {
                    collapseBooleanAttributes: true,
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyURLS: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                })
            );
            this.push(file);
            cb();
        });
    }
};

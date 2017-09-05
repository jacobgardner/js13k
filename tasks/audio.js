const gulp = require('gulp');
const through = require('through2');

function instrument(instrument) {
    return `{
wave: waves.${instrument.wave.toUpperCase()},
envelope: envelopes.${instrument.envelope.toUpperCase()},
${instrument.filter ?
        `filter: filters.${instrument.filter
            .toUpperCase()
            .replace(/ /g, '_')},` : '' }

}`;
}

function pattern(pattern) {
    return `[${pattern.notes.filter(n => n.pitches.length > 0).map(n => `[${n.pitches.join(', ')}]`)}]`
}

function patterns(patterns) {
    const output = `[${patterns.map(p => pattern(p)).filter(p => p !== '[]').join(', ')}]`;
    return output !== '[]' ? output : '[[]]';
}

function sequence(sequence) {
    return `[${sequence.join(', ')}]`;
}

function beepbox() {
    return through.obj(function(chunk, enc, callback) {
        chunk.path = chunk.path.replace(/\.json$/i, '.ts');
        const data = JSON.parse(chunk.contents.toString());
        let template = `
import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';
    
export const speed = ${data.beatsPerMinute *
            data.beatsPerBar *
            data.ticksPerBeat}; 
export const channels = [
${data.channels.map(
            ch => `
[${instrument(ch.instruments[0])}, ${patterns(ch.patterns)}, ${sequence(ch.sequence)}]
`
        )}
];
        `;
        chunk.contents = new Buffer(template);
        this.push(chunk);
        callback();
    });
}

gulp.task('build-audio', () => {
    return gulp
        .src('./assets/music/**/*.json')
        .pipe(beepbox())
        .pipe(gulp.dest('./src/music'));
});

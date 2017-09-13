const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const Vinyl = require('vinyl');

function instrument(instrument) {
    return `{
wave: waves.${instrument.wave.toUpperCase().replace(/ /g, '_')},
envelope: envelopes.${instrument.envelope.toUpperCase().replace(/ /g, '_')},
${instrument.filter ?
        `filter: filters.${instrument.filter
            .toUpperCase()
            .replace(/ /g, '_')},` : '' }

}`;
}

function buildPoint(point) {
    return `{
        t: ${point.tick},
        b: ${point.pitchBend},
        v: ${point.volume}
    }`;
}

function buildPattern(pattern) {
    const notes = [];

    for (const note of pattern.notes) {
        notes.push(`{
            n: [${note.pitches.join(',')}],
            p: [${note.points.map(buildPoint).join(', ')}]
        }`)
    }

   return `[${notes.join(', ')}]`
}

function buildPatterns(patterns) {
    const patternArray = []
    for (const pattern of patterns) {
        patternArray.push(buildPattern(pattern));
    }

    return `[${patternArray.join(', ')}]`;
}

function sequence(sequence) {
    return `[${sequence.join(', ')}]`;
}

function beepbox() {
    const fileNames = [];

    return through.obj(function(chunk, enc, callback) {
        chunk.path = chunk.path.replace(/\.json$/i, '.ts');
        fileNames.push(path.basename(chunk.path, '.ts'));
        const data = JSON.parse(chunk.contents.toString());
        let template = `
import IChannel from '../audio/channel';
import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';

export const bpm = ${data.beatsPerMinute};
export const bpb = ${data.beatsPerBar};
export const tpb = ${data.ticksPerBeat};
export const loopBars = ${data.loopBars};
export const channels: IChannel[] = [
${data.channels.map(
            ch => `
[${instrument(ch.instruments[0])}, ${buildPatterns(ch.patterns)}, ${sequence(ch.sequence)}]
`
        )}
];
        `;
        chunk.contents = new Buffer(template);
        this.push(chunk);
        callback();
    }, function (cb) {
        const index = new Vinyl({
            path: 'allSongs.ts',
            contents: new Buffer(`${fileNames.map(p => `import * as ${p} from './${p}';`).join('\n')}

const songs = [${fileNames.join(', ')}];`)
        })
        this.push(index);
        cb();
    });
}

gulp.task('build-audio', () => {
    return gulp
        .src('./assets/music/**/*.json')
        .pipe(beepbox())
        .pipe(gulp.dest('./src/music'));
});

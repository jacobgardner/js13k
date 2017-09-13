
import IChannel from '../audio/channel';
import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';

export const bpm = 103;
export const bpb = 8;
export const tpb = 4;
export const loopBars = 16;
export const channels: IChannel[] = [

[{
wave: waves.SQUARE,
envelope: envelopes.SUDDEN,
filter: filters.SUSTAIN_SHARP,

}, [[], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
,
[{
wave: waves.SQUARE,
envelope: envelopes.SUDDEN,
filter: filters.SUSTAIN_SHARP,

}, [[{
            n: [32],
            p: [{
        t: 0,
        b: 0,
        v: 100
    }, {
        t: 2,
        b: 0,
        v: 100
    }]
        }, {
            n: [31],
            p: [{
        t: 2,
        b: 0,
        v: 100
    }, {
        t: 4,
        b: 0,
        v: 100
    }]
        }, {
            n: [26],
            p: [{
        t: 4,
        b: 0,
        v: 100
    }, {
        t: 6,
        b: 0,
        v: 100
    }]
        }, {
            n: [32],
            p: [{
        t: 8,
        b: 0,
        v: 100
    }, {
        t: 10,
        b: 0,
        v: 100
    }]
        }, {
            n: [35],
            p: [{
        t: 10,
        b: 0,
        v: 100
    }, {
        t: 12,
        b: 0,
        v: 100
    }]
        }, {
            n: [32],
            p: [{
        t: 12,
        b: 0,
        v: 100
    }, {
        t: 14,
        b: 0,
        v: 100
    }]
        }, {
            n: [32],
            p: [{
        t: 16,
        b: 0,
        v: 100
    }, {
        t: 18,
        b: 0,
        v: 100
    }]
        }, {
            n: [31],
            p: [{
        t: 18,
        b: 0,
        v: 100
    }, {
        t: 20,
        b: 0,
        v: 100
    }]
        }, {
            n: [26],
            p: [{
        t: 20,
        b: 0,
        v: 100
    }, {
        t: 22,
        b: 0,
        v: 100
    }]
        }, {
            n: [32],
            p: [{
        t: 24,
        b: 0,
        v: 100
    }, {
        t: 26,
        b: 0,
        v: 100
    }]
        }, {
            n: [36],
            p: [{
        t: 26,
        b: 0,
        v: 100
    }, {
        t: 28,
        b: 0,
        v: 100
    }]
        }, {
            n: [38],
            p: [{
        t: 28,
        b: 0,
        v: 100
    }, {
        t: 30,
        b: 0,
        v: 100
    }]
        }], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
,
[{
wave: waves.SQUARE,
envelope: envelopes.SUDDEN,
filter: filters.SUSTAIN_SHARP,

}, [[{
            n: [20],
            p: [{
        t: 4,
        b: 0,
        v: 100
    }, {
        t: 6,
        b: 0,
        v: 100
    }]
        }, {
            n: [20],
            p: [{
        t: 12,
        b: 0,
        v: 100
    }, {
        t: 14,
        b: 0,
        v: 100
    }]
        }, {
            n: [20],
            p: [{
        t: 20,
        b: 0,
        v: 100
    }, {
        t: 22,
        b: 0,
        v: 100
    }]
        }], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
,
[{
wave: waves.WHITE,
envelope: envelopes.SUDDEN,


}, [[{
            n: [1],
            p: [{
        t: 4,
        b: 0,
        v: 100
    }, {
        t: 6,
        b: 0,
        v: 0
    }]
        }, {
            n: [5],
            p: [{
        t: 6,
        b: 0,
        v: 100
    }, {
        t: 8,
        b: 0,
        v: 0
    }]
        }, {
            n: [1],
            p: [{
        t: 12,
        b: 0,
        v: 100
    }, {
        t: 14,
        b: 0,
        v: 0
    }]
        }, {
            n: [5],
            p: [{
        t: 14,
        b: 0,
        v: 100
    }, {
        t: 16,
        b: 0,
        v: 0
    }]
        }, {
            n: [1],
            p: [{
        t: 20,
        b: 0,
        v: 100
    }, {
        t: 22,
        b: 0,
        v: 0
    }]
        }, {
            n: [5],
            p: [{
        t: 22,
        b: 0,
        v: 100
    }, {
        t: 24,
        b: 0,
        v: 0
    }]
        }, {
            n: [1],
            p: [{
        t: 28,
        b: 0,
        v: 100
    }, {
        t: 30,
        b: 0,
        v: 0
    }]
        }, {
            n: [5],
            p: [{
        t: 30,
        b: 0,
        v: 100
    }, {
        t: 32,
        b: 0,
        v: 0
    }]
        }], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

];
        
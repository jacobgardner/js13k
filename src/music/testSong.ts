
import IChannel from '../audio/channel';
import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';

export const bpm = 151;
export const bpb = 8;
export const tpb = 4;
export const channels: IChannel[] = [

[{
wave: waves.TRIANGLE,
envelope: envelopes.SUDDEN,
filter: filters.SUSTAIN_SHARP,

}, [[{
            n: [48,43],
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
            n: [51],
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
            n: [48,43],
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
            n: [51],
            p: [{
        t: 6,
        b: 0,
        v: 100
    }, {
        t: 8,
        b: 0,
        v: 100
    }]
        }, {
            n: [48],
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
            n: [48],
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
            n: [43],
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
            n: [43],
            p: [{
        t: 14,
        b: 0,
        v: 100
    }, {
        t: 16,
        b: 0,
        v: 100
    }]
        }, {
            n: [48],
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
            n: [48],
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
            n: [46],
            p: [{
        t: 20,
        b: 0,
        v: 100
    }, {
        t: 27,
        b: 0,
        v: 100
    }, {
        t: 28,
        b: 2,
        v: 100
    }]
        }, {
            n: [48],
            p: [{
        t: 28,
        b: 0,
        v: 100
    }, {
        t: 31,
        b: 0,
        v: 100
    }]
        }, {
            n: [51],
            p: [{
        t: 31,
        b: 0,
        v: 100
    }, {
        t: 32,
        b: 0,
        v: 100
    }]
        }], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
,
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

}, [[], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
,
[{
wave: waves.WHITE,
envelope: envelopes.SUDDEN,


}, [[], [], [], [], [], [], [], []], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

];
        
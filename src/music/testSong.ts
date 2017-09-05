import IChannel from '../audio/channel';
import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';

export const speed = 4832;
export const channels: IChannel[] = [
    [
        {
            wave: waves.SQUARE,
            envelope: envelopes.SUDDEN,
            filter: filters.SUSTAIN_SHARP
        },
        [[]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        {
            wave: waves.SQUARE,
            envelope: envelopes.SUDDEN,
            filter: filters.SUSTAIN_SHARP
        },
        [[[48, 45], [45], [43], [45]]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        {
            wave: waves.SQUARE,
            envelope: envelopes.SUDDEN,
            filter: filters.SUSTAIN_SHARP
        },
        [[]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        {
            wave: waves.WHITE,
            envelope: envelopes.SUDDEN
        },
        [[]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

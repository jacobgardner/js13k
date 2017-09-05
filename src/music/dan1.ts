import * as waves from '../audio/waves';
import * as envelopes from '../audio/envelopes';
import * as filters from '../audio/filters';

export const speed = 3296;
export const channels = [
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
        [
            [
                [32],
                [31],
                [26],
                [32],
                [35],
                [32],
                [32],
                [31],
                [26],
                [32],
                [36],
                [38]
            ]
        ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        {
            wave: waves.SQUARE,
            envelope: envelopes.SUDDEN,
            filter: filters.SUSTAIN_SHARP
        },
        [[[20], [20], [20]]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        {
            wave: waves.WHITE,
            envelope: envelopes.SUDDEN
        },
        [[[1], [5], [1], [5], [1], [5], [1], [5]]],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

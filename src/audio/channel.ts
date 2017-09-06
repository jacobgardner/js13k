export interface IChannelInfo {
    wave: string;
    envelope: number;
    filter?: number;
}

export interface Point {
    t: number;
    v: number;
    b: number;
}

export interface Note {
    n: number[];
    p: Point[];
}

type Sequence = Note[];
// Sequence, Beats, Notes
type IChannel = [IChannelInfo, Sequence[], number[]];
export default IChannel;

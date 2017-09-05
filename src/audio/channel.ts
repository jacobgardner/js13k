export interface IChannelInfo {
    wave: number;
    envelope: number;
    filter?: number;
}

// Seqeuence, Beats, Notes
type IChannel = [IChannelInfo, number[][][], number[]];
export default IChannel;

import IChannel from '../audio/channel';

// function buildOscillatorTable(context: AudioContext) {

// }

// const context = new AudioContext();
// const gain = context.createGain();
// const oscillator = context.createOscillator();
// oscillator.type = 'square';
// // oscillator.frequency.value = 30;
// oscillator.frequency.setValueAtTime(30, 0);
// gain.connect(context.destination);
// gain.gain.value = 0.02;
// oscillator.connect(gain);
// oscillator.start();
// oscillator.frequency.setValueAtTime(220, 1);
// oscillator.frequency.setValueAtTime(0, 5);
// gain.gain.linearRampToValueAtTime(0, 5);

// console.log(channels);

function getPitch(root: number, n: number): number {
    return root * Math.pow(2, (n - 49) / 12);
}

class Channel {
    oscillatorPool: OscillatorNode[] = [];
    gainPool: GainNode[] = [];

    constructor(
        public context: AudioContext,
        public parent: AudioNode,
        public channel: IChannel,
        public ticksPerBeat: number,
        public beatsPerMinute: number,
        public beatsPerBar: number,
    ) {
        // for (const sequence of channel[1]) {
        //     for (const note of sequence) {
        //         for (let pIdx = 0; pIdx < note.p.length; pIdx += 1) {
        //             const point = note.p[pIdx];
        //             const t = point.t * speed;
        //             for (let i = 0; i < note.n.length; i += 1) {
        //                 const pitch = note.n[i];
        //                 const oscillator = this.get(i);
        //                 const pitchHz = pIdx === note.p.length - 1 ? 0 : getPitch(440, pitch);
        //                 oscillator.frequency.setValueAtTime(pitchHz, t);
        //             }
        //         }
        //     }
        // }
    }

    playSequence(sequenceNumber: number, offset: number) {
        const sequence = this.channel[1][sequenceNumber];

        const speed = 60 / (this.ticksPerBeat * this.beatsPerMinute);
        if (!sequence) {return;}
        for (const note of sequence) {
            for (let pIdx = 0; pIdx < note.p.length; pIdx += 1) {
                const point = note.p[pIdx];
                const t = point.t * speed + offset;
                for (let i = 0; i < note.n.length; i += 1) {
                    const pitch = note.n[i];
                    const [oscillator, gainNode] = this.get(i);

                    if (pIdx === 0) {
                        gainNode.gain.setValueAtTime(point.v / 100, t + 0.01);
                    } else {
                        gainNode.gain.exponentialRampToValueAtTime(point.v / 100 || 0.00001, t - 0.03);
                    }

                    if (pIdx === note.p.length - 1) {
                        gainNode.gain.exponentialRampToValueAtTime(0.0001, t);
                    }

                    const pitchHz =
                        pIdx === note.p.length - 1 ? 0 : getPitch(440, pitch);
                    oscillator.frequency.setValueAtTime(pitchHz, t);
                }
            }
        }
    }

    play() {

        for (let barNumber = 0; barNumber < this.channel[2].length; barNumber += 1) {
            const sequenceNumber = this.channel[2][barNumber] - 1;

            this.playSequence(sequenceNumber, barNumber * this.beatsPerBar * 60 / this.beatsPerMinute);
        }
    }

    get(n: number): [OscillatorNode, GainNode] {
        if (n >= this.oscillatorPool.length) {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            gainNode.connect(this.parent);
            oscillator.connect(gainNode);

            oscillator.frequency.setValueAtTime(0, 0);
            oscillator.type = this.channel[0].wave as any;

            oscillator.start();
            this.oscillatorPool.push(oscillator);
            this.gainPool.push(gainNode);
        }

        return [this.oscillatorPool[n], this.gainPool[n]];
    }
}

export default class Song {
    channels: Channel[] = [];

    constructor(channels: IChannel[], ticksPerBeat: number, beatsPerMinute: number, beatsPerBar: number) {


        const context = new AudioContext();
        const gainNode = context.createGain();
        gainNode.gain.value = 0.01;
        gainNode.connect(context.destination);

        for (const channel of channels) {
            const channelObj = new Channel(context, gainNode, channel, ticksPerBeat, beatsPerMinute, beatsPerBar);
            this.channels.push();
            channelObj.play();
        }
    }

    play() {}
}

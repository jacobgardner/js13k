import IChannel from '../audio/channel';

function getPitch(root: number, n: number): number {
    return root * Math.pow(2, (n - 49) / 12);
}

class Channel {
    oscillatorPool: OscillatorNode[] = [];
    gainPool: GainNode[] = [];
    finalTime: number = 0;

    constructor(
        public context: AudioContext,
        public parent: AudioNode,
        public channel: IChannel,
        public ticksPerBeat: number,
        public beatsPerMinute: number,
        public beatsPerBar: number,
        private done: () => void
    ) {}

    playSequence(sequenceNumber: number, offset: number) {
        const sequence = this.channel[1][sequenceNumber];

        const speed = 60 / (this.ticksPerBeat * this.beatsPerMinute);
        if (!sequence) {
            return;
        }
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
                        gainNode.gain.exponentialRampToValueAtTime(
                            point.v / 100 || 0.00001,
                            t - 0.03
                        );
                    }

                    if (pIdx === note.p.length - 1) {
                        gainNode.gain.exponentialRampToValueAtTime(0.0001, t);
                    }

                    const pitchHz =
                        pIdx === note.p.length - 1 ? 0 : getPitch(440, pitch - 8);
                    oscillator.frequency.setValueAtTime(pitchHz, t);

                    if (t > this.finalTime) {
                        this.finalTime = t;
                    }
                }
            }
        }
    }

    play(playOffset: number) {
        // for (const oscillator of this.oscillatorPool) {
        //     oscillator.stop(0);
        //     oscillator.disconnect();
        // }

        // for (const gainNode of this.gainPool) {
        //     gainNode.disconnect();
        // }

        // this.oscillatorPool = [];
        // this.gainPool = [];
        this.finalTime = 0;

        for (
            let barNumber = 0;
            barNumber < this.channel[2].length;
            barNumber += 1
        ) {
            const sequenceNumber = this.channel[2][barNumber] - 1;

            this.playSequence(
                sequenceNumber,
                playOffset + barNumber * this.beatsPerBar * 60 / this.beatsPerMinute
            );
        }

        setTimeout(() => {
            this.done();
        }, this.finalTime * 1000 + 800);
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
            console.log('new oscillator');
            this.oscillatorPool.push(oscillator);
            this.gainPool.push(gainNode);
        }

        return [this.oscillatorPool[n], this.gainPool[n]];
    }
}

export default class Song {
    channels: Channel[] = [];
    channelsRemaining: number;
    createdTime: number;

    constructor(
        channels: IChannel[],
        ticksPerBeat: number,
        public beatsPerMinute: number,
        public beatsPerBar: number,
        public loopBars: number
    ) {
        const context = new AudioContext();
        this.createdTime = Date.now();
        const gainNode = context.createGain();
        gainNode.gain.value = 0.02;
        gainNode.connect(context.destination);

        for (const channel of channels) {
            const channelObj = new Channel(
                context,
                gainNode,
                channel,
                ticksPerBeat,
                beatsPerMinute,
                beatsPerBar,
                () => {
                    this.channelsRemaining -= 1;
                    if (this.channelsRemaining === 0) {
                        this.play();
                    }
                }
            );
            this.channels.push(channelObj);
        }
    }

    play() {
        console.log('Playing...');
        this.channelsRemaining = this.channels.length;
        const offset = (Date.now() - this.createdTime) / 1000;
        for (const channel of this.channels) {
            channel.play(offset);
        }
    }
}

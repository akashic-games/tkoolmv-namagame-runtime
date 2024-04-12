import { Utils } from "../core/Utils";

interface AudioParameters {
	name: string;
	pan: number;
	pitch: number;
	volume: number;
	pos?: number;
}

interface AudioPlayObject {
	name: string;
	playContext: g.AudioPlayContext;
}

interface SoundStatus {
	isPlaying: boolean;
}

export class AudioManager {
	private static _soundStatusMap: { [name: string]: SoundStatus } = Object.create(null);

	static get masterVolume() {
		return this._masterVolume;
	}

	static set masterVolue(value: number) {
		this._masterVolume = value;
	}

	static get bgmVolume() {
		return this._bgmVolume;
	}
	static set bgmVolume(value: number) {
		this._bgmVolume = value;
		this.updateBgmParameters(this._currentBgm);
	}

	static get bgsVolume() {
		return this._bgsVolume;
	}

	static set bgsVolume(value: number) {
		this._bgsVolume = value;
		this.updateBgsParameters(this._currentBgs);
	}

	static get meVolume() {
		return this._meVolume;
	}

	static set meVolume(value: number) {
		this._meVolume = value;
		this.updateMeParameters(this._currentMe);
	}

	static get seVolume() {
		return this._seVolume;
	}

	static set seVolume(value: number) {
		this._seVolume = value;
	}

	static playBgm(bgm: AudioParameters, pos?: number) {
		if (this.isCurrentBgm(bgm)) {
			this.updateBgmParameters(bgm);
		} else {
			this.stopBgm();
			let asset: g.AudioAsset;
			try {
				asset = g.game.scene().asset.getAudio(Utils.assetPathOfName("audio/bgm/" + bgm.name));
			} catch (_e) {
				return;
			}
			// akashic-engineでシーク再生はサポートしていないため、コメントアウト
			// if (pos) {
			// 	asset.offset = pos;
			// }
			this._bgmBuffer = {
				name: bgm.name,
				playContext: g.game.audio.create(asset)
			};
			this.updateBgmParameters(bgm);
			if (!this._meBuffer) {
				this._bgmBuffer.playContext.play();
				this._addSoundStatus(this._bgmBuffer);
			}
		}
		this.updateCurrentBgm(bgm, pos);
	}

	static replayBgm(bgm: AudioParameters) {
		if (this.isCurrentBgm(bgm)) {
			this.updateBgmParameters(bgm);
		} else {
			this.playBgm(bgm, bgm.pos);
			if (this._bgmBuffer) {
				// this._bgmBuffer.fadeIn(this._replayFadeTime);

				// フェードインの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
				// 元コードでfadeInBgm()関数呼び出しを行っていないので、同様に呼び出しを行わずにフェードイン処理を行う
				const playContext = this._bgmBuffer.playContext;
				g.AudioUtil.fadeIn(g.game, playContext, this._replayFadeTime * 1000, playContext._volume);
			}
		}
	}

	static isCurrentBgm(bgm: AudioParameters) {
		return this._currentBgm && this._bgmBuffer && this._currentBgm.name === bgm.name;
	}

	static updateBgmParameters(bgm: AudioParameters) {
		this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
	}

	static updateCurrentBgm(bgm: AudioParameters, pos?: number) {
		this._currentBgm = {
			name: bgm.name,
			volume: bgm.volume,
			pitch: bgm.pitch,
			pan: bgm.pan,
			pos: pos
		};
	}

	static stopBgm() {
		if (this._bgmBuffer) {
			this._bgmBuffer.playContext.stop();
			this._bgmBuffer = null;
			this._currentBgm = null;
		}
	}

	static fadeOutBgm(duration: number) {
		if (this._bgmBuffer && this._currentBgm) {
			// フェードアウトの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
			g.AudioUtil.fadeOut(g.game, this._bgmBuffer.playContext, duration * 1000);
			this._currentBgm = null;
		}
	}

	static fadeInBgm(duration: number, to: number = 1) {
		if (this._bgmBuffer && this._currentBgm) {
			// フェードインの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
			g.AudioUtil.fadeIn(g.game, this._bgmBuffer.playContext, duration * 1000, to);
		}
	}

	static playBgs(bgs: AudioParameters, pos?: number) {
		if (this.isCurrentBgs(bgs)) {
			this.updateBgsParameters(bgs);
		} else {
			this.stopBgs();
			let asset: g.AudioAsset;
			try {
				asset = g.game.scene().asset.getAudio(Utils.assetPathOfName("audio/bgs/" + bgs.name));
			} catch (_e) {
				return;
			}
			// akashic-engineでシーク再生はサポートしていないため、コメントアウト
			// if (pos) {
			// 	asset.offset = pos;
			// }
			this._bgsBuffer = {
				name: bgs.name,
				playContext: g.game.audio.create(asset)
			};
			this.updateBgsParameters(bgs);
			this._bgsBuffer.playContext.play();
			this._addSoundStatus(this._bgsBuffer);
		}
		this.updateCurrentBgs(bgs, pos);
	}

	static replayBgs(bgs: AudioParameters) {
		if (this.isCurrentBgs(bgs)) {
			this.updateBgsParameters(bgs);
		} else {
			this.playBgs(bgs, bgs.pos);
			if (this._bgsBuffer) {
				// this._bgsBuffer.fadeIn(this._replayFadeTime);

				// フェードインの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
				// 元コードでfadeInBgs()関数呼び出しを行っていないので、同様に呼び出しを行わずにフェードイン処理を行う
				const playContext = this._bgsBuffer.playContext;
				g.AudioUtil.fadeIn(g.game, playContext, this._replayFadeTime * 1000, playContext._volume);
			}
		}
	}

	static isCurrentBgs(bgs: AudioParameters) {
		return this._currentBgs && this._bgsBuffer && this._currentBgs.name === bgs.name;
	}

	static updateBgsParameters(bgs: AudioParameters) {
		this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
	}

	static updateCurrentBgs(bgs: AudioParameters, pos?: number) {
		this._currentBgs = {
			name: bgs.name,
			volume: bgs.volume,
			pitch: bgs.pitch,
			pan: bgs.pan,
			pos: pos
		};
	}

	static stopBgs() {
		if (this._bgsBuffer) {
			this._bgsBuffer.playContext.stop();
			this._bgsBuffer = null;
			this._currentBgs = null;
		}
	}

	static fadeOutBgs(duration: number) {
		if (this._bgsBuffer && this._currentBgs) {
			// フェードアウトの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
			g.AudioUtil.fadeOut(g.game, this._bgsBuffer.playContext, duration * 1000);
			this._currentBgs = null;
		}
	}

	static fadeInBgs(duration: number, to: number = 1) {
		if (this._bgsBuffer && this._currentBgs) {
			// フェードインの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
			g.AudioUtil.fadeIn(g.game, this._bgsBuffer.playContext, duration * 1000, to);
		}
	}

	static playMe(me: AudioParameters) {
		this.stopMe();
		let asset: g.AudioAsset;
		try {
			asset = g.game.scene().asset.getAudio(Utils.assetPathOfName("audio/me/" + me.name));
		} catch (_e) {
			return;
		}
		if (this._bgmBuffer && this._currentBgm) {
			// akashic-engineでシーク再生はサポートしていないため、コメントアウト
			// this._currentBgm.pos = this._bgmBuffer.seek();
			this._bgmBuffer.playContext.stop();
		}
		this._meBuffer = {
			name: me.name,
			playContext: g.game.audio.create(asset)
		};
		this.updateMeParameters(me);
		this._meBuffer.playContext.play();
		this._meBuffer.playContext.onStop.add(() => this.stopMe());
		this._addSoundStatus(this._meBuffer);
	}

	static updateMeParameters(me: AudioParameters) {
		this.updateBufferParameters(this._meBuffer, this._meVolume, me);
	}

	static fadeOutMe(duration: number) {
		if (this._meBuffer) {
			// フェードアウトの長さの単位がRPGツクールMVでは秒になっているのでミリ秒に変換する
			g.AudioUtil.fadeOut(g.game, this._meBuffer.playContext, duration * 1000);
		}
	}

	static stopMe() {
		if (this._meBuffer) {
			this._meBuffer.playContext.stop();
			this._meBuffer = null;
			if (this._bgmBuffer && this._currentBgm && this._soundStatusMap[this._bgmBuffer.name]?.isPlaying === false) {
				// akashic-engineでシーク再生はサポートしていないため、コメントアウト
				// this._bgmBuffer.asset.offset = this._currentBgm.pos || 0;
				this.updateBgmParameters(this._currentBgm);
				this.fadeInBgm(this._replayFadeTime, this._bgmBuffer.playContext._volume);
			}
		}
	}

	static playSe(se: AudioParameters) {
		let asset: g.AudioAsset;
		try {
			asset = g.game.scene().asset.getAudio(Utils.assetPathOfName("audio/se/" + se.name));
		} catch (_e) {
			return;
		}
		this._seBuffers = this._seBuffers.filter(audio => this._soundStatusMap[audio.name]?.isPlaying);
		const buffer = {
			name: se.name,
			playContext: g.game.audio.create(asset)
		};
		this.updateSeParameters(buffer, se);
		buffer.playContext.play();
		this._addSoundStatus(buffer);
		this._seBuffers.push(buffer);
	}

	static updateSeParameters(buffer: AudioPlayObject, se: AudioParameters) {
		this.updateBufferParameters(buffer, this._seVolume, se);
	}

	static stopSe() {
		this._seBuffers.forEach(buffer => buffer.playContext.stop());
		this._seBuffers = [];
	}

	static playStaticSe(se: AudioParameters) {
		if (se.name) {
			this.loadStaticSe(se);
			for (const buffer of this._staticBuffers) {
				if (buffer.name === se.name) {
					buffer.playContext.stop();
					this.updateSeParameters(buffer, se);
					buffer.playContext.play();
					break;
				}
			}
		}
	}

	static loadStaticSe(se: AudioParameters) {
		let asset: g.AudioAsset;
		try {
			asset = g.game.scene().asset.getAudio(Utils.assetPathOfName("audio/se/" + se.name));
		} catch (_e) {
			return;
		}
		if (this.isStaticSe(se)) {
			return;
		}
		const buffer = {
			name: se.name,
			playContext: g.game.audio.create(asset)
		};
		this._staticBuffers.push(buffer);
	}

	static isStaticSe(se: AudioParameters) {
		return this._staticBuffers.some(buffer => buffer.name === se.name);
	}

	static stopAll() {
		this.stopMe();
		this.stopBgm();
		this.stopBgs();
		this.stopSe();
	}

	static saveBgm() {
		if (this._currentBgm) {
			const bgm = this._currentBgm;
			return {
				name: bgm.name,
				volume: bgm.volume,
				pitch: bgm.pitch,
				pan: bgm.pan
				// akashic-engineでシーク再生はサポートしていないため、コメントアウト
				// pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
			};
		} else {
			return this.makeEmptyAudioObject();
		}
	}

	static saveBgs() {
		if (this._currentBgs) {
			const bgs = this._currentBgs;
			return {
				name: bgs.name,
				volume: bgs.volume,
				pitch: bgs.pitch,
				pan: bgs.pan
				// pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
			};
		} else {
			return this.makeEmptyAudioObject();
		}
	}

	static makeEmptyAudioObject() {
		return { name: "", volume: 0, pitch: 0 };
	}

	static updateBufferParameters(buffer: AudioPlayObject, configVolume: number, audio: AudioParameters) {
		if (buffer && audio) {
			buffer.playContext.changeVolume((configVolume * (audio.volume || 0)) / 10000);
			// akashic-engineで非サポートのためコメントアウト
			// buffer.pitch = (audio.pitch || 0) / 100;
			// buffer.pan = (audio.pan || 0) / 100;
		}
	}

	private static _addSoundStatus(audio: AudioPlayObject) {
		audio.playContext.onPlay.add(() => {
			this._soundStatusMap[audio.name] = { isPlaying: true };
		});
		audio.playContext.onStop.add(() => {
			this._soundStatusMap[audio.name] = { isPlaying: false };
		});
	}

	private static _masterVolume: number = 1; // (min: 0, max: 1)
	private static _bgmVolume: number = 100;
	private static _bgsVolume: number = 100;
	private static _meVolume: number = 100;
	private static _seVolume: number = 100;
	private static _currentBgm: AudioParameters | null = null;
	private static _currentBgs: AudioParameters | null = null;
	private static _bgmBuffer: AudioPlayObject | null = null;
	private static _bgsBuffer: AudioPlayObject | null = null;
	private static _meBuffer: AudioPlayObject | null = null;
	private static _seBuffers: AudioPlayObject[] = [];
	private static _staticBuffers: AudioPlayObject[] = [];
	private static _replayFadeTime: number = 0.5;
	private static _currentMe: AudioParameters | null = null;
}

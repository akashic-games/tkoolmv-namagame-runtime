export class StorageManager {
	static save(savefileId: number, json: any) {
		if (this.isLocalMode()) {
			this.saveToLocalFile(savefileId, json);
		} else {
			this.saveToWebStorage(savefileId, json);
		}
	}

	static load(savefileId: number) {
		if (this.isLocalMode()) {
			return this.loadFromLocalFile(savefileId);
		} else {
			return this.loadFromWebStorage(savefileId);
		}
	}

	static exists(savefileId: number): boolean {
		if (this.isLocalMode()) {
			return this.localFileExists(savefileId);
		} else {
			return this.webStorageExists(savefileId);
		}
	}

	static remove(savefileId: number) {
		if (this.isLocalMode()) {
			this.removeLocalFile(savefileId);
		} else {
			this.removeWebStorage(savefileId);
		}
	}

	static backup(_savefileId: number) {
		// if (this.exists(savefileId)) {
		// 	if (this.isLocalMode()) {
		// 		const data = this.loadFromLocalFile(savefileId);
		// 		const compressed = LZString.compressToBase64(data);
		// 		const fs = require('fs');
		// 		const dirPath = this.localFileDirectoryPath();
		// 		const filePath = this.localFilePath(savefileId) + ".bak";
		// 		if (!fs.existsSync(dirPath)) {
		// 			fs.mkdirSync(dirPath);
		// 		}
		// 		fs.writeFileSync(filePath, compressed);
		// 	} else {
		// 		const data = this.loadFromWebStorage(savefileId);
		// 		const compressed = LZString.compressToBase64(data);
		// 		const key = this.webStorageKey(savefileId) + "bak";
		// 		localStorage.setItem(key, compressed);
		// 	}
		// }
	}

	static backupExists(savefileId: number) {
		if (this.isLocalMode()) {
			return this.localFileBackupExists(savefileId);
		} else {
			return this.webStorageBackupExists(savefileId);
		}
	}

	static cleanBackup(_savefileId: number) {
		// if (this.backupExists(savefileId)) {
		// 	if (this.isLocalMode()) {
		// 		const fs = require('fs');
		// 		const dirPath = this.localFileDirectoryPath();
		// 		const filePath = this.localFilePath(savefileId);
		// 		fs.unlinkSync(filePath + ".bak");
		// 	} else {
		// 		const key = this.webStorageKey(savefileId);
		// 		localStorage.removeItem(key + "bak");
		// 	}
		// }
	}

	static restoreBackup(_savefileId: number) {
		// if (this.backupExists(savefileId)) {
		// 	if (this.isLocalMode()) {
		// 		const data = this.loadFromLocalBackupFile(savefileId);
		// 		const compressed = LZString.compressToBase64(data);
		// 		const fs = require('fs');
		// 		const dirPath = this.localFileDirectoryPath();
		// 		const filePath = this.localFilePath(savefileId);
		// 		if (!fs.existsSync(dirPath)) {
		// 			fs.mkdirSync(dirPath);
		// 		}
		// 		fs.writeFileSync(filePath, compressed);
		// 		fs.unlinkSync(filePath + ".bak");
		// 	} else {
		// 		const data = this.loadFromWebStorageBackup(savefileId);
		// 		const compressed = LZString.compressToBase64(data);
		// 		const key = this.webStorageKey(savefileId);
		// 		localStorage.setItem(key, compressed);
		// 		localStorage.removeItem(key + "bak");
		// 	}
		// }
	}

	static isLocalMode() {
		// return Utils.isNwjs();
		return false;
	}

	static saveToLocalFile(_savefileId: number, _json: any) {
		// const data = LZString.compressToBase64(json);
		// const fs = require('fs');
		// const dirPath = this.localFileDirectoryPath();
		// const filePath = this.localFilePath(savefileId);
		// if (!fs.existsSync(dirPath)) {
		// 	fs.mkdirSync(dirPath);
		// }
		// fs.writeFileSync(filePath, data);
	}

	static loadFromLocalFile(_savefileId: number) {
		// const data = null;
		// const fs = require('fs');
		// const filePath = this.localFilePath(savefileId);
		// if (fs.existsSync(filePath)) {
		// 	data = fs.readFileSync(filePath, { encoding: 'utf8' });
		// }
		// return LZString.decompressFromBase64(data);
	}

	static loadFromLocalBackupFile(_savefileId: number) {
		// const data = null;
		// const fs = require('fs');
		// const filePath = this.localFilePath(savefileId) + ".bak";
		// if (fs.existsSync(filePath)) {
		// 	data = fs.readFileSync(filePath, { encoding: 'utf8' });
		// }
		// return LZString.decompressFromBase64(data);
	}

	static localFileBackupExists(_savefileId: number) {
		// const fs = require('fs');
		// return fs.existsSync(this.localFilePath(savefileId) + ".bak");
	}

	static localFileExists(_savefileId: number): boolean {
		// const fs = require('fs');
		// return fs.existsSync(this.localFilePath(savefileId));
		return false;
	}

	static removeLocalFile(_savefileId: number) {
		// const fs = require('fs');
		// const filePath = this.localFilePath(savefileId);
		// if (fs.existsSync(filePath)) {
		// 	fs.unlinkSync(filePath);
		// }
	}

	static saveToWebStorage(_savefileId: number, _json: any) {
		// const key = this.webStorageKey(savefileId);
		// const data = LZString.compressToBase64(json);
		// localStorage.setItem(key, data);
	}

	static loadFromWebStorage(_savefileId: number) {
		// const key = this.webStorageKey(savefileId);
		// const data = localStorage.getItem(key);
		// return LZString.decompressFromBase64(data);
	}

	static loadFromWebStorageBackup(_savefileId: number) {
		// const key = this.webStorageKey(savefileId) + "bak";
		// const data = localStorage.getItem(key);
		// return LZString.decompressFromBase64(data);
	}

	static webStorageBackupExists(_savefileId: number) {
		// const key = this.webStorageKey(savefileId) + "bak";
		// return !!localStorage.getItem(key);
	}

	static webStorageExists(_savefileId: number): boolean {
		// const key = this.webStorageKey(savefileId);
		// return !!localStorage.getItem(key);
		return false;
	}

	static removeWebStorage(_savefileId: number) {
		// const key = this.webStorageKey(savefileId);
		// localStorage.removeItem(key);
	}

	static localFileDirectoryPath() {
		// const path = require('path');
		// const base = path.dirname(process.mainModule.filename);
		// return path.join(base, 'save/');
	}

	static localFilePath(_savefileId: number) {
		// const name;
		// if (savefileId < 0) {
		// 	name = 'config.rpgsave';
		// } else if (savefileId === 0) {
		// 	name = 'global.rpgsave';
		// } else {
		// 	name = 'file%1.rpgsave'.format(savefileId);
		// }
		// return this.localFileDirectoryPath() + name;
	}

	static webStorageKey(savefileId: number) {
		if (savefileId < 0) {
			return "RPG Config";
		} else if (savefileId === 0) {
			return "RPG Global";
		} else {
			// return "RPG File%1".format(savefileId);
			return "RPG File" + savefileId;
		}
	}
}

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const marked = require("marked");

const distDirPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distDirPath)) {
	shell.rm("-rf", distDirPath);
}
shell.mkdir(distDirPath);

const tkoolmvRuntimeDirPath = path.join(distDirPath, "tkoolmv-namagame-runtime");
shell.mkdir(tkoolmvRuntimeDirPath);

const scriptDirPath = path.resolve(__dirname, "../script");
const staticDirPath = path.resolve(__dirname, "../static");
const pluginsDirPath = path.resolve(__dirname, "../plugins");

// distディレクトリにファイル・ディレクトリ配置
shell.cp("-Rf", pluginsDirPath, tkoolmvRuntimeDirPath);
fs.writeFileSync(path.join(tkoolmvRuntimeDirPath, "README.html"), marked.marked(fs.readFileSync(path.join(staticDirPath, "README.md")).toString()));
const gameDirPath = path.join(tkoolmvRuntimeDirPath, "game");
shell.mkdir(gameDirPath);
["assets", "text", "game.json"].forEach(f => shell.cp("-Rf", path.join(staticDirPath, f), gameDirPath));
shell.cp("-Rf", scriptDirPath, gameDirPath);
// 外部モジュールのコピー
const gameJson = require(path.join(gameDirPath, "game.json"));
(gameJson["globalScripts"] ?? []).forEach(scriptPath => {
	const dirPath = path.join(gameDirPath, path.dirname(scriptPath));
	if (!fs.existsSync(dirPath)) {
		shell.mkdir("-p", dirPath);
	}
	shell.cp(path.join(__dirname, "..", scriptPath), dirPath);
});
shell.exec(`cd ${gameDirPath} && ${path.resolve(__dirname, "../node_modules/.bin/akashic-cli-scan")} asset`);

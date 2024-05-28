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
const scriptDistDirPath = path.join(gameDirPath, "script");
const scriptTkoolDistDirPath = path.join(scriptDistDirPath, "tkool");
shell.mkdir("-p", scriptTkoolDistDirPath);
// script直下のファイルとプラグインはバンドルしないため直接コピー
shell.cp(path.join(scriptDirPath, "*.js"), scriptDistDirPath);
shell.cp("-Rf", path.join(scriptDirPath, "tkool", "plugins"), scriptTkoolDistDirPath);
// tkoolディレクトリ以下のスクリプトファイルバンドル処理
shell.exec(`browserify -e ${path.join(scriptDirPath, "tkool", "index.js")} -o ${path.join(scriptTkoolDistDirPath, "index.js")} -s TkoolmvNamagame`);
shell.exec(`cd ${gameDirPath} && ${path.resolve(__dirname, "../node_modules/.bin/akashic-cli-scan")} asset`);

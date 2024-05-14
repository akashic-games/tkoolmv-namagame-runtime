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
// スクリプトファイルバンドル処理・配置
shell.exec(`browserify -r ./script/tkool/index.js -o ${path.join(distDirPath, "__tmp_rollup_bundle.js")} -s TkoolmvNamagame`);
const scriptTkoolPath = path.join(gameDirPath, "script", "tkool");
shell.rm("-Rf", path.join(scriptTkoolPath, "*"));
shell.mv(path.join(distDirPath, "__tmp_rollup_bundle.js"), path.join(scriptTkoolPath, "index.js"));
shell.cp("-Rf", path.join(scriptDirPath, "tkool", "plugins"), scriptTkoolPath);
shell.exec(`cd ${gameDirPath} && ${path.resolve(__dirname, "../node_modules/.bin/akashic-cli-scan")} asset`);

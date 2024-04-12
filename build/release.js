const fs = require("fs");
const os = require("os");
const path = require("path");
const sh = require("shelljs");
const archiver = require("archiver");

const tkoolmvRuntimeDirPath = path.resolve(__dirname, "..", "dist", "tkoolmv-namagame-runtime");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));
const version = packageJson["version"];
const tkoolmvRuntimeZipPath = path.resolve(__dirname, "..", "dist", `tkoolmv-namagame-runtime-${version}.zip`);

(async() => {
	if (fs.existsSync(tkoolmvRuntimeZipPath)) {
		sh.rm("-Rf", tkoolmvRuntimeZipPath);
	}
	const ostream = fs.createWriteStream(tkoolmvRuntimeZipPath);
	// zip圧縮完了の通知が来るまで待機するための処理
	const streamClosePromise = new Promise(resolve => ostream.on("close", resolve));
	const archive = archiver("zip");
	await archive.pipe(ostream);
	await archive.glob(`${path.basename(tkoolmvRuntimeDirPath)}/**`, {cwd: path.relative(process.cwd(), path.dirname(tkoolmvRuntimeDirPath))});
	await archive.finalize();
	// zipが不完全な状態でアップロードされるのを防ぐために、zip圧縮完了の通知が来るまで待機
	await streamClosePromise;
	console.log(`Completed: ${tkoolmvRuntimeZipPath}`);

	// Releases に書き込む内容をCHANGELOGから抽出
	const changelog = fs.readFileSync(path.resolve(__dirname, "..", "CHANGELOG.md")).toString();
	const matches = changelog.match(new RegExp(`## ${version}(.*?)(?=## \\d|\\Z|\$)`, "gs"));
	const tmpChangelogPath = path.join(os.tmpdir(), `tkoolmv-namagame-runtime-changelog-${Date.now()}.md`);
	// 内容に改行を含む場合、オプションで直接文章を渡すと Releases に全て書き込めないことがあるので、ファイルにしておく
	fs.writeFileSync(tmpChangelogPath, matches[0].replace(`## ${version}`, '').trim());
	const result = sh.exec(`gh release view v${version}`);
	// 現バージョンの Release Note が無い時のみ、Release Note作成を行う
	if (result.code === 1 && result.stderr.includes("release not found")) {
		sh.exec(`gh release create "v${version}" -t "Release v${version}" --target "main" -F "${tmpChangelogPath}"`);
		sh.exec(`gh release upload "v${version}" "${tkoolmvRuntimeZipPath}" --clobber`);
	}
})();

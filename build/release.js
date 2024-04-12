const fs = require("fs");
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
	sh.exec(`gh release upload "v${version}" "${tkoolmvRuntimeZipPath}"`);
})();

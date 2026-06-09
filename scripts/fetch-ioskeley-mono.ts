import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { $ } from "bun";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");

const RELEASE_TAG = "v2.0.0";
const RELEASE_BASE = `https://github.com/ahatem/IoskeleyMono/releases/download/${RELEASE_TAG}`;

const WEIGHTS = ["Regular", "Medium", "SemiBold", "Bold"] as const;

const webOutDir = join(repoRoot, "apps/web/public/fonts/ioskeley-mono");
const nativeOutDir = join(repoRoot, "apps/native/assets/fonts/ioskeley-mono");
const licenseDir = join(repoRoot, "packages/fonts/ioskeley-mono");
const tempDir = join(repoRoot, ".tmp/ioskeley-mono-fetch");

function ensureDir(path: string) {
	mkdirSync(path, { recursive: true });
}

async function download(url: string, dest: string) {
	const result = await $`curl -fsSL ${url} -o ${dest}`.quiet();
	if (result.exitCode !== 0) {
		throw new Error(`Failed to download ${url}`);
	}
}

async function main() {
	rmSync(tempDir, { recursive: true, force: true });
	ensureDir(tempDir);
	ensureDir(webOutDir);
	ensureDir(nativeOutDir);
	ensureDir(licenseDir);

	const webZip = join(tempDir, "IoskeleyMono-Web.zip");
	const ttfZip = join(tempDir, "IoskeleyMono.zip");

	console.log("Downloading Ioskeley Mono release assets...");
	await download(`${RELEASE_BASE}/IoskeleyMono-Web.zip`, webZip);
	await download(`${RELEASE_BASE}/IoskeleyMono.zip`, ttfZip);

	const webExtract = join(tempDir, "web");
	const ttfExtract = join(tempDir, "ttf");
	ensureDir(webExtract);
	ensureDir(ttfExtract);

	await $`unzip -qo ${webZip} -d ${webExtract}`;
	await $`unzip -qo ${ttfZip} -d ${ttfExtract}`;

	for (const weight of WEIGHTS) {
		const woff2Name = `IoskeleyMono-${weight}.woff2`;
		const ttfName = `IoskeleyMono-${weight}.ttf`;

		copyFileSync(
			join(webExtract, "WOFF2", woff2Name),
			join(webOutDir, woff2Name),
		);
		copyFileSync(
			join(ttfExtract, "Normal/Unhinted", ttfName),
			join(nativeOutDir, ttfName),
		);
		console.log(`  ${weight}: ${woff2Name}, ${ttfName}`);
	}

	const licenseResponse = await fetch(
		"https://raw.githubusercontent.com/ahatem/IoskeleyMono/main/LICENSE",
	);
	if (!licenseResponse.ok) {
		throw new Error("Failed to download OFL license");
	}
	writeFileSync(
		join(licenseDir, "OFL.txt"),
		await licenseResponse.text(),
		"utf8",
	);

	writeFileSync(
		join(licenseDir, "NOTICE.md"),
		`# Ioskeley Mono

Source: https://github.com/ahatem/IoskeleyMono
Release: ${RELEASE_TAG}
License: SIL Open Font License 1.1 (see OFL.txt)

Ioskeley Mono is a custom Iosevka configuration mimicking Berkeley Mono.
Bundled weights: ${WEIGHTS.join(", ")}.
`,
		"utf8",
	);

	rmSync(tempDir, { recursive: true, force: true });
	console.log("Done.");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

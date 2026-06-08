const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const {
	wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Monorepo: resolve workspace packages from the repo root.
config.watchFolders = [monorepoRoot];

// Prefer native's node_modules so Metro doesn't pick web's react@19.2.x.
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(monorepoRoot, "node_modules"),
];
config.resolver.extraNodeModules = {
	react: path.resolve(projectRoot, "node_modules/react"),
	"react-dom": path.resolve(projectRoot, "node_modules/react-dom"),
};

// Alchemy writes runtime state here; block it to avoid Metro refresh loops.
const blockList = config.resolver.blockList ?? [];
const blockListPatterns = Array.isArray(blockList) ? blockList : [blockList];

config.resolver.blockList = [
	...blockListPatterns,
	/[/\\]packages[/\\]infra[/\\]\.alchemy(?:[/\\]|$)/,
];

const uniwindConfig = withUniwindConfig(wrapWithReanimatedMetroConfig(config), {
	cssEntryFile: "./global.css",
	dtsFile: "./uniwind-types.d.ts",
});

module.exports = uniwindConfig;

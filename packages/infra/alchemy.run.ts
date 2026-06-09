import alchemy from "alchemy";
import { TanStackStart, Worker } from "alchemy/cloudflare";
import { GitHubComment } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

const stage = process.env.STAGE ?? process.env.ALCHEMY_STAGE ?? "dev";
const isPreview = stage.startsWith("pr-");

const databaseUrlSecret = isPreview
	? (process.env.DATABASE_URL_STAGING ?? process.env.DATABASE_URL)
	: process.env.DATABASE_URL;

if (!databaseUrlSecret) {
	throw new Error(
		`DATABASE_URL is required${isPreview ? " (or DATABASE_URL_STAGING for PR previews)" : ""}`,
	);
}

if (!process.env.BETTER_AUTH_SECRET) {
	throw new Error("BETTER_AUTH_SECRET is required");
}

if (!process.env.ALCHEMY_PASSWORD) {
	throw new Error(
		"ALCHEMY_PASSWORD is required in packages/infra/.env (openssl rand -base64 32)",
	);
}

const useRemoteState = Boolean(process.env.ALCHEMY_STATE_TOKEN);

const app = await alchemy("personalWebsite", {
	stage,
	password: process.env.ALCHEMY_PASSWORD,
	...(useRemoteState
		? { stateStore: (scope) => new CloudflareStateStore(scope) }
		: {}),
});

const sharedBindings = {
	DATABASE_URL: alchemy.secret(databaseUrlSecret),
	BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET,
	WORKERS_DEV_SUBDOMAIN: alchemy.env.WORKERS_DEV_SUBDOMAIN ?? "",
};

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	url: true,
	bindings: {
		...sharedBindings,
		BETTER_AUTH_URL: Worker.DevUrl,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "http://localhost:3001",
	},
	dev: {
		port: 3000,
	},
});

if (!server.url) {
	throw new Error("Server Worker URL was not available after deploy");
}

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		...sharedBindings,
		VITE_SERVER_URL: server.url,
		VITE_USE_MOCK_FEED: "false",
		VITE_USE_MOCK_AUTH: "false",
		BETTER_AUTH_URL: server.url,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "http://localhost:3001",
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

const pullRequest = process.env.PULL_REQUEST;
if (pullRequest) {
	const [owner, repository] = (
		process.env.GITHUB_REPOSITORY ?? "owner/repo"
	).split("/");

	if (owner && repository && owner !== "owner") {
		await GitHubComment("preview-comment", {
			owner,
			repository,
			issueNumber: Number(pullRequest),
			body: `## Preview deployed

Your changes are live on a preview environment:

**Web:** ${web.url}
**API:** ${server.url}

Built from commit \`${process.env.GITHUB_SHA?.slice(0, 7) ?? "unknown"}\`

---
<sub>This comment updates automatically on each push.</sub>`,
		});
	}
}

await app.finalize();

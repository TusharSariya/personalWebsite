import { env } from "@personalWebsite/env/server";

export function resolveCorsOrigin(
	requestOrigin: string | undefined,
): string | undefined {
	if (!requestOrigin) {
		return env.CORS_ORIGIN;
	}

	if (env.CORS_ORIGIN && requestOrigin === env.CORS_ORIGIN) {
		return requestOrigin;
	}

	const workersDevSuffix = env.WORKERS_DEV_SUBDOMAIN;
	if (workersDevSuffix && requestOrigin.endsWith(workersDevSuffix)) {
		return requestOrigin;
	}

	return env.CORS_ORIGIN;
}

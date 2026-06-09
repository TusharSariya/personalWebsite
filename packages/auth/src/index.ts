import { expo } from "@better-auth/expo";
import { createDb } from "@personalWebsite/db";
import * as schema from "@personalWebsite/db/schema/auth";
import { env } from "@personalWebsite/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

function workersDevCookieDomain(): string | undefined {
	const suffix = env.WORKERS_DEV_SUBDOMAIN?.trim();
	if (!suffix) {
		return undefined;
	}

	return suffix.startsWith(".") ? suffix : `.${suffix}`;
}

export function createAuth() {
	const db = createDb();
	const crossSubDomainDomain = workersDevCookieDomain();

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema: schema,
		}),
		trustedOrigins: [
			env.CORS_ORIGIN,
			"personalWebsite://",
			"exp://",
			"http://localhost:8081",
		],
		emailAndPassword: {
			enabled: true,
		},
		...(crossSubDomainDomain
			? {
					session: {
						cookieCache: {
							enabled: true,
							maxAge: 5 * 60,
						},
					},
				}
			: {}),
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
			...(crossSubDomainDomain
				? {
						crossSubDomainCookies: {
							enabled: true,
							domain: crossSubDomainDomain,
						},
					}
				: {}),
		},
		plugins: [expo()],
	});
}

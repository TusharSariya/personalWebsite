import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAppSession } from "@/lib/app-session";

export const Route = createFileRoute("/_auth")({
	ssr: false,
	component: AuthLayout,
	beforeLoad: async () => {
		const session = await getAppSession();
		if (!session.data) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
});

function AuthLayout() {
	return <Outlet />;
}

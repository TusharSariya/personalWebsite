import { Link } from "@tanstack/react-router";

import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/feed", label: "Feed" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<header className="border-border border-b-2 bg-card">
			<div className="flex flex-row items-center justify-between px-4 py-2">
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="font-semibold text-sm uppercase tracking-widest"
					>
						Life Log
					</Link>
					<nav className="flex gap-2">
						{links.map(({ to, label }) => {
							return (
								<Link
									key={to}
									to={to}
									className="border border-transparent px-2 py-1 text-xs uppercase tracking-wide transition-colors hover:border-border hover:bg-muted"
									activeProps={{
										className:
											"border border-border bg-muted px-2 py-1 text-xs uppercase tracking-wide",
									}}
								>
									{label}
								</Link>
							);
						})}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<UserMenu />
				</div>
			</div>
		</header>
	);
}

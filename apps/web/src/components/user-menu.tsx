import { Button } from "@personalWebsite/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@personalWebsite/ui/components/dropdown-menu";
import { Skeleton } from "@personalWebsite/ui/components/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";

import { signOutAppSession, useAppSession } from "@/lib/app-session";
import { authClient } from "@/lib/auth-client";
import { isMockAuthEnabled } from "@/lib/mock-auth";

export default function UserMenu() {
	const navigate = useNavigate();
	const { data: session, isPending } = useAppSession();

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		return (
			<Link to="/login">
				<Button variant="outline">Sign In</Button>
			</Link>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				{session.user.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-card">
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>{session.user.email}</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							if (isMockAuthEnabled()) {
								signOutAppSession();
								navigate({ to: "/" });
								return;
							}

							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										navigate({
											to: "/",
										});
									},
								},
							});
						}}
					>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

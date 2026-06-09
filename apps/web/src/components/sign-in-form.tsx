import { Button } from "@personalWebsite/ui/components/button";
import { Input } from "@personalWebsite/ui/components/input";
import { Label } from "@personalWebsite/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { useAppSession } from "@/lib/app-session";
import { authClient } from "@/lib/auth-client";
import {
	isMockAuthEnabled,
	signInWithMockDevCredentials,
} from "@/lib/mock-auth";

import Loader from "./loader";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = useAppSession();
	const mockAuthEnabled = isMockAuthEnabled();

	const form = useForm({
		defaultValues: {
			email: mockAuthEnabled ? "admin" : "",
			password: mockAuthEnabled ? "admin" : "",
		},
		onSubmit: async ({ value }) => {
			if (mockAuthEnabled) {
				const session = signInWithMockDevCredentials(
					value.email,
					value.password,
				);
				if (session) {
					navigate({ to: "/dashboard" });
					toast.success("Signed in as dev admin");
					return;
				}
				toast.error("Use admin / admin in mock auth mode");
				return;
			}

			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/dashboard",
						});
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: mockAuthEnabled
					? z.string().min(1, "Username is required")
					: z.email("Invalid email address"),
				password: mockAuthEnabled
					? z.string().min(1, "Password is required")
					: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<div className="retro-panel p-6">
				<h1 className="mb-6 text-center font-bold text-2xl uppercase tracking-wide">
					Welcome Back
				</h1>
				{mockAuthEnabled ? (
					<p className="retro-label mb-4 text-center">
						Dev mode: sign in with <strong>admin</strong> /{" "}
						<strong>admin</strong>
					</p>
				) : null}

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div>
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="retro-label">
										Email
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="retro-label">
										Password
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting,
						})}
					>
						{({ canSubmit, isSubmitting }) => (
							<Button
								type="submit"
								className="w-full"
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Sign In"}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center">
					<Button variant="link" onClick={onSwitchToSignUp}>
						Need an account? Sign Up
					</Button>
				</div>
			</div>
		</div>
	);
}

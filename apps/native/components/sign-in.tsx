import { useForm } from "@tanstack/react-form";
import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	Surface,
	TextField,
	useToast,
} from "heroui-native";
import { useRef } from "react";
import { Text, type TextInput, View } from "react-native";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { isMockAuthEnabled, signInWithMockDevCredentials } from "@/lib/mock-auth";
import { queryClient } from "@/utils/orpc";

function getSignInSchema() {
	if (isMockAuthEnabled()) {
		return z.object({
			email: z.string().trim().min(1, "Username is required"),
			password: z.string().min(1, "Password is required"),
		});
	}

	return z.object({
		email: z
			.string()
			.trim()
			.min(1, "Email is required")
			.email("Enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Use at least 8 characters"),
	});
}

function getErrorMessage(error: unknown): string | null {
	if (!error) return null;

	if (typeof error === "string") {
		return error;
	}

	if (Array.isArray(error)) {
		for (const issue of error) {
			const message = getErrorMessage(issue);
			if (message) {
				return message;
			}
		}
		return null;
	}

	if (typeof error === "object" && error !== null) {
		const maybeError = error as { message?: unknown };
		if (typeof maybeError.message === "string") {
			return maybeError.message;
		}
	}

	return null;
}

function SignIn() {
	const passwordInputRef = useRef<TextInput>(null);
	const { toast } = useToast();
	const mockAuthEnabled = isMockAuthEnabled();

	const form = useForm({
		defaultValues: {
			email: mockAuthEnabled ? "admin" : "",
			password: mockAuthEnabled ? "admin" : "",
		},
		validators: {
			onSubmit: getSignInSchema(),
		},
		onSubmit: async ({ value, formApi }) => {
			if (mockAuthEnabled) {
				const session = await signInWithMockDevCredentials(
					value.email,
					value.password,
				);
				if (session) {
					formApi.reset();
					toast.show({
						variant: "success",
						label: "Signed in as dev admin",
					});
					queryClient.refetchQueries();
					return;
				}
				toast.show({
					variant: "danger",
					label: "Use admin / admin in mock auth mode",
				});
				return;
			}

			await authClient.signIn.email(
				{
					email: value.email.trim(),
					password: value.password,
				},
				{
					onError(error) {
						toast.show({
							variant: "danger",
							label: error.error?.message || "Failed to sign in",
						});
					},
					onSuccess() {
						formApi.reset();
						toast.show({
							variant: "success",
							label: "Signed in successfully",
						});
						queryClient.refetchQueries();
					},
				},
			);
		},
	});

	return (
		<Surface variant="secondary" className="rounded-lg p-4">
			<Text className="mb-4 font-medium text-foreground">Sign In</Text>
			{mockAuthEnabled ? (
				<Text className="mb-3 text-muted text-sm">
					Dev mode: admin / admin
				</Text>
			) : null}

			<form.Subscribe
				selector={(state) => ({
					isSubmitting: state.isSubmitting,
					validationError: getErrorMessage(state.errorMap.onSubmit),
				})}
			>
				{({ isSubmitting, validationError }) => {
					const formError = validationError;

					return (
						<>
							<FieldError isInvalid={!!formError} className="mb-3">
								{formError}
							</FieldError>

							<View className="gap-3">
								<form.Field name="email">
									{(field) => (
										<TextField>
											<Label>Email</Label>
											<Input
												value={field.state.value}
												onBlur={field.handleBlur}
												onChangeText={field.handleChange}
												placeholder="email@example.com"
												keyboardType="email-address"
												autoCapitalize="none"
												autoComplete="email"
												textContentType="emailAddress"
												returnKeyType="next"
												blurOnSubmit={false}
												onSubmitEditing={() => {
													passwordInputRef.current?.focus();
												}}
											/>
										</TextField>
									)}
								</form.Field>

								<form.Field name="password">
									{(field) => (
										<TextField>
											<Label>Password</Label>
											<Input
												ref={passwordInputRef}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChangeText={field.handleChange}
												placeholder="••••••••"
												secureTextEntry
												autoComplete="password"
												textContentType="password"
												returnKeyType="go"
												onSubmitEditing={form.handleSubmit}
											/>
										</TextField>
									)}
								</form.Field>

								<Button
									onPress={form.handleSubmit}
									isDisabled={isSubmitting}
									className="mt-1"
								>
									{isSubmitting ? (
										<Spinner size="sm" color="default" />
									) : (
										<Button.Label>Sign In</Button.Label>
									)}
								</Button>
							</View>
						</>
					);
				}}
			</form.Subscribe>
		</Surface>
	);
}

export { SignIn };

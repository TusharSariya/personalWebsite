import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { IOSKELEY_FONT_FAMILY, useIoskeleyFonts } from "@/lib/fonts";
import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
	initialRouteName: "(drawer)",
};

function StackLayout() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}

export default function Layout() {
	const [fontsLoaded, fontError] = useIoskeleyFonts();

	useEffect(() => {
		if (fontError) {
			console.error("Failed to load Ioskeley Mono fonts", fontError);
		}
	}, [fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView
				style={{ flex: 1, fontFamily: IOSKELEY_FONT_FAMILY }}
				className="font-sans"
			>
				<KeyboardProvider>
					<AppThemeProvider>
						<HeroUINativeProvider>
							<StackLayout />
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}

import { useFonts } from "expo-font";

export const IOSKELEY_FONT_FAMILY = "Ioskeley Mono";

export function useIoskeleyFonts() {
	return useFonts({
		"IoskeleyMono-Regular": require("@/assets/fonts/ioskeley-mono/IoskeleyMono-Regular.ttf"),
		"IoskeleyMono-Medium": require("@/assets/fonts/ioskeley-mono/IoskeleyMono-Medium.ttf"),
		"IoskeleyMono-SemiBold": require("@/assets/fonts/ioskeley-mono/IoskeleyMono-SemiBold.ttf"),
		"IoskeleyMono-Bold": require("@/assets/fonts/ioskeley-mono/IoskeleyMono-Bold.ttf"),
	});
}

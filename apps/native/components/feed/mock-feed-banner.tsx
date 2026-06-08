import { Text, View } from "react-native";

export function MockFeedBanner() {
	return (
		<View className="mx-4 mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
			<Text className="text-amber-950 text-sm dark:text-amber-100">
				Demo mode: mock feed data. No server or sign-in required.
			</Text>
		</View>
	);
}

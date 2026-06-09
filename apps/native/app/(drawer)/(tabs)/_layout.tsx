import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";

import { IOSKELEY_FONT_FAMILY } from "@/lib/fonts";

export default function TabLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: themeColorBackground,
					borderBottomWidth: 2,
				},
				tabBarStyle: {
					backgroundColor: themeColorBackground,
					borderTopWidth: 2,
				},
				headerTintColor: themeColorForeground,
				headerTitleStyle: {
					fontFamily: IOSKELEY_FONT_FAMILY,
					color: themeColorForeground,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Feed",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="albums" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Explore",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="compass" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}

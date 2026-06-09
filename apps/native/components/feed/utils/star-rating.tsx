import { Text } from "react-native";

export function StarRating({ rating }: { rating: number }) {
	const stars = Array.from({ length: 5 }, (_, index) => {
		const fill = rating - index;
		if (fill >= 1) return "★";
		if (fill >= 0.5) return "⯨";
		return "☆";
	}).join("");

	return (
		<Text
			className="text-amber-400 text-sm"
			accessibilityLabel={`${rating} out of 5 stars`}
		>
			{stars}
		</Text>
	);
}

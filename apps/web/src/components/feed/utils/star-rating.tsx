import { Star } from "lucide-react";

const STAR_IDS = ["star-1", "star-2", "star-3", "star-4", "star-5"] as const;

export function StarRating({ rating }: { rating: number }) {
	const stars = STAR_IDS.map((id, index) => ({
		id,
		fill: Math.min(Math.max(rating - index, 0), 1),
	}));

	return (
		<div
			role="img"
			className="flex items-center gap-0.5"
			aria-label={`${rating} out of 5 stars`}
		>
			{stars.map(({ id, fill }) => (
				<span key={id} className="relative inline-block h-4 w-4">
					<Star className="h-4 w-4 text-muted-foreground/40" aria-hidden />
					{fill > 0 ? (
						<span
							className="absolute inset-0 overflow-hidden"
							style={{ width: `${fill * 100}%` }}
						>
							<Star
								className="h-4 w-4 fill-amber-400 text-amber-400"
								aria-hidden
							/>
						</span>
					) : null}
				</span>
			))}
		</div>
	);
}

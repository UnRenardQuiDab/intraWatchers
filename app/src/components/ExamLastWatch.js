import ExamStats from "./ExamStats";

export default function ExamLastWatch({ lastWatch }) {

	const color = () => {
		const today = new Date();
		const diffTime = Math.abs(today - lastWatch);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		if (diffDays < 60) {
			return 'fg';
		} else if (diffDays < 90) {
			return 'fg.warning';
		} else {
			return 'fg.error';
		}
	}

	return (
		<ExamStats
			colorPalette={color()}
			label={"Last Watch"}
			value={lastWatch ? lastWatch.toLocaleDateString('fr-FR') : 'No watch yet'}
		/>
	)
}
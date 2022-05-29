export const calculatePoints = (finishPlace:number, numberOfPlayers:number, tookPole?: boolean, fastestLap?:boolean) => {
	let totalPoints:number = 0;

	// Make this a formula with nothing hardcoded if possible
	switch (finishPlace) {
		case 1:
			totalPoints = numberOfPlayers * 1.25;
			break;
		case 2:
			totalPoints = numberOfPlayers * 0.9;
			break;
		case 3:
			totalPoints = numberOfPlayers * 0.75;
			break;
		case 4:
			totalPoints = numberOfPlayers * 0.6;
			break;
		case 5:
			totalPoints = numberOfPlayers * 0.50;
			break;
		case 6:
			totalPoints = numberOfPlayers * 0.40;
			break;
		case 7:
			totalPoints = numberOfPlayers * 0.30;
			break;
		case 8:
			totalPoints = numberOfPlayers * 0.20;
			break;
		case 9:
			totalPoints = numberOfPlayers * 0.10;
			break;
		case 10:
			totalPoints = numberOfPlayers * 0.05;
			break;
		default:
			totalPoints = 0;
			break;
	}

	totalPoints += (tookPole ? 1 : 0);
	totalPoints += (fastestLap ? 1 : 0);

	return Math.round(totalPoints);
};

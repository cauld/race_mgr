export const calculatePoints = (finishPlace:number, numberOfPlayers:number, tookPole?: boolean, fastestLap?:boolean) => {
	const pointsPositions = Math.round(numberOfPlayers / 2); // Assign points for the 1st half of the finish places
	const pointsPositionsBeat = pointsPositions - finishPlace;

	let points = pointsPositionsBeat < 0 ? 0 : pointsPositionsBeat * 2;

	const firstPlaceBonus = 0.4;
	const secondPlaceBonus = 0.1;
	const thirdPlaceBonus = 0.075;

	switch (finishPlace) {
		case 1:
			points += points * firstPlaceBonus;
			break;
		case 2:
			points += points * secondPlaceBonus;
			break;
		case 3:
			points += points * thirdPlaceBonus;
			break;
		case pointsPositions: // Finished in the last points position
			points = 1;
			break;
		default:
			break;
	}

	points += (tookPole ? 1 : 0);
	points += (fastestLap ? 1 : 0);

	return Math.round(points);
};


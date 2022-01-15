import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { KMS_PER_WEEK, MAX_KMS_PER_YEAR, WazeData } from "../../App";
const { CronJob } = require("cron");

type KilometersDataProps = {
	totalDrivenKilometers: number;
	currentKilometers: number;
};

const runCronJob = (callback?: () => void) => {
	// const job = new CronJob("* * * * * *", callback);
	// const job = new CronJob("* * * * *", callback);
	const job = new CronJob("59 23 * * 0", callback);

	job.start();
};

const KilometersData: FC<KilometersDataProps> = ({
	totalDrivenKilometers,
	currentKilometers,
}) => {
	// const [kilometersThisWeek, setKilometersThisWeek] = useState(KMS_PER_WEEK);
	const [localStorageData, setLocalStorageData] =
		useLocalStorage<WazeData>("waze");
	const weeklyCurrentKilometers = Math.round(
		localStorageData?.weeklyUpdate?.at(
			localStorageData?.weeklyUpdate.length - 1
		)?.currentKilometers || 0
	);

	useEffect(() => {
		runCronJob(() => {
			console.log("running cronjob...");

			if (localStorageData) {
				setLocalStorageData({
					...localStorageData,
					weeklyUpdate: [
						...(localStorageData?.weeklyUpdate || []),
						{
							// At the time of the cron, get the last current km's driven from Waze and store.
							// We can use this to calculate the difference with the next updates and reset to 385 every sunday
							currentKilometers: currentKilometers,
							date: format(new Date(Date.now()), "dd-MM-yyyy"),
						},
					],
				});
			}
		});
	}, []);
	return (
		<section>
			<div>
				{currentKilometers && weeklyCurrentKilometers ? (
					currentKilometers - weeklyCurrentKilometers
				) : (
					<p>No data</p>
				)}
				km
			</div>

			<div>
				<div className={"totalKm"}>
					Totaal aantal km's over (per week)
				</div>
				<div className={"totalKm"}>
					{KMS_PER_WEEK -
						(currentKilometers - weeklyCurrentKilometers)}
					km
				</div>
			</div>

			<div>
				<div className={"totalKm"}>
					Gemiddeld maximum aantal km's (per week)
				</div>
				<div className={"totalKm"}>{KMS_PER_WEEK}km</div>
			</div>

			<div>
				<div className={"totalKm"}>
					Totaal aantal km's over (per jaar)
				</div>
				<div className={"totalKm"}>
					{MAX_KMS_PER_YEAR - totalDrivenKilometers}km
				</div>
			</div>

			<div>
				<div className={"totalKm"}>Maximum aantal km's (per jaar)</div>
				<div className={"totalKm"}>{MAX_KMS_PER_YEAR}km</div>
			</div>

			<div>
				<div className={"totalKm"}>Kilometerstand auto</div>
				<div className={"totalKm"}>...km</div>
			</div>
			<div>
				<div className={"totalKm"}>Totaal aantal Waze km's</div>
				{/* <div className={"totalKm"}>{Math.round(kilometers)}km</div> */}
			</div>
		</section>
	);
};

export default KilometersData;

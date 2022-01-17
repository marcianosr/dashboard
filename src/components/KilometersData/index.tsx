import { format } from "date-fns";
import { FC, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { KMS_PER_WEEK, MAX_KMS_PER_YEAR, WazeData } from "../../App";
import SubTitle from "../SubTitle";
import styles from "./styles.module.scss";
const { CronJob } = require("cron");

type KilometersDataProps = {
	totalDrivenKilometers: number;
	currentKilometers: number;
};

const runCronJob = (callback?: () => void) => {
	// const job = new CronJob("* * * * * *", callback);
	// const job = new CronJob("* * * * *", callback);
	const job = new CronJob("59 23 * * 0", callback);
	// const job = new CronJob("*/10 * * * *", callback);

	job.start();
};

const KilometersData: FC<KilometersDataProps> = ({
	totalDrivenKilometers,
	currentKilometers,
}) => {
	// const [kilometersThisWeek, setKilometersThisWeek] = useState(KMS_PER_WEEK);
	const [localStorageData, setLocalStorageData] =
		useLocalStorage<WazeData>("waze");

	const startingKilometers = Math.round(
		localStorageData?.startingKilometers || 0
	);
	const lastWeekData = localStorageData?.weeklyUpdate?.at(
		localStorageData?.weeklyUpdate.length - 2
	);
	const currentWeekData = localStorageData?.weeklyUpdate?.at(
		localStorageData?.weeklyUpdate.length - 1
	);

	const kilometersLeftFromLastWeek = Math.round(
		currentWeekData?.kilometersLeft || 0
	);

	const currentKilometersFromLastWeek = Math.round(
		lastWeekData?.currentKilometers || 0
	);

	const amountOfKilometersLeftByWeek =
		KMS_PER_WEEK +
		(kilometersLeftFromLastWeek || startingKilometers) -
		(currentKilometers - currentKilometersFromLastWeek);

	const amountOfKilometersLeftByYear =
		MAX_KMS_PER_YEAR +
		(kilometersLeftFromLastWeek || startingKilometers) -
		(currentKilometers - currentKilometersFromLastWeek);

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
							kilometersLeft: amountOfKilometersLeftByWeek,
						},
					],
				});
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<section className={styles.container}>
			<section className={styles.innerContainer}>
				<h2 className={styles.title}>Deze week</h2>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							{currentKilometers &&
							currentKilometersFromLastWeek ? (
								<>
									{currentKilometers -
										currentKilometersFromLastWeek}
									<span>km</span>
								</>
							) : (
								<>
									{startingKilometers + KMS_PER_WEEK}
									<span>km</span>
								</>
							)}
						</div>
						<SubTitle>kilometers gereden</SubTitle>
					</article>
				</section>
			</section>

			<section className={styles.innerContainer}>
				<h2 className={styles.title}>Vorige week</h2>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							{kilometersLeftFromLastWeek}
							<span>km</span>
						</div>
						<SubTitle>kilometers over</SubTitle>
					</article>
				</section>
			</section>

			<section className={styles.innerContainer}>
				<h2 className={styles.title}>Per week</h2>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							<>
								{amountOfKilometersLeftByWeek}
								<span>km</span>
							</>
							<div className={styles.smallText}>
								({KMS_PER_WEEK} + {kilometersLeftFromLastWeek} -{" "}
								{currentKilometersFromLastWeek && (
									<>
										{currentKilometers -
											currentKilometersFromLastWeek}
									</>
								)}
								)
							</div>
						</div>
						<SubTitle>Kilometers over</SubTitle>
					</article>
				</section>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							{KMS_PER_WEEK}
							<span>km</span>
						</div>
						<SubTitle>Max. aantal kilometers</SubTitle>
					</article>
				</section>
			</section>

			<section className={styles.innerContainer}>
				<h2 className={styles.title}>Per jaar</h2>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							{amountOfKilometersLeftByYear}
							<span>km</span>
						</div>
						<SubTitle>Kilometers over</SubTitle>
					</article>
				</section>

				<section className={styles.dataContainer}>
					<article>
						<div className={styles.amount}>
							{MAX_KMS_PER_YEAR}
							<span>km</span>
						</div>
						<SubTitle>Max. aantal km's</SubTitle>
					</article>
				</section>
			</section>

			{/* <div>
				<div className={"totalKm"}>Kilometerstand auto</div>
				<div className={"totalKm"}>...km</div>
			</div> */}
			{/* <div>
				<div className={"totalKm"}>Totaal aantal Waze km's</div>
				<div className={"totalKm"}>{Math.round(kilometers)}km</div>
			</div> */}
		</section>
	);
};

export default KilometersData;

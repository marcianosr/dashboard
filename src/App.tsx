import { useEffect, useState } from "react";
import axios from "axios";
import Block from "./components/Block";
import "./App.css";
import KilometersData from "./components/KilometersData";
import useLocalStorage from "use-local-storage";
import { format } from "date-fns";

type WazeUser = {
	existingKilometersCount: string;
};

export type WazeData = {
	startingKilometers: number;
	startDate: number;
	currentKilometers: number;
	lastAPIUpdate: number;
	weeklyUpdate?: {
		currentKilometers: number;
		date: string;
		kilometersLeft: number;
	}[];
};

export const MAX_KMS_PER_YEAR = 20000;
export const KMS_PER_WEEK = Math.round(MAX_KMS_PER_YEAR / 52);

const getWazeData = async (): Promise<WazeUser> =>
	axios.get("/.netlify/server/api").then((response) => response.data.api);

function App() {
	const [localStorageData, setLocalStorageData] =
		useLocalStorage<WazeData>("waze");

	console.log(localStorageData);
	const [error, setError] = useState<string>();

	const current = Math.round(localStorageData?.currentKilometers || 0);
	const start = Math.round(localStorageData?.startingKilometers || 0);

	const lastAPIUpdateDate = new Date(localStorageData?.lastAPIUpdate || 0);

	const totalDrivenKilometers = current - start;

	useEffect(() => {
		getWazeData()
			.then((response) => {
				const currentKilometersFromAPI =
					+response.existingKilometersCount;

				if (!localStorageData)
					return setLocalStorageData({
						startingKilometers: currentKilometersFromAPI,
						startDate: Date.now(),
						currentKilometers: currentKilometersFromAPI,
						lastAPIUpdate: Date.now(),
					});

				const isAPIUpdated =
					currentKilometersFromAPI >
					localStorageData.currentKilometers;

				if (isAPIUpdated) {
					return setLocalStorageData({
						...localStorageData,
						lastAPIUpdate: Date.now(),
						currentKilometers: currentKilometersFromAPI,
					});
				}
			})
			.catch((error) => {
				console.log("Error fetching from API: ", error);
				error && setError("Whoops, error");
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="App">
			<Block title="Overzicht van kilometers">
				{!localStorageData?.currentKilometers && !error && <>Loading</>}
				{error && <>{error}</>}
				{
					<KilometersData
						currentKilometers={current}
						totalDrivenKilometers={Math.round(
							totalDrivenKilometers
						)}
					/>
				}
				<span className={"smallText"}>
					Last API update:{" "}
					{format(lastAPIUpdateDate, "dd-MM-yyyy HH:mm")}
				</span>
			</Block>
		</div>
	);
}

export default App;

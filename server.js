const axios = require("axios");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Welcome to CORS server 😁");
});

const getWazeData = async (res) => {
	const result = axios
		.get("https://www.waze.com/_user/api/user/points/details?geoEnv=row", {
			method: "GET",
			headers: {
				cookie: "_gcl_au=1.1.697634755.1641889816; _web_visitorid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJTZXNzaW9uIjoiY1ZCUWVuaENhelYyZUd0VWVrMHdVRzQxZVM5MU1GQXZabGRIY1VGbWIySnJRa2xRUVZnNFdIRnBUemRvZFdNNGRHOHdjVk5SVTBGRFFrWkJaa2R2TVMwdFdGZG5RMVYwTW1GVlZrMDBjVUp6WjNBM1dGcG1kejA5LS03ODY1NzY3OThjYTczMjdlYTQxZTlhMGVkZWJjMzQ3MzQ4N2ZmYWExIiwidXVpZCI6ImYyMzQ2NTU5LTEzNDQtNDU2Ni1hNWMxLTg5NzFiMDJhNjMxZCIsImlhdCI6MTY0MTg4OTgyMX0.fviClQB-Tkqap0kPaXUnjc158GYmlDhkB-Wdg4uO6Ks; ads-cookie-consent=allow; phpbb3_waze_u=18030705; phpbb3_waze_k=; phpbb3_waze_sid=7035e2b54c440bd315576f5a894cf7d4; _ga_DGC95PYF7W=GS1.1.1641894483.1.1.1641894745.0; _ga_NNRWG3BV8Y=GS1.1.1641894530.1.1.1641894745.0; _ga=GA1.2.909969111.1641889816; G_ENABLED_IDPS=google; G_AUTHUSER_H=1; fbm_343050668156=base_domain=.waze.com; _gid=GA1.2.782095611.1641897099; _csrf_token=Eb-fZzIAMQ_ZO-FfGwmmkSG470bfqAJz5_cQTvX51GI; _waze_session=dEFRcDNIcWdMa1d1ckk3SjdEMmVmWGFvSkVEUE96Sll0RHNCYVF6NGVybTNGZU5oZjZSS2x3dFNTbTFZeXljbkFqblFpRFZDQUFnYmtVNlRNQjZ4b0hwWS9uUmk3L0UrQjlmSGlWdWNIMWJpM0VYeHRuSHBzZ3hWSTNGRW93cW1NQzRLV2NnQ3ladXY0dXJZdWVXanNBPT0tLURua1ZqaklWQ0NEZWRDMm5nQ3F0bEE9PQ%3D%3D--6fd0e1bc205409d4263481c5d60cdd22fb0ebe52; _gat_UA-6698700-1=1; _web_session=bFVIUmlhYWFSOXJyU2twYTJUa0dYZnJxM1JrVVZMUHJQQ29PMFhBSkZodG9nU0pDb00zQllsUnp6NmJhOWlqNG44bDFQYm5hek5rdm5yZjhRZkFsMUE9PS0tV1RiTGloSzNqYVYzeHRjalB1Yk1sUT09--13bd305000a1161ab15637472b4afebf5e5a5d95",
				authority: "www.waze.com",
				pragma: "no-cache",
				"cache-control": "no-cache",
				"sec-ch-ua":
					'" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
				accept: "*/*",
				"x-requested-with": "XMLHttpRequest",
				"sec-ch-ua-mobile": "?0",
				"user-agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-site": "same-origin",
				"sec-fetch-mode": "cors",
				"sec-fetch-dest": "empty",
				referer:
					"https://www.waze.com/account?utm_source=refresh_button",
				"accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
			},
		})
		.then((response) => response.data)
		.catch((error) => {
			console.log("error", error);
		});
	return result;
};

app.get("/api", async (req, res) => {
	const result = await getWazeData();

	console.log(result);

	res.json({
		api: {
			existingKilometersCount: result.existingKilometersCount,
		},
	});
});

app.listen(3200, () => {
	console.log("listening on port 3200");
});

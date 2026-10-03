export default async function handler(request, response) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return response.status(500).json({
      errors: { configuration: "API_FOOTBALL_KEY is not configured." },
      response: [],
    });
  }

  try {
    const apiResponse = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      { headers: { "x-apisports-key": apiKey } },
    );
    const data = await apiResponse.json();
    return response.status(apiResponse.status).json(data);
  } catch (error) {
    return response.status(502).json({
      errors: { upstream: "Unable to reach API-Football." },
      response: [],
    });
  }
}

const BASE_URL = "/api/live-scores";
const REFRESH_INTERVAL_MS = 120000;

// Set to true before a presentation to always show the sample scoreboard.
const DEMO_MODE = false;

const MOCK_MATCHES = [
  { teams: { home: { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" }, away: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" } }, goals: { home: 2, away: 3 }, fixture: { status: { elapsed: 78 } } },
  { teams: { home: { name: "Man United", logo: "https://media.api-sports.io/football/teams/33.png" }, away: { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" } }, goals: { home: 1, away: 1 }, fixture: { status: { elapsed: 45 } } },
  { teams: { home: { name: "Man City", logo: "https://media.api-sports.io/football/teams/50.png" }, away: { name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" } }, goals: { home: 0, away: 2 }, fixture: { status: { elapsed: 15 } } },
  { teams: { home: { name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" }, away: { name: "Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" } }, goals: { home: 4, away: 0 }, fixture: { status: { elapsed: 89 } } },
];

async function fetchLiveScores() {
  if (DEMO_MODE) {
    renderDemo("Presentation mode is enabled.");
    return;
  }

  try {
    console.log("Updating live scores from all football leagues...");
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    const data = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      throw new Error(`API returned an error: ${JSON.stringify(data.errors)}`);
    }

    if (Array.isArray(data.response) && data.response.length > 0) {
      updateUI(data.response);
      return;
    }
    renderDemo("No live matches are available right now.");
  } catch (error) {
    console.error("Unable to fetch live scores:", error);
    renderDemo("Live data is unavailable, so sample data is shown.");
  }
}

function renderDemo(reason) {
  console.log(`${reason} Showing demo data.`);
  updateUI(MOCK_MATCHES, { isDemo: true, message: reason });
}

function updateUI(matches, { isDemo = false, message = "" } = {}) {
  const heroSection = document.getElementById("hero-match-container");
  const grid = document.getElementById("live-matches-container");
  const topMatch = matches[0];

  if (topMatch && heroSection) {
    const matchDetails = document.createElement("div");
    matchDetails.className = "match-details";
    matchDetails.append(
      createTeam(topMatch.teams.home, "team", 100),
      createScoreArea(topMatch, isDemo, message),
      createTeam(topMatch.teams.away, "team", 100),
    );
    heroSection.replaceChildren(matchDetails);
  }

  if (grid) grid.replaceChildren(...matches.slice(1).map(createMatchCard));
}

function createTeam(team, className, logoWidth) {
  const teamElement = document.createElement("div");
  teamElement.className = className;
  const logo = document.createElement("img");
  logo.src = team.logo;
  logo.alt = `${team.name} logo`;
  logo.width = logoWidth;
  const name = document.createElement("p");
  name.textContent = team.name;
  teamElement.append(logo, name);
  return teamElement;
}

function createScoreArea(match, isDemo, message) {
  const scoreArea = document.createElement("div");
  scoreArea.className = "score-area";
  const badge = document.createElement("span");
  badge.className = isDemo ? "live-badge demo-badge" : "live-badge";
  badge.textContent = isDemo ? "DEMO" : "LIVE";
  const score = document.createElement("h1");
  score.id = "main-score";
  score.textContent = `${match.goals.home} - ${match.goals.away}`;
  const time = document.createElement("p");
  time.className = "match-time";
  time.textContent = `${match.fixture.status.elapsed}'`;
  scoreArea.append(badge, score, time);
  if (isDemo) {
    const note = document.createElement("small");
    note.className = "demo-note";
    note.textContent = message;
    scoreArea.append(note);
  }
  return scoreArea;
}

function createMatchCard(match) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.append(createMiniTeam(match.teams.home), createMiniScore(match), createMiniTeam(match.teams.away, true));
  return card;
}

function createMiniTeam(team, isAway = false) {
  const teamElement = document.createElement("div");
  teamElement.className = "team-mini";
  if (isAway) teamElement.style.justifyContent = "flex-end";
  const logo = document.createElement("img");
  logo.src = team.logo;
  logo.alt = `${team.name} logo`;
  logo.width = 30;
  const name = document.createElement("span");
  name.textContent = team.name;
  teamElement.append(...(isAway ? [name, logo] : [logo, name]));
  return teamElement;
}

function createMiniScore(match) {
  const score = document.createElement("div");
  score.className = "score-mini";
  const scoreValue = document.createElement("strong");
  scoreValue.textContent = `${match.goals.home} - ${match.goals.away}`;
  const time = document.createElement("small");
  time.style.cssText = "display: block; color: #a259ff;";
  time.textContent = `${match.fixture.status.elapsed}'`;
  score.append(scoreValue, time);
  return score;
}

fetchLiveScores();
setInterval(fetchLiveScores, REFRESH_INTERVAL_MS);

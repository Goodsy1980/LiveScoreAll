// 1. ตั้งค่าการเชื่อมต่อ
const API_KEY = "88050c2f45fd54a5491db660aac5ebb4";
const BASE_URL = "https://v3.football.api-sports.io/fixtures?live=all";

const requestOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-apisports-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
};

// 2. ฟังก์ชันหลักในการดึงข้อมูล
async function fetchLiveScores() {
  try {
    console.log("กำลังอัปเดตข้อมูลทุกลีก...");
    const response = await fetch(BASE_URL, requestOptions);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.response && data.response.length > 0) {
      updateUI(data.response);
    } else {
      console.log("ตอนนี้ไม่มีการแข่งขันสด");
      const heroSection = document.getElementById("hero-match-container");
      if (heroSection) {
        const message = document.createElement("h1");
        message.style.cssText = "text-align: center; padding: 20px;";
        message.textContent = "No Live Matches Available";
        heroSection.replaceChildren(message);
      }
    }
  } catch (error) {
    console.error("ดึงข้อมูลพลาด:", error);
  }
}

// 3. ฟังก์ชันอัปเดตหน้าจอ (แก้ไขให้ตรงกับ CSS/HTML ล่าสุด)
function updateUI(matches) {
  // --- ส่วนคู่เด่น (Hero Match) ---
  const topMatch = matches[0];
  // แก้เป็นดึง ID hero-match-container ให้ตรงกับ HTML
  const heroSection = document.getElementById("hero-match-container");

  if (topMatch && heroSection) {
    const matchDetails = document.createElement("div");
    matchDetails.className = "match-details";
    matchDetails.append(
      createTeam(topMatch.teams.home, "team", 100),
      createScoreArea(topMatch),
      createTeam(topMatch.teams.away, "team", 100),
    );
    heroSection.replaceChildren(matchDetails);
  }

  // --- ส่วนคู่อื่นๆ (Matches Grid) ---
  const grid = document.getElementById("live-matches-container");
  if (grid) {
    grid.replaceChildren();
    // ถ้ามีมากกว่า 1 คู่ ให้วนลูปคู่ที่เหลือ
    matches.slice(1).forEach((match) => {
      grid.append(createMatchCard(match));
    });
  }
}

// 4. เปิดใช้งาน (ลบคอมเมนต์ออก)
fetchLiveScores();
setInterval(fetchLiveScores, 120000); // อัปเดตทุก 2 นาที

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

function createScoreArea(match) {
  const scoreArea = document.createElement("div");
  scoreArea.className = "score-area";

  const liveBadge = document.createElement("span");
  liveBadge.className = "live-badge";
  liveBadge.textContent = "LIVE";

  const score = document.createElement("h1");
  score.id = "main-score";
  score.textContent = `${match.goals.home} - ${match.goals.away}`;

  const time = document.createElement("p");
  time.className = "match-time";
  time.textContent = `${match.fixture.status.elapsed}'`;

  scoreArea.append(liveBadge, score, time);
  return scoreArea;
}

function createMatchCard(match) {
  const card = document.createElement("div");
  card.className = "match-card";

  const home = createMiniTeam(match.teams.home);
  const score = document.createElement("div");
  score.className = "score-mini";
  const scoreValue = document.createElement("strong");
  scoreValue.textContent = `${match.goals.home} - ${match.goals.away}`;
  const time = document.createElement("small");
  time.style.cssText = "display: block; color: #a259ff;";
  time.textContent = `${match.fixture.status.elapsed}'`;
  score.append(scoreValue, time);

  const away = createMiniTeam(match.teams.away, true);
  card.append(home, score, away);
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

// 1. ข้อมูลจำลอง (Mock Data) สำหรับตกแต่ง UI
// const mockData = [
//   {
//     teams: {
//       home: {
//         name: "Barcelona",
//         logo: "https://media.api-sports.io/football/teams/529.png",
//       },
//       away: {
//         name: "Real Madrid",
//         logo: "https://media.api-sports.io/football/teams/541.png",
//       },
//     },
//     goals: { home: 2, away: 3 },
//     fixture: { status: { elapsed: 78 } },
//   },
//   {
//     teams: {
//       home: {
//         name: "Man United",
//         logo: "https://media.api-sports.io/football/teams/33.png",
//       },
//       away: {
//         name: "Liverpool",
//         logo: "https://media.api-sports.io/football/teams/40.png",
//       },
//     },
//     goals: { home: 1, away: 1 },
//     fixture: { status: { elapsed: 45 } },
//   },
//   {
//     teams: {
//       home: {
//         name: "Man City",
//         logo: "https://media.api-sports.io/football/teams/50.png",
//       },
//       away: {
//         name: "Arsenal",
//         logo: "https://media.api-sports.io/football/teams/42.png",
//       },
//     },
//     goals: { home: 0, away: 2 },
//     fixture: { status: { elapsed: 15 } },
//   },
//   {
//     teams: {
//       home: {
//         name: "Bayern Munich",
//         logo: "https://media.api-sports.io/football/teams/157.png",
//       },
//       away: {
//         name: "Dortmund",
//         logo: "https://media.api-sports.io/football/teams/165.png",
//       },
//     },
//     goals: { home: 4, away: 0 },
//     fixture: { status: { elapsed: 89 } },
//   },
// ];

// // 2. ฟังก์ชันดึงข้อมูล (เปลี่ยนเป็นใช้ Mock Data ชั่วคราว)
// async function fetchLiveScores() {
//   console.log("กำลังแสดงผลด้วย Mock Data...");

//   // เรียกใช้ข้อมูลปลอมแทนการ fetch จริง
//   updateUI(mockData);
// }

// // -------------------------------------------------------
// // ส่วนของ updateUI (ใช้โค้ดเดิมของคุณได้เลย แต่ผมปรับแต่งจุดเล็กน้อยให้เป๊ะขึ้น)
// function updateUI(matches) {
//   const topMatch = matches[0];
//   const heroSection = document.getElementById("hero-match-container");

//   if (topMatch && heroSection) {
//     heroSection.innerHTML = `
//             <div class="match-details">
//                 <div class="team">
//                     <img src="${topMatch.teams.home.logo}" alt="home-logo" width="100">
//                     <p>${topMatch.teams.home.name}</p>
//                 </div>
//                 <div class="score-area">
//                     <span class="live-badge">LIVE</span>
//                     <h1 id="main-score">${topMatch.goals.home} - ${topMatch.goals.away}</h1>
//                     <p>${topMatch.fixture.status.elapsed}'</p>
//                 </div>
//                 <div class="team">
//                     <img src="${topMatch.teams.away.logo}" alt="away-logo" width="100">
//                     <p>${topMatch.teams.away.name}</p>
//                 </div>
//             </div>
//         `;
//   }

//   const grid = document.getElementById("live-matches-container");
//   if (grid) {
//     grid.innerHTML = "";
//     matches.slice(1).forEach((match) => {
//       const card = `
//                 <div class="match-card">
//                     <div class="team-mini">
//                         <img src="${match.teams.home.logo}" width="30">
//                         <span>${match.teams.home.name}</span>
//                     </div>
//       <div class="score-mini">
//                         <strong>${match.goals.home} - ${match.goals.away}</strong>
//                         <small style="display:block; font-size:10px; color:#ff4b2b;">${match.fixture.status.elapsed}'</small>
//                     </div>
//                     <div class="team-mini">
//                         <span>${match.teams.away.name}</span>
//                         <img src="${match.teams.away.logo}" width="30">
//                     </div>
//                 </div>
//             `;
//       grid.innerHTML += card;
//     });
//   }
// }

// // เรียกทำงานทันทีเพื่อดูผล
// fetchLiveScores();

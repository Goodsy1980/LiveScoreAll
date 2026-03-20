// 1. ตั้งค่าการเชื่อมต่อ
const API_KEY = "88050c2f45fd54a5491db660aac5ebb4";
const BASE_URL = " https://v3.football.api-sports.io/fixtures?live=all";

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
    console.log("กำลังอัปเดตข้อมูลพรีเมียร์ลีก...");
    const response = await fetch(BASE_URL, requestOptions);
    const data = await response.json();

    if (data.response && data.response.length > 0) {
      updateUI(data.response);
    } else {
      console.log("ตอนนี้ไม่มีคู่พรีเมียร์ลีกเตะสด");
      const heroSection = document.getElementById("hero-match-container");
      if (heroSection) {
        heroSection.innerHTML = `<h1 style="text-align:center; padding: 20px;">No Premier League Live</h1>`;
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
    heroSection.innerHTML = `
            <div class="match-details">
                <div class="team">
                    <img src="${topMatch.teams.home.logo}" alt="logo" width="100">
                    <p>${topMatch.teams.home.name}</p>
                </div>
                <div class="score-area">
                    <span class="live-badge">LIVE</span> <h1 id="main-score">${topMatch.goals.home} - ${topMatch.goals.away}</h1>
                    <p class="match-time">${topMatch.fixture.status.elapsed}'</p>
                </div>
                <div class="team">
                    <img src="${topMatch.teams.away.logo}" alt="logo" width="100">
                    <p>${topMatch.teams.away.name}</p>
                </div>
            </div>
        `;
  }

  // --- ส่วนคู่อื่นๆ (Matches Grid) ---
  const grid = document.getElementById("live-matches-container");
  if (grid) {
    grid.innerHTML = "";
    // ถ้ามีมากกว่า 1 คู่ ให้วนลูปคู่ที่เหลือ
    matches.slice(1).forEach((match) => {
      const card = `
                <div class="match-card">
                    <div class="team-mini">
                        <img src="${match.teams.home.logo}" width="30">
                        <span>${match.teams.home.name}</span>
                    </div>
                    <div class="score-mini">
                        <strong>${match.goals.home} - ${match.goals.away}</strong>
                        <small style="display:block; color:#a259ff;">${match.fixture.status.elapsed}'</small>
                    </div>
                    <div class="team-mini" style="justify-content: flex-end;">
                        <span>${match.teams.away.name}</span>
                        <img src="${match.teams.away.logo}" width="30">
                    </div>
                </div>
            `;
      grid.innerHTML += card;
    });
  }
}

// 4. เปิดใช้งาน (ลบคอมเมนต์ออก)
fetchLiveScores();
setInterval(fetchLiveScores, 120000); // อัปเดตทุก 1 นาที

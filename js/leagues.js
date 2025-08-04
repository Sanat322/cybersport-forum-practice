'use strict'
const liveMatchContainer = document.querySelector("[data-live-matches]");
const proTeams = ["Team Spirit", "Gaimin Gladiators", "Team Liquid",
    "Tundra Esports", "BB Team", "Xtreme Gaming", "Nigma Galaxy", "Team Falcons", "PVISION", "Aurora Gaming", "BOOM Esports", "Team Tidebound", "HEROIC", "Team Nemesis", "NAVI Junior", "OG", "LGD Gaming", "Team Secret"];
const matchModalBlock = document.querySelector("[data-match-modal-container]");
const matchDetailsContainer = document.querySelector("[data-match-details]");
const matchModalCloseBtn = document.querySelector("[data-match-details-close-btn]");
let cachedLiveMatches = [];
const getLiveTournaments = async () => {
    try {
        const response = await fetch("https://api.opendota.com/api/live");
        const liveMatches = await response.json();
        cachedLiveMatches = liveMatches;
        
        const proTeamNames = await getProTeams();

        const proLiveMatches = cachedLiveMatches.filter(match =>
            proTeamNames.includes(match.team_name_radiant) ||
            proTeamNames.includes(match.team_name_dire)
        );
        for (const proMatch of proLiveMatches) {
            const matchId = proMatch.match_id;
            const radiantTeam = proMatch.team_name_radiant;
            const direTeam = proMatch.team_name_dire;
            const leagueid = proMatch.league_id;

            const liveLeagueName = await getLeagueName(leagueid);
            const direScore = proMatch.dire_score;
            const radiantScore = proMatch.radiant_score;
            const matchCard = document.createElement("div");
            matchCard.classList.add("match-card");
            const radiantLogo = `./team-logos/${radiantTeam.replace(/\s+/g, "_")}.png`;
            const direLogo = `./team-logos/${direTeam.replace(/\s+/g, "_")}.png`;
            matchCard.innerHTML = `
            <h2 data-match-link>${liveLeagueName}</h2>
            <div class = "match-card-block" data-match-link>
                <div class ="radiant-team">
                    <img class = "match-card-team-image" src = "${radiantLogo}" width = 50 height = 50 / onerror="this.onerror=null;this.src='./team-logos/Dota-2-Logo.png';">
                    <p class = "match-card-team-title">${radiantTeam}</p>
                </div>
                <span>${radiantScore} - ${direScore}</span>
                <div class ="dire-team">
                    <img class = "match-card-team-image" src = "${direLogo}" / onerror="this.onerror=null;this.src='./team-logos/Dota-2-Logo.png';">
                    <p class = "match-card-team-title">${direTeam}</p>
                </div>
            </div> 
            `
            matchCard.querySelectorAll("[data-match-link]").forEach(el => {
                el.addEventListener("click", () => showMatchDetails(matchId));
            });
            liveMatchContainer.appendChild(matchCard);
        }
    }
    catch (error) {
        console.error("поймана ошибка", error.message)
    }
}

const getLeagueName = async (leagueId) => {
    const res = await fetch(`https://api.opendota.com/api/leagues/${leagueId}`);
    const data = await res.json();
    const leagueName = data.name;
    return leagueName || "Unknown tournament";
}

const liveUpdates = () => {
    getLiveTournaments();
    setInterval(() => {
        liveMatchContainer.innerHTML = "";
        getLiveTournaments();
    }, 600000);
};

const showMatchDetails = async (match_id) => {
    const matchRes = await fetch(`https://api.opendota.com/api/live`);
    cachedLiveMatches = await matchRes.json();

    const match = cachedLiveMatches.find(m => m.match_id === match_id);
    if (!match) return;

    matchDetailsContainer.innerHTML = "";

    const { heroes, items } = await getHeroesAndItems();
    const heroesMap = {};
    const itemsMap = {};
    heroes.forEach(hero => {
        heroesMap[hero.id] = hero.name.replace("npc_dota_hero_", "");
    });
    items.forEach(item => {
        itemsMap[item.id] = item.name.replace("item_", "").toLowerCase();
    });



    const liveMatchDetails = document.createElement("div");
    liveMatchDetails.classList.add("live-match-details");
    liveMatchDetails.innerHTML = `
       <table class = "match-table">
            <thead>
                <tr>
                    <th>Hero</th>
                    <th>Player</th>
                    <th>Info</th>
                    <th>Items</th>
                    <th>K/D/A</th>
                    <th>Net</th>
                    <th>LH/DN</th>
                    <th>GPM</th>
                    <th>XPM</th>
                    <th>Dmg</th>
                    <th>Heal</th>
                    <th>Tower</th>
                </tr>
            </thead>
            <tbody class ="modal-team-radiant">
            </tbody>
        </table>    
        <table class = "match-table">
            <thead>
                <tr>
                    <th>Hero</th>
                    <th>Player</th>
                    <th>Info</th>
                    <th>Items</th>
                    <th>K/D/A</th>
                    <th>Net</th>
                    <th>LH/DN</th>
                    <th>GPM</th>
                    <th>XPM</th>
                    <th>Dmg</th>
                    <th>Heal</th>
                    <th>Tower</th>
                </tr>
            </thead>
            <tbody class ="modal-team-dire">
            </tbody>
        </table>    
    `;

    const radiantTeamContainer = liveMatchDetails.querySelector(".modal-team-radiant");
    const direTeamContainer = liveMatchDetails.querySelector(".modal-team-dire");
    console.log("Игроки матча:", match.players);
    console.log(match_id)
    const searchedMatch = await fetch(`https://api.opendota.com/api/matches/${match_id}`);
    const searchedMatchData = await searchedMatch.json();
    searchedMatchData.players.forEach(player => {
        const heroId = player.hero_id;
        const heroName = heroesMap[heroId];
        const heroImagePath = `./heroes-images/${heroName}_icon.webp`;
        const itemImages = [player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5]
            .map(id => {
                const itemName = itemsMap[id];
                if (!itemName) return "";
                return `<img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${itemName}_lg.png" width="20">`;
            }).join("");

        const playerRow = document.createElement("tr");
        playerRow.classList.add("modal-player-row");

        playerRow.innerHTML = `
                        <td><img src="${heroImagePath}" width="50" height="30"></td>
                        <td>${player.name || player.personaname}</td>
                        <td>${player.level} ${heroName}</td>
                        <td>${itemImages}</td>
                        <td>${player.kills}/${player.deaths}/${player.assists}</td>
                        <td>${player.net_worth}</td>
                        <td>${player.last_hits}/${player.denies}</td>
                        <td>${player.gold_per_min}</td>
                        <td>${player.xp_per_min}</td>
                        <td>${player.hero_damage}</td>
                        <td>${player.hero_healing}</td>
                        <td>${player.tower_damage}</td>
        `;
        if (player.player_slot < 128) {
            radiantTeamContainer.appendChild(playerRow);
        } else {
            direTeamContainer.appendChild(playerRow);
        }
    });
    matchModalBlock.hidden = false;
    matchDetailsContainer.appendChild(liveMatchDetails);
};
matchModalCloseBtn.onclick = () => matchModalBlock.hidden = true;
window.onclick = (e) => {
    if (e.target === matchModalBlock) {
        matchModalBlock.hidden = true;
    }
}


const getHeroesAndItems = async () => {
    const [heroes, items] = await Promise.all([
        fetch("js/heroes-cleaned.json").then(r => r.json()),
        fetch("js/items-id.json").then(r => r.json())
    ])
    return { heroes, items };
}

const getProTeams = async () => {
    const res = await fetch(`https://api.opendota.com/api/proMatches`);
    const matchData = await res.json();
    const teamNames = new Set();
    matchData.forEach(match => {
        if (match.radiant_name) teamNames.add(match.radiant_name)
        if (match.dire_name) teamNames.add(match.dire_name)
    })
    return Array.from(teamNames);
}

liveUpdates();
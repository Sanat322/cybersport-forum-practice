'use strict'

const params = new URLSearchParams(window.location.search);
const teamName = params.get('name');
const modal = document.querySelector(".match-modal");
const closeBtn = document.querySelector(".modal-content-close");
const getTeamInfo = async () => {
    const [teams, players] = await Promise.all([
        fetch('https://api.opendota.com/api/teams').then(r => r.json()),
        fetch('js/proPlayers-cleaned.json').then(r => r.json()),
    ]);
    return { teams, players };
}

const renderTeam = (team, container) => {
    const logoUrl = `team-logos/${team.name.replace(/\s+/g, "_").toLowerCase()}.png`;
    const winrate = (team.wins / (team.wins + team.losses)) * 100;
    container.innerHTML = `
    <div class = "team-page">
        <div class = "team-page-bg">
            <div class = "team-info-block">
                <img src = "${logoUrl}" width = 180 height = 200 />
                <h2>
                    <span>${team.name}</span>
                </h2>
            </div>
            <div class = "team-table">
                <table>
                    <tbody>
                        <tr>
                            <th>All time rating:</th>
                            <td> ${team.rating}</td>
                        </tr>
                        <tr>
                            <th>Win/Lose:</th>
                            <td> ${team.wins}/${team.losses}</td>
                        </tr>
                        <tr>
                            <th>Winrate:</th>
                            <td>${winrate.toFixed(1)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>    
    `
}

const renderPlayers = (players, container) => {

    const playersList = players.filter(p => p.team_name === teamName);
    playersList.forEach(player => {
        const playerCard = document.createElement("div");
        const playerProfileImage = `player-avatars/${player.name}.png`;
        playerCard.classList.add("player-info");

        playerCard.innerHTML = `
            <div class = "player-profile">
                <img src = ${playerProfileImage} width = 172 height = 205 />
            </div>
            <div class = "player-profile-info">
                <table>
                <tbody>
                    <tr>
                        <th>PLAYER: </th>
                        <td>${player.name}</td>
                    </tr>
                    <tr>
                        <th>POSITION: </th>
                        <td>${player.position}</td>
                    </tr>
                    <tr>
                        <th>COUNTRY: </th>
                        <td>${player.country_code}</td>
                    </tr>
                    <tr>
                        <th>LAST MATCH: </th>
                        <td>${player.last_match_time.slice(0, 10)}</td>
                    </tr>
                    <tr>
                        <td>${player.team_tag}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        `
        container.appendChild(playerCard);
    })
}
const renderTeamMatches = async (teamName, id, container) => {
    const matchRes = await fetch(`https://api.opendota.com/api/teams/${id}/matches`);
    const matchData = await matchRes.json();
    matchData.slice(0, 10).forEach(match => {
        const {
            match_id,
            radiant_win,
            radiant,
            radiant_score,
            dire_score,
            duration,
            start_time,
            league_name,
            opposing_team_name,
        } = match;
        const teamWin = (radiant && radiant_win) || (!radiant && !radiant_win);
        const matchDate = new Date(start_time * 1000).toLocaleDateString();
        let teamScore, oponentScore;
        if (radiant) {
            teamScore = radiant_score;
            oponentScore = dire_score;
        }
        else {
            teamScore = dire_score;
            oponentScore = radiant_score;
        }
        const matchDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`;
        const matchWrapper = document.createElement("div");
        matchWrapper.classList.add("match-wrapper");

        matchWrapper.innerHTML = `
        <div class = "match-card" data-match-id="${match_id}">
            <div class = "match-card-header">
                ${teamWin ? "Victory" : "Defeat"} — ${league_name} (${matchDate})
            </div>
            <div class = "match-card-body ${teamWin ? "win" : "lose"}">
                <div class = "match-card-info">
                    <div class = "match-cad-result">
                        <p class = "team">${teamName}</p> <p>${teamScore} - ${oponentScore}</p> <p class = "opposing-team">${opposing_team_name}</p>
                    </div>
                    <p>Duration: ${matchDuration}</p>
                </div>
            </div>
        </div>

        `
        container.appendChild(matchWrapper);

        const card = matchWrapper.querySelector(".match-card");
        card.addEventListener("click", async () => {
            const matchId = card.dataset.matchId;
            const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`);
            const matchData = await res.json();
            showMatchModal(matchData);
        })
    })

}

const showMatchModal = async (matchData) => {
    const modalBody = document.querySelector("[data-modal-body]");
    const { heroes, items } = await loadPlayerMatchData();
    const heroesMap = {};
    const itemsMap = {};
    heroes.forEach(hero => {
        heroesMap[hero.id] = hero.name.replace("npc_dota_hero_", "");
    })
    items.forEach(item => {
        itemsMap[item.id] = item.name.replace("item_", "").toLowerCase();
    })
    const {
        radiant_score,
        dire_score,
        radiant_name,
        dire_name,
        duration,
        start_time,
        radiant_win,

    } = matchData;

    const winner = radiant_win ? radiant_name || "Radiant" : dire_name || "Dire";
    const matchTime = new Date(start_time * 1000).toLocaleDateString();
    const matchDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`;
    
    modalBody.innerHTML = "";
    modalBody.innerHTML = `
    <span>${winner}🏆</span>
    <span>${matchDuration}</span>
    <h3>${radiant_name}-${radiant_score}</h3>
    <table class="team-table">
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
        <tbody class="radiant-team"></tbody>
    </table>

    <h3 style = "color: #a1303a">${dire_name}-${dire_score}</h3>
    <table class="team-table">
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
        <tbody class="dire-team"></tbody>
    </table>
        `
    const radiantTeamContainer = document.querySelector(".radiant-team");
    const direTeamContainer = document.querySelector(".dire-team");


    matchData.players.forEach(player => {
        const heroId = player.hero_id;
        const kills = player.kills;
        const playerName = player.name;
        const deaths = player.deaths;
        const assists = player.assists;
        const slot = player.player_slot;
        const netWorth = player.net_worth;
        const lh = player.last_hits;
        const dn = player.denies;
        const goldPerMin = player.gold_per_min;
        const xpPerMin = player.xp_per_min;
        const heroDamage = player.hero_damage;
        const towerDamage = player.tower_damage;
        const heroHealing = player.hero_healing;
        const level = player.level;
        const lane = player.lane;
        const isRoaming = player.is_roaming;
        let role = "Unknown";
        if (lane === 1) role = "Safe lane";
        else if (lane === 2) role = "Mid";
        else if (lane === 3) role = "Offlane";
        else if (isRoaming) role = "Roamer";
        const itemsList = [
            player.item_0, player.item_1, player.item_2,
            player.item_3, player.item_4, player.item_5
        ];
        const playerRow = document.createElement("tr");
        playerRow.classList.add("match-player");
        const itemImagesHTML = itemsList
            .map(id => {
                const itemName = itemsMap[id];

                if (!itemName) return '';

                return `<img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${itemName}_lg.png" alt="${itemName}" width="20">`;

            })
            .join("");

        const heroName = heroesMap[heroId];
        console.log(player)
        const heroImagePath = `./heroes-images/${heroName}_icon.webp`;
        playerRow.innerHTML = `
        <td><img src="${heroImagePath}" width="50"></td>
        <td>${playerName}</td>
        <td>${level} ${heroName}, ${role}</td>
        <td>${itemImagesHTML}</td>
        <td>${kills}/${deaths}/${assists}</td>
        <td>${netWorth}</td>
        <td>${lh}/${dn}</td>
        <td>${goldPerMin}</td>
        <td>${xpPerMin}</td>
        <td>${heroDamage}</td>
        <td>${heroHealing}</td>
        <td>${towerDamage}</td>
        `
        if (slot < 128) {
            radiantTeamContainer.appendChild(playerRow);
        }
        else {
            direTeamContainer.appendChild(playerRow);
        }

    })
    document.querySelector(".match-modal").hidden = false;

}
closeBtn.onclick = () => modal.hidden = true;

window.onclick = (e) => {
    if (e.target === modal) modal.hidden = true;
};


async function loadPlayerMatchData() {
    const [heroes, items] = await Promise.all([
        fetch('js/heroes-cleaned.json').then(r => r.json()),
        fetch('js/items-id.json').then(r => r.json())
    ]);
    return { heroes, items };
}

const loadTeamPage = async () => {
    try {
        const { teams, players } = await getTeamInfo();
        const team = teams.find(t => t.name === teamName);
        const teamId = team.team_id;
        const container = document.querySelector("[data-team-container]");
        const playersContainer = document.querySelector("[data-players-list]");
        const matchesContainer = document.querySelector("[data-matches-list]")
        renderTeam(team, container);
        renderPlayers(players, playersContainer);
        renderTeamMatches(teamName, teamId, matchesContainer);
    }
    catch (error) {
        console.error("ошибка прогрузки страницы", error.message)
    }
}



loadTeamPage();




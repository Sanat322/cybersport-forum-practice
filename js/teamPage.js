'use strict'

const params = new URLSearchParams(window.location.search);
const teamName = params.get('name');

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
        <div class = "match-card">
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
    })

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




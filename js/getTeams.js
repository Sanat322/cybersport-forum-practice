'use strict'

const TopTeams = ["Team Spirit", "Gaimin Gladiators", "Team Liquid",
    "Tundra Esports", "BB Team", "Xtreme Gaming","Nigma Galaxy", "Team Falcons", "PVISION", "Aurora Gaming", "BOOM Esports", "Team Tidebound", "HEROIC", "Team Nemesis","NAVI Junior"];

const getPopularTeams = async () =>{
    const res  = await fetch("js/proPlayers-cleaned.json");
    const playersData = await res.json();
    const teamsMap = {};
    playersData.forEach(player =>{
        const team = player.team_name;
        if (!team || !TopTeams.includes(team)) return;
        if (!teamsMap[team]){
            teamsMap[team] = [];
        }
        teamsMap[team].push(player);
    })
    renderTeamPlayers(teamsMap);
}
const renderTeamPlayers = (teams) =>{
    const container = document.querySelector("[data-teams-container]");
    container.innerHTML = "";
    Object.entries(teams).forEach(([teamName, players]) =>{
        const teamContainer = document.createElement("div");
        teamContainer.classList.add("team-container");
        const logoPath = teamName.replace(/\s/g,"_");
        teamContainer.innerHTML = `
            <a href ="">
                <p>${teamName}</p>
                <img class ="team-logo" src = "./team-logos/${logoPath}.png" />
                <ul>
                    ${players.slice(0,5).map(player =>`
                        <li>
                            <div class = "team-player-card">
                                <span>${player.name}</span>
                            </div>
                        </li>`).join("")}
                </ul>
            </a>
        `;
        container.appendChild(teamContainer);
    })
}

getPopularTeams();




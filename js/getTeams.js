'use strict'

const TopTeams = ["Team Spirit", "Gaimin Gladiators", "Team Liquid",
    "Tundra Esports", "BetBoom Team", "OG", "Virtus.pro","Nigma Galaxy", "Team Falcons"];

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
    console.log(teamsMap)
}
const renderTeamPlayers = (teams) =>{
    teams.forEach(([teamName, players]) =>{
        const teamContainer = document.createElement("div");
        teamContainer.classList.add("team-container");
        const logoPath = team.team_name.replace(" ","_");
        teamContainer.innerHTML = `
        <img src = "./team-logos/${logoPath}.png" width = 100 />
        `
    })
}

getPopularTeams();




'use strict'
const liveMatchContainer = document.querySelector("[data-live-matches]");
const proTeams = ["Team Spirit", "Gaimin Gladiators", "Team Liquid",
    "Tundra Esports", "BB Team", "Xtreme Gaming", "Nigma Galaxy", "Team Falcons", "PVISION", "Aurora Gaming", "BOOM Esports", "Team Tidebound", "HEROIC", "Team Nemesis", "NAVI Junior", "OG", "LGD Gaming", "Team Secret"];

const getLiveTournaments = async () => {
    try {
        const response = await fetch("https://api.opendota.com/api/live");
        const liveMatches = await response.json();
        const proMatches = liveMatches.filter(match =>
            proTeams.includes(match.team_name_radiant) ||
            proTeams.includes(match.team_name_dire)
        )
        .slice(0, 3);

        proMatches.forEach(proMatch => {
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
            matchCard.innerHTML =`
            <div class ="radiant-team">
                <img src = "${radiantLogo}" width = 40 / onerror="this.onerror=null;this.src='./team-logos/Dota-2-Logo.png';">
                <p>${radiantTeam}</p>
            </div>
            <span>${radiantScore} - ${direScore}</span>
            <div class ="dire-team">
                <img src = "${direLogo}" width = 40 / onerror="this.onerror=null;this.src='./team-logos/Dota-2-Logo.png';">
                <p>${direTeam}</p>
            </div>
            `
            liveMatchContainer.appendChild(matchCard);
        });
        
    }
    catch (error) {
        console.error("поймана ошибка", error.message)
    }
}

const getLeagueName = async (leagueId) =>{
    const res = await fetch(`https://api.opendota.com/api/leagues/${leagueId}`);
    const data = await res.json();
    const leagueName = data.league_name;
    return leagueName;
} 


getLiveTournaments();
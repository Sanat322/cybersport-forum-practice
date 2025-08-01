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
        for (const proMatch of proMatches) {
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
            <h2>${liveLeagueName}</h2>
            <div class = "match-card-block">
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
    }, 120000);
};

const getMatchDetails = async (match_id) => {
    const matchRes = await fetch(`https://api.opendota.com/api/live`);
    const dataMatch = await matchRes.json();

    const matchDetailsContainer = document.querySelector("[data-match-details]");

    const liveMatchDetails = document.createElement("div");
    liveMatchDetails.classList.add("live-match-details");
    const currentLeagueId = dataMatch.league_id;
    const currentLeagueName = await getLeagueName(currentLeagueId);
    liveMatchDetails.innerHTML = `
        <h2>${currentLeagueName}</h2>
        <div class = "modal-team-radiant"></div>
        <div class = "modal-team-dire"></div>
        `
        const {
            team_radiant_name
        } = dataMatch;

    const playersList = dataMatch.players;
    playersList.forEach(player => {
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

        const radiantTeamContainer = document.querySelector(".modal-team-radiant");
        const direTeamContainer = document.querySelector(".modal-dire-container");
        // const heroImageUrl = `./heroes-images/${}`;
        const playerRow = document.createElement("div");
        playerRow.classList.add("modal-player-row");
        playerRow.innerHTML = `
        
        `
    })

}
const getHeroesAndItems = async () => {
    const [heroes, items] = await Promise.all([
        fetch("heroes-clened.json").then(r => r.json()),
        fetch("items-id").then(r => r.json())
    ])
    return { heroes, items };
}
// const getPlayers = async () =>{
//     const playerRes = fetch(``)
// }
liveUpdates();
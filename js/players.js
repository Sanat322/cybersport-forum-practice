'use strict'
const TopTeams = ["Team Spirit", "Gaimin Gladiators", "Team Liquid",
    "Tundra Esports", "BB Team", "Xtreme Gaming", "Nigma Galaxy", "Team Falcons", "PVISION", "Aurora Gaming", "BOOM Esports", "Team Tidebound", "HEROIC", "Team Nemesis", "NAVI Junior", "OG", "LGD Gaming", "Team Secret"];

async function loadTeams() {
    const res = await fetch("https://api.opendota.com/api/teams");
    const teams = await res.json();
    const popularTeams = teams
    .filter(t => TopTeams.includes(t.name))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    const tbody = document.querySelector("#tBody");
    console.log(popularTeams);
    tbody.innerHTML = popularTeams
        .filter(team => team.name)
        .map(team => {
            const teamLogo = `./team-logos/${team.name.replace(/\s/g, "_").toLowerCase()}.png`;
           return`
            <tr>
        <td><img src="${teamLogo}" width="50" height="40"></td>
        <td><a href = "teamPage.html?name=${encodeURIComponent(team.name)}">${team.name}</a></td>
        <td>${team.wins}</td>
        <td>${team.losses}</td>
        <td>${team.rating?.toFixed(1) ?? "—"}</td>
      </tr>
            `}).join("")
        ;

}

loadTeams();
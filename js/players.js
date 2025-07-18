'use strict'

const teamLogos = {
    7119388: "./team-logos/Team_Spirit_Logotype.png",
    2163: "./team-logos/team-liquid-logo-png_seeklogo-528696.png",
    7554697: "./team-logos/Nigma_Galaxy_(лого).png",
    9572001: "./team-logos/parivision-logo-png_seeklogo-612976.png",
    8255888: "./team-logos/BetBoom_Team_(2024).png",
    7412785: "./team-logos/cyberbonch.png",
    8254145: "./team-logos/execration.png",
    6209166: "./team-logos/aster.png",
    2108395: "./team-logos/tnc-pro-team-logo-png_seeklogo-431276.png",
    8546012: "./team-logos/Dota-2-Logo.png",
    8849833: "./team-logos/Dota-2-Logo.png",
    8893825: "./team-logos/Dota-2-Logo.png",
    1375614: "./team-logos/NewBee_logo_notext.png",
    4: "./team-logos/Dota-2-Logo.png",
    8686786: "./team-logos/Dota-2-Logo.png",
    1838315: "./team-logos/Team_Secret_logo_notext.png",
    2586976: "./team-logos/OGLogo.png",
    111474: "./team-logos/the-alliance-logo-png_seeklogo-340194.png",
    36: "./team-logos/Natus_Vincere_logo.png",
    1883502: "./team-logos/Virtus.proLogo.png",
    726228:"./team-logos/Vici_Gaming_logo_notext.png",
    39: "./team-logos/Shopify_Rebellion_logo.png",
    5: "./team-logos/Invictus_Gaming_logo.png",
    15: "./team-logos/LGD_Gaming_Logo.png"
}


async function loadTeams() {
    const res = await fetch("https://api.opendota.com/api/teams");
    const teams = await res.json();
    const popularTeams = teams
        .filter(team => team.name)
        .sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses))
        .slice(0, 20);
    const tbody = document.querySelector("#tBody");
    tbody.innerHTML = popularTeams
        .filter(team => team.name)
        .map(team => `
            <tr>
        <td><img src="${teamLogos[team.team_id] || team.logo_url || 'img/teams/default.png'}" width="50" height="40"></td>
        <td>${team.name}</td>
        <td>${team.wins}</td>
        <td>${team.losses}</td>
        <td>${team.rating?.toFixed(1) ?? "—"}</td>
      </tr>
            `).join("")
        ;

}

loadTeams();
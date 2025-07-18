'use strict'
const leaguesInfoContainer = document.querySelector("[data-league-info]");
const selectedLeagueTier = document.querySelector("#tier-filter");
const countLeagueSelected = document.querySelector("#league-count");
const leagueIds = new Set();
const customBanners = {
    18043: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGigbtEqtXcMEoI1JNiG0IlGgmCEuw38GtTjQHw47_ZG6jEkhoCdjYcSDP1E6pksFhBiw&usqp=CAU",
    17233: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgORk4jKFguSqMH4YxnrXWz9t_Udro2e89vw&s",
    17211: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpNvOFHRjfqWDHhpH0OZAsl9s6-1wwjWmvMQ&s",
    17366: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfDJuPitnfcefdJYRB74sfNtjjFD328O9LNQ&s",
    18331: "https://escharts.com/metaImage/tournaments/lunar-snake-trophy-2?social=twitter&v=1752258422"
}
const getActiveTournaments = async () => {
    try {
        const response = await fetch("https://api.opendota.com/api/proMatches");
        const matches = await response.json();
        matches.forEach((match) => {
            if (match.leagueid) {
                leagueIds.add(match.leagueid)
            }
        });
        const leaguesRes = await fetch("https://api.opendota.com/api/leagues");
        const allLeagues = await leaguesRes.json();

        const activeLeagues = allLeagues
            .filter(league => leagueIds.has(league.leagueid))
            .filter(league => league.name && league.tier)
            .slice(0, 5)

        console.log(activeLeagues);
        renderLeagueCard(activeLeagues);
    }
    catch (error) {
        console.error("поймана ошибка", error.message)
    }
}
const renderLeagueCard = (leagues) => {
    leaguesInfoContainer.innerHTML = "";
    leagues
        .filter(league => league.name && league.tier)
        .slice(0, 5)
        .forEach((league) => {
            const bannerUrl = league.banner || customBanners[league.leagueid] || "";
            leaguesInfoContainer.insertAdjacentHTML("beforeend",
                `
            <div class = "league-card" style= "background-image:url(${bannerUrl}); background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  ">
                <h2>${league.name}</h2>
                <p class="league-card-tier">🔴 Активный турнир, tier ${league.tier}</p>
                
            </div>
            `
            )
            console.log(league.name && league.leagueid);
        }

        )

}


getActiveTournaments();
'use strict'
const leaguesInfoContainer = document.querySelector("[data-league-info]");
const selectedLeagueTier = document.querySelector("#tier-filter");
const countLeagueSelected = document.querySelector("#league-count");
const leagueIds = new Set();
const customBanners = {
    18043: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGigbtEqtXcMEoI1JNiG0IlGgmCEuw38GtTjQHw47_ZG6jEkhoCdjYcSDP1E6pksFhBiw&usqp=CAU",
    17233: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgORk4jKFguSqMH4YxnrXWz9t_Udro2e89vw&s",
    17381: "https://d3dwep9z8m8y9r.cloudfront.net/publications/2023/11/publications-10593/preview/43013/Site_548x400.png",
    17659: "https://escharts.com/metaImage/tournaments/epl-world-series-southeast-asia-season-4?social=twitter&v=1750688718",
    17914: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4JUuyCQr53_r4D0obLSyJ7ps3OGbwxJi2ig&s",
    18409: "https://static-cdn.jtvnw.net/jtv_user_pictures/e3ac9e3a-1e47-4e8b-a3ad-5519edcb1930-profile_banner-480.png",
    18433: "https://static.gosugamers.net/1c/39/fe/badc284597f4143143e79f6970db581645eca94796460b572ea86b2c98.webp"
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
                <p class="league-card-tier">🔴 Активный турнир, tier ${league.tier}</p>
                
            </div>
            `
            )
            // console.log(league.name && league.leagueid);
        }

        )

}


getActiveTournaments();
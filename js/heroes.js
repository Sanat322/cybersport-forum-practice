'use strict'
export const getHeroes = async () => {
    try {
        const heroRes = await fetch("js/heroes-cleaned.json");
        const heroData = await heroRes.json();
        console.log("heroData:", heroData);
        heroData.forEach(hero => {
            const heroGroup = document.querySelector(`[data-group ="${hero.primary_attr}"]`);
            if (!heroGroup) return;

            const formatedName = hero.localized_name.replace(/\s+/g, "_");
            const customPath = `heroes-images/${formatedName}_icon.webp`;
            hero.customPath = customPath;
            const heroCard = document.createElement("div");
            heroCard.classList.add("hero-card");

            heroCard.innerHTML =
                `
            <div data-hero-icon>
                <img src = "${customPath}" class = "hero-card-image" alt ="${hero.localized_name}" title ="${hero.localized_name}"">
            </div>
            `;
            heroCard.querySelector("[data-hero-icon]").addEventListener("click", () => {
                showModalHero(hero);
            });

            heroGroup.appendChild(heroCard)
        })
    }
    catch (error) {
        console.error("поймана ошибка при рендеринге", error.message)
    }
}

const showModalHero = (chosenHero) => {
    const heroModalContainer = document.querySelector("[data-hero-modal-container]");
    const heroInfo = document.querySelector("[data-hero-info-container]");

    heroModalContainer.hidden = false;
    heroInfo.innerHTML =
        `
    <div class = "player-card">
        <img class= "player-card-avatar"  src = "${chosenHero.customPath}">
        <div class = "player-card-info">
            <h2>${chosenHero.localized_name}</h2>
            <p>Hero primary attribute: ${chosenHero.primary_attr}</p>
            <p>Hero roles: ${chosenHero.roles.join(', ')}</p>
            <p>Hero attributes: Str: ${chosenHero.base_str}, Agi: ${chosenHero.base_agi}, Int: ${chosenHero.base_int}</p>
            <p>Base health: ${chosenHero.base_health}</p>
            <p>Current health: ${chosenHero.base_str * 22 + chosenHero.base_health}</p>

        </div>
    </div>
    `
}

const setupModalClose = () => {
    document.querySelector("[data-close-hero-modal-btn]").addEventListener("click", () => {
        document.querySelector("[data-hero-modal-container]").hidden = true;
    });
}

setupModalClose();
getHeroes();


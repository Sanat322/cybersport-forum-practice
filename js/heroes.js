'use strict'
export const getHeroes = async () => {
    try {
        const heroRes = await fetch("js/heroes-cleaned.json");
        const heroData = await heroRes.json();
        // console.log("heroData:", heroData);
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
                <a href="heroPage.html?name=${encodeURIComponent(hero.localized_name)}">
                    <div data-hero-icon>
                        <img src = "${customPath}" class = "hero-card-image" alt ="${hero.localized_name}" title ="${hero.localized_name}">
                    </div>
                </a>
            `;
            heroGroup.appendChild(heroCard)
        })
    }
    catch (error) {
        console.error("поймана ошибка при рендеринге", error.message)
    }
}




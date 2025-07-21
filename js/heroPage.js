'use strict'

const params = new URLSearchParams(window.location.search);
const heroName = params.get('name');

const loadHeroPage = async () => {
    try {
        const res = await fetch('js/heroes-cleaned.json');
        const heroes = await res.json();
        const heroContainer = document.querySelector(".hero-details");
        const hero = heroes.find(h => h.localized_name === heroName);
        const heroVideoPreview = hero.name
            .replace("npc_dota_hero_", "")
            + ".webm";
        const renderUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${heroVideoPreview}`
        if (!hero) {
            document.querySelector(".hero-details").innerText = "hero not found!"
            return;
        }
        const heroAttackType = hero.attack_type;
        const meleeAttackIcon = "icons-proect/melee.svg";
        const rangedAttackIcon = "icons-proect/ranged.svg";
        const attackIcon = heroAttackType === "Melee" ? meleeAttackIcon : rangedAttackIcon;
        const attackTypeElement = document.createElement("img");
        attackTypeElement.src = attackIcon;
        attackTypeElement.classList.add("attack-type");
        // иконки атрибутов

        const formatedName = hero.localized_name.replace(/\s+/g, "_");
        const customPath = `heroes-images/${formatedName}_icon.webp`;
        heroContainer.innerHTML =
            `
         <div class = "hero-page">
            <div class = "hero-preview-block">  
                <div class = "hero-title">
                    <h2>${hero.localized_name}</h2>
                    <p id="attackTypeLine">Hero Attack Type: </p>
                </div>
                
                <video autoplay muted loop playsinline class="hero-video">
                    <source src="${renderUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                </video>
            </div>
                
            
                <div class = "hero-characteristics">
                    <div class = "hero-info">
                        <div class = "hero-mini-profile">
                            <div class ="hero-mini-profile-left">
                                <img src = "${customPath}" width = 150 height = 90>
                                <div class = "hero-health">${hero.base_str * 22 + hero.base_health}</div>
                                <div class = "hero-mana">${hero.base_int * 12 + hero.base_mana}</div>
                            </div>
                            <div class = "hero-mini-profile-right">
                                <div class ="hero-attribute"><img src= "icons-proect/attr_str.png" height=25 width = 25 /><p> ${hero.base_str}</p></div>
                                <div class ="hero-attribute"><img src= "icons-proect/attr_agi.png" height=25 width = 25 /><p> ${hero.base_agi}</p></div>
                                <div class ="hero-attribute"><img src= "icons-proect/attr_int.png" height=25 width = 25 /><p> ${hero.base_int}</p></div>
                            </div>
                        </div>
                        <div class = "hero-roles">
                            <h2>ROLES</h2>
                            <span>${hero.roles[0]}</span>
                            <div class = "hero-roles-line"></div>
                            <span>${hero.roles[1]}</span>
                            <div class = "hero-roles-line"></div>
                            <span>${hero.roles[2]}</span>
                            <div class = "hero-roles-line"></div>
                        </div>
                        <div class = "hero-stats">
                            <div class = "hero-stats-attack">
                                <h2>Attack</h2>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_damage.png">${hero.base_attack_min} - ${hero.base_attack_max}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_attack_time.png">${hero.attack_rate}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_attack_range.png">${hero.attack_range}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_projectile_speed.png">${hero.projectile_speed}</p>
                            </div>
                            <div class = "hero-stats-defense">
                                <h2>Defense</h2>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_armor.png">${hero.base_armor}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_magic_resist.png">${hero.base_mr}%</p>
                            </div>
                            <div class = "hero-stats-mobility">
                                <h2>Mobility</h2>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_movement_speed.png">${hero.move_speed}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_turn_rate.png">${hero.turn_rate}</p>
                                <p class = "hero-stats-info"><img src = "icons-proect/icon_vision.png">${hero.day_vision}/${hero.night_vision}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
                ${hero.videoUrl ? `
                <div class="hero-video-wrapper">
                    <iframe 
                        width="400" 
                        height="250" 
                        src="${hero.videoUrl}" 
                        title="Hero video" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>` : ""}
         </div>
         
         `;
        const attackTypeLine = document.querySelector("#attackTypeLine");
        attackTypeLine.append(attackTypeElement);
        //  heroContainer.append(attackTypeElement);
    }
    catch (error) {
        console.error("произошла ошибка в процессе показа карточки героя!", error.message)
    }
}

loadHeroPage();
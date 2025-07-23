'use strict'

const params = new URLSearchParams(window.location.search);
const heroName = params.get('name');

const loadHeroPage = async () => {
    try {
        /* const res = await fetch('js/heroes-cleaned.json');
        const heroes = await res.json(); */
        const [heroes, abilities] = await Promise.all([
            fetch('js/heroes-cleaned.json').then(r => r.json()),
            fetch('js/abilities.json').then(r => r.json())
        ]);
        const heroContainer = document.querySelector(".hero-details");
        const hero = heroes.find(h => h.localized_name === heroName);
        const heroKey = hero.name.replace("npc_dota_hero_", "");
        const heroAbilitiesList = Object.values(abilities).filter(a => a.Name.startsWith(heroKey));
        const abilityContainer = document.createElement("div");
        abilityContainer.classList.add("ability-container")

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
                    <div class="ability-slider">
                        <div class="ability-icons" data-ability-icons></div>
                        <div class="ability-display">
                            <video data-ability-video autoplay muted loop playsinline width="800">
                                <source data-ability-video-source src="" type="video/webm">
                            </video>
                            
                            <div class ="ability-info" data-ability-info>
                                <div class ="ability-info-title">
                                    <img data-ability-info-icon src ="" alt ="Ability Icon" width = 40 height = 40 />
                                    <p><strong></strong><span data-ability-info-name>-</span></p>
                                </div>
                                <p><strong>Mana cost: </strong><span data-ability-info-manacost>-</span></</p>
                                <p><strong>Cooldown: </strong><span data-ability-info-cooldown>-</span></p>
                            </div>
                        </div>
                        
                    </div>
                </div>        
         </div>
         `;
        const attackTypeLine = document.querySelector("#attackTypeLine");
        attackTypeLine.append(attackTypeElement);
        const abilityIconsContainer = document.querySelector("[data-ability-icons]");
        const abilityVideo = document.querySelector("[data-ability-video]");
        let abilityVideoSource = document.querySelector("[data-ability-video-source]");
        const abilityInfoIcon = document.querySelector("[data-ability-info-icon]");
        let abilityInfoName = document.querySelector("[data-ability-info-name]");
        let abilityInfoManaCost = document.querySelector("[data-ability-info-manacost]");
        let abilityInfoManaCooldown = document.querySelector("[data-ability-info-cooldown]");
        heroAbilitiesList.forEach(ability => {
            const abilityId = ability.Name;
            const shortName = abilityId.replace(`${heroKey}_`, "").replace(/_/g, " ");
            const abilityIconUrl = `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/abilities/${abilityId}.png`;
            const abilityVideoUrl = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/${heroKey}/${abilityId}.webm`;

            const abilityButton = document.createElement("img");
            abilityButton.src = abilityIconUrl;
            abilityButton.alt = shortName;
            abilityButton.classList.add("ability-icon-btn");
            abilityButton.title = shortName;

            abilityButton.addEventListener("click", () => {
                abilityVideoSource.src = abilityVideoUrl;
                abilityVideo.load();

                abilityInfoName.textContent = shortName;
                abilityInfoIcon.src = abilityIconUrl;
                abilityInfoManaCost.textContent = ability.Manacost?.join('/') || "—";
                abilityInfoManaCooldown.textContent = ability.Cooldown?.join('/') || "—";
            })

            abilityIconsContainer.appendChild(abilityButton);
            if (abilityIconsContainer.firstChild) {
                abilityIconsContainer.firstChild.click();
            }
        })
    }
    catch (error) {
        console.error("произошла ошибка в процессе показа карточки героя!", error.message)
    }
}

loadHeroPage();
'use strict'
const params = new URLSearchParams(window.location.search);
const itemName = params.get('name');

const loadItem = async () => {
    const res = await fetch("js/items.json");
    const items = await res.json();
    const itemContainer = document.querySelector(".item-container");
    const item = items.find(i => i.name === itemName);
    const itemImgUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${item.tag}_lg.png`;
    

    itemContainer.innerHTML = `
        <div class = "item-info">
            <h2>${item.name}</h2>
            <div class="item-info-box">
                <table class="infobox">
                    <tbody>
                        <tr>
                            <th colspan="2"><span>${item.name}</span></th>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="infobox-image">
                                    <img src="${itemImgUrl}" width="100" height="70" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <p><i>${item.lore}</i></p>
                            </td>
                        </tr>
                        <tr style="background-color: #b9500b; text-align: center;">
                            <th colspan="2">${item.category}</th>
                        </tr>
                        <tr>
                            <th>Cost</th>
                            <td>${item.cost}</td>
                        </tr>
                        <tr>
                            <th>Sell Value</th>
                            <td>${item.cost / 2}</td>
                        </tr>
                        <tr>
                            <th>Mana cost</th>
                            <td>${item.manacost ? item.manacost : "—"}</td>
                        </tr>
                        <tr>
                            <th>Bonus</th>
                            <td>
                                ${item.attrib ? `
                                <div class="item-attributes">
                                    <strong>Бонусы:</strong> ${item.attrib}
                                </div>
                                ` : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th>Recipe</th>
                            <td>
                                <div class = "components-container"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "item-abilities">
                ${item.description ? `<div class = "item-abilities-info">${item.description}</div>`:""}
            </div>
        </div>
    `
    const componentPart = document.createElement("div");
    componentPart.classList.add("components-block");
    if (item.components && item.components.length > 0){
        item.components.forEach(component =>{
            const componentImg = document.createElement("img");
            componentImg.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${component.replace("item_", "")}_lg.png`;
            componentImg.width = 50;
            componentImg.height = 30;
            componentImg.alt = "component";
            componentPart.appendChild(componentImg);
        })
    }
    document.querySelector(".components-container").append(componentPart);
}

loadItem();
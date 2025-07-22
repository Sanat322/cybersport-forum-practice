'use strict'

const itemBlock = document.querySelector("[data-item-block]");

const getItems = async () => {
    try {
        const res = await fetch("js/items.json");
        const itemsData = await res.json();
        itemsData.forEach(item => {
            const itemCategory = document.querySelector(`[data-item-category = "${item.category}"]`)
            const itemImgUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${item.tag}_lg.png`;
            const testImgUrl = './icons-proect/Enchanted_Mango_icon.webp';
            const itemCard = document.createElement("div");
            itemCard.classList.add("item-card");
            itemCard.innerHTML = `
            
                <div class = "item-link" data-item-icon>
                    <a href="itemPage.html?name=${encodeURIComponent(item.name)}" class = "item-link-element">
                        <img class = "item-card-image" src ="${itemImgUrl}" title = "${item.name}" />
                        <span>${item.name} (${item.cost})<img src ="./icons-proect/gold_symbol.webp" width = 10 height = 10></span>
                    </a>    
                </div>
            
            `
            itemCategory.appendChild(itemCard);
        });

       
    }
    catch (error) {
        console.error("ошибка", error.message)
    }
}

getItems();
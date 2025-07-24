'use strict'
import { searchPlayer, getPlayersInfo } from './search.js';
import { showModal, setupModalClose } from './modal.js';
import { getHeroes } from './heroes.js';
import { newsData } from './newsList.js';
const main = document.querySelector(".whole-content");

const sideBarToggleBtn = document.querySelector("[data-toggle-sidebar]");
const sideBar = document.querySelector("[data-sidebar]");
// sidebar кнопки  
const searchInputElement = document.querySelector("[data-search-input]");
const searchButtonElement = document.querySelector("[data-search-btn]");
const proPlayersPath = "js/proPlayers-cleaned.json";
let players = [];
// поиск игроков 
const header = document.querySelector(".header");
const links = document.querySelectorAll(".menu-list a");
// иконки героев 

links.forEach(link => {
    const color = link.dataset.border;
    link.addEventListener("mouseenter", () => {
        header.style.borderBottomColor = color;
    })
    link.addEventListener("mouseleave", () => {
        header.style.borderBottomColor = "#252f39"
    })
})


function toggleSideBar() {
    sideBarToggleBtn.addEventListener("click", () => {
        sideBar.classList.toggle("open");
    })
    main.addEventListener("click", (e) => {
        if (!sideBar.contains(e.target) && !sideBarToggleBtn.contains(e.target)) {
            sideBar.classList.remove("open")
        }
    })
}


const renderNews = (dotaPosts, container, limit) => {
    dotaPosts.slice(0, limit).forEach(post => {
        const newsPost = document.createElement("div")
        newsPost.classList.add("news__item")
        const image = post.image;
        newsPost.innerHTML = `
            
            ${image ? `<img src="${image}" alt="" style="width:350px; height: 200px;object-fit : contain;">` : ""}
          <h3><a href="${post.link}" target="_blank"  class = "news-item-title">${post.title}</a></h3>
          <p>${post.description.slice(0, 150)}</p>
            `
        container.append(newsPost);
    })
}

getPlayersInfo(proPlayersPath).then(data => {
    players = data;
})

searchButtonElement.addEventListener("click", () => {
    const value = searchInputElement.value;
    const found = searchPlayer(players, value);
    if (found) showModal(found)
    else alert("игрок не найден!")
})


if (document.querySelector("[data-news-block]")) {
  const newsContainer = document.querySelector("[data-news-block]");
  renderNews(newsData, newsContainer, 10);
}

getHeroes();
setupModalClose();
toggleSideBar();


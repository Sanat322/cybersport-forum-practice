'use strict'
import { searchPlayer, getPlayersInfo } from './search.js';
import { showModal, setupModalClose} from './modal.js';
import{getHeroes} from './heroes.js';
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
    const heroIcons = document.querySelector("[data-hero-icon]");

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
    main.addEventListener("click", (e)=>{
        if (!sideBar.contains(e.target) && !sideBarToggleBtn.contains(e.target)){
            sideBar.classList.remove("open")
        }
    })
}

function showNews(URL, containerSelector, limit) {
    const apiURL = URL;
    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            const newsContainer = document.querySelector(containerSelector);
            if (!newsContainer) return;
            newsContainer.innerHTML = ""
            const posts = data.data.children;
            const newsList = posts.map(post => ({
                title: post.data.title,
                link: "https://reddit.com" + post.data.permalink,
                description: post.data.selftext || "Перейдите по ссылке на reddit.com/r/DotA2 для прочтения",
                image: post.data.thumbnail && post.data.thumbnail.startsWith("http") ? post.data.thumbnail : null
            }));
            renderNews(newsList, newsContainer, limit)
        });


}

const renderNews = (dotaPosts, container, limit) => {
    dotaPosts.slice(0, limit).forEach(post => {
        const newsPost = document.createElement("div")
        newsPost.classList.add("news__item")
        const image = post.thumbnail;
        newsPost.innerHTML = `
            
            ${image ? `<img src="${image}" alt="" style="max-width:150px;">` : ""}
          <h3><a href="${post.link}" target="_blank"  class = "news-item-title">${post.title}</a></h3>
          <p>${post.description.slice(0, 150)}...</p>
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


showNews(
    "https://dotesports.com/dota-2/feed",
    "[data-news-block]", 10
);

getHeroes();
setupModalClose();
toggleSideBar();


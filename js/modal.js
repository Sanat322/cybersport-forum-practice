'use strict'

export const showModal = (player) => {
    const playersContainer = document.querySelector("[data-player-info-container]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const proPlayerImgPath = `./player-avatars/${player.name.toLowerCase()}.png`
    playersContainer.innerHTML =
        `
    <div class = "player-card">
        <img class="player-card-avatar" src="${proPlayerImgPath}" onerror="this.src='./icons-proect/steam-svgrepo-com (1).svg'">
        <div class = "player-card-info">
            <h2>${player.name}</h2>
            <p>team: ${player.team_name}</p>
            <p>steam ID: ${player.steamid}</p>
            <p>${player.country_code || 'Страна не указана'}</p>
            <p>last played match: ${player.last_match_time.slice(0, 19)}</p>
        </div>
    </div>
    `
    modalContainer.hidden = false;
    modalContainer.classList.remove("modal-container-off")
    
    requestAnimationFrame(() =>{
        modalContainer.classList.add("modal-container-active");
    })
}
export const setupModalClose = () => {
    const modal = document.querySelector("[data-modal-container]");
    const closeBtn = document.querySelector("[data-close-modal-btn]");

    // Закрытие по кнопке
    closeBtn.addEventListener("click", () => {
        modal.classList.add("modal-container-off");
    });

    // Закрытие по клику вне модального окна
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("modal-container-off");
        }
    });

    // Сброс классов после завершения анимации
    modal.addEventListener("transitionend", () => {
        if (modal.classList.contains("modal-container-off")) {
            modal.hidden = true;
            modal.classList.remove("modal-container-active", "modal-container-off");
        }
    });
};




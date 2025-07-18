'use strict'

export const showModal = (player) => {
    const playersContainer = document.querySelector("[data-player-info-container]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const defaultProfile = "./icons-proect/steam-svgrepo-com (1).svg"
    modalContainer.hidden = false;
    playersContainer.innerHTML =
        `
    <div class = "player-card">
        <img class= "player-card-avatar"  src = "${player.avatarfull} onerror="this.onerror=null; this.src='${defaultProfile}';"">
        <div class = "player-card-info">
            <h2>${player.name}</h2>
            <p>team: ${player.team_name}</p>
            <p>steam ID: ${player.steamid}</p>
            <p>${player.country_code || 'Страна не указана'}</p>
            <p>last played match: ${player.last_match_time.slice(0, 19)}</p>
        </div>
    </div>
    `
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer)
            modalContainer.hidden = true;
    })

}
export const setupModalClose = () => {
    document.querySelector("[data-close-modal-btn]").addEventListener("click", () => {
        document.querySelector("[data-modal-container]").hidden = true;
    });
}





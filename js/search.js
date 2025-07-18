'use strict'
export const searchPlayer = (players, searchValue) => {
    const cleanedValue = searchValue.trim().toLowerCase()
    return players.find(p => p.name?.trim().toLowerCase() === cleanedValue);
}

export const getPlayersInfo = async (path) => {
    try {
        const playersRes = await fetch(path);
        const playersData = await playersRes.json();
        return playersData.filter(p => p.name);
    }
    catch (error) {
        console.error("произошла ошибка во время получения данных о игроке😅", error.message);
        return [];
    }
}



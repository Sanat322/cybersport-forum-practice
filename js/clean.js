import fs from 'fs';

const raw = fs.readFileSync('./proPlayers.json', 'utf-8');
const data = JSON.parse(raw);

const cleaned = data.filter(player => player.is_pro !== null);

fs.writeFileSync('./proPlayers-cleaned.json', JSON.stringify(cleaned, null, 2));
console.log("Очищено и сохранено в proPlayers-cleaned.json");
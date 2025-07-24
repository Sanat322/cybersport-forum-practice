const fs = require('fs');

const rawData = fs.readFileSync('abilities-with-desc.json', 'utf-8');
const abilities = JSON.parse(rawData);

const filtered = {};

for (const key in abilities) {
  const a = abilities[key];
  filtered[key] = {
    desc: a.desc || "",
    cd: a.cd || [],
    mc: a.mc || [],
    lore: a.lore || ""
  };
}

fs.writeFileSync('abilities-desc-cleaned.json', JSON.stringify(filtered, null, 2));
console.log("✅ abilities-desc-cleaned.json создан!");
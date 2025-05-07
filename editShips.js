const fs = require('fs');
const SHIPS_PATH = './ships.json';

let ships = fs.existsSync(SHIPS_PATH)
  ? JSON.parse(fs.readFileSync(SHIPS_PATH, 'utf8'))
  : {};

const key = ['gamescom', 'marcelo'].sort().join('__');
ships[key] = 3; // Altere o número aqui se quiser outro valor

fs.writeFileSync(SHIPS_PATH, JSON.stringify(ships, null, 2));
console.log(`Compatibilidade entre Marcelo e Gamescom definida como ${ships[key]}%.`);

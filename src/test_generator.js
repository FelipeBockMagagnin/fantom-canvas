
const fs = require('fs');
let items = []

for (let y = 0; y < 60; y++) {
    for (let x = 0; x < 80; x++) {
        items.push({
            name: 'felpi',
            color: getRandomColor(),
            x: x, 
            y: y
        })
    }
}

let data = JSON.stringify(items);
fs.writeFileSync('data.json', '{"items":' + data + '}');


console.log(items.length);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
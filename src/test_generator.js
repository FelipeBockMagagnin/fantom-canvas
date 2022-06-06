
const fs = require('fs');
let items = []

for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
        items.push({
            name: 'felpi',
            color: '#' + (Math.random(111, 10000) * 1000).toFixed(0),
            x: x, 
            y: y
        })
    }
}

let data = JSON.stringify(items);
fs.writeFileSync('data.json', '{"items":' + data + '}');


console.log(items);
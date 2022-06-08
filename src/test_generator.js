
const fs = require('fs');
let items = []

for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 75; x++) {
        items.push({
            name: 'felpi',
            color:  (x + y)%2 ? 'black' : 'white',
            x: x, 
            y: y
        })
    }
}

let data = JSON.stringify(items);
fs.writeFileSync('data.json', '{"items":' + data + '}');


console.log(items.length);
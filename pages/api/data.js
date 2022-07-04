
export default function handler(req, res) {
  const fs = require('fs');
  
  let data = JSON.stringify(req.body);
  fs.writeFileSync('data.json', '{"data": ' + data + ', "date": "' + new Date() + '"}');

  console.log(req.body);
  res.status(200).json({ name: 'John Doe' })
}

const http = require('http');
const math = require('./math');

const server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World! desde Server con node.js');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
    console.log("Multiplicacion: ", math.multiply(3,4));
});
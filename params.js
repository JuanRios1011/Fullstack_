const http = require("http");
const url = require("url");

const server = http.createServer((req, res)=>{
    // URL parseada como Objeto
    const parsedUrl = url.parse(req.url, true);

    // Array de Parametros
    const query = parsedUrl.query;

    //http response - head
    res.writeHead(200, {"content-type": "application/json"});

    //http response - body
    res.end(JSON.stringify(
        {
            message: "Parametros Recibidos",
            params: query
        }
    ));
});

server.listen(3000, ()=>{
    console.log("El servidor está corriendo en http://localhost:3000/")
});
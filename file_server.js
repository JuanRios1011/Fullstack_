const fs = require('fs');
const http = require("http");
const path = require("path");
const eventos = require("events");

//Create event emitter
const EventEmitter = new eventos();

// Register event listener
EventEmitter.on("fileRead", (filename) => {
    console.log(`El archivo "${filename}" fue leido exitosamente.`);
});

EventEmitter.on('fileUpdate', (filename) =>{
    console.log(`El archivo "${filename}" ha sido actualizado.`) 
});

EventEmitter.on('fileDelete', (filename) =>{
    console.log(`El archivo "${filename}" ha sido eliminado.`) 
});


//Create server
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, "messages.txt"); // <-- Definido aquí

    if(req.url === "/"){
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Bienvenido al servidor de archivos");
    }
    else if(req.url === "/leer"){ //Ruta para leer archivo
        //Leer archivo
        fs.readFile(filePath, "utf-8", (err, data) => {
            //Error leer archivo
            if (err){
             //Mensaje de error por http
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error leyendo el archivo");
                return;
            };

            //Caso de exito - leemos archivo
            //Evento de archivo leido
            EventEmitter.emit("fileRead", "messages.txt");
            //Data por http
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }
    else if (req.url === '/actualizar'){ // Ruta para actualizar archivo
        //Actualizar archivo
        fs.appendFile(filePath, '\nContenido adicional', (err) => {
            if (err){
                //Mensaje de error por http
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error to updating file');
                return;
            }

            EventEmitter.emit('fileUpdate', "messages.txt");
            //Mensaje de exito por http
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("El archivo fue actualizado");
        });
    }
    else if(req.url === '/eliminar'){ // Ruta para eliminar archivo
        //Eliminar archivo
        fs.unlink(filePath, (err) => {
            if (err){
                //Mensaje de error por http
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al eliminar el archivo');
                return;
            }

            EventEmitter.emit('fileDelete', "messages.txt");
            //Mensaje de exito por http
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("El archivo fue eliminado");
        });
    }
    else{ //Ruta no encontrada
        //Mensaje de error por http
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Página no encontrada");
    }
});

//Start server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
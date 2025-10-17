const fs = require('fs');
const http = require("http");
const path = require("path");
const eventos = require("events");

// Crear emisor de eventos
const EventEmitter = new eventos();

// Registrar eventos personalizados
EventEmitter.on("fileRead", (filename) => {
    console.log(`El archivo "${filename}" fue leído exitosamente.`);
});

EventEmitter.on('fileUpdate', (filename) => {
    console.log(`El archivo "${filename}" ha sido actualizado.`);
});

EventEmitter.on('fileDelete', (filename) => {
    console.log(`El archivo "${filename}" ha sido eliminado.`);
});

// Función asincrónica para registrar logs
async function registrarLog(req) {
    const logPath = path.join(__dirname, "log.txt");
    const fecha = new Date().toISOString();
    const logEntry = `${fecha} - Método: ${req.method} - URL: ${req.url}\n`;

    try {
        await fs.promises.appendFile(logPath, logEntry);
    } catch (err) {
        console.error("Error al escribir el log:", err);
    }
}

// Crear servidor
const server = http.createServer(async (req, res) => {
    // Registrar log cada vez que se use el servidor
    await registrarLog(req);

    const filePath = path.join(__dirname, "messages.txt");
    const logPath = path.join(__dirname, "log.txt");

    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Bienvenido al servidor de archivos");
    }
    else if (req.url === "/leer") {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error leyendo el archivo");
                return;
            }
            EventEmitter.emit("fileRead", "messages.txt");
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }
    else if (req.url === '/actualizar') {
        fs.appendFile(filePath, '\nContenido adicional', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error actualizando el archivo');
                return;
            }
            EventEmitter.emit('fileUpdate', "messages.txt");
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("El archivo fue actualizado");
        });
    }
    else if (req.url === '/eliminar') {
        fs.unlink(filePath, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al eliminar el archivo');
                return;
            }
            EventEmitter.emit('fileDelete', "messages.txt");
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("El archivo fue eliminado");
        });
    }
    else if (req.url === '/leer-log') {
        fs.readFile(logPath, "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error leyendo el log");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Página no encontrada");
    }
});

// Iniciar servidor
server.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000/");
});

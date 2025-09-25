const fs = require("fs");

//CRUD 
// Create
fs.writeFile("messages.txt", "Iniciando archivo!", (err) => {
    if (err) throw err;
    // Mensaje exito
    console.log("File created!");
}); 

// Read
fs.readFile("messages.txt", "utf8", (err,data) => {
if (err) throw err;
    // Archivo leido
    console.log("Los mensajes del archivo son: \n", data);
});


// Update
fs.appendFile("messages.txt", "\n  Nueva linea en archivo...", (err) => {
    if (err) throw err;
    // Archivo actualizado
    console.log("Archivo actualizado!");
});

// // Delete
// fs.unlink("messages.txt", (err) => {
//     if (err) throw err;
//     // Archivo eliminado
//     console.log("Archivo eliminado!");
// });
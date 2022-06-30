var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`./images/${filename}`, (err, data) => {
            if (err) {
                reject({
                    status: 404,
                    contentType: "text/plain",
                    data: "<h1>Not found</h1>"
                });
            } else {
                resolve({
                    data,
                    contentType: "image/png",
                    status: 200
                });
            }
        })
    })
}

http.createServer(function(req, res) {
    readFile(req.url.substring(1))
        .then(data => {
            res.writeHead(data.status, { "Content-Type": data.contentType });
            res.end(data.data);
        })
        .catch(err => {
            res.writeHead(err.status, { "Content-Type": err.contentType });
            res.end(err.data);
        })
}).listen(8080, "127.0.0.1")

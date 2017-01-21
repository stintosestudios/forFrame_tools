/*
 *  server.js
 *
 *   This is the main server.js for my forFrame.js project.
 *
 */

var http = require("http"),
fs = require("fs"),
port = process.argv[2] || 8888,

onGet = function (req, res) {

    var filename = req.url != '/' ? '.' + req.url : 'index.html',
    last = filename.split('/');

    if (last.length > 1) {

        last = last[last.length - 1];

    } else {

        last = last[0];

    }

    if (last.indexOf('.') === -1) {

        filename += '/index.html';

    }

    fs.readFile(filename, "binary", function (err, file) {
        if (err) {

            res.writeHead(500, {
                "Content-Type" : "text/plain"
            });
            res.write(err + "\n");
            res.end();
            return;
        }

        res.writeHead(200);
        res.write(file, "binary");
        res.end();
    });

},

onPost = function (req, res) {

    //require('./node_scripts/write_gif.js').respondTo(req, res);

	require('./node_scripts/responder.js').respondTo(req, res);

	
};

http.createServer(function (req, res) {

    if (req.method === 'GET') {

        onGet(req, res);

    } else {

        onPost(req, res);
    }

}).listen(parseInt(port, 10));

console.log('server.js is alive.');

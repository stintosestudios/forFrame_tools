/*
 *  server.js
 *
 *   This just provides a simple static server for the project.
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

    console.log('yes a post');

    var gif = false;

    //var text = '';

    var buffers = [];

    req.on('data', function (chunk) {

        // doing this to see if it is a gif
        var first = chunk.toString('utf8').substr(0, 6);

        // build up the data
        //text += chunk.toString('utf8');

        buffers.push(chunk);

        //if (first === 'GIF89a') {
        if (first === 'data:i') {

            gif = true;

        }

    });

    req.on('end', function () {

        var binary;

        if (gif) {

            binary = Buffer.concat(buffers);

            console.log('writing gif file...');
            fs.writeFile('test.txt', binary, 'utf8', function () {

                console.log('files done.');

            });

        }

        res.writeHead(200);
        res.write('isGif: ' + gif);
        res.end();

    });
};

http.createServer(function (req, res) {

    if (req.method === 'GET') {

        onGet(req, res);

    } else {

        onPost(req, res);
    }

}).listen(parseInt(port, 10));

console.log('server.js is alive.');

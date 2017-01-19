
var fs = require('fs');

exports.respondTo = function (req, res) {

    var gif = false,

    buffers = [];

    console.log('i am responder');

    req.on('data', function (chunk) {

        // doing this to see if it is a gif
        var first = chunk.toString('utf8').substr(0, 6);

        buffers.push(chunk);

        if (first === '\"GIF89') {

            gif = true;

        }

    });

    req.on('end', function () {

        var binary;

        if (gif) {

            binary = Buffer.concat(buffers);

            binary = JSON.parse(binary);

            console.log('writing gif file...');
            fs.writeFile('test.gif', binary, 'binary', function () {

                console.log('files done.');

            });

        }

        res.writeHead(200);
        res.write('isGif: ' + gif);
        res.end();

    });

};

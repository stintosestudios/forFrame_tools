
var fs = require('fs');
makeDir = require('./make_dir.js'),

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('write_gif.js: ' + mess);

    } else {

        console.log(mess);

    }

};

writeGif = function (req, res) {

    var buffers = [];

    req.on('data', function (chunk) {

        buffers.push(chunk);

    });

    req.on('end', function () {

        var binary = Buffer.concat(buffers),
        binary_gif,
        fromClient = JSON.parse(binary.toString('utf8'));

        console.log(fromClient.projectName);

        // if binary gif data write it.
        if (fromClient.binary_gif) {

            binary_gif = new Buffer(fromClient.binary_gif,'binary');

            fs.writeFile(fromClient.projectName + '.gif', binary_gif, 'binary', function () {

                log('write done.');

            });

        }

        res.writeHead(200);
        res.write('yes now');
        res.end();

    });

};

exports.respondTo = function (req, res) {

    writeGif(req, res);

};

/*
writeGif = function (req,res) {

var gif = false,

buffers = [];

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

log('writing gif file...');
fs.writeFile('test.gif', binary, 'binary', function () {

log('write done.');

});

}

res.writeHead(200);
res.write('isGif: ' + gif);
res.end();

});

};

exports.respondTo = function (req, res) {

writeGif(req, res);

};
*/

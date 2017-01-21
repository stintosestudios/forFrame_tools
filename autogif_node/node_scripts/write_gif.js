
var fs = require('fs');
mk = require('./make_dir.js'),

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('write_gif.js: ' + mess);

    } else {

        console.log(mess);

    }

},

writeGif = function (req, res) {

    var buffers = [];

    req.on('data', function (chunk) {

        buffers.push(chunk);

    });

    req.on('end', function () {

        var binary = Buffer.concat(buffers),
        binary_gif,
        fromClient = JSON.parse(binary.toString('utf8'));

        log('saving data for project : ' + fromClient.projectName);

        if (fromClient.projectName) {

            // make the folder for the project if not there
            mk.make('./projects', fromClient.projectName, function () {

                // make the gif folder if not there
                mk.make('./projects/' + fromClient.projectName, 'gif', function () {

                    // if binary gif data write it.
                    if (fromClient.binary_gif) {

                        binary_gif = new Buffer(fromClient.binary_gif, 'binary');

                        log('saving gif...');

                        fs.writeFile('./projects/' +
                            fromClient.projectName + '/gif/' +
                            'gif_1_'+fromClient.size+'.gif',

                            binary_gif,
                            'binary', function (err) {

                            res.writeHead(200);

                            if (err) {

                                log('write err.');
                                log(err);

                                res.write('ERROR saving gif');

                            } else {

                                log('write done.');

                                res.write('GIF saved okay');

                            }

                            res.end();

                        });

                    } else {

                        res.writeHead(200);
                        res.write('no gif data');
                        res.end();

                    }

                });

            });

        } else {

            res.writeHead(200);
            res.write('no projectName');
            res.end();

        }

    });

};

exports.respondTo = function (req, res) {

    // make the porjects dir if it is not there.
    mk.make('./', 'projects', function () {

        writeGif(req, res);

    });

};

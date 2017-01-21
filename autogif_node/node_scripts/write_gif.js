
var fs = require('fs');
mk = require('./make_dir.js'),
spawn = require('child_process').spawn;

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('write_gif.js: ' + mess);

    } else {

        console.log(mess);

    }

},

crunchGif = function (path, filename) {

    //note = spawn('notepad.exe', [path]);

    var gifsicle = spawn('./gifsicle-1.88-win64/gifsicle.exe', [
                '-O2',
                path + filename,
                '-o',
                path + 'opp_' + filename
            ]);

    gifsicle.stdout.on('data', function (code) {

        log('gifsicle:');
        log(code.toString('utf8'));

    });

    gifsicle.stderr.on('data', function (code) {

        log('gifsicle error:');
        log(code.toString('utf8'));

    });

    gifsicle.on('exit', function (code) {

        log('gifsicle opp gif made.');
        log(code);

    });

    /*
    var gifsicle = spawn('./gifsicle-1.88-win64/gifsicle.exe', [
    '-O2',
    '-resize 128x_',
    path + filename,
    '-o',
    path + 'resize_' + filename
    ]);

     */

},

writeGif = function (req, res) {

    var buffers = [];

    req.on('data', function (chunk) {

        buffers.push(chunk);

    });

    req.on('end', function () {

        var binary = Buffer.concat(buffers),
        binary_gif,
        path,
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

                        path = './projects/' +
                            fromClient.projectName + '/gif/';

                        filename = 'gif_1_' + fromClient.size + '.gif';

                        fs.writeFile(path + filename,

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

                                crunchGif(path, filename);

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

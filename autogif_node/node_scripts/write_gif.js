
var fs = require('fs');
mk = require('./make_dir.js'),
spawn = require('child_process').spawn,

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('write_gif.js: ' + mess);

    } else {

        console.log(mess);

    }

},

crunchGif = function (path, filename) {

    var sizes = [480, 320, 240, 150];

    sizes.forEach(function (size) {

        var gifsicle = spawn('./gifsicle-1.88-win64/gifsicle.exe', [
                    '--resize', size + 'x_',
                    '--colors', '256',
                    '-O3',
                    path + filename,
                    '-o',
                    path + 'gif_1_' + size + '.gif'
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

    });

},

writeGif = function (json, done, fail) {

    var binary_gif,
    path,
    filename;

    // if binary gif data write it.
    if (json.binary_gif) {

        binary_gif = new Buffer(json.binary_gif, 'binary');

        log('saving gif...');

        path = './projects/' + json.projectName + '/gif/';

        filename = 'gif_1_master.gif';

        fs.writeFile(path + filename,

            binary_gif,
            'binary', function (err) {

            if (err) {

                log('write err.');
                log(err);

                done('ERROR saving gif');

            } else {

                log('write done.');

                done('GIF saved okay');

                crunchGif(path, filename);

            }

        });

    } else {

        fail('write_gif: no binary data');

    }

};

exports.call = function (json, done, fail) {

    if (json.projectName) {

        // make the folder for the project if not there
        mk.make('./projects', json.projectName, function () {

            // make the gif folder if not there
            mk.make('./projects/' + json.projectName, 'gif', function () {

                writeGif(json, function (mess) {

                    done(mess);

                }, function (mess) {

                    fail(mess);

                });

            });

        });

    } else {

        fail('write_gif: no project name');

    }

};


var fs = require('fs'),

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('make_dir.js: ' + mess);

    } else {

        console.log(mess);

    }

};

// make a dir if it is not there
exports.make = function (root, dir, done, fail) {

    var path = root + dir;

    if (root[root.length - 1] != '/') {

        path = root + '/' + dir;

    }

    // do we have the GIF path?
    if (!fs.existsSync(path)) {

        log(' ' + path + ' folder does not exist.');

        // then make it
        fs.mkdir(path, function (err) {

            if (err) {

                fail(err);

            } else {

                log(' ' + path + ' folder created!');

                done();

            }

        });

    } else {

        log(' ' + path + ' folder found.');

        done();

    }

}
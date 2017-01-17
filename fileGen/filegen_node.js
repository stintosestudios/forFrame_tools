var github = require('./github.js'),
fs = require('fs');

var build = function () {

    console.log('before_generate.js: Ready to build source files');

    fs.writeFile('./source/gif/test.txt', 'Okay so that worked', function (err) {

        if (err) {

            console.log('before_generate.js: error writing a file.');
            console.log(err);

        } else {

            console.log('before_generate.js: test file create.');

        }

    });

},

makeDir = function (root, dir, done, fail) {

    var path = root + dir;

    if (root[root.length - 1] != '/') {

        path = root + '/' + dir;

    }

    // do we have the GIF path?
    if (!fs.existsSync(root + dir)) {

        console.log('filegen.js: ' + path + ' folder does not exist.');

        // then make it
        fs.mkdir(root + dir, function (err) {

            if (err) {

                fail(err);

            } else {

                console.log('filegen.js: ' + path + ' folder created!');

                done();

            }

        });

    } else {

        console.log('filegen.js: ' + path + ' folder found.');

        done();

    }

},

ifFail = function (err) {

    console.log('filegen.js: oh no's we failed!');
    console.log(err);

};

// start by making a call to github
github.call(function (repos, repoNames) {

    makeDir('./', 'source', function () {

        makeDir('./source', 'git', function () {

            console.log('filgen.js: all is well with the path');

        }, ifFail);

    }, ifFail);

});

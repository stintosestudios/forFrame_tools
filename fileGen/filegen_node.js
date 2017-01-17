var github = require('./github.js'),
fs = require('fs'),
os = require('os'),
token = '';

if (process.argv[2]) {

    token = process.argv[2];

}

var build = function (repoNames) {

    console.log('filegen.js: Ready to build source files');

    var fi = 0,

    writeDone = function () {

        console.log('filegen.js: file writing done');

    },

    writeNext = function () {

        var projects = '',
        text = '';

        repoNames[fi][2].forEach(function (project, index, names) {

            projects += project;

            if (index < names.length - 1) {

                projects += ';';

            }

        });

        console.log('filegen.js: projectNames: ' + projects);

        // write title
        text = '---' + os.EOL +
            'title: ' + repoNames[fi][0] + ' GIF collection' + os.EOL +
            'layout: page' + os.EOL +
            '---' + os.EOL + os.EOL;

        // write hexo tag call

        text += '{% forframe_thumbs ' +
        repoNames[fi][0].substr(9, repoNames[fi][0].length) +
        ' ' + projects + ' %}';

        fs.writeFile('./source/gif/' + repoNames[fi][0] + '.md', text, function (err) {

            if (err) {

                console.log('filegen.js: error writing file for ' + repoNames[fi][0] + '.');
                ifFail(err);

            } else {

                console.log('filegen.js: ' + repoNames[fi][0] + ' file create.');

                fi += 1;

                if (fi < repoNames.length) {

                    writeNext();

                } else {

                    writeDone();

                }

            }

        });

    };

    writeNext();

},

makeDir = function (root, dir, done, fail) {

    var path = root + dir;

    if (root[root.length - 1] != '/') {

        path = root + '/' + dir;

    }

    // do we have the GIF path?
    if (!fs.existsSync(path)) {

        console.log('filegen.js: ' + path + ' folder does not exist.');

        // then make it
        fs.mkdir(path, function (err) {

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

    console.log('filegen.js: oh no\'s we failed!');
    console.log(err);

};

// start by making a call to github
github.call(function (repos, repoNames) {

    makeDir('./', 'source', function () {

        makeDir('./source', 'gif', function () {

            console.log('filegen.js: all is well with the path, building...');

            if (repoNames.length > 0) {

                build(repoNames);

            } else {

                console.log('filegen.js: we do not have any repoNames!');

            }

        }, ifFail);

    }, ifFail);

}, token);

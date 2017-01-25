var github = require('./github.js'),
fs = require('fs'),
os = require('os'),
token = '';

if (process.argv[2]) {

    token = process.argv[2];

}

var log = function (mess) {

    if (typeof mess === 'string') {

        console.log('hexo_markdown: ' + mess);

    } else {

        console.log(mess);

    }

};

var buildIndex = function (repoNames, done) {

    log('building index.md...');

    // write header
    text = '---' + os.EOL +
        'title: forFrame collection index.' + os.EOL +
        'layout: page' + os.EOL +
        '---' + os.EOL + os.EOL;

    // links to collection files
    repoNames.forEach(function (repo) {

        // make link here
        //text += '<a href=\"/forframe/' + repo[0] + '.html\">' + repo[0] + '<\/a>' + os.EOL;

        // use hexo tag
        text += '{% forframe_collection_link ' + repo[0] + ' ' + repo[2][repo[2].length - 1] + ' %}' + os.EOL;

    });

    fs.writeFile('./source/forframe/index.md', text, function (err) {

        log('index.md wrote.');
        done();

    });

};

var build = function (repoNames) {

    log('Ready to build source files');

    var fi = 0,

    writeDone = function () {

        log('build done.');

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

        log('projectNames: ' + projects);

        // write title
        text = '---' + os.EOL +
            'title: ' + repoNames[fi][0] + ' GIF collection' + os.EOL +
            'layout: page' + os.EOL +
            '---' + os.EOL + os.EOL;

        // write hexo tag call

        text += '{% forframe_thumbs ' +
        repoNames[fi][0].substr(9, repoNames[fi][0].length) +
        ' ' + projects + ' %}';

        fs.writeFile('./source/forframe/' + repoNames[fi][0] + '.md', text, function (err) {

            if (err) {

                log('error writing file for ' + repoNames[fi][0] + '.');
                ifFail(err);

            } else {

                log(repoNames[fi][0] + ' file create.');

                fi += 1;

                if (fi < repoNames.length) {

                    writeNext();

                } else {

                    // building of collecton files is now done, build/update the index.
                    buildIndex(repoNames, function () {

                        writeDone();

                    });

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

        log(' ' + path + 'folder does not exist.');

        // then make it
        fs.mkdir(path, function (err) {

            if (err) {

                fail(err);

            } else {

                log(path + ' folder created!');

                done();

            }

        });

    } else {

        log(path + ' folder found.');

        done();

    }

},

ifFail = function (err) {

    log('oh no\'s we failed!');
    log(err);

};

// start by making a call to github
github.call(function (repos, repoNames) {

    makeDir('./', 'source', function () {

        makeDir('./source', 'forframe', function () {

            log('all is well with the path, building...');

            if (repoNames.length > 0) {

                build(repoNames);

            } else {

                log('we do not have any repoNames!');

            }

        }, ifFail);

    }, ifFail);

}, token);

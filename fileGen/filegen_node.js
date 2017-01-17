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

makeDir = function (done) {

    // do we have the GIF path?
    if (!fs.existsSync('./source/gif')) {

        console.log('before_generate.js: GIF folder does not exist.');

        // then make it
        fs.mkdir('./source/gif', function () {

            console.log('before_generate.js: GIF folder created!');

            done();

        });

    } else {

        console.log('before_generate.js: GIF folder found, re-building...');

        done();

    }

};

// start by making a call to github
github.call(function (repos, repoNames) {
	
	makeDir(function(){
		
		build();
		
	});
	
});

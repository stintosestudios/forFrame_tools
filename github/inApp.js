var github = require('./github');

var token = '';

if (process.argv[2]) {

    token = process.argv[2];

}

github.call(function (repos, repoNames) {

    console.log('useing github.js from an app...');

    console.log(repoNames);

}, token);

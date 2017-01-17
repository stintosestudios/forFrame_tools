var http = require('https'),

repos = [],
repoNames = [],

username = 'stintosestudios',

options = {

    host : 'api.github.com',

    path : '/users/' + username + '/repos',

    method : 'GET',

    headers : {
        'user-agent' : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
    }

},

// get the forframe collection names
getCollectionNames = function (gitHubData) {

    var prefix = /forFrame_collection/,
    collectionNames = [];

    if (typeof gitHubData === 'object') {

        if (gitHubData.constructor.name === 'Array') {

            gitHubData.forEach(function (repo, index) {

                // if regex match
                if (repo.name.match(prefix)) {

                    collectionNames.push([repo.name, index]);

                }

            });

        }

        return collectionNames;

    }

    return [];

},

// node version of my 'get' method
get = function (host, path, done, isJSON) {

    var username = 'stintosestudios',

    options = {

        host : host,

        path : path,

        method : 'GET',

        headers : {
            'user-agent' : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }

    },

    req = http.request(options, function (res) {

            var text = '';

            res.setEncoding('utf8');
            res.on('data', function (chunk) {

                text += chunk;

            });

            //res.setEncoding('utf8');
            res.on('end', function () {

                if (isJSON) {

                    done(JSON.parse(text));

                } else {

                    done(text);

                }

            });

        });

    req.on('error', function (e) {
        console.log('github.js: problem with request: ' + e.message);
    });

    req.end();

},

start = function (done) {

    get('api.github.com', '/users/stintosestudios/repos', function (data) {

        repos = data;
        repoNames = getCollectionNames(data);

        done()

    }, true);

};

exports.call = function (done) {

    console.log('github.js: A call to github has been made');

    start(function () {

        console.log('github.js: call done');

        done(repos, repoNames);

    });

}

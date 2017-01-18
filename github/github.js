var http = require('https'),

username = 'stintosestudios',
token = '',
repos = [],
repoNames = [],

log = function (mess) {

    if (typeof mess === 'string') {

        console.log('github: ' + mess);

    } else {

        console.log(mess);

    }

},

// node version of my 'get' method
get = function (host, path, done, isJSON) {

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

        log(' Problem with request: ' + e.message);

    });

    req.end();

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

// get and append project names for each forframe collection
appendProjectNames = function (done) {

    var i = 0,
    len = repoNames.length;
    //results = [];

    //get(data[0].contents_url.split('{')[0], function (data) {

    var processNext = function () {

        if (i < len) {

            get('api.github.com',
                '/repos/' + username + '/' + repoNames[i][0] + '/contents/projects?access_token=' + token,
                function (data) {

                var results = [];

                if (data.constructor.name === 'Array') {

                    data.forEach(function (item) {

                        if (item.type === 'dir') {

                            results.push(item.name);

                        }

                    });

                }

                repoNames[i].push(results);

                i += 1;
                processNext();

            }, true);

        } else {

            done();

        }

    };

    processNext();

},

start = function (done) {

    get('api.github.com',
        '/users/' + username + '/repos?access_token=' + token,
        function (data) {

        repos = data;
        repoNames = getCollectionNames(data);

        // append project names
        appendProjectNames(function (results) {

            done();

        });

    }, true);

};

exports.call = function (done, accessToken) {

    log(' A call to github has been made');

    if (accessToken) {

        token = accessToken;

    }

    start(function () {

        log(' Call done');

        if (repoNames.length === 0) {

            log('Empty repoNames array. (maybe give an access token?)');

        }

        done(repos, repoNames);

    });

}

// if calling from command line
if (!!process.argv[1].match(/github.js$/)) {

    if (process.argv[2]) {

        token = process.argv[2];

    }

    exports.call(function (repos, reposNames) {

        log(' called from commandline');
        log(' repoNames:');
        log(reposNames);

    }, token);

}

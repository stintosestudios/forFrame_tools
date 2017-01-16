
/*    getCollectionNames helper
 *    feed it an array from this:
 *
 *    request.open('get', 'https://api.github.com/users/stintosestudios/repos');
 *
 *    It should return an array of repo names that are forFrame collections
 *
 */

var userURL = 'https://api.github.com/users/stintosestudios',
reposURL = 'https://api.github.com/repos/stintosestudios',
rawURL = 'https://raw.githubusercontent.com/stintosestudios',

getCollectionNames = function (gitHubData) {

    var prefix = /forFrame_collection/,
    collectionNames = [];

    if (typeof gitHubData === 'object') {

        if (gitHubData.constructor.name === 'Array') {

            gitHubData.forEach(function (repo, index) {

                // if regex match
                if (repo.name.match(prefix)) {

                    //console.log(repo.name);
                    collectionNames.push([repo.name, index]);

                }

            });

        }

        return collectionNames;

    }

    return [];

},

getProjectNames = function (projectName) {},

get = function (url, done, isJSON) {

    var request = new XMLHttpRequest(),
    data;

    request.open('get', url);

    request.onreadystatechange = function () {

        if (request.readyState === 4) {

            data = request.response;

            if (isJSON) {

                data = JSON.parse(data);

            }

            done(data, request);

        };

    };

    request.send();
},

makeLinks = function (results) {

    var html = '';

    results.forEach(function (re) {

        var baseURL = rawURL + '/' + re.collectionName + '/master/projects/' + re.projectName;

        html += '<img src=\"' + baseURL + '/thum_128.png' + '\"' + ' >';

    });

    document.body.innerHTML += html;

};

get(userURL + '/repos', function (data) {

    var repoNames = getCollectionNames(data),
    i = 0,
    len = repoNames.length,
    results = [];

    //get(data[0].contents_url.split('{')[0], function (data) {

    var processNext = function () {

        if (i < len) {

            get(data[repoNames[i][1]].contents_url.split('{')[0] + '/projects', function (data) {

                if (data.constructor.name === 'Array') {

                    data.forEach(function (item) {

                        if (item.type === 'dir') {

                            results.push({

                                collectionName : repoNames[i][0],
                                projectName : item.name

                            });

                        }

                    });

                }

                i += 1;
                processNext();

            }, true);

        } else {

            makeLinks(results);

        }

    };

    processNext();

}, true);

/*
// Useing XMLHttpRequest
var request = new XMLHttpRequest();

// Open a new GET
//request.open('get', baseUrl + '/repos');

request.open('get', baseUrl);

// What to do with the response
request.onreadystatechange = function () {

var theType = typeof request.response,
data;

if (request.readyState === 4) {

// if string assume JSON
if (theType === 'string') {

data = JSON.parse(request.response);

//console.log(getCollectionNames(data));

console.log(request.response);

}

}

};

// Send
request.send();
*/

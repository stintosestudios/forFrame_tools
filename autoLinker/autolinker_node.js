var http = require('https'),

username = 'stintosestudios',

options = {

    host : 'api.github.com',

    path : '/users/' + username + '/repos',

    method : 'GET',

    headers : {
        'user-agent' : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
    }

},

req = http.request(options, function (res) {

        console.log('headers:\n' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('body:\n' + chunk);
        });
    });

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.end();

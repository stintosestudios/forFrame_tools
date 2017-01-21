var fs = require('fs');

exports.respondTo = function (req, res) {

    var buffers = [];

    req.on('data', function (chunk) {

        buffers.push(chunk);

    });

    req.on('end', function () {

        var binary = Buffer.concat(buffers),
        json = JSON.parse(binary.toString('utf8'));

        require('./' + json.script + '.js').call(json, function (mess) {

            res.writeHead(200);
            res.write(mess);
            res.end();

        },

            function (mess) {

            res.writeHead(200);
            res.write(mess);
            res.end();

        });

    });

};

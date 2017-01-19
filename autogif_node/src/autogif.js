
var autoGif = (function () {

    var encoder = new GIFEncoder(),
    binary_gif,
    data_url,

    log = function (mess) {

        if (typeof mess === 'string') {

            console.log('autogif: ' + mess);

        } else {

            console.log(mess);

        }

    },

    post = function (data) {

        var xhr = new XMLHttpRequest();

        xhr.open('post', location.hostname);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {

                log('server response');
                log(xhr.response);

            }

        };

        xhr.send(data);

    },

    progress = function (frame, maxFrame, done) {

        var container = document.getElementById('forframe_autogif'),
        disp,
        percent = frame / maxFrame;

        if (container) {

            disp = document.getElementsByClassName('forframe_autogif_progress')[0];

            log(percent + '');

            disp.style.width = Math.floor(percent * 100) + '%';

            done();

        } else {

            done();

        }

    },

    injectFrames = function (playbackObj, maxFrame) {

        log('Setting up encoder (native)');

        //post('started');

        injectFrames_native(playbackObj, maxFrame);

    },

    injectFrames_native = function (playbackObj, maxFrame) {

        var frame = 0,

        // yes I need a plugin system for forFrame
        ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

        // set up the encoder
        encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(33);
        encoder.start();

        var processNext = function () {

            scene.setFrame(frame);
            scene.renderFrame(playbackObj);
            encoder.addFrame(ctx);

            progress(frame, maxFrame, function () {

                if (frame < maxFrame) {

                    frame += 1;

                    setTimeout(processNext, 0);

                } else {

                    encoder.finish();

                    binary_gif = encoder.stream().getData();
                    data_url = 'data:image/gif;base64,' + encode64(binary_gif);

                    //console.log(binary_gif);
                    //console.log(JSON.stringify(binary_gif));

                    // post the data url to the server
                    post(JSON.stringify(binary_gif));

                    log('Encoder ready.');
                }

            });

        };

        processNext();

    },

    makeGif = function () {

        var img = new Image();
        img.src = data_url;
        document.body.appendChild(img);
        log(binary_gif)

    };

    return {

        // inject a ui
        injectUI : function (playbackObj, maxFrame) {

            var ui = document.createElement('div'),
            control;

            ui.id = 'forframe_autogif';
            ui.style.outline = '1px solid #000000';
            ui.style.width = '640px';
            ui.style.marginTop = '10px';
            // ui.style.height = '50px';

            // inject frames button
            control = document.createElement('input');
            control.type = 'button';
            control.value = 'injectFrames';
            control.style.margin = '10px';

            control.addEventListener('click', function (e) {

                injectFrames(playbackObj, maxFrame);

            });
            ui.appendChild(control);

            // make gif
            control = document.createElement('input');
            control.type = 'button';
            control.value = 'make gif';
            control.style.margin = '10px';

            control.addEventListener('click', function (e) {

                log('making gif.');

                makeGif();

            });
            ui.appendChild(control);

            // disp
            control = document.createElement('div');
            control.className = 'forframe_autogif_progress';
            control.style.width = '100%';
            control.style.height = '20px';
            control.style.background = '#aaffaa';
            ui.appendChild(control);

            document.getElementById(playbackObj.containerId).appendChild(ui);

        }

    }

}
    ());
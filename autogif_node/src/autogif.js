
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

        size = 128,
        toServer,
        scaledH,
        nativeW,
        nativeH,

        size = Number(document.getElementById('autogif_size').value);

        // yes I need a plugin system for forFrame
        //ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

        canvas = scene.state.canvas,
        ctx = scene.state.ctx;

        log('native canvas size: ' + canvas.width + ',' + canvas.height);

        scaledH = Math.floor(canvas.height / canvas.width * size);

        //canvas.style.width = size+'px';
        //canvas.style.height = scaledH+'px';

        //canvas.width = size;
        //canvas.height = scaledH;

        nativeW = canvas.width;
        nativeH = canvas.height;

        //ctx.scale(size / canvas.width,scaledH / canvas.height);
        canvas.width = size;
        canvas.height = scaledH;
        ctx.scale(size / nativeW, scaledH / nativeH);

        log('scaled canvas size: ' + size + ',' + scaledH);

        // set up the encoder
        encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(33);
        encoder.start();

        playbackObj.drawBackground = function (ctx) {

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, nativeW, nativeH);

        };

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

                    toServer = {

                        script : 'write_gif',
                        projectName : scene.state.projectName,
                        size : size,
                        binary_gif : binary_gif

                    },

                    // post the data url to the server
                    //post(JSON.stringify(binary_gif));

                    post(JSON.stringify(toServer));

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
            control.value = 'save gif to server';
            control.style.margin = '10px';

            control.addEventListener('click', function (e) {

                injectFrames(playbackObj, maxFrame);

            });
            ui.appendChild(control);

            // set size
            control = document.createElement('span');
            control.innerHTML = 'size:';
            ui.appendChild(control);

            control = document.createElement('input');
            control.type = 'text';
            control.id = 'autogif_size';
            control.value = '480';
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

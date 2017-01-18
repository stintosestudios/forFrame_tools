
var autoGif = (function () {

    var encoder = new GIFEncoder(),

    log = function (mess) {

        if (typeof mess === 'string') {

            console.log('autogif: ' + mess);

        } else {

            console.log(mess);

        }

    },

    progress = function (frame, maxFrame) {

        var container = document.getElementById('forframe_autogif'),

        percent = frame / maxFrame;

        log(percent + '');

        if (container) {

            disp = document.getElementsByClassName('disp')[0];

        }

    },

    injectFrames = function (playbackObj, maxFrame) {

        var frame = 0,

        // yes I need a plugin system for forFrame
        ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

        // set up the encoder
        encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(33);
        encoder.start();

        // inject frames
        while (frame < maxFrame) {

            scene.setFrame(frame);
            scene.renderFrame(playbackObj);
            encoder.addFrame(ctx);

            progress(frame, maxFrame);

            frame += 1;

        }

        encoder.finish();

        var binary_gif = encoder.stream().getData();

        log('Encoder ready.');

    },

    makeGif = function () {

        var binary_gif = encoder.stream().getData();
        var data_url = 'data:image/gif;base64,' + encode64(binary_gif);
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
            ui.style.height = '50px';

            // inject frames button
            control = document.createElement('input');
            control.type = 'button';
            control.value = 'injectFrames';
            control.style.margin = '10px';

            control.addEventListener('click', function (e) {

                log('Setting up encoder.');

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
            control.className = 'disp';
            ui.appendChild(control);

            document.getElementById(playbackObj.containerId).appendChild(ui);

        }

    }

}
    ());

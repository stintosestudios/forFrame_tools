
var encoder = new GIFEncoder();

var autoGif = (function () {

    var encoder = new GIFEncoder();

    /*
    var encoder = new GIFEncoder();

    //0  -> loop forever
    encoder.setRepeat(0);

    //go to next frame every n milliseconds
    encoder.setDelay(33);

    encoder.start();

    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    canvas.width = 160;
    canvas.height = 90;

    var i = 0;
    while (i < 3) {

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 160, 90);

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(10 + 20 * i, 20, 15, 15);

    encoder.addFrame(ctx);

    i += 1;

    }

    encoder.finish();

    var binary_gif = encoder.stream().getData();
    var data_url = 'data:image/gif;base64,' + encode64(binary_gif);
    var img = new Image();
    img.src = data_url;
    document.body.appendChild(img);

     */

    var log = function (mess) {

        if (typeof mess === 'string') {

            console.log('autogif: ' + mess);

        } else {

            console.log(mess);

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
            frame += 1;
        }

        encoder.finish();

        var binary_gif = encoder.stream().getData();

        log('Encoder ready.');
        log(binary_gif);

    },

    makeGif = function () {

        var binary_gif = encoder.stream().getData();
        var data_url = 'data:image/gif;base64,' + encode64(binary_gif);
        var img = new Image();
        img.src = data_url;
        document.body.appendChild(img);
        log(binary_gif)

    };

    /*
    injectFrames = function () {

    var encoder = new GIFEncoder();

    //0  -> loop forever
    encoder.setRepeat(0);

    //go to next frame every n milliseconds
    encoder.setDelay(33);

    encoder.start();

    var canvas = document.createElement('canvas'),
    //ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

    ctx = scene.state.ctx;


    console.log(ctx);

    encoder.addFrame(ctx);


    encoder.finish();

    var binary_gif = encoder.stream().getData();
    var data_url = 'data:image/gif;base64,' + encode64(binary_gif);
    var img = new Image();
    img.src = data_url;

    console.log(binary_gif);

    document.body.appendChild(img);

    };
     */

    return {

        // inject a ui
        injectUI : function (playbackObj, maxFrame) {

            var ui = document.createElement('div'),
            control;

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

            document.getElementById(playbackObj.containerId).appendChild(ui);

        }

    }

}
    ());

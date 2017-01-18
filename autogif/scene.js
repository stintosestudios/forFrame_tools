
var maxFrame = 50;

scene({

    maxFrame : maxFrame,

    viewPort : {

        w : 480,
        h : 360

    },

    logo : {
        w : 128,
        h : 56,
        opacity : .4,
        skin : {
            imgIndex : 0,
            sw : 128,
            sh : 56
        }
    },

    // define some parts
    parts : [{
            id : 'theline',
            w : 480,
            h : 360,
            skin : {
                appendRender : function (ctx) {

                    var totalPoints = 50,
                    boxI;

                    getPoint = function (i) {

                        var bias = Math.abs(.5 - this.percentDone) / .5;

                        return {

                            x : this.viewPort.w / totalPoints * i,
                            y : this.viewPort.h - 50 - Math.pow(1.115, i) - (1.9 * i)

                        }
                    },

                    drawLine = function () {

                        var i = 0,
                        point;

                        ctx.save();
                        while (i < totalPoints) {

                            ctx.strokeStyle = 'rgba(255,255,255,.2)';
                            ctx.beginPath();
                            point = getPoint.call(this, i - 1);
                            ctx.moveTo(point.x, point.y);

                            point = getPoint.call(this, i);
                            ctx.lineTo(point.x, point.y);
                            ctx.stroke();

                            i += 1;

                        }
                        ctx.restore();

                    },

                    drawBox = function (i) {

                        var point,
                        angle,
                        size;

                        i = i === undefined ? Math.floor(totalPoints) * this.percentDone : i;

                        point = getPoint.call(this, i);
                        angle = Math.atan2(point.y, point.x);

                        size = 256 - 256 * (i / totalPoints);

                        // draw box
                        ctx.save();
                        ctx.strokeStyle = 'rgba(255,255,255,' + (1 - i / totalPoints) + ')';

                        ctx.fillStyle = 'rgba(0,0,255,' + (1 - i / totalPoints) + ')';
                        ctx.lineWidth = 3;
                        ctx.translate(point.x - size / 2, point.y - size / 2);
                        ctx.rotate(angle);
                        ctx.fillRect(0, 0, size, size);
                        ctx.strokeRect(0, 0, size, size);
                        ctx.restore();

                    };

                    drawLine.call(this);

                    boxI = 0;
                    while (boxI < 55) {

                        drawBox.call(this, boxI + 10 * this.percentDone);

                        boxI += 5;

                    }

                }
            }
        }

    ],

    // define the forFrame movement
    forFrame : function () {}

});

// inject a canvas into an element with an id of 'apparea'.
scene.injectCanvas('apparea');

scene.load(
    [
        'img/mylogo_128.png'
    ],
    function (progress) {

    // uncomment to save as png
    if (progress === 1) {

        var playback = {

            appendRender : function (ctx) {},
            appendZ : 0,

            containerId : 'apparea',

            frameRate : 40
        };

        scene.injectUI(playback);
        autoGif.injectUI(playback,maxFrame);

    }

});

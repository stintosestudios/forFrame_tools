/*
 *    forFrame.js
 *    Copyright 2016 by stintose studios (GPL v3)
 *    https://github.com/stintosestudios/forFrame
 *
 */

var scene = (function () {

    var state = {

        frame : 0,
        maxFrame : 50,
        percentDone : 0,
        sections : {},
        sectionPer : 0,
        sectionIndex : 0,
        sectionName : '',
        forFrame : null,
        img : [],
        parts : {},
        opacity : 1,
        viewPort : {

            w : 640,
            h : 480

        },
        canvas : null,
        ctx : null,
        logo : null,

        // run the current section forFrame method
        currentSection : function () {

            var i = 0,
            timeline = this.sections.timeline,
            len = timeline.length;
            while (i < len) {

                if (this.percentDone < timeline[i][1]) {

                    break;

                }

                i += 1;

            }

            // set the current section index
            this.sectionIndex = i;

            var bias = i === 0 ? 0 : timeline[i - 1][1];

            this.sectionPer = (this.percentDone - bias) / (timeline[i][1] - bias);

            this.sectionName = this.sections.timeline[this.sectionIndex][0];

            // run the current section forFrame method, and return anything it returns.
            return this.sections.forFrame[timeline[i][0]].call(this);

        }

    };

    // The Skin Class is used to skin a Part with an image
    var Skin = function (part, skinOptions) {

        var defaults = 'imgIndex:-1;xOffset:0;yOffset:0;sx:0;sy:0;sw:32;sh:32;renderPartBox:0;appendRender:none;'.split(';'),
        i = 0,
        len = defaults.length,
        current;

        if (skinOptions === undefined) {
            skinOptions = {};
        }
        while (i < len - 1) {

            current = defaults[i].split(':');

            if (current[0]in skinOptions) {

                this[current[0]] = skinOptions[current[0]];

            } else {

                // else the default value

                this[current[0]] = current[1];

            }

            i += 1;

        }

        this.renderPartBox = this.renderPartBox === '0' ? false : true;

        // store a reference to the part that is used.
        this.part = part;

    };

    // draw and appendRender skin
    Skin.prototype.draw = function () {

        var ctx = state.ctx;

        ctx.save();

        // draw relative to the part;
        ctx.translate(-this.part.w / 2, -this.part.h / 2);

        // in the draw function this refers to the current state, and pass the drawing context.
        this.appendRender.call(state, ctx, this);

        ctx.restore();

    };

    // the Part Class.
    var Part = function (values) {

        var defaults = 'id:none;w:32;h:32;x:0;y:0;radian:0;opacity:none;forFrame:none;'.split(';'),
        i = 0,
        len = defaults.length,
        current;
        while (i < len) {

            current = defaults[i].split(':');

            if (current[0]in values) {

                this[current[0]] = values[current[0]];

            } else {

                // else the default value

                this[current[0]] = current[1];

            }

            i += 1;

        }

        // default that Parts skin to a blank Skin class instance
        this.skin = new Skin(this, values.skin);

    };

    // main scene setup method
    var api = function (options) {

        // no state?
        if (options == undefined) {

            throw new Error('you need to give a state object, see the README');

        }

        // no parts?
        if (options.parts === undefined) {

            throw new Error('you must define at least one Part for your scene, see the README');

        }

        // no forFrame?
        if (options.forFrame === undefined) {

            throw new Error('you must define a forFrame method, see the README.');

        }

        // default to 50 frames if maxFrame is not given
        state.maxFrame = options.maxFrame ? options.maxFrame : 50;

        // setup parts array.
        state.parts = {};
        options.parts.forEach(function (currentPart) {

            state.parts[currentPart.id] = new Part(currentPart);

        });

        state.forFrame = options.forFrame;

        // setup sections if given
        if (options.sections) {

            (function () {

                var secValues = options.sections.timeline.split(';');

                state.sections = {

                    timeline : [],

                    // referencing options for now.
                    forFrame : options.sections.forFrame

                };

                // build timeline array
                secValues.forEach(function (secVal) {

                    secVal = secVal.split(':');
                    secVal[1] = secVal[1] / 100;

                    state.sections.timeline.push(secVal);

                });

            }
                ());
        }

        // set global opacity if given
        if (options.opacity) {

            state.opacity = options.opacity;

        }

        // set the viewPort if given
        if (options.viewPort) {

            state.viewPort.w = options.viewPort.w;
            state.viewPort.h = options.viewPort.h;

        }

        // setup logo if given
        if (options.logo) {

            state.logo = new Part(options.logo);

            if (options.logo.x === undefined) {
                state.logo.x = state.viewPort.w - state.logo.w;
            }

            if (options.logo.y === undefined) {
                state.logo.y = state.viewPort.h - state.logo.h;
            }

        }

    };

    // making state public
    api.state = state;

    // inject a canvas into the given id
    api.injectCanvas = function (id) {

        state.canvas = document.createElement('canvas');
        state.ctx = state.canvas.getContext('2d');

        state.canvas.width = state.viewPort.w;
        state.canvas.height = state.viewPort.h;

        state.ctx.fillStyle = 'black';
        state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

        document.getElementById(id).appendChild(state.canvas);

    };

    // inject a User Interface into the element of the given id
    api.injectUI = function (playbackObj) {

        var ui = document.createElement('div'),
        control;

        ui.style.outline = '1px solid #000000';
        ui.style.width = '640px';
        ui.style.height = '120px';

        // play/stop button
        control = document.createElement('input');
        control.type = 'button';
        control.value = 'play\/stop';
        control.style.margin = '10px';
        control.addEventListener('click', function (e) {

            api.play(playbackObj);

        });
        ui.appendChild(control);

        // step+ button
        control = document.createElement('input');
        control.type = 'button';
        control.value = 'step+';
        control.style.margin = '10px';
        control.addEventListener('click', function (e) {

            // step the current frame forward
            api.step();
            api.renderFrame(playbackObj);

        });
        ui.appendChild(control);

        // step- button
        control = document.createElement('input');
        control.type = 'button';
        control.value = 'step-';
        control.style.margin = '10px';
        control.addEventListener('click', function (e) {

            // step the current frame forward
            api.step(true);
            api.renderFrame(playbackObj);

        });
        ui.appendChild(control);

        // make PNG's
        control = document.createElement('input');
        control.type = 'button';
        control.value = 'toPNGCollection';
        control.style.margin = '10px';
        control.addEventListener('click', function (e) {

            api.toPNGCollection(playbackObj);

        });
        ui.appendChild(control);

        // disp div
        control = document.createElement('div');
        control.id = "for_frame_ui_disp";
        control.style.margin = '10px';
        ui.appendChild(control);

        api.setFrame(0);
        api.renderFrame(playbackObj);

        document.getElementById(playbackObj.containerId).appendChild(ui);

    };

    // render the current frame
    api.renderFrame = function (playbackObj) {

        var prop,
        skin,
        pt,
        z = 0,
        ctx = state.ctx,
        appendZ,
        disp;

        if (playbackObj === undefined) {
            playbackObj = {};
        }

        appendZ = playbackObj.appendZ === undefined ? Object.keys(state.parts).length - 1 : playbackObj.appendZ;

        // clear canvas.
        state.ctx.fillStyle = 'black';
        state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

        // ALERT! a for in loop!? NO!
        for (prop in state.parts) {

            // append render?
            if (playbackObj.appendRender && z === appendZ) {

                playbackObj.appendRender.call(state, ctx);

            }

            z += 1;

            pt = state.parts[prop];

            ctx.save();
            // default to state.opacity
            ctx.globalAlpha = state.opacity;

            // if part opacity that will override state.opacity
            if (Number(pt.opacity) >= 0) {

                ctx.globalAlpha = pt.opacity;

            }

            ctx.translate(pt.x + pt.w / 2, pt.y + pt.h / 2);
            ctx.rotate(pt.radian);

            skin = pt.skin;

            if (Number(skin.imgIndex) > -1) {

                // if we have a skin for the part use the skin
                ctx.strokeStyle = '#ff0000';
                ctx.drawImage(
                    state.img[skin.imgIndex],
                    skin.sx,
                    skin.sy,
                    skin.sw,
                    skin.sh,
                    -pt.w / 2 + Number(skin.xOffset),
                    -pt.h / 2 + Number(skin.yOffset),
                    pt.w,
                    pt.h);

                if (skin.renderPartBox) {

                    ctx.strokeRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h);

                }

            }

            if (skin.appendRender != 'none') {

                skin.draw();

            }

            ctx.restore();

        }

        // all parts rendered, so render logo if given
        if (state.logo) {

            pt = state.logo;
            skin = state.logo.skin;

            ctx.save();
            ctx.globalAlpha = state.opacity;

            if (Number(pt.opacity) >= 0) {

                ctx.globalAlpha = pt.opacity;

            }

            ctx.drawImage(
                state.img[skin.imgIndex],
                skin.sx,
                skin.sy,
                skin.sw,
                skin.sh,
                pt.x + Number(skin.xOffset),
                pt.y + Number(skin.yOffset),
                pt.w,
                pt.h);

            ctx.restore();

        }

        disp = document.getElementById('for_frame_ui_disp');

        if (disp) {

            disp.innerHTML = 'frame: ' + state.frame + '\/' + state.maxFrame;

            7
        }

    };

    // set animation to the given frame.
    api.setFrame = function (frameNum) {

        state.frame = frameNum;

        if (state.frame === -1) {
            state.frame = state.maxFrame - 1;
        }
        if (state.frame === state.maxFrame) {
            state.frame = 0;
        }

        state.percentDone = state.frame / state.maxFrame;

        // call the forFrame method;
        state.forFrame.call(state);

        for (var partId in state.parts) {

            if (state.parts[partId].forFrame != 'none') {

                state.parts[partId].forFrame.call(state, state.parts[partId]);

            }

        }

    };

    // step the current frame
    api.step = function (back) {

        var rate = back ? -1 : 1;

        state.frame += rate;
        api.setFrame(state.frame);

    };

    api.load = function (urlList, done) {

        var img,
        progress = 0;

        if (done === undefined) {
            done = function () {};
        }

        state.img = [];

        urlList.forEach(function (url) {

            img = new Image();

            img.addEventListener('load', function () {

                progress += 1;

                done(progress / state.img.length);

            });

            img.src = url;

            state.img.push(img);

        });

    };

    // play the scene
    api.play = (function () {

        var playActive = false;

        return function (playbackObj) {

            // ALERT! setTimeout? what?

            playbackObj = playbackObj === undefined ? {}

             : playbackObj;

            playbackObj.frameRate = playbackObj.frameRate === undefined ? 33 : 1000 / playbackObj.frameRate;

            var loop = function () {

                if (playActive) {

                    setTimeout(loop, playbackObj.frameRate);

                }

                api.renderFrame(playbackObj);

                api.step();

            };

            if (!playActive) {

                playActive = true;
                loop();

            } else {

                playActive = false;

            }

        };
    }
        ()),

    // convert your animation to a *.png file collection
    api.toPNGCollection = function (playbackObj) {

        var saveFrames = function () {

            api.setFrame(state.frame);
            api.renderFrame(playbackObj);

            state.canvas.toBlob(function (blob) {

                saveAs(blob, 'frame_' + state.frame + '.png');

                state.frame += 1;
                if (state.frame < state.maxFrame) {

                    saveFrames();

                } else {

                    state.frame = 0;
                    api.setFrame(0);
                    api.renderFrame(playbackObj);
                }

            });

        };

        if (playbackObj === undefined) {

            playbackObj = {};

        }

        // test for "saveAs" global as this methods requiers filesaver.js
        if (saveAs) {

            // set current frame to zerro if it is not all ready
            state.frame = 0;

            // start saveFrames recursive loop
            saveFrames();

            // no saveAs
        } else {

            throw new Error('toPngCollection needs filesaver.js. See the README.');

        }

    };

    return api;

}
    ());

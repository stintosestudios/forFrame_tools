/*
 *    forFrame.js ( hacked over for forFrame_tools, possible 2.x )
 *    Copyright 2016, 2017 by stintose studios (GPL v3)
 *    https://github.com/stintosestudios/forFrame
 *
 */

var scene = (function () {

    var state = {

        projectName : 'untitled',
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

    },

    plugins = {},

    // The Skin Class is used to skin a Part with an image
    Skin = function (part, skinOptions) {

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

        // projectName
        state.projectName = options.projectName ? options.projectName: 'untitled';

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

    // inject plugins
    api.injectPlugin = function (plugObj) {

        if (plugObj.name) {

            // just reference for now
            plugins[plugObj.name] = plugObj;

            api[plugObj.name] = function () {

                plugins[plugObj.name].method.call(state, arguments)
            };

        }

    },

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
        ())

    return api;

}
    ());


scene.injectPlugin({

    name : 'toPNGCollection',

    // convert your animation to a *.png file collection
    method : function (scope) {
		
		var self = this,

        saveFrames = function () {

            scene.setFrame(self.frame);
            scene.renderFrame(scope[0]);

			console.log(self);
			
            self.canvas.toBlob(function (blob) {

                saveAs(blob, 'frame_' + self.frame + '.png');

                self.frame += 1;
                if (self.frame < self.maxFrame) {

                    saveFrames();

                } else {

                    self.frame = 0;
                    scene.setFrame(0);
                    scene.renderFrame(scope[0]);
                }

            });

        };

        if (scope[0] === undefined) {

            scope[0] = {};

        }

        // test for "saveAs" global as this methods requiers filesaver.js
        if (saveAs) {

            // set current frame to zerro if it is not all ready
            this.frame = 0;

            // start saveFrames recursive loop
            saveFrames();

            // no saveAs
        } else {

            throw new Error('toPngCollection needs filesaver.js. See the README.');

        }

    }

});

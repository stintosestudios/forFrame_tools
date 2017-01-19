// inject a canvas into the given id

/*
scene.injectCanvas = function (id) {

state.canvas = document.createElement('canvas');
state.ctx = state.canvas.getContext('2d');

state.canvas.width = state.viewPort.w;
state.canvas.height = state.viewPort.h;

state.ctx.fillStyle = 'black';
state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

document.getElementById(id).appendChild(state.canvas);

};
 */

scene.injectPlugin({

    name : 'injectCanvas',

    method : function (id) {

        console.log('looking good');
        console.log(id[0]);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.viewPort.w;
        this.canvas.height = this.viewPort.h;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        document.getElementById(id[0]).appendChild(this.canvas);

    }

});

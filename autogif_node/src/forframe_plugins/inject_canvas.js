
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

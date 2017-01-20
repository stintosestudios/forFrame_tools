
scene.injectPlugin({

    name : 'injectCanvas',

    method : function (id) {

        var container = document.createElement('div'),
        title = document.createElement('p');

        container.style.background = '#5a5a5a';
        container.style.padding = '10px';
        container.style.margin = '10px';

        title.innerHTML = 'forFrame.js injectCanvas plugin - ' + scene.state.projectName;

        container.appendChild(title);

        // the canvase
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.viewPort.w;
        this.canvas.height = this.viewPort.h;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        container.appendChild(this.canvas);

        document.getElementById(id[0]).appendChild(container);

    }

});

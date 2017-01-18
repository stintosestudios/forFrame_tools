
var self = this;

self.addEventListener('message', function (state) {

    //console.log('i am web wroker');
    console.log(self)

    self.postMessage('anything');

}, false);

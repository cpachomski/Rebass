"use strict";

var AudioSnippet = (function() {
  var AudioSnippetProto = Object.create(HTMLElement.prototype);
  var context = new AudioContext();
  var color_arr = ["#00FF00", "00FFFF", "#FF3300", "#FFFF00", "#FF00FF"];
  var rand_color = color_arr[Math.floor(Math.random()*color_arr.length)];
  var frameLooper = function () {
    $("audio-snippet").each(function(index, ele){
      ele.draw();
    });
    window.requestAnimationFrame(frameLooper);
  }

  frameLooper();

  AudioSnippetProto.createdCallback = function() {
    console.log('<audio-snippet>.createdCallback', this);
    var snip = new Audio();
    snip.controls = "true";
    this.analyser = context.createAnalyser();
    this.canvas = document.createElement('canvas');
    this.audio = snip;
    this.appendChild(snip);
    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.source = context.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    this.analyser.connect(context.destination);
  };

  AudioSnippetProto.attachedCallback = function() {


    var currentSnippet = this;
    $( currentSnippet ).draggable(
      {
        drag: function(){
            var offset = $(currentSnippet).offset();
            var newCueIn = (offset.left)/20;
            $('#'+ currentSnippet.id)
            currentSnippet.dataset.cueIn = newCueIn;
            currentSnippet.dataset.cueOut = (newCueIn + this.audio.duration);
        },
        axis: 'x',
        containment: 'document',
        stop: function(){
          $('#currentCue'+ currentSnippet.id).text("Cue In: " + currentSnippet.dataset.cueIn)
          $('#currentCue'+ currentSnippet.id).css('color','white')

        }
      }
    );

    console.log('<audio-snippet>.attachedCallback', this);

  };

  AudioSnippetProto.detachedCallback = function() {

  };

  AudioSnippetProto.attributeChangedCallback = function(attr, oldVal, newVal) {
    console.log('<audio-snippet>.attributeChangedCallback', attr, oldVal, newVal);
    switch (attr) {
    case 'src':
      this.audio.src = newVal;
      break;
    }
  };

  AudioSnippetProto.draw = function() {
    var fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(fbc_array);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = rand_color // Color of the bars
    var bars = 100;
    for (var i = 0; i < bars; i++) {
      var bar_x = i * 3,
        bar_width = 2,
        bar_height = -(fbc_array[i] / 2);
     this.ctx.fillRect(bar_x, this.canvas.height, bar_width, bar_height);
    }
  };

return document.registerElement('audio-snippet', {prototype: AudioSnippetProto});
})();


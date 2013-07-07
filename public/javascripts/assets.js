var Assets = {

  sources: [
    { key: 'client', value: 'images/character-sprite.jpg' }
  ],

  images: [],

  loadedImages: 0,

  numberOfImages: 0,

  init: function (finishedLoading) {
    Assets.numberOfImages = Assets.sources.length;

    $.each(Assets.sources, function (i, source) {
      Assets.images[source.key] = new Image();

      Assets.images[source.key].onload = function () {
        if (++Assets.loadedImages == Assets.numberOfImages) {
          finishedLoading();
        }
      }
      
      Assets.images[source.key].src = source.value;
    });
  }

};

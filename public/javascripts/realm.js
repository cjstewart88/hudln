var Realm = {

  dimensions: {
    width:  800,
    height: 600
  },

  canvas: null,

  canvasContext: null,

  tiles: {},

  init: function () {
    Realm.canvas = document.getElementById("realm");
    Realm.canvasContext = Realm.canvas.getContext('2d');
    Realm.generateTiles();

    Character.init();
    Character.sprite.onload = function () {
      Realm.draw();
    };
  },

  draw: function () {
    // clear the canvas for redrawing
    Realm.canvas.width   = Realm.canvas.height = 0;
    Realm.canvas.width   = Realm.dimensions.width;
    Realm.canvas.height  = Realm.dimensions.height;

    // draw yourself ... always in the center
    Realm.canvasContext.drawImage(Character.sprite, Character.spriteSX, Character.spriteSY, 25, 32, Math.floor(Realm.dimensions.width/2), Math.floor(Realm.dimensions.height/2), 24, 32);

    Realm.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    Realm.canvasContext.fillRect((Character.x-0)*-1, (Character.y-0)*-1, 10, 10);

    // draw all the client specific realm items
    $.each(Realm.tiles, function (key, tile) {
      $.each(tile.items, function () {
        itemX = (Character.x-this.itemX)*-1;
        itemY = (Character.y-this.itemY)*-1;

        Realm.canvasContext.fillStyle = 'rgb(66, 219, 212)';
        Realm.canvasContext.fillRect(itemX, itemY, 10, 10);
      });
    });
  },

  generateTiles: function () {
    var tileKey; // minX maxX minY max Y

    var topLeftPoint = {
      x: Math.floor(Character.x/Realm.dimensions.width)*Realm.dimensions.width,
      y: Math.floor(Character.y/Realm.dimensions.height)*Realm.dimensions.height
    };

    // center
    tileKey = topLeftPoint.x + ' ' + (topLeftPoint.x+Realm.dimensions.width) + ' ' + topLeftPoint.y + ' ' + (topLeftPoint.y+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // top center
    tileKey = topLeftPoint.x + ' ' + (topLeftPoint.x+Realm.dimensions.width) + ' ' + (topLeftPoint.y-Realm.dimensions.height) + ' ' + topLeftPoint.y;
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // top left
    tileKey = (topLeftPoint.x-Realm.dimensions.width) + ' ' + topLeftPoint.x + ' ' + (topLeftPoint.y-Realm.dimensions.height) + ' ' + topLeftPoint.y;
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // top right
    tileKey = (topLeftPoint.x+Realm.dimensions.width) + ' ' + (topLeftPoint.x+Realm.dimensions.width+Realm.dimensions.width) + ' ' + (topLeftPoint.y-Realm.dimensions.height) + ' ' + topLeftPoint.y;
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // left
    tileKey = (topLeftPoint.x-Realm.dimensions.width) + ' ' + topLeftPoint.x + ' ' + topLeftPoint.y + ' ' + (topLeftPoint.y+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // right
    tileKey = (topLeftPoint.x+Realm.dimensions.width) + ' ' + (topLeftPoint.x+Realm.dimensions.width+Realm.dimensions.width) + ' ' + topLeftPoint.y + ' ' + (topLeftPoint.y+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // bottom center
    tileKey = topLeftPoint.x + ' ' + (topLeftPoint.x+Realm.dimensions.width) + ' ' + (topLeftPoint.y+Realm.dimensions.height) + ' ' + (topLeftPoint.y+Realm.dimensions.height+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // bottom left
    tileKey = (topLeftPoint.x-Realm.dimensions.width) + ' ' + topLeftPoint.x + ' ' + (topLeftPoint.y+Realm.dimensions.height) + ' ' + (topLeftPoint.y+Realm.dimensions.height+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }

    // bottom right
    tileKey = (topLeftPoint.x+Realm.dimensions.width) + ' ' + (topLeftPoint.x+Realm.dimensions.width+Realm.dimensions.width) + ' ' + (topLeftPoint.y+Realm.dimensions.height) + ' ' + (topLeftPoint.y+Realm.dimensions.height+Realm.dimensions.height);
    if (Realm.tiles[tileKey] === undefined) {
      Realm.generateItems(tileKey);
    }
  },

  generateItems: function (tileKey) {
    Realm.tiles[tileKey] = {
      items: []
    };

    var minMax  = tileKey.split(' ');

    for (var i = 0; i < 5; i++) {
      Realm.tiles[tileKey].items.push({
        itemID:   i,
        itemX:    Math.floor(Math.random() * (parseInt(minMax[1]) - parseInt(minMax[0])) + parseInt(minMax[0])),
        itemY:    Math.floor(Math.random() * (parseInt(minMax[3]) - parseInt(minMax[2])) + parseInt(minMax[2]))
      });
    }
  }
  
};
(function() {
	var realm        = document.getElementById("realm");
  var realmContext = realm.getContext('2d');

  var me = {
    x:          0,
    y:          0,
    spriteSX:   23,
    spriteSY:   64,
    resources:  0
  };

  var realmTiles = {};
  generateTiles();

  var character = new Image();
  character.src = "images/char3.png";

  character.onload = function () {
    drawRealm();
  }

  function drawRealm () {
    // my cords
    var myX = me.x;
    var myY = me.y;
    console.log(myX, myY)
    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    realm.width   = 800;
    realm.height  = 600;

    // draw yourself ... always in the center
    realmContext.drawImage(character, me.spriteSX, me.spriteSY, 25, 32, 400, 300, 24, 32);

    realmContext.fillStyle = 'rgb(0, 0, 0)';
    realmContext.fillRect((myX-0)*-1, (myY-0)*-1, 10, 10);

    // draw all the client specific realm items
    $.each(realmTiles, function (key, tile) {
      $.each(tile, function () {
        itemX = (myX-this.itemX)*-1;
        itemY = (myY-this.itemY)*-1;

        realmContext.fillStyle = this.color;
        realmContext.fillRect(itemX, itemY, 10, 10);
      });
    });
  }

  function updateHud (to_update, value) {
    $('#'+to_update).text(value);
  }

  // Client Contols
	$(document).keydown(function (e) {
	  var key = e.keyCode;

	  if (key == 32) {
	    e.preventDefault();
	    pickupItem();
	  }
	  else if (key == 37 || key == 39 || key == 38 || key == 40) {
	    e.preventDefault();

      var direction;
      if      (key == 37) direction = "left";
      else if (key == 39) direction = "right";
      else if (key == 38) direction = "up";
      else if (key == 40) direction = "down";

      clientMovement(direction);
	  }
  });

  function pickupItem () {
    $.each(realmItems, function () {
      var dx    = this.itemX - (me.x + 400);
      var dy    = this.itemY - (me.y + 300);
      var dist  = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));

      if (dist <= 20 || dist == 21) {
        delete this.itemID;
        delete this.itemX;
        delete this.itemY;
        me.resources += 1;
        updateHud('resources-collected', me.resources);
      }
    });

    drawRealm();
  }

  function clientMovement (direction) {
    if (direction == "left") {
      me.x -= 10
      me.spriteSY = 96;
    }
    else if (direction == "right") {
      me.x += 10
      me.spriteSY = 32;
    }
    else if (direction == "up") {
      me.y -= 10
      me.spriteSY = 0;
    }
    else if (direction == "down") {
      me.y += 10
      me.spriteSY = 64;
    }

    if (me.spriteSX + 23 <= 46) {
      me.spriteSX += 24
    }
    else {
      me.spriteSX = 0;
    }

    // if (me.x != 0 && (me.x*-1)/400 % 1 === 0) {
    //   if (direction == 'left') {
    //     realmItemGenerationDetails.minX -= 1600
    //     realmItemGenerationDetails.maxX -= 1600
    //   }
    //   else if (direction == 'right') {
    //     realmItemGenerationDetails.minX += 1600
    //     realmItemGenerationDetails.maxX += 1600
    //   }
    //   generateItems();
    // }
    // else if (me.y != 0 && (me.y*-1)/500 % 1 === 0) {
    //   if (direction == 'up') {
    //     realmItemGenerationDetails.minY -= 1200
    //     realmItemGenerationDetails.maxY -= 1200
    //   }
    //   else if (direction == 'down') {
    //     realmItemGenerationDetails.minY += 600
    //     realmItemGenerationDetails.maxY += 600
    //   }
    //   generateItems();
    // }

    drawRealm()
  }

  function generateItems (tileKey) {
    realmItems[tileKey] = [];

    var minMax  = tileKey.split(' ');
    var color   = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

    for (var i = 0; i < 100; i++) {
      realmItems[tileKey].push({
        itemID:   i,
        itemX:    Math.floor(Math.random() * (parseInt(minMax[1]) - parseInt(minMax[0])) + parseInt(minMax[0])),
        itemY:    Math.floor(Math.random() * (parseInt(minMax[3]) - parseInt(minMax[2])) + parseInt(minMax[2])),
        color:    color
      });
    }
  }

  function generateTiles () {
    var tileKey; // minX maxX minY max Y

    // center
    tileKey = me.x + ' ' + (me.x+800) + ' ' + me.y + ' ' + (me.y+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // top center
    tileKey = me.x + ' ' + (me.x+800) + ' ' + (me.y-600) + ' ' + me.y;
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // top left
    tileKey = (me.x-800) + ' ' + me.x + ' ' + (me.y-600) + ' ' + me.y;
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // top right
    tileKey = (me.x+800) + ' ' + (me.x+800+800) + ' ' + (me.y-600) + ' ' + me.y;
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // left
    tileKey = (me.x-800) + ' ' + me.x + ' ' + me.y + ' ' + (me.y+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // right
    tileKey = (me.x+800) + ' ' + (me.x+800+800) + ' ' + me.y + ' ' + (me.y+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // bottom center
    tileKey = me.x + ' ' + (me.x+800) + ' ' + (me.y+600) + ' ' + (me.y+600+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // bottom left
    tileKey = (me.x-800) + ' ' + me.x + ' ' + (me.y+600) + ' ' + (me.y+600+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    // bottom right
    tileKey = (me.x+800) + ' ' + (me.x+800+800) + ' ' + (me.y+600) + ' ' + (me.y+600+600);
    if (realmItems[tileKey] === undefined) {
      generateItems(tileKey);
    }

    console.log(realmItems)
  }
})();
(function() {
	var realm        = document.getElementById("realm");
  var realmContext = realm.getContext('2d');
  var realmItems   = [];

  var me = {
    x:          0,
    y:          0,
    spriteSX:   23,
    spriteSY:   64,
    resources:  0
  };

  generateItems(-400, 1200);

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
    realm.height  = 800;

    // draw yourself ... always in the center
    realmContext.drawImage(character, me.spriteSX, me.spriteSY, 25, 32, 400, 400, 24, 32);

    // draw all the client specific realm items
    $.each(realmItems, function (item) {
      itemX = (myX-this.itemX)*-1;
      itemY = (myY-this.itemY)*-1;

  		realmContext.fillStyle = 'rgb(234, 44, 70)';
  		realmContext.fillRect(itemX, itemY, 10, 10);
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
      var dy    = this.itemY - (me.y + 400);
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
    //   console.log('new items between', 'x', me.x*2, 'y', me.y*2)
    //   generateItems(me.x*2, me.y*2);
    // } 
    // else if (me.y != 0 && (me.y*-1)/400 % 1 === 0) {
    //   console.log('new items between', 'x', me.x*2, 'y', me.y*2)
    //   generateItems(me.x*2, me.y*2);
    // }

    drawRealm()
  }

  function generateItems (min, max) {
    for (var i = 0; i < 30; i++) {
      realmItems.push({
        itemID:   i,
        itemX:    Math.floor(Math.random() * (max - min) + min),
        itemY:    Math.floor(Math.random() * (max - min) + min)
      })
    }
  }
})();
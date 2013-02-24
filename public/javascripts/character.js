var Character = {
  
  x:          0,

  y:          0,

  spriteSX:   23,

  spriteSY:   64,

  resources:  0,

  sprite:     null,

  init: function () {
    Character.loadAssets();
    Character.bindActions();
  },

  loadAssets: function () {
    Character.sprite      = new Image();
    Character.sprite.src  = "images/char3.png";
  },

  bindActions: function () {
    $(document).keydown(function (e) {
      var key = e.keyCode;

      if (key == 32) {
        e.preventDefault();
        Character.pickupItem();
      }
      else if (key == 37 || key == 39 || key == 38 || key == 40) {
        e.preventDefault();

        var direction;
        if      (key == 37) { direction = "left";   }
        else if (key == 39) { direction = "right";  }
        else if (key == 38) { direction = "up";     }
        else if (key == 40) { direction = "down";   }

        Character.move(direction);
      }
    });
  },

  move: function (direction) {
    if (direction == "left") {
      Character.x -= 10;
      Character.spriteSY = 96;
    }
    else if (direction == "right") {
      Character.x += 10;
      Character.spriteSY = 32;
    }
    else if (direction == "up") {
      Character.y -= 10;
      Character.spriteSY = 0;
    }
    else if (direction == "down") {
      Character.y += 10;
      Character.spriteSY = 64;
    }

    if (Character.spriteSX + 23 <= 46) {
      Character.spriteSX += 24;
    }
    else {
      Character.spriteSX = 0;
    }

    if (Character.x != 0 && (Character.x*-1)/800 % 1 === 0) {
      Realm.generateTiles();
    }
    else if (Character.y != 0 && (Character.y*-1)/600 % 1 === 0) {
      Realm.generateTiles();
    }

    Realm.draw();
  },

  pickupItem: function () {
    $.each(Realm.tiles, function (key, tile) {
      $.each(tile.items, function () {
        var dx    = this.itemX - (Character.x + 400);
        var dy    = this.itemY - (Character.y + 300);
        var dist  = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));

        if (dist <= 20 || dist == 21) {
          delete this.itemID;
          delete this.itemX;
          delete this.itemY;
          Character.resources += 1;
          Character.updateHud('resources-collected', Character.resources);
        }
      });
    });

    Realm.draw();
  },

  updateHud: function (to_update, value) {
    $('#'+to_update).text(value);
  }

};
var Character = {
  
  x:          0,

  y:          0,

  spriteSX:   23,

  spriteSY:   64,

  resources:  0,

  init: function () {

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
  },

  pickupItem: function () {
    $.each(Realm.objects, function (i, object) {
      var dx    = this.x - (Character.x + 400);
      var dy    = this.y - (Character.y + 300);
      var dist  = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));

      if (dist <= 20 || dist == 21) {
        Realm.objects.splice(i, 1);
        Character.resources += 1;
        Character.updateHud('resources-collected', Character.resources);
      }
    });
  },

  updateHud: function (to_update, value) {
    $('#'+to_update).text(value);
  }

};
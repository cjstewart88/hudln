var Character = {
  
  x:          0,

  y:          0,

  spriteSX:   23,

  spriteSY:   64,

  resources:  0,

  init: function () {

  },

  move: function (direction) {
    if (direction == "left" && Character.x - 10 >= 0 && Character.x != 0) {
      Character.x -= 10;
      Character.spriteSY = 96;
    }
    else if (direction == "right" && Character.x + 10 <= 2000 && Character.x != 2000) {
      Character.x += 10;
      Character.spriteSY = 32;
    }
    else if (direction == "up" && Character.y - 10 >= 0 && Character.y != 0) {
      Character.y -= 10;
      Character.spriteSY = 0;
    }
    else if (direction == "down" && Character.y + 10 <= 2000 && Character.y != 2000) {
      Character.y += 10;
      Character.spriteSY = 64;
    }
    else {
      return;
    }

    if (Character.spriteSX + 23 <= 46) {
      Character.spriteSX += 24;
    }
    else {
      Character.spriteSX = 0;
    }
  },

  gatherResources: function () {
    for (var i = 0; Realm.resourceNodes.length > i; i++) {
      var resourceNode = Realm.resourceNodes[i];

      var dx    = resourceNode.properties.x - (Character.x + 5);
      var dy    = resourceNode.properties.y - (Character.y + 5);
      var dist  = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));

      if (dist <= 20 || dist == 21) {
        Character.resources += resourceNode.properties.value;
        Character.updateHud('resources-collected', Character.resources);
        Realm.resourceNodes.splice(i, 1);
      }
    }
  },

  updateHud: function (to_update, value) {
    $('#'+to_update).text(value);
  }

};
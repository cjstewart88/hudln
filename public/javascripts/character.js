var Character = {
  
  x:          0,

  y:          0,

  spriteSX:   0,

  spriteSY:   12,

  resources:  0,

  counter: 2,

  init: function () {

  },

  move: function (direction) {
    if (--Character.counter > 0) { return; };

    if (direction == "left" && Character.x - 10 >= 0 && Character.x != 0) {
      Character.x -= 10;
      Character.spriteSY = 44;
    }
    else if (direction == "right" && Character.x + 10 <= 2000 && Character.x != 2000) {
      Character.x += 10;
      Character.spriteSY = 76;
    }
    else if (direction == "up" && Character.y - 10 >= 0 && Character.y != 0) {
      Character.y -= 10;
      Character.spriteSY = 108;
    }
    else if (direction == "down" && Character.y + 10 <= 2000 && Character.y != 2000) {
      Character.y += 10;
      Character.spriteSY = 12;
    }
    else {
      return;
    }
    
    Character.counter = 2;

    if (Character.spriteSX + 16 <= 48) {
      Character.spriteSX += 16;
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
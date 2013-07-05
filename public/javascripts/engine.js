var Engine = {

  canvas: null,

  canvasContext: null,

  init: function () {
    Engine.canvas = document.getElementById('realm');
    Engine.canvasContext = Engine.canvas.getContext('2d');

    Engine.bindActions();

    Realm.init();

    Assets.init(function () {
      Engine.draw();
    });
  },

  draw: function () {
    requestAnimationFrame(Engine.draw);

    // clear the canvas for redrawing
    Engine.canvas.width   = Engine.canvas.height = 0;
    Engine.canvas.width   = 800;
    Engine.canvas.height  = 600;

    Engine.drawClient();
    Engine.drawSurroundingObjects();

    // draw a random black square at 0,0 every time
    Engine.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    Engine.canvasContext.fillRect((Character.x-0)*-1, (Character.y-0)*-1, 10, 10);
  },

  // draw yourself ... always in the center
  drawClient: function () {
    Engine.canvasContext.drawImage(Assets.images.client, Character.spriteSX, Character.spriteSY, 25, 32, Math.floor(Engine.canvas.width/2), Math.floor(Engine.canvas.height/2), 24, 32);
  },

  drawSurroundingObjects: function () {
    $.each(Realm.objects, function (i, object) {
      itemX = (Character.x-object.x)*-1;
      itemY = (Character.y-object.y)*-1;

      Engine.canvasContext.fillStyle = 'rgb(66, 219, 212)';
      Engine.canvasContext.fillRect(itemX, itemY, 10, 10);
    });
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
  }

};

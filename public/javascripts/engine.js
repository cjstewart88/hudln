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

    Engine.drawBounderies();
    Engine.drawClient();
    Engine.drawResourceNodes();
  },

  drawBounderies: function () {
    if      (Character.y < 300)  Engine.canvasContext.fillRect(0 , 0, 800, 300-Character.y)    
    else if (Character.y > 1600) Engine.canvasContext.fillRect(0, 2320-Character.y, 800, 300);
    if      (Character.x < 400)  Engine.canvasContext.fillRect(0, 0, 400-Character.x, 600);
    else if (Character.x > 1600) Engine.canvasContext.fillRect(2420-Character.x, 0, 400, 600);
  },

  // draw yourself ... always in the center
  drawClient: function () {
    Engine.canvasContext.drawImage(Assets.images.client, Character.spriteSX, Character.spriteSY, 16, 19, Math.floor(Engine.canvas.width/2), Math.floor(Engine.canvas.height/2), 16, 19);
  },

  drawResourceNodes: function () {
    $.each(Realm.resourceNodes, function (i, resourceNode) {
      itemX = (Character.x-resourceNode.properties.x-400)*-1;
      itemY = (Character.y-resourceNode.properties.y-300)*-1;

      Engine.canvasContext.fillStyle = 'rgb(66, 219, 212)';
      Engine.canvasContext.fillRect(itemX, itemY, 10, 10);
    });
  },

  bindActions: function () {
    $(document).keydown(function (e) {
      var key = e.keyCode;

      if (key == 32) {
        e.preventDefault();
        Character.gatherResources();
      }
      else if (key == 37 || key == 39 || key == 38 || key == 40) {
        e.preventDefault();

        var direction;
        if      (key == 37) { direction = "left";  }
        else if (key == 39) { direction = "right"; }
        else if (key == 38) { direction = "up";    }
        else if (key == 40) { direction = "down";  }

        Character.move(direction);
      }
    }).keyup(function (e) {
      var key = e.keyCode;

      if (key == 37 || key == 39 || key == 38 || key == 40) {
        Character.counter = 0;
      }
    });
  }

};

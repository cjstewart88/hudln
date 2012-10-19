(function() {
	var realm           = document.getElementById("realm");
  var realm_context   = realm.getContext('2d');

  var me = {
    x:          0,
    y:          0,
    sprite_sx:  23,
    sprite_sy:  64,
    tick:       0,
    resources:  0
  };
  
  var realm_items = generate_items();
  
  var character = new Image();
  character.src = "images/char3.png";
  
  character.onload = function () {
    draw_realm();
  }
  
  function draw_realm () {
    // my cords
    var my_x = me.x;
    var my_y = me.y;

    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    realm.width   = 800; 
    realm.height  = 600;

		// draw realm boundaries if player is anywhere near them
		realm_context.fillStyle = 'rgb(0, 0, 0)';
		if      (my_y < 300)  realm_context.fillRect(0 , 0, 800, 300-my_y)
		else if (my_y > 1600) realm_context.fillRect(0, 2320-my_y, 800, 300);

		if      (my_x < 400)  realm_context.fillRect(0, 0, 400-my_x, 600);
		else if (my_x > 1600) realm_context.fillRect(2420-my_x, 0, 400, 600);
		
    // draw yourself ... always in the center
    realm_context.drawImage(character, me.sprite_sx, me.sprite_sy, 25, 32, 400, 300, 24, 32);
    
    // draw all the client specific realm items
    $.each(realm_items, function (item) {
      item_x = (my_x-this.item_x-400)*-1;
      item_y = (my_y-this.item_y-300)*-1;
      
  		realm_context.fillStyle = 'rgb(234, 44, 70)';
  		realm_context.fillRect(item_x, item_y, 10, 10);
    });
  }
  
  function update_hud (to_update, value) {
    $('#'+to_update).text(value);
  }
  
  // Client Contols
	$(document).keydown(function (e) { 
	  var key = e.keyCode;
	   
	  if (key == 32) {
	    e.preventDefault();
	    pickup_item();
	  }
	  else if (key == 37 || key == 39 || key == 38 || key == 40) {
	    e.preventDefault();
	    client_movement(key);
	  }
  });

  function pickup_item () {
    $.each(realm_items, function () {
      var dx    = this.item_x - (me.x + 5);
      var dy    = this.item_y - (me.y + 5);
      var dist  = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));

      if (dist <= 20 || dist == 21) {
        delete this.item_id;
        delete this.item_x;
        delete this.item_y;
        me.resources += 1;
        update_hud('resources-collected', me.resources);
      }
    });

    draw_realm();
  }
  
  function client_movement (key) {
    me.tick += 1;
    if (me.tick%2 != 0) return;
    
    var direction = null;
	  
    if      (key == 37) direction = "left";
    else if (key == 39) direction = "right";
    else if (key == 38) direction = "up";
    else if (key == 40) direction = "down";
    
    var old_x = me.x;
    var old_y = me.y;
          
    if (direction == "left"  && me.x - 10 >= 0 && me.x != 0) {     
      me.x -= 10
      me.sprite_sy = 96;
    }
    else if (direction == "right" && me.x + 10 <= 2000 && me.x != 2000) {
      me.x += 10
      me.sprite_sy = 32;
    }
    else if (direction == "up" && me.y - 10 >= 0 && me.y != 0) {
      me.y -= 10
      me.sprite_sy = 0;
    }
    else if (direction == "down" && me.y + 10 <= 2000 && me.y != 2000) {
      me.y += 10
      me.sprite_sy = 64;
    }
    
    if (me.sprite_sx + 23 <= 46) {
      me.sprite_sx += 24
    }
    else {
      me.sprite_sx = 0;
    }
    
    if (old_x != me.x || old_y != me.y) draw_realm();
  }
  
  function generate_items () {
    var generated_items = [];

    for (var i = 0; i < 100; i++) {
      generated_items.push({
        item_id:  i,
        item_x:   Math.floor(Math.random()*190)*10,
        item_y:   Math.floor(Math.random()*190)*10
      })
    }

    return generated_items;
  }
})();
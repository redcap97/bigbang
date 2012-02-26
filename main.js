const ENCHANTJS_IMAGE_PATH = "enchantjs/images/";

window.onload = function () {
  enchant();

  var game = new Game(320, 320);
  game.scale = 3.0;
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif');
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
  game.onload = function () {
    var scene = new Scene();

    var map = new Map(16, 16);
    map.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
    var mapData = [
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [4, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
    ];

    var colMap = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    map.loadData(mapData);
    map.collisionData = colMap;

    var sprite = new Sprite(32, 32);
    sprite.x = 16;

    sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'chara0.gif'];
    game.addEventListener('enterframe', function(){
      if(!map.hitTest(sprite.x + 24, 16)){
        sprite.x += 1;
      }
    });

    scene.addChild(map);
    scene.addChild(sprite);

    game.pushScene(scene);
  };
  game.start();
}

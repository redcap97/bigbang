(function() {
  var BattleStage, Bomberman, ENCHANTJS_IMAGE_PATH, StageObject;

  BattleStage = (function() {

    function BattleStage() {
      var b, f;
      this.tileSize = 16;
      b = new StageObject(4, true);
      f = new StageObject(0, false);
      this.dataMap = [[b, b, b, b, b, b, b, b, b, b, b, b, b, b, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]];
      this.viewMap = [[], [], [], [], [], [], [], [], [], [], [], [], []];
      this.bomberman = new Bomberman(this, 16, 16);
      this.updateMaps();
    }

    BattleStage.prototype.update = function(input) {
      this.updateMaps();
      return this.bomberman.update(input);
    };

    BattleStage.prototype.updateMaps = function() {
      var i, j, _ref, _ref2, _ref3, _results;
      for (i = 0, _ref = this.dataMap.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        for (j = 0, _ref2 = this.dataMap[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
          this.dataMap[i][j].update();
        }
      }
      _results = [];
      for (i = 0, _ref3 = this.dataMap.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        _results.push((function() {
          var _ref4, _results2;
          _results2 = [];
          for (j = 0, _ref4 = this.dataMap[i].length; 0 <= _ref4 ? j < _ref4 : j > _ref4; 0 <= _ref4 ? j++ : j--) {
            _results2.push(this.viewMap[i][j] = this.dataMap[i][j].id);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    BattleStage.prototype.getIndex = function(x, y) {
      if (x < 0 || x >= this.tileSize * this.dataMap[0].length || y < 0 || y >= this.tileSize * this.dataMap.length) {
        return null;
      }
      x = x / this.tileSize | 0;
      y = y / this.tileSize | 0;
      return {
        x: x,
        y: y
      };
    };

    return BattleStage;

  })();

  Bomberman = (function() {

    function Bomberman(stage, x, y) {
      this.stage = stage;
      this.x = x;
      this.y = y;
      this.power = this.speed = this.bombCapacity = 1;
      this.canThrow = this.canKick = false;
      this.width = this.height = this.stage.tileSize;
    }

    Bomberman.prototype.update = function(input) {
      var pos;
      pos = this.nextPosition(input);
      if (!this.hitTest(pos)) return this.move(pos);
    };

    Bomberman.prototype.nextPosition = function(input) {
      var pos;
      pos = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
      if (input.left) {
        pos.x -= this.speed;
      } else if (input.right) {
        pos.x += this.speed;
      } else if (input.up) {
        pos.y -= this.speed;
      } else if (input.down) {
        pos.y += this.speed;
      }
      return pos;
    };

    Bomberman.prototype.move = function(pos) {
      this.x = pos.x;
      return this.y = pos.y;
    };

    Bomberman.prototype.hitTest = function(other) {
      var p;
      p = this.stage.getIndex(other.x, other.y);
      if (this.stage.dataMap[p.y][p.x].isBarrier) return true;
      p = this.stage.getIndex(other.x + other.width - 1, other.y);
      if (this.stage.dataMap[p.y][p.x].isBarrier) return true;
      p = this.stage.getIndex(other.x, other.y + other.height - 1);
      if (this.stage.dataMap[p.y][p.x].isBarrier) return true;
      p = this.stage.getIndex(other.x + other.width - 1, other.y + other.height - 1);
      if (this.stage.dataMap[p.y][p.x].isBarrier) return true;
      return false;
    };

    return Bomberman;

  })();

  ENCHANTJS_IMAGE_PATH = "enchantjs/images/";

  window.onload = function() {
    var game;
    game = new enchant.Game(320, 320);
    game.scale = 3.0;
    game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
    game.onload = function() {
      var scene, sprite, stage, stageModel;
      stageModel = new BattleStage();
      stage = new enchant.Map(16, 16);
      stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      stage.loadData(stageModel.viewMap);
      sprite = new enchant.Sprite(16, 16);
      sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      sprite.x = sprite.y = 16;
      sprite.frame = [2];
      game.addEventListener('enterframe', function() {
        stageModel.update(game.input);
        sprite.x = stageModel.bomberman.x;
        return sprite.y = stageModel.bomberman.y;
      });
      scene = new enchant.Scene();
      scene.addChild(stage);
      scene.addChild(sprite);
      return game.pushScene(scene);
    };
    return game.start();
  };

  StageObject = (function() {

    function StageObject(id, isBarrier) {
      this.id = id;
      this.isBarrier = isBarrier;
    }

    StageObject.prototype.update = function() {};

    return StageObject;

  })();

}).call(this);

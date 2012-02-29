(function() {
  var BattleStage, Bomberman, ENCHANTJS_IMAGE_PATH, Rect, StageObject,
    __slice = Array.prototype.slice;

  BattleStage = (function() {

    BattleStage.prototype.OUTSIDE_OF_STAGE_ERROR = "Point is outside of the stage";

    function BattleStage() {
      var b, f;
      this.tileSize = 16;
      b = new StageObject(4, true);
      f = new StageObject(0, false);
      this.dataMap = [[b, b, b, b, b, b, b, b, b, b, b, b, b, b, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]];
      this.viewMap = [[], [], [], [], [], [], [], [], [], [], [], [], []];
      this.bomberman = new Bomberman(this, this.tileSize, this.tileSize);
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
        throw new Error(this.OUTSIDE_OF_STAGE_ERROR);
      }
      x = x / this.tileSize | 0;
      y = y / this.tileSize | 0;
      return {
        x: x,
        y: y
      };
    };

    BattleStage.prototype.getXIndexes = function() {
      var rs, x, xs, _i, _len;
      xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      rs = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (x < 0 || x >= this.tileSize * this.dataMap[0].length) {
          throw new Error(this.OUTSIDE_OF_STAGE_ERROR);
        }
        rs.push(x / this.tileSize | 0);
      }
      return rs;
    };

    BattleStage.prototype.getYIndexes = function() {
      var rs, y, ys, _i, _len;
      ys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      rs = [];
      for (_i = 0, _len = ys.length; _i < _len; _i++) {
        y = ys[_i];
        if (y < 0 || y >= this.tileSize * this.dataMap.length) {
          throw new Error(this.OUTSIDE_OF_STAGE_ERROR);
        }
        rs.push(y / this.tileSize | 0);
      }
      return rs;
    };

    BattleStage.prototype.toString = function() {
      var ix;
      ix = this.bomberman.getCurrentIndex();
      return "Index of Bomberman: " + ix.y + ", " + ix.x;
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
      var r;
      r = this.nextPosition(input);
      if (!this.hitTest(r)) return this.move(r);
    };

    Bomberman.prototype.nextPosition = function(input) {
      var r;
      r = this.getRect();
      if (input.left) {
        r.x -= this.speed;
      } else if (input.right) {
        r.x += this.speed;
      } else if (input.up) {
        r.y -= this.speed;
      } else if (input.down) {
        r.y += this.speed;
      }
      return r;
    };

    Bomberman.prototype.move = function(r) {
      this.x = r.x;
      return this.y = r.y;
    };

    Bomberman.prototype.hitTest = function(other) {
      var i, p, ps, _i, _len;
      ps = [other.getTopLeft(), other.getTopRight(), other.getBottomLeft(), other.getBottomRight()];
      for (_i = 0, _len = ps.length; _i < _len; _i++) {
        p = ps[_i];
        i = this.stage.getIndex(p.x, p.y);
        if (this.stage.dataMap[i.y][i.x].isBarrier) return true;
      }
      return false;
    };

    Bomberman.prototype.getRect = function() {
      return new Rect(this.x, this.y, this.width, this.height);
    };

    Bomberman.prototype.getCurrentIndex = function() {
      var i, r, xis, yis;
      i = {};
      r = this.getRect();
      xis = this.stage.getXIndexes(r.getLeft(), r.getRight());
      if (xis[0] === xis[1]) {
        i.x = xis[0];
      } else {
        if (((xis[1] * this.stage.tileSize) - this.x) > (this.width / 2 | 0)) {
          i.x = xis[0];
        } else {
          i.x = xis[1];
        }
      }
      yis = this.stage.getYIndexes(r.getTop(), r.getBottom());
      if (yis[0] === yis[1]) {
        i.y = yis[0];
      } else {
        if (((yis[1] * this.stage.tileSize) - this.y) > (this.height / 2 | 0)) {
          i.y = yis[0];
        } else {
          i.y = yis[1];
        }
      }
      return i;
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
      var label, scene, sprite, stage, stageModel;
      stageModel = new BattleStage();
      stage = new enchant.Map(16, 16);
      stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      stage.loadData(stageModel.viewMap);
      sprite = new enchant.Sprite(16, 16);
      sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      sprite.x = sprite.y = 16;
      sprite.frame = [2];
      label = new enchant.Label();
      label.color = "white";
      label.x = 4;
      game.addEventListener('enterframe', function() {
        stageModel.update(game.input);
        sprite.x = stageModel.bomberman.x;
        sprite.y = stageModel.bomberman.y;
        return label.text = stageModel.toString();
      });
      scene = new enchant.Scene();
      scene.addChild(stage);
      scene.addChild(sprite);
      scene.addChild(label);
      return game.pushScene(scene);
    };
    return game.start();
  };

  Rect = (function() {

    function Rect(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    Rect.prototype.getLeft = function() {
      return this.x;
    };

    Rect.prototype.getRight = function() {
      return this.x + this.width - 1;
    };

    Rect.prototype.getTop = function() {
      return this.y;
    };

    Rect.prototype.getBottom = function() {
      return this.y + this.height - 1;
    };

    Rect.prototype.getTopLeft = function() {
      return {
        x: this.getLeft(),
        y: this.getTop()
      };
    };

    Rect.prototype.getTopRight = function() {
      return {
        x: this.getRight(),
        y: this.getTop()
      };
    };

    Rect.prototype.getBottomLeft = function() {
      return {
        x: this.getLeft(),
        y: this.getBottom()
      };
    };

    Rect.prototype.getBottomRight = function() {
      return {
        x: this.getRight(),
        y: this.getBottom()
      };
    };

    return Rect;

  })();

  StageObject = (function() {

    function StageObject(id, isBarrier) {
      this.id = id;
      this.isBarrier = isBarrier;
    }

    StageObject.prototype.update = function() {};

    return StageObject;

  })();

}).call(this);

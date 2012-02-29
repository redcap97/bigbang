(function() {
  var BattleStage, Bomberman, ENCHANTJS_IMAGE_PATH, Point, Rect, StageObject,
    __slice = Array.prototype.slice;

  BattleStage = (function() {

    BattleStage.prototype.OUTSIDE_OF_STAGE_ERROR = "Point is outside of the stage";

    function BattleStage() {
      var b, f;
      this.tileSize = 16;
      b = new StageObject(4, true);
      f = new StageObject(0, false);
      this.dataMap = [[b, b, b, b, b, b, b, b, b, b, b, b, b, b, b], [b, b, b, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, b, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]];
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

    BattleStage.prototype.isBarrier = function(ix, iy) {
      return this.dataMap[iy][ix].isBarrier;
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
      this.power = this.speed = this.bombCapacity = 2;
      this.canThrow = this.canKick = false;
      this.width = this.height = this.stage.tileSize;
    }

    Bomberman.prototype.update = function(input) {
      if (input.right) {
        return this.moveRight();
      } else if (input.down) {
        return this.moveDown();
      } else if (input.left) {
        return this.moveLeft();
      } else if (input.up) {
        return this.moveUp();
      }
    };

    Bomberman.prototype.move = function(r) {
      this.x = r.x;
      return this.y = r.y;
    };

    Bomberman.prototype.onBarrier = function(ni) {
      var oi;
      oi = this.getCurrentIndex();
      return this.stage.isBarrier(oi.x, oi.y) && oi.equals(ni);
    };

    Bomberman.prototype.moveRight = function() {
      var b, ib, il, ir, it, new_rect, ni, oi, old_rect, _ref, _ref2;
      old_rect = this.getRect();
      new_rect = this.getRect(this.speed, 0);
      _ref = this.stage.getXIndexes(new_rect.getLeft(), new_rect.getRight()), il = _ref[0], ir = _ref[1];
      _ref2 = this.stage.getYIndexes(new_rect.getTop(), new_rect.getBottom()), it = _ref2[0], ib = _ref2[1];
      oi = this.getIndex(old_rect);
      ni = this.getIndex(new_rect);
      if ((il !== ir) && this.stage.isBarrier(ir, it) && this.stage.isBarrier(il, it)) {
        return false;
      }
      if (!this.stage.isBarrier(ir, it) && !this.stage.isBarrier(ir, ib)) {
        this.move(new_rect);
        return true;
      }
      if ((il === ir || it === ib) && this.onBarrier(ni)) {
        this.move(new_rect);
        return true;
      }
      b = ir * this.stage.tileSize - 1;
      if (b === old_rect.getRight()) {
        new_rect = this.getRect(0, -this.speed);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(ir, it) && (!this.stage.isBarrier(il, it) || this.onBarrier(ni))) {
          if (it * this.stage.tileSize > new_rect.getTop()) {
            new_rect.y = it * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
        new_rect = this.getRect(0, this.speed);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(ir, ib) && (!this.stage.isBarrier(il, ib) || this.onBarrier(ni))) {
          if (ib * this.stage.tileSize < new_rect.getTop()) {
            new_rect.y = ib * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
      } else if (b > old_rect.getRight()) {
        this.move(this.getRect(b - old_rect.getRight(), 0));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveDown = function() {
      var b, ib, il, ir, it, new_rect, ni, oi, old_rect, _ref, _ref2;
      old_rect = this.getRect();
      new_rect = this.getRect(0, this.speed);
      _ref = this.stage.getXIndexes(new_rect.getLeft(), new_rect.getRight()), il = _ref[0], ir = _ref[1];
      _ref2 = this.stage.getYIndexes(new_rect.getTop(), new_rect.getBottom()), it = _ref2[0], ib = _ref2[1];
      oi = this.getIndex(old_rect);
      ni = this.getIndex(new_rect);
      if ((it !== ib) && this.stage.isBarrier(il, it) && this.stage.isBarrier(il, ib)) {
        return false;
      }
      if (!this.stage.isBarrier(il, ib) && !this.stage.isBarrier(ir, ib)) {
        this.move(new_rect);
        return true;
      }
      if ((il === ir || it === ib) && this.onBarrier(ni)) {
        this.move(new_rect);
        return true;
      }
      b = ib * this.stage.tileSize - 1;
      if (b === old_rect.getBottom()) {
        new_rect = this.getRect(-this.speed, 0);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(il, ib) && (!this.stage.isBarrier(il, it) || this.onBarrier(ni))) {
          if (il * this.stage.tileSize > new_rect.getLeft()) {
            new_rect.x = il * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
        new_rect = this.getRect(this.speed, 0);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(ir, ib) && (!this.stage.isBarrier(ir, it) || this.onBarrier(ni))) {
          if (ir * this.stage.tileSize < new_rect.getLeft()) {
            new_rect.x = ir * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
      } else if (b > old_rect.getBottom()) {
        this.move(this.getRect(0, b - old_rect.getBottom()));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveLeft = function() {
      var b, ib, il, ir, it, new_rect, ni, oi, old_rect, _ref, _ref2;
      old_rect = this.getRect();
      new_rect = this.getRect(-this.speed, 0);
      _ref = this.stage.getXIndexes(new_rect.getLeft(), new_rect.getRight()), il = _ref[0], ir = _ref[1];
      _ref2 = this.stage.getYIndexes(new_rect.getTop(), new_rect.getBottom()), it = _ref2[0], ib = _ref2[1];
      oi = this.getIndex(old_rect);
      ni = this.getIndex(new_rect);
      if ((il !== ir) && this.stage.isBarrier(ir, it) && this.stage.isBarrier(il, it)) {
        return false;
      }
      if (!this.stage.isBarrier(il, it) && !this.stage.isBarrier(il, ib)) {
        this.move(new_rect);
        return true;
      }
      if ((il === ir || it === ib) && this.onBarrier(ni)) {
        this.move(new_rect);
        return true;
      }
      b = ir * this.stage.tileSize;
      if (b === old_rect.getLeft()) {
        new_rect = this.getRect(0, -this.speed);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(il, it) && (!this.stage.isBarrier(ir, it) || this.onBarrier(ni))) {
          if (it * this.stage.tileSize > new_rect.getTop()) {
            new_rect.y = it * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
        new_rect = this.getRect(0, this.speed);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(il, ib) && (!this.stage.isBarrier(ir, ib) || this.onBarrier(ni))) {
          if (ib * this.stage.tileSize < new_rect.getTop()) {
            new_rect.y = ib * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
      } else if (b < old_rect.getLeft()) {
        this.move(this.getRect(b - old_rect.getLeft(), 0));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveUp = function() {
      var b, ib, il, ir, it, new_rect, ni, oi, old_rect, _ref, _ref2;
      old_rect = this.getRect();
      new_rect = this.getRect(0, -this.speed);
      _ref = this.stage.getXIndexes(new_rect.getLeft(), new_rect.getRight()), il = _ref[0], ir = _ref[1];
      _ref2 = this.stage.getYIndexes(new_rect.getTop(), new_rect.getBottom()), it = _ref2[0], ib = _ref2[1];
      oi = this.getIndex(old_rect);
      ni = this.getIndex(new_rect);
      if ((it !== ib) && this.stage.isBarrier(il, it) && this.stage.isBarrier(il, ib)) {
        return false;
      }
      if (!this.stage.isBarrier(il, it) && !this.stage.isBarrier(ir, it)) {
        this.move(new_rect);
        return true;
      }
      if ((il === ir || it === ib) && this.onBarrier(ni)) {
        this.move(new_rect);
        return true;
      }
      b = ib * this.stage.tileSize;
      if (b === old_rect.getTop()) {
        new_rect = this.getRect(-this.speed, 0);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(il, it) && (!this.stage.isBarrier(il, ib) || this.onBarrier(ni))) {
          if (il * this.stage.tileSize > new_rect.getLeft()) {
            new_rect.x = il * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
        new_rect = this.getRect(this.speed, 0);
        ni = this.getIndex(new_rect);
        if (!this.stage.isBarrier(ir, it) && (!this.stage.isBarrier(ir, ib) || this.onBarrier(ni))) {
          if (ir * this.stage.tileSize < new_rect.getLeft()) {
            new_rect.x = ir * this.stage.tileSize;
          }
          this.move(new_rect);
          return true;
        }
      } else if (b < old_rect.getTop()) {
        this.move(this.getRect(0, b - old_rect.getTop()));
        return true;
      }
      return false;
    };

    Bomberman.prototype.getRect = function(dx, dy) {
      if (dx == null) dx = 0;
      if (dy == null) dy = 0;
      return new Rect(this.x + dx, this.y + dy, this.width, this.height);
    };

    Bomberman.prototype.getIndex = function(r) {
      var i, xis, yis;
      i = new Point();
      xis = this.stage.getXIndexes(r.getLeft(), r.getRight());
      if (xis[0] === xis[1]) {
        i.x = xis[0];
      } else {
        if (((xis[1] * this.stage.tileSize) - r.x) > (r.width / 2 | 0)) {
          i.x = xis[0];
        } else {
          i.x = xis[1];
        }
      }
      yis = this.stage.getYIndexes(r.getTop(), r.getBottom());
      if (yis[0] === yis[1]) {
        i.y = yis[0];
      } else {
        if (((yis[1] * this.stage.tileSize) - r.y) > (r.height / 2 | 0)) {
          i.y = yis[0];
        } else {
          i.y = yis[1];
        }
      }
      return i;
    };

    Bomberman.prototype.getCurrentIndex = function() {
      return this.getIndex(this.getRect());
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

  Point = (function() {

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    Point.prototype.equals = function(other) {
      return this.x === other.x && this.y === other.y;
    };

    return Point;

  })();

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

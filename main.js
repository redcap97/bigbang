(function() {
  var BattleField, Bomberman, FieldObject, Point, Rectangle,
    __slice = Array.prototype.slice;

  BattleField = (function() {

    BattleField.prototype.OUTSIDE_OF_FIELD_ERROR = "Point is outside of the field";

    function BattleField() {
      var b, f;
      this.tileSize = 16;
      b = new FieldObject(4, true);
      f = new FieldObject(0, false);
      this.dataMap = [[b, b, b, b, b, b, b, b, b, b, b, b, b, b, b], [b, b, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, b, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b], [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b], [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]];
      this.viewMap = [[], [], [], [], [], [], [], [], [], [], [], [], []];
      this.bomberman = new Bomberman(this, this.tileSize, this.tileSize);
      this.updateMaps();
    }

    BattleField.prototype.update = function(input) {
      this.updateMaps();
      return this.bomberman.update(input);
    };

    BattleField.prototype.updateMaps = function() {
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

    BattleField.prototype.getIndex = function(x, y) {
      if (x < 0 || x >= this.tileSize * this.dataMap[0].length || y < 0 || y >= this.tileSize * this.dataMap.length) {
        throw new Error(this.OUTSIDE_OF_FIELD_ERROR);
      }
      return new Point(x / this.tileSize | 0, y / this.tileSize | 0);
    };

    BattleField.prototype.getXIndexes = function() {
      var rs, x, xs, _i, _len;
      xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      rs = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (x < 0 || x >= this.tileSize * this.dataMap[0].length) {
          throw new Error(this.OUTSIDE_OF_FIELD_ERROR);
        }
        rs.push(x / this.tileSize | 0);
      }
      return rs;
    };

    BattleField.prototype.getYIndexes = function() {
      var rs, y, ys, _i, _len;
      ys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      rs = [];
      for (_i = 0, _len = ys.length; _i < _len; _i++) {
        y = ys[_i];
        if (y < 0 || y >= this.tileSize * this.dataMap.length) {
          throw new Error(this.OUTSIDE_OF_FIELD_ERROR);
        }
        rs.push(y / this.tileSize | 0);
      }
      return rs;
    };

    BattleField.prototype.getRectangleIndex = function(r) {
      var ib, il, ir, it, _ref, _ref2;
      _ref = this.getXIndexes(r.getLeft(), r.getRight()), il = _ref[0], ir = _ref[1];
      _ref2 = this.getYIndexes(r.getTop(), r.getBottom()), it = _ref2[0], ib = _ref2[1];
      return [il, it, ir, ib];
    };

    BattleField.prototype.isBarrier = function(ix, iy) {
      return this.dataMap[iy][ix].isBarrier;
    };

    BattleField.prototype.toString = function() {
      var ix;
      ix = this.bomberman.getCurrentIndex();
      return "Index of Bomberman: " + ix.y + ", " + ix.x;
    };

    return BattleField;

  })();

  Bomberman = (function() {

    function Bomberman(field, x, y) {
      this.field = field;
      this.x = x;
      this.y = y;
      this.power = this.speed = this.bombCapacity = 2;
      this.canThrow = this.canKick = false;
      this.width = this.height = this.field.tileSize;
    }

    Bomberman.prototype.update = function(input) {
      if (input.right) {
        this.moveRight();
      } else if (input.down) {
        this.moveDown();
      } else if (input.left) {
        this.moveLeft();
      } else if (input.up) {
        this.moveUp();
      }
      if (input.a) return this.putBomb();
    };

    Bomberman.prototype.changePosition = function(r) {
      this.x = r.x;
      return this.y = r.y;
    };

    Bomberman.prototype.putBomb = function() {
      var ix;
      if (this.canPutBomb()) {
        ix = this.getCurrentIndex();
        return this.field.dataMap[ix.y][ix.x] = new FieldObject(4, true);
      }
    };

    Bomberman.prototype.canMoveOnBomb = function(ni) {
      var oi;
      oi = this.getCurrentIndex();
      return this.field.isBarrier(oi.x, oi.y) && oi.equals(ni);
    };

    Bomberman.prototype.canPutBomb = function() {
      var ib, il, ir, it, ix, _ref;
      ix = this.getCurrentIndex();
      if (this.field.isBarrier(ix.x, ix.y)) return false;
      _ref = this.field.getRectangleIndex(this.getRectangle()), il = _ref[0], it = _ref[1], ir = _ref[2], ib = _ref[3];
      if (il === ir && it === ib) return true;
      if ((ix.equals(new Point(il, it)) && !this.field.isBarrier(ir, ib)) || (ix.equals(new Point(ir, ib)) && !this.field.isBarrier(il, it))) {
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveRight = function() {
      var bound, ib, il, ir, it, new_rect, old_rect, _ref;
      new_rect = this.getRectangle(this.speed, 0);
      _ref = this.field.getRectangleIndex(new_rect), il = _ref[0], it = _ref[1], ir = _ref[2], ib = _ref[3];
      if (il !== ir && it === ib && this.field.isBarrier(il, it) && this.field.isBarrier(ir, ib)) {
        return false;
      }
      if ((!this.field.isBarrier(ir, it) && !this.field.isBarrier(ir, ib)) || ((il === ir || it === ib) && this.canMoveOnBomb(this.getIndex(new_rect)))) {
        this.changePosition(new_rect);
        return true;
      }
      bound = ir * this.field.tileSize - 1;
      old_rect = this.getRectangle();
      if (bound === old_rect.getRight()) {
        new_rect = this.getRectangle(0, -this.speed);
        if (!this.field.isBarrier(ir, it) && (!this.field.isBarrier(il, it) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (it * this.field.tileSize > new_rect.getTop()) {
            new_rect.y = it * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
        new_rect = this.getRectangle(0, this.speed);
        if (!this.field.isBarrier(ir, ib) && (!this.field.isBarrier(il, ib) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (ib * this.field.tileSize < new_rect.getTop()) {
            new_rect.y = ib * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
      } else if (bound > old_rect.getRight()) {
        this.changePosition(this.getRectangle(bound - old_rect.getRight(), 0));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveDown = function() {
      var bound, ib, il, ir, it, new_rect, old_rect, _ref;
      new_rect = this.getRectangle(0, this.speed);
      _ref = this.field.getRectangleIndex(new_rect), il = _ref[0], it = _ref[1], ir = _ref[2], ib = _ref[3];
      if (it !== ib && il === ir && this.field.isBarrier(il, it) && this.field.isBarrier(ir, ib)) {
        return false;
      }
      if ((!this.field.isBarrier(il, ib) && !this.field.isBarrier(ir, ib)) || ((il === ir || it === ib) && this.canMoveOnBomb(this.getIndex(new_rect)))) {
        this.changePosition(new_rect);
        return true;
      }
      bound = ib * this.field.tileSize - 1;
      old_rect = this.getRectangle();
      if (bound === old_rect.getBottom()) {
        new_rect = this.getRectangle(-this.speed, 0);
        if (!this.field.isBarrier(il, ib) && (!this.field.isBarrier(il, it) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (il * this.field.tileSize > new_rect.getLeft()) {
            new_rect.x = il * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
        new_rect = this.getRectangle(this.speed, 0);
        if (!this.field.isBarrier(ir, ib) && (!this.field.isBarrier(ir, it) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (ir * this.field.tileSize < new_rect.getLeft()) {
            new_rect.x = ir * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
      } else if (bound > old_rect.getBottom()) {
        this.changePosition(this.getRectangle(0, bound - old_rect.getBottom()));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveLeft = function() {
      var bound, ib, il, ir, it, new_rect, old_rect, _ref;
      new_rect = this.getRectangle(-this.speed, 0);
      _ref = this.field.getRectangleIndex(new_rect), il = _ref[0], it = _ref[1], ir = _ref[2], ib = _ref[3];
      if (il !== ir && it === ib && this.field.isBarrier(il, it) && this.field.isBarrier(ir, ib)) {
        return false;
      }
      if ((!this.field.isBarrier(il, it) && !this.field.isBarrier(il, ib)) || ((il === ir || it === ib) && this.canMoveOnBomb(this.getIndex(new_rect)))) {
        this.changePosition(new_rect);
        return true;
      }
      bound = ir * this.field.tileSize;
      old_rect = this.getRectangle();
      if (bound === old_rect.getLeft()) {
        new_rect = this.getRectangle(0, -this.speed);
        if (!this.field.isBarrier(il, it) && (!this.field.isBarrier(ir, it) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (it * this.field.tileSize > new_rect.getTop()) {
            new_rect.y = it * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
        new_rect = this.getRectangle(0, this.speed);
        if (!this.field.isBarrier(il, ib) && (!this.field.isBarrier(ir, ib) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (ib * this.field.tileSize < new_rect.getTop()) {
            new_rect.y = ib * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
      } else if (bound < old_rect.getLeft()) {
        this.changePosition(this.getRectangle(bound - old_rect.getLeft(), 0));
        return true;
      }
      return false;
    };

    Bomberman.prototype.moveUp = function() {
      var bound, ib, il, ir, it, new_rect, old_rect, _ref;
      new_rect = this.getRectangle(0, -this.speed);
      _ref = this.field.getRectangleIndex(new_rect), il = _ref[0], it = _ref[1], ir = _ref[2], ib = _ref[3];
      if (it !== ib && il === ir && this.field.isBarrier(il, it) && this.field.isBarrier(ir, ib)) {
        return false;
      }
      if ((!this.field.isBarrier(il, it) && !this.field.isBarrier(ir, it)) || ((il === ir || it === ib) && this.canMoveOnBomb(this.getIndex(new_rect)))) {
        this.changePosition(new_rect);
        return true;
      }
      bound = ib * this.field.tileSize;
      old_rect = this.getRectangle();
      if (bound === old_rect.getTop()) {
        new_rect = this.getRectangle(-this.speed, 0);
        if (!this.field.isBarrier(il, it) && (!this.field.isBarrier(il, ib) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (il * this.field.tileSize > new_rect.getLeft()) {
            new_rect.x = il * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
        new_rect = this.getRectangle(this.speed, 0);
        if (!this.field.isBarrier(ir, it) && (!this.field.isBarrier(ir, ib) || this.canMoveOnBomb(this.getIndex(new_rect)))) {
          if (ir * this.field.tileSize < new_rect.getLeft()) {
            new_rect.x = ir * this.field.tileSize;
          }
          this.changePosition(new_rect);
          return true;
        }
      } else if (bound < old_rect.getTop()) {
        this.changePosition(this.getRectangle(0, bound - old_rect.getTop()));
        return true;
      }
      return false;
    };

    Bomberman.prototype.getRectangle = function(dx, dy) {
      if (dx == null) dx = 0;
      if (dy == null) dy = 0;
      return new Rectangle(this.x + dx, this.y + dy, this.width, this.height);
    };

    Bomberman.prototype.getIndex = function(r) {
      var ib, il, ir, it, ix, _ref, _ref2;
      ix = new Point();
      _ref = this.field.getXIndexes(r.getLeft(), r.getRight()), il = _ref[0], ir = _ref[1];
      if (il === ir) {
        ix.x = il;
      } else {
        if (((ir * this.field.tileSize) - r.x) > (r.width / 2 | 0)) {
          ix.x = il;
        } else {
          ix.x = ir;
        }
      }
      _ref2 = this.field.getYIndexes(r.getTop(), r.getBottom()), it = _ref2[0], ib = _ref2[1];
      if (it === ib) {
        ix.y = it;
      } else {
        if (((ib * this.field.tileSize) - r.y) > (r.height / 2 | 0)) {
          ix.y = it;
        } else {
          ix.y = ib;
        }
      }
      return ix;
    };

    Bomberman.prototype.getCurrentIndex = function() {
      return this.getIndex(this.getRectangle());
    };

    return Bomberman;

  })();

  FieldObject = (function() {

    function FieldObject(id, isBarrier) {
      this.id = id;
      this.isBarrier = isBarrier;
    }

    FieldObject.prototype.update = function() {};

    return FieldObject;

  })();

  window.onload = function() {
    var ENCHANTJS_IMAGE_PATH, game;
    ENCHANTJS_IMAGE_PATH = "enchantjs/images/";
    game = new enchant.Game(320, 320);
    game.scale = 3.0;
    game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
    game.keybind("Z".charCodeAt(0), 'a');
    game.keybind("X".charCodeAt(0), 'b');
    game.onload = function() {
      var field, label, scene, sprite, stage;
      field = new BattleField();
      stage = new enchant.Map(16, 16);
      stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      stage.loadData(field.viewMap);
      sprite = new enchant.Sprite(16, 16);
      sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      sprite.x = sprite.y = 16;
      sprite.frame = [2];
      label = new enchant.Label();
      label.color = "white";
      label.x = 4;
      game.addEventListener('enterframe', function() {
        field.update(game.input);
        sprite.x = field.bomberman.x;
        sprite.y = field.bomberman.y;
        stage.loadData(field.viewMap);
        return label.text = field.toString();
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

  Rectangle = (function() {

    function Rectangle(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    Rectangle.prototype.getLeft = function() {
      return this.x;
    };

    Rectangle.prototype.getRight = function() {
      return this.x + this.width - 1;
    };

    Rectangle.prototype.getTop = function() {
      return this.y;
    };

    Rectangle.prototype.getBottom = function() {
      return this.y + this.height - 1;
    };

    Rectangle.prototype.getTopLeft = function() {
      return new Point(this.getLeft(), this.getTop());
    };

    Rectangle.prototype.getTopRight = function() {
      return new Point(this.getRight(), this.getTop());
    };

    Rectangle.prototype.getBottomLeft = function() {
      return new Point(this.getLeft(), this.getBottom());
    };

    Rectangle.prototype.getBottomRight = function() {
      return new Point(this.getRight(), this.getBottom());
    };

    return Rectangle;

  })();

}).call(this);

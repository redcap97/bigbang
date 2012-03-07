(function() {
  var BattleField, Blast, BlastView, Block, BlockView, Bomb, BombUp, BombView, Bomberman, BombermanView, ENCHANTJS_IMAGE_PATH, FieldObject, FieldView, Item, ItemView, Point, Rectangle, RenderingQueue, Utils, View,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BattleField = (function() {

    BattleField.prototype.OUTSIDE_OF_FIELD_ERROR = "Point is outside of the field";

    function BattleField() {
      var g, i, j, w;
      this.tileSize = 16;
      this.height = 13;
      this.width = 15;
      this.bomberman = new Bomberman(this, this.tileSize, this.tileSize);
      w = new FieldObject(FieldObject.TYPE_WALL, true);
      g = new FieldObject(FieldObject.TYPE_GROUND, false);
      this.staticDataMap = [[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w], [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w], [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]];
      this.mutableDataMap = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = this.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (j = 0, _ref2 = this.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
              _results2.push(null);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }).call(this);
      this.setMapData(4, 1, new Block(this, new Point(4, 1)));
      this.setMapData(5, 1, new Block(this, new Point(5, 1)));
      this.setMapData(5, 2, new Block(this, new Point(5, 2)));
      this.setMapData(1, 2, new BombUp(this, new Point(1, 2)));
      this.updateMap();
    }

    BattleField.prototype.getMapData = function(x, y) {
      return this.mutableDataMap[y][x] || this.staticDataMap[y][x];
    };

    BattleField.prototype.setMapData = function(x, y, data) {
      return this.mutableDataMap[y][x] = data;
    };

    BattleField.prototype.removeMapData = function(x, y) {
      return this.setMapData(x, y, null);
    };

    BattleField.prototype.update = function(input) {
      var data, ix;
      ix = this.bomberman.getCurrentIndex();
      data = this.getMapData(ix.x, ix.y);
      switch (data.type) {
        case FieldObject.TYPE_BLAST:
          this.bomberman.destroy();
          break;
        case FieldObject.TYPE_ITEM:
          data.exertEffectOn(this.bomberman);
          data.destroy();
      }
      if (!this.bomberman.isDestroyed) this.bomberman.update(input);
      return this.updateMap();
    };

    BattleField.prototype.updateMap = function() {
      var x, y, _ref, _results;
      _results = [];
      for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
            _results2.push(this.getMapData(x, y).update());
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    BattleField.prototype.getIndex = function(x, y) {
      if (x < 0 || x >= this.tileSize * this.width || y < 0 || y >= this.tileSize * this.height) {
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
        if (x < 0 || x >= this.tileSize * this.width) {
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
        if (y < 0 || y >= this.tileSize * this.height) {
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

    BattleField.prototype.isBarrier = function(x, y) {
      return this.getMapData(x, y).isBarrier;
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
      this.objectId = Utils.generateId();
      this.width = this.height = this.field.tileSize;
      this.power = 2;
      this.speed = 2;
      this.bombCapacity = 2;
      this.usedBomb = 0;
      this.canThrow = this.canKick = false;
      this.isDestroyed = false;
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
      if (this.canPutBomb() && this.usedBomb < this.bombCapacity) {
        ix = this.getCurrentIndex();
        this.usedBomb += 1;
        return this.field.setMapData(ix.x, ix.y, new Bomb(this, this.field, ix));
      }
    };

    Bomberman.prototype.canMoveOnBomb = function(ni) {
      var oi;
      oi = this.getCurrentIndex();
      return this.field.isBarrier(oi.x, oi.y) && oi.equals(ni);
    };

    Bomberman.prototype.canPutBomb = function() {
      var data, ib, il, ir, it, ix, _ref;
      ix = this.getCurrentIndex();
      data = this.field.getMapData(ix.x, ix.y);
      if (data.type !== FieldObject.TYPE_GROUND) return false;
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

    Bomberman.prototype.destroy = function() {
      return this.isDestroyed = true;
    };

    return Bomberman;

  })();

  FieldObject = (function() {

    function FieldObject(type, isBarrier) {
      this.type = type;
      this.isBarrier = isBarrier;
      this.objectId = Utils.generateId();
      this.isDestroyed = false;
    }

    FieldObject.prototype.update = function() {};

    FieldObject.prototype.destroy = function() {};

    return FieldObject;

  })();

  FieldObject.TYPE_WALL = 0;

  FieldObject.TYPE_GROUND = 1;

  FieldObject.TYPE_BLOCK = 2;

  FieldObject.TYPE_BOMB = 3;

  FieldObject.TYPE_BLAST = 4;

  FieldObject.TYPE_ITEM = 5;

  Blast = (function(_super) {

    __extends(Blast, _super);

    Blast.prototype.DURATION = 10;

    function Blast(bomberman, field, index) {
      this.bomberman = bomberman;
      this.field = field;
      this.index = index;
      Blast.__super__.constructor.call(this, FieldObject.TYPE_BLAST, false);
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
      this.count = 0;
    }

    Blast.prototype.update = function() {
      this.count += 1;
      if (this.count > this.DURATION) return this.destroy();
    };

    Blast.prototype.destroy = function() {
      this.isDestroyed = true;
      return this.field.removeMapData(this.index.x, this.index.y);
    };

    return Blast;

  })(FieldObject);

  Bomb = (function(_super) {

    __extends(Bomb, _super);

    Bomb.prototype.TIME_LIMIT = 80;

    function Bomb(bomberman, field, index) {
      this.bomberman = bomberman;
      this.field = field;
      this.index = index;
      Bomb.__super__.constructor.call(this, FieldObject.TYPE_BOMB, true);
      this.count = 0;
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
    }

    Bomb.prototype.update = function() {
      this.count += 1;
      if (this.count > this.TIME_LIMIT) return this.destroy();
    };

    Bomb.prototype.destroy = function() {
      var data, i, ix, v, vs, _i, _len, _results;
      this.isDestroyed = true;
      this.bomberman.usedBomb -= 1;
      this.setBlast(this.index);
      vs = [new Point(1, 0), new Point(-1, 0), new Point(0, 1), new Point(0, -1)];
      _results = [];
      for (_i = 0, _len = vs.length; _i < _len; _i++) {
        v = vs[_i];
        ix = this.index.clone();
        _results.push((function() {
          var _ref, _results2;
          _results2 = [];
          for (i = 0, _ref = this.bomberman.power; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
            ix.x += v.x;
            ix.y += v.y;
            data = this.field.getMapData(ix.x, ix.y);
            if (data.type === FieldObject.TYPE_BLAST) continue;
            data.destroy();
            if (data.type !== FieldObject.TYPE_GROUND) break;
            _results2.push(this.setBlast(ix.clone()));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Bomb.prototype.setBlast = function(ix) {
      var blast;
      blast = new Blast(this.bomberman, this.field, ix);
      return this.field.setMapData(ix.x, ix.y, blast);
    };

    return Bomb;

  })(FieldObject);

  Block = (function(_super) {

    __extends(Block, _super);

    function Block(field, index) {
      this.field = field;
      this.index = index;
      Block.__super__.constructor.call(this, FieldObject.TYPE_BLOCK, true);
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
    }

    Block.prototype.destroy = function() {
      this.isDestroyed = true;
      if (this.hasItem()) {
        return this.field.setMapData(this.index.x, this.index.y, new BombUp(this.field, this.index));
      } else {
        return this.field.removeMapData(this.index.x, this.index.y);
      }
    };

    Block.prototype.hasItem = function() {
      return Math.floor(Math.random() * 2) === 0;
    };

    return Block;

  })(FieldObject);

  Item = (function(_super) {

    __extends(Item, _super);

    function Item(field, index) {
      this.field = field;
      this.index = index;
      Item.__super__.constructor.call(this, FieldObject.TYPE_ITEM, false);
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
    }

    Item.prototype.destroy = function() {
      this.isDestroyed = true;
      return this.field.removeMapData(this.index.x, this.index.y);
    };

    Item.prototype.exertEffectOn = function(bomberman) {
      this.bomberman = bomberman;
    };

    return Item;

  })(FieldObject);

  BombUp = (function(_super) {

    __extends(BombUp, _super);

    function BombUp(field, index) {
      this.field = field;
      this.index = index;
      BombUp.__super__.constructor.call(this, this.field, this.index);
    }

    BombUp.prototype.exertEffectOn = function(bomberman) {
      this.bomberman = bomberman;
      return this.bomberman.bombCapacity += 1;
    };

    return BombUp;

  })(Item);

  ENCHANTJS_IMAGE_PATH = "enchantjs/images/";

  window.onload = function() {
    var game;
    game = new enchant.Game(320, 320);
    game.scale = 3.0;
    game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
    game.keybind("Z".charCodeAt(0), 'a');
    game.keybind("X".charCodeAt(0), 'b');
    game.onload = function() {
      var bomberman, bombermanView, field, fieldView, label, queue, scene;
      field = new BattleField();
      bomberman = field.bomberman;
      scene = new enchant.Scene();
      queue = new RenderingQueue(game, scene);
      fieldView = new FieldView(queue, field);
      fieldView.update();
      bombermanView = new BombermanView(queue, bomberman);
      queue.store(bomberman.objectId, bombermanView);
      label = new enchant.Label();
      label.color = "white";
      label.x = 4;
      scene.addChild(label);
      game.addEventListener('enterframe', function() {
        var data, i, j, view, _ref, _results;
        field.update(game.input);
        label.text = field.toString();
        queue.update();
        _results = [];
        for (i = 0, _ref = field.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (j = 0, _ref2 = field.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
              data = field.mutableDataMap[i][j];
              if (data && !queue.contains(data.objectId)) {
                view = null;
                switch (data.type) {
                  case FieldObject.TYPE_BOMB:
                    view = new BombView(queue, data);
                    break;
                  case FieldObject.TYPE_BLAST:
                    view = new BlastView(queue, data);
                    break;
                  case FieldObject.TYPE_BLOCK:
                    view = new BlockView(queue, data);
                    break;
                  case FieldObject.TYPE_ITEM:
                    view = new ItemView(queue, data);
                    break;
                  default:
                    throw Error("Unknown object");
                }
                _results2.push(queue.store(data.objectId, view));
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })());
        }
        return _results;
      });
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

    Point.prototype.clone = function() {
      return new Point(this.x, this.y);
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

  RenderingQueue = (function() {

    function RenderingQueue(game, scene) {
      this.game = game;
      this.scene = scene;
      this.table = {};
    }

    RenderingQueue.prototype.contains = function(key) {
      return !!this.table[key];
    };

    RenderingQueue.prototype.store = function(id, view) {
      return this.table[id] = view;
    };

    RenderingQueue.prototype.remove = function(id) {
      return delete this.table[id];
    };

    RenderingQueue.prototype.update = function() {
      var id, view, _ref, _results;
      _ref = this.table;
      _results = [];
      for (id in _ref) {
        if (!__hasProp.call(_ref, id)) continue;
        view = _ref[id];
        _results.push(view.update());
      }
      return _results;
    };

    RenderingQueue.prototype.getScene = function() {
      return this.scene;
    };

    RenderingQueue.prototype.getGame = function() {
      return this.game;
    };

    return RenderingQueue;

  })();

  Utils = {
    generateId: (function() {
      var maxId;
      maxId = 0;
      return function() {
        maxId += 1;
        return maxId;
      };
    })()
  };

  View = (function() {

    function View(queue) {
      this.queue = queue;
      this.game = this.queue.getGame();
      this.scene = this.queue.getScene();
    }

    View.prototype.stopUpdate = function(id) {
      return this.queue.remove(id);
    };

    View.prototype.addNode = function(node) {
      return this.scene.addChild(node);
    };

    View.prototype.removeNode = function(node) {
      return this.scene.removeChild(node);
    };

    View.prototype.update = function() {};

    return View;

  })();

  FieldView = (function(_super) {

    __extends(FieldView, _super);

    function FieldView(queue, field) {
      this.queue = queue;
      this.field = field;
      FieldView.__super__.constructor.call(this, this.queue);
      this.map = new enchant.Map(16, 16);
      this.map.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.addNode(this.map);
    }

    FieldView.prototype.update = function() {
      return this.map.loadData(this.getIdMap());
    };

    FieldView.prototype.getIdMap = function() {
      var i, j, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.field.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this.field.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            if (this.field.staticDataMap[i][j].type === FieldObject.TYPE_GROUND) {
              _results2.push(0);
            } else {
              _results2.push(4);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    return FieldView;

  })(View);

  BombermanView = (function(_super) {

    __extends(BombermanView, _super);

    function BombermanView(queue, bomberman) {
      this.queue = queue;
      this.bomberman = bomberman;
      BombermanView.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.x = this.sprite.y = 16;
      this.sprite.frame = [2];
      this.addNode(this.sprite);
    }

    BombermanView.prototype.update = function() {
      if (this.bomberman.isDestroyed) {
        this.stopUpdate(this.bomberman.objectId);
        this.removeNode(this.sprite);
        return;
      }
      this.sprite.x = this.bomberman.x;
      return this.sprite.y = this.bomberman.y;
    };

    return BombermanView;

  })(View);

  BombView = (function(_super) {

    __extends(BombView, _super);

    function BombView(queue, bomb) {
      this.queue = queue;
      this.bomb = bomb;
      BombView.__super__.constructor.call(this, this.queue);
      this.count = 0;
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.frame = [5];
      this.sprite.x = this.bomb.x;
      this.sprite.y = this.bomb.y;
      this.addNode(this.sprite);
    }

    BombView.prototype.update = function() {
      this.count += 1;
      if (this.count === 10) {
        this.sprite.frame = [6];
      } else if (this.count === 20) {
        this.sprite.frame = [5];
        this.count = 0;
      }
      if (this.bomb.isDestroyed) {
        this.stopUpdate(this.bomb.objectId);
        return this.removeNode(this.sprite);
      }
    };

    return BombView;

  })(View);

  BlastView = (function(_super) {

    __extends(BlastView, _super);

    function BlastView(queue, blast) {
      this.queue = queue;
      this.blast = blast;
      BlastView.__super__.constructor.call(this, this.queue);
      this.count = 0;
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.frame = [7];
      this.sprite.x = this.blast.x;
      this.sprite.y = this.blast.y;
      this.addNode(this.sprite);
    }

    BlastView.prototype.update = function() {
      this.count += 1;
      if (this.count > this.blast.DURATION) {
        this.stopUpdate(this.blast.objectId);
        return this.removeNode(this.sprite);
      }
    };

    return BlastView;

  })(View);

  BlockView = (function(_super) {

    __extends(BlockView, _super);

    function BlockView(queue, block) {
      this.queue = queue;
      this.block = block;
      BlockView.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.frame = [8];
      this.sprite.x = this.block.x;
      this.sprite.y = this.block.y;
      this.addNode(this.sprite);
    }

    BlockView.prototype.update = function() {
      if (this.block.isDestroyed) {
        this.stopUpdate(this.block.objectId);
        return this.removeNode(this.sprite);
      }
    };

    return BlockView;

  })(View);

  ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView(queue, item) {
      this.queue = queue;
      this.item = item;
      ItemView.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.frame = [1];
      this.sprite.x = this.item.x;
      this.sprite.y = this.item.y;
      this.addNode(this.sprite);
    }

    ItemView.prototype.update = function() {
      if (this.item.isDestroyed) {
        this.stopUpdate(this.item.objectId);
        return this.removeNode(this.sprite);
      }
    };

    return ItemView;

  })(View);

}).call(this);

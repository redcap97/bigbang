(function() {
  var BattleField, BattleGame, Blast, BlastView, Block, BlockView, Bomb, BombUp, BombView, Bomberman, BombermanView, ENCHANTJS_IMAGE_PATH, EntryScreen, FieldObject, FieldView, FirePowerUp, GameResult, InputManager, Item, ItemView, Point, Rectangle, RenderingQueue, SpeedUp, Utils, View,
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
      this.bombermans = [new Bomberman(this, this.tileSize, this.tileSize), new Bomberman(this, this.tileSize * 13, this.tileSize), new Bomberman(this, this.tileSize, this.tileSize * 11), new Bomberman(this, this.tileSize * 13, this.tileSize * 11)];
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
      this.setMapData(5, 5, new Block(this, new Point(5, 5)));
      this.setMapData(5, 2, new Block(this, new Point(5, 2)));
      this.setMapData(1, 2, new SpeedUp(this, new Point(1, 2)));
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

    BattleField.prototype.update = function(inputs) {
      var bomberman, data, i, ix, _i, _len, _ref, _ref2;
      _ref = this.bombermans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bomberman = _ref[_i];
        ix = bomberman.getCurrentIndex();
        data = this.getMapData(ix.x, ix.y);
        switch (data.type) {
          case FieldObject.TYPE_BLAST:
            bomberman.destroy();
            break;
          case FieldObject.TYPE_ITEM:
            data.exertEffectOn(bomberman);
            data.destroy();
        }
      }
      for (i = 0, _ref2 = this.bombermans.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        if (inputs[i] && !this.bombermans[i].isDestroyed) {
          this.bombermans[i].update(inputs[i]);
        }
      }
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

    BattleField.prototype.getRemainingBombermans = function() {
      var bomberman, remainingBombermans, _i, _len, _ref;
      remainingBombermans = [];
      _ref = this.bombermans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bomberman = _ref[_i];
        if (bomberman.isDestroyed === false) remainingBombermans.push(bomberman);
      }
      return remainingBombermans;
    };

    BattleField.prototype.isFinished = function() {
      return this.getRemainingBombermans().length < 2;
    };

    BattleField.prototype.isDraw = function() {
      return this.getRemainingBombermans().length === 0;
    };

    BattleField.prototype.getWinner = function() {
      var i, _ref;
      for (i = 0, _ref = this.bombermans.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        if (!this.bombermans[i].isDestroyed) return i;
      }
    };

    return BattleField;

  })();

  BattleGame = (function() {

    function BattleGame(game) {
      var bomberman, bombermanView, _i, _len, _ref,
        _this = this;
      this.game = game;
      this.field = new BattleField();
      this.scene = new enchant.Scene();
      this.game.pushScene(this.scene);
      this.scene2 = new enchant.Scene();
      this.game.pushScene(this.scene2);
      this.queue = new RenderingQueue(this.game, this.scene);
      this.queue2 = new RenderingQueue(this.game, this.scene2);
      this.fieldView = new FieldView(this.queue, this.field);
      this.fieldView.update();
      _ref = this.field.bombermans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bomberman = _ref[_i];
        bombermanView = new BombermanView(this.queue2, bomberman);
        this.queue2.store(bomberman.objectId, bombermanView);
      }
      this.inputBuffer = [];
      this.socket = new WebSocket('ws://localhost:8080', 'bigbang');
      this.socket.binaryType = 'arraybuffer';
      this.socket.onmessage = function(event) {
        var byteArray, i, inputs, _ref2;
        byteArray = new Uint8Array(event.data);
        inputs = [];
        for (i = 0, _ref2 = byteArray.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          inputs.push(Utils.decodeInput(byteArray[i]));
        }
        return _this.inputBuffer.push(inputs);
      };
      this.count = 0;
      this.updateQueue();
    }

    BattleGame.prototype.update = function() {
      var data, i, inputs, j, _ref, _ref2;
      while (this.inputBuffer.length > 0) {
        inputs = this.inputBuffer.shift();
        this.field.update(inputs);
        this.updateQueue();
      }
      for (i = 0, _ref = this.field.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        for (j = 0, _ref2 = this.field.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
          data = this.field.mutableDataMap[i][j];
          if (data && !this.queue.contains(data.objectId)) {
            this.queue.store(data.objectId, this.createView(data));
          }
        }
      }
      this.count = (this.count + 1) % 2;
      if (this.count === 0) return this.sendInput(this.game.input);
    };

    BattleGame.prototype.updateQueue = function() {
      this.queue.update();
      return this.queue2.update();
    };

    BattleGame.prototype.sendInput = function(input) {
      var byteArray, v;
      v = Utils.encodeInput(input);
      if (v === 0) return;
      byteArray = new Uint8Array(1);
      byteArray[0] = v;
      if (this.socket.readyState === 1) return this.socket.send(byteArray.buffer);
    };

    BattleGame.prototype.createView = function(data) {
      switch (data.type) {
        case FieldObject.TYPE_BOMB:
          return new BombView(this.queue, data);
        case FieldObject.TYPE_BLAST:
          return new BlastView(this.queue, data);
        case FieldObject.TYPE_BLOCK:
          return new BlockView(this.queue, data);
        case FieldObject.TYPE_ITEM:
          return new ItemView(this.queue, data);
        default:
          throw Error("Unknown object");
      }
    };

    BattleGame.prototype.isFinished = function() {
      return this.field.isFinished();
    };

    BattleGame.prototype.isDraw = function() {
      return this.field.isDraw();
    };

    BattleGame.prototype.getWinner = function() {
      return this.field.getWinner();
    };

    BattleGame.prototype.release = function() {
      this.socket.close();
      this.game.removeScene(this.scene);
      return this.game.removeScene(this.scene2);
    };

    return BattleGame;

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
      this.inputManager = new InputManager();
    }

    Bomberman.prototype.update = function(input) {
      if (Utils.encodeInput(input) === 0) return;
      this.inputManager.update(input);
      if (this.inputManager.aDown) this.putBomb();
      return this.move();
    };

    Bomberman.prototype.move = function() {
      switch (this.inputManager.direction) {
        case InputManager.LEFT:
          return this.moveLeft();
        case InputManager.UP:
          return this.moveUp();
        case InputManager.RIGHT:
          return this.moveRight();
        case InputManager.DOWN:
          return this.moveDown();
      }
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

  EntryScreen = (function() {

    function EntryScreen(game) {
      this.game = game;
      this.finished = false;
      this.scene = new enchant.Scene();
      this.label = new enchant.Label();
      this.label.x = 4;
      this.label.text = "Plese input Z to start game";
      this.scene.addChild(this.label);
      this.game.pushScene(this.scene);
    }

    EntryScreen.prototype.update = function() {
      if (this.game.input.a) return this.finished = true;
    };

    EntryScreen.prototype.isFinished = function() {
      return this.finished;
    };

    EntryScreen.prototype.release = function() {
      return this.game.removeScene(this.scene);
    };

    return EntryScreen;

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
      var item;
      this.isDestroyed = true;
      if (this.hasItem()) {
        item = this.generateItem();
        return this.field.setMapData(this.index.x, this.index.y, item);
      } else {
        return this.field.removeMapData(this.index.x, this.index.y);
      }
    };

    Block.prototype.hasItem = function() {
      return Utils.random(3) === 0;
    };

    Block.prototype.generateItem = function() {
      var cs, klass;
      cs = [BombUp, FirePowerUp, SpeedUp];
      klass = cs[Utils.random(cs.length)];
      return new klass(this.field, this.index);
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

  FirePowerUp = (function(_super) {

    __extends(FirePowerUp, _super);

    function FirePowerUp(field, index) {
      this.field = field;
      this.index = index;
      FirePowerUp.__super__.constructor.call(this, this.field, this.index);
    }

    FirePowerUp.prototype.exertEffectOn = function(bomberman) {
      this.bomberman = bomberman;
      return this.bomberman.power += 1;
    };

    return FirePowerUp;

  })(Item);

  SpeedUp = (function(_super) {

    __extends(SpeedUp, _super);

    function SpeedUp(field, index) {
      this.field = field;
      this.index = index;
      SpeedUp.__super__.constructor.call(this, this.field, this.index);
    }

    SpeedUp.prototype.exertEffectOn = function(bomberman) {
      this.bomberman = bomberman;
      return this.bomberman.speed += 1;
    };

    return SpeedUp;

  })(Item);

  GameResult = (function() {

    function GameResult(game) {
      this.game = game;
      this.scene = new enchant.Scene();
      this.label = new enchant.Label();
      this.label.x = 4;
      this.scene.addChild(this.label);
      this.game.pushScene(this.scene);
    }

    GameResult.prototype.setWinner = function(pn) {
      return this.label.text = "Winner: " + pn;
    };

    GameResult.prototype.setDraw = function() {
      return this.label.text = "Draw";
    };

    GameResult.prototype.update = function() {};

    GameResult.prototype.isFinished = function() {
      return false;
    };

    GameResult.prototype.release = function() {
      return this.game.removeScene(this.scene);
    };

    return GameResult;

  })();

  InputManager = (function() {

    function InputManager() {
      this.a = this.b = false;
      this.aDown = this.aUp = false;
      this.bDown = this.bUp = false;
      this.direction = this.oldDirection = InputManager.NONE;
      this.up = this.down = this.left = this.right = false;
    }

    InputManager.prototype.update = function(input) {
      this.updateDirection(input);
      this.updateAButton(input);
      return this.updateBButton(input);
    };

    InputManager.prototype.isSamePreviousDirections = function(dirs) {
      return (this.direction === dirs[0] && this.oldDirection === dirs[1]) || (this.direction === dirs[1] && this.oldDirection === dirs[0]);
    };

    InputManager.prototype.getInputDirections = function(input) {
      var dirs;
      dirs = [];
      if (input.left) dirs.push(InputManager.LEFT);
      if (input.up) dirs.push(InputManager.UP);
      if (input.right) dirs.push(InputManager.RIGHT);
      if (input.down) dirs.push(InputManager.DOWN);
      return dirs.slice(0, 2);
    };

    InputManager.prototype.updateDirection = function(input) {
      var dirs;
      dirs = this.getInputDirections(input);
      if (dirs.length === 0) {
        this.direction = InputManager.NONE;
        return this.oldDirection = InputManager.NONE;
      } else if (dirs.length === 1) {
        this.direction = dirs[0];
        return this.oldDirection = InputManager.NONE;
      } else if (!this.isSamePreviousDirections(dirs)) {
        if (this.direction === dirs[0]) {
          this.oldDirection = this.direction;
          return this.direction = dirs[1];
        } else if (this.direction === dirs[1]) {
          this.oldDirection = this.direction;
          return this.direction = dirs[0];
        } else {
          this.direction = dirs[0];
          return this.oldDirection = dirs[1];
        }
      }
    };

    InputManager.prototype.updateAButton = function(input) {
      if (this.a === input.a) {
        this.aDown = this.aUp = false;
      } else if (input.a === true) {
        this.aDown = true;
        this.aUp = false;
      } else if (input.a === false) {
        this.aDown = false;
        this.aUp = true;
      }
      return this.a = input.a;
    };

    InputManager.prototype.updateBButton = function(input) {
      if (this.b === input.b) {
        this.bDown = this.bUp = false;
      } else if (input.b === true) {
        this.bDown = true;
        this.bUp = false;
      } else if (input.b === false) {
        this.bDown = false;
        this.bUp = true;
      }
      return this.b = input.b;
    };

    return InputManager;

  })();

  InputManager.NONE = 0;

  InputManager.LEFT = 1;

  InputManager.UP = 2;

  InputManager.RIGHT = 3;

  InputManager.DOWN = 4;

  ENCHANTJS_IMAGE_PATH = "enchantjs/images/";

  window.onload = function() {
    var game;
    game = new enchant.Game(320, 320);
    game.scale = 3.0;
    game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
    game.fps = 60;
    game.keybind("Z".charCodeAt(0), 'a');
    game.keybind("X".charCodeAt(0), 'b');
    game.onload = function() {
      var currentScene;
      currentScene = new EntryScreen(game);
      return game.addEventListener('enterframe', function() {
        var gameResult;
        if (currentScene.isFinished()) {
          if (currentScene instanceof EntryScreen) {
            currentScene.release();
            currentScene = new BattleGame(game);
          } else if (currentScene instanceof BattleGame) {
            gameResult = new GameResult(game);
            if (currentScene.isDraw()) {
              gameResult.setDraw();
            } else {
              gameResult.setWinner(currentScene.getWinner());
            }
            currentScene.release();
            currentScene = gameResult;
          } else if (currentScene instanceof GameResult) {
            currentScene.release();
            currentScene = new EntryScreen(game);
          } else {
            throw new Error("Unknown scene");
          }
        }
        return currentScene.update();
      });
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
    })(),
    random: function(max) {
      return Math.floor(Math.random() * max);
    },
    inputFlags: {
      left: 1,
      up: 2,
      right: 4,
      down: 8,
      a: 16,
      b: 32
    },
    encodeInput: function(input) {
      var flag, key, value, _ref;
      value = 0;
      _ref = this.inputFlags;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        flag = _ref[key];
        if (input[key]) value |= flag;
      }
      return value;
    },
    decodeInput: function(value) {
      var flag, input, key, _ref;
      input = {
        a: false,
        b: false,
        left: false,
        up: false,
        right: false,
        down: false
      };
      _ref = this.inputFlags;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        flag = _ref[key];
        if (value & flag) input[key] = true;
      }
      return input;
    }
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

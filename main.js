(function() {
  var BattleField, BattleGame, Blast, BlastRenderer, Block, BlockRenderer, Bomb, BombKick, BombRenderer, BombUp, Bomberman, BombermanRenderer, DataTransport, Direction, ENCHANTJS_IMAGE_PATH, EntryScreen, FieldObject, FieldRenderer, FirePowerUp, GameResult, Ground, InputManager, Item, ItemRenderer, MAX_NUMBER_OF_PLAYERS, Point, Random, Rectangle, Remocon, Renderer, RenderingQueue, SpeedUp, Utils, WS_SUBPROTOCOL, WS_URI, Wall,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BattleField = (function() {
    var FPS, OUTSIDE_OF_FIELD_ERROR, TIME_LIMIT;

    OUTSIDE_OF_FIELD_ERROR = "Point is outside of the field";

    FPS = 30;

    TIME_LIMIT = FPS * 60 * 2;

    function BattleField(numberOfPlayers, seed) {
      var g, i, j, w;
      this.tileSize = 16;
      this.height = 13;
      this.width = 15;
      this.generateId = (function() {
        var maxId;
        maxId = 0;
        return function() {
          maxId += 1;
          return maxId;
        };
      })();
      this.random = new Random(seed);
      this.bombermans = this.createBombermans(numberOfPlayers);
      w = new Wall(this);
      g = new Ground(this);
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
      this.count = 0;
      this.createBlocks();
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
      var bomberman, data, i, ix, _len, _ref;
      this.count += 1;
      _ref = this.bombermans;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        bomberman = _ref[i];
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
        if (inputs[i] && !bomberman.isDestroyed) bomberman.update(inputs[i]);
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

    BattleField.prototype.createBombermans = function(n) {
      var bombermans, i, positions, x, y;
      if (n < 2 && n > MAX_NUMBER_OF_PLAYERS) {
        throw Error("Cannot create bombermans");
      }
      positions = [new Point(1, 1), new Point(13, 11), new Point(13, 1), new Point(1, 11)];
      bombermans = [];
      for (i = 0; 0 <= n ? i < n : i > n; 0 <= n ? i++ : i--) {
        x = positions[i].x;
        y = positions[i].y;
        bombermans.push(new Bomberman(this, this.tileSize * x, this.tileSize * y));
      }
      return bombermans;
    };

    BattleField.prototype.createBlocks = function() {
      var data, n, x, y, _ref, _ref2, _results;
      for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
        for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          data = this.getMapData(x, y);
          if (data.type === FieldObject.TYPE_GROUND) {
            this.setMapData(x, y, new Block(this, new Point(x, y)));
          }
        }
      }
      this.removeMapData(1, 1);
      this.removeMapData(1, 2);
      this.removeMapData(1, 3);
      this.removeMapData(2, 1);
      this.removeMapData(3, 1);
      this.removeMapData(this.width - 2, 1);
      this.removeMapData(this.width - 2, 2);
      this.removeMapData(this.width - 2, 3);
      this.removeMapData(this.width - 3, 1);
      this.removeMapData(this.width - 4, 1);
      this.removeMapData(1, this.height - 2);
      this.removeMapData(1, this.height - 3);
      this.removeMapData(1, this.height - 4);
      this.removeMapData(2, this.height - 2);
      this.removeMapData(3, this.height - 2);
      this.removeMapData(this.width - 2, this.height - 2);
      this.removeMapData(this.width - 2, this.height - 3);
      this.removeMapData(this.width - 2, this.height - 4);
      this.removeMapData(this.width - 3, this.height - 2);
      this.removeMapData(this.width - 4, this.height - 2);
      n = 0;
      _results = [];
      while (n < 11) {
        x = this.getRandom(this.width);
        y = this.getRandom(this.height);
        data = this.getMapData(x, y);
        if (data.type === FieldObject.TYPE_BLOCK) {
          this.removeMapData(x, y);
          _results.push(n += 1);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    BattleField.prototype.getIndex = function(x, y) {
      if (x < 0 || x >= this.tileSize * this.width || y < 0 || y >= this.tileSize * this.height) {
        throw new Error(OUTSIDE_OF_FIELD_ERROR);
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
          throw new Error(OUTSIDE_OF_FIELD_ERROR);
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
          throw new Error(OUTSIDE_OF_FIELD_ERROR);
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

    BattleField.prototype.getNearestIndex = function(r) {
      var ib, il, ir, it, ix, _ref, _ref2;
      ix = new Point();
      _ref = this.getXIndexes(r.getLeft(), r.getRight()), il = _ref[0], ir = _ref[1];
      if (il === ir) {
        ix.x = il;
      } else {
        if (((ir * this.tileSize) - r.x) > (r.width / 2 | 0)) {
          ix.x = il;
        } else {
          ix.x = ir;
        }
      }
      _ref2 = this.getYIndexes(r.getTop(), r.getBottom()), it = _ref2[0], ib = _ref2[1];
      if (it === ib) {
        ix.y = it;
      } else {
        if (((ib * this.tileSize) - r.y) > (r.height / 2 | 0)) {
          ix.y = it;
        } else {
          ix.y = ib;
        }
      }
      return ix;
    };

    BattleField.prototype.bombermanExists = function(ix) {
      var bomberman, _i, _len, _ref;
      _ref = this.bombermans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bomberman = _ref[_i];
        if (!bomberman.isDestroyed && ix.equals(bomberman.getCurrentIndex())) {
          return true;
        }
      }
      return false;
    };

    BattleField.prototype.getRandom = function(max) {
      return this.random.getRandom(max);
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
      return this.count > TIME_LIMIT || this.getRemainingBombermans().length < 2;
    };

    BattleField.prototype.isDraw = function() {
      return this.count > TIME_LIMIT || this.getRemainingBombermans().length === 0;
    };

    BattleField.prototype.getWinner = function() {
      var bomberman, i, _len, _ref;
      if (!this.isFinished()) throw new Error("Battle is not finished");
      _ref = this.bombermans;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        bomberman = _ref[i];
        if (!bomberman.isDestroyed) return i;
      }
    };

    BattleField.prototype.getRemainingTime = function() {
      var v;
      if (this.count > TIME_LIMIT) return [0, 0];
      v = (TIME_LIMIT - this.count) / FPS;
      return [Math.floor(v / 60), Math.floor(v % 60)];
    };

    return BattleField;

  })();

  BattleGame = (function() {

    function BattleGame(game, dataTransport) {
      var bomberman, bombermanRenderer, _i, _len, _ref;
      this.game = game;
      this.dataTransport = dataTransport;
      this.field = new BattleField(this.dataTransport.numberOfPlayers, this.dataTransport.seed);
      this.scene = new enchant.Scene();
      this.game.pushScene(this.scene);
      this.queue = new RenderingQueue(this.game, this.scene);
      this.scene2 = new enchant.Scene();
      this.game.pushScene(this.scene2);
      this.queue2 = new RenderingQueue(this.game, this.scene2);
      this.fieldRenderer = new FieldRenderer(this.queue, this.field);
      this.fieldRenderer.update();
      this.label = new enchant.Label();
      this.label.color = "white";
      this.label.x = 4;
      this.scene2.addChild(this.label);
      this.count = 0;
      _ref = this.field.bombermans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bomberman = _ref[_i];
        bombermanRenderer = new BombermanRenderer(this.queue2, bomberman);
        this.queue2.store(bomberman.objectId, bombermanRenderer);
      }
      this.updateQueue();
      this.updateRemainingTime();
    }

    BattleGame.prototype.update = function() {
      var data, i, inputs, j, _ref, _ref2;
      while (this.dataTransport.getBufferSize() > 0) {
        inputs = this.dataTransport.getInput();
        this.field.update(inputs);
        this.updateQueue();
        this.updateRemainingTime();
      }
      for (i = 0, _ref = this.field.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        for (j = 0, _ref2 = this.field.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
          data = this.field.mutableDataMap[i][j];
          if (data && !this.queue.contains(data.objectId)) {
            this.queue.store(data.objectId, this.createRenderer(data));
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

    BattleGame.prototype.updateRemainingTime = function() {
      var min, sec, sm, ss, _ref;
      _ref = this.field.getRemainingTime(), min = _ref[0], sec = _ref[1];
      sm = min < 10 ? '0' + String(min) : String(min);
      ss = sec < 10 ? '0' + String(sec) : String(sec);
      return this.label.text = "" + sm + ":" + ss;
    };

    BattleGame.prototype.sendInput = function(input) {
      return this.dataTransport.sendInput(input);
    };

    BattleGame.prototype.createRenderer = function(data) {
      switch (data.type) {
        case FieldObject.TYPE_BOMB:
          return new BombRenderer(this.queue, data);
        case FieldObject.TYPE_BLAST:
          return new BlastRenderer(this.queue, data);
        case FieldObject.TYPE_BLOCK:
          return new BlockRenderer(this.queue, data);
        case FieldObject.TYPE_ITEM:
          return new ItemRenderer(this.queue, data);
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
      this.game.removeScene(this.scene);
      this.game.removeScene(this.scene2);
      return this.dataTransport.release();
    };

    return BattleGame;

  })();

  Bomberman = (function() {

    function Bomberman(field, x, y) {
      this.field = field;
      this.x = x;
      this.y = y;
      this.objectId = this.field.generateId();
      this.width = this.height = this.field.tileSize;
      this.isDestroyed = false;
      this.speed = 2;
      this.power = 1;
      this.bombCapacity = 1;
      this.usedBomb = 0;
      this.hasRemocon = false;
      this.canKick = false;
      this.inputManager = new InputManager();
    }

    Bomberman.prototype.update = function(input) {
      if (Utils.encodeInput(input) === 0) return;
      this.inputManager.update(input);
      if (this.inputManager.aDown) this.putBomb();
      if (this.inputManager.bDown && this.hasRemocon) this.explodeBomb();
      return this.move();
    };

    Bomberman.prototype.incrementSpeed = function() {
      if (this.speed < 8) return this.speed += 1;
    };

    Bomberman.prototype.incrementPower = function() {
      if (this.power < 9) return this.power += 1;
    };

    Bomberman.prototype.incrementBombCapacity = function() {
      if (this.bombCapacity < 9) return this.bombCapacity += 1;
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
      return this.x = r.x, this.y = r.y, r;
    };

    Bomberman.prototype.putBomb = function() {
      var ix;
      if (this.canPutBomb() && this.usedBomb < this.bombCapacity) {
        ix = this.getCurrentIndex();
        this.usedBomb += 1;
        return this.field.setMapData(ix.x, ix.y, new Bomb(this.field, ix, this));
      }
    };

    Bomberman.prototype.explodeBomb = function() {
      var data, x, y, _ref, _results;
      _results = [];
      for (y = 0, _ref = this.field.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (x = 0, _ref2 = this.field.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
            data = this.field.getMapData(x, y);
            if (data.type === FieldObject.TYPE_BOMB && data.bomberman.objectId === this.objectId) {
              _results2.push(data.destroy());
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
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

    Bomberman.prototype.canMoveOnBomb = function(ni) {
      var oi;
      oi = this.getCurrentIndex();
      return this.field.isBarrier(oi.x, oi.y) && oi.equals(ni);
    };

    Bomberman.prototype.moveRight = function() {
      var bound, data, ib, il, ir, it, new_rect, old_rect, _ref;
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
        if (it === ib && this.canKick) {
          data = this.field.getMapData(ir, it);
          data.kick(Direction.RIGHT);
          return false;
        }
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
      var bound, data, ib, il, ir, it, new_rect, old_rect, _ref;
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
        if (ir === il && this.canKick) {
          data = this.field.getMapData(ir, ib);
          data.kick(Direction.DOWN);
          return false;
        }
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
      var bound, data, ib, il, ir, it, new_rect, old_rect, _ref;
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
        if (it === ib && this.canKick) {
          data = this.field.getMapData(il, it);
          data.kick(Direction.LEFT);
          return false;
        }
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
      var bound, data, ib, il, ir, it, new_rect, old_rect, _ref;
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
        if (ir === il && this.canKick) {
          data = this.field.getMapData(ir, it);
          data.kick(Direction.UP);
          return false;
        }
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
      return this.field.getNearestIndex(r);
    };

    Bomberman.prototype.getCurrentIndex = function() {
      return this.getIndex(this.getRectangle());
    };

    Bomberman.prototype.destroy = function() {
      return this.isDestroyed = true;
    };

    return Bomberman;

  })();

  DataTransport = (function() {

    function DataTransport() {
      var _this = this;
      this.inputBuffer = [];
      this.playerId = this.numberOfPlayers = null;
      this.socket = new WebSocket(WS_URI, WS_SUBPROTOCOL);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onmessage = function(event) {
        if (!_this.hasBattleData()) {
          return _this.receiveBattleData(event.data);
        } else {
          return _this.receiveInputs(event.data);
        }
      };
    }

    DataTransport.prototype.receiveBattleData = function(data) {
      var _ref;
      try {
        _ref = JSON.parse(data), this.seed = _ref.seed, this.numberOfPlayers = _ref.numberOfPlayers, this.playerId = _ref.playerId;
      } catch (e) {
        this.release();
        throw e;
      }
      if (!this.validateBattleData()) {
        this.release();
        throw Error("Invalid battle data");
      }
    };

    DataTransport.prototype.receiveInputs = function(data) {
      var byteArray, i, inputs, _ref;
      byteArray = new Uint8Array(data);
      inputs = [];
      for (i = 0, _ref = byteArray.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        inputs.push(Utils.decodeInput(byteArray[i]));
      }
      return this.inputBuffer.push(inputs);
    };

    DataTransport.prototype.sendInput = function(input) {
      var byteArray, v;
      v = Utils.encodeInput(input);
      if (v === 0) return;
      byteArray = new Uint8Array(1);
      byteArray[0] = v;
      if (this.isConnected()) return this.socket.send(byteArray.buffer);
    };

    DataTransport.prototype.getInput = function() {
      return this.inputBuffer.shift();
    };

    DataTransport.prototype.getBufferSize = function() {
      return this.inputBuffer.length;
    };

    DataTransport.prototype.clearBuffer = function() {
      return this.inputBuffer.length = 0;
    };

    DataTransport.prototype.hasBattleData = function() {
      return (this.playerId != null) && (this.numberOfPlayers != null);
    };

    DataTransport.prototype.validateBattleData = function() {
      return (this.seed != null) && this.numberOfPlayers >= 2 && this.numberOfPlayers <= MAX_NUMBER_OF_PLAYERS && this.playerId >= 0 && this.playerId < this.numberOfPlayers;
    };

    DataTransport.prototype.isConnected = function() {
      return this.socket.readyState === WebSocket.OPEN;
    };

    DataTransport.prototype.isClosed = function() {
      return this.socket.readyState === WebSocket.CLOSED;
    };

    DataTransport.prototype.release = function() {
      this.clearBuffer();
      return this.socket.close();
    };

    return DataTransport;

  })();

  EntryScreen = (function() {

    function EntryScreen(game) {
      this.game = game;
      this.scene = new enchant.Scene();
      this.label = new enchant.Label();
      this.label.x = 4;
      this.scene.addChild(this.label);
      this.game.pushScene(this.scene);
      this.setText("Plese input Z to start game");
      this.dataTransport = null;
      this.isCanceling = false;
      this.finished = false;
    }

    EntryScreen.prototype.update = function() {
      var id,
        _this = this;
      if (this.game.input.a && this.dataTransport === null) {
        this.setText("Please wait");
        this.dataTransport = new DataTransport();
      }
      if (this.game.input.b && this.dataTransport !== null && !this.isCanceling) {
        this.setText("Canceling...");
        this.dataTransport.release();
        this.isCanceling = true;
        return id = setInterval(function() {
          if (_this.dataTransport.isClosed()) {
            _this.setText("Plese input Z to start game");
            _this.dataTransport = null;
            _this.isCanceling = false;
            return clearInterval(id);
          }
        }, 2 * 1000);
      }
    };

    EntryScreen.prototype.setText = function(text) {
      return this.label.text = text;
    };

    EntryScreen.prototype.isFinished = function() {
      var _ref;
      return (_ref = this.dataTransport) != null ? _ref.hasBattleData() : void 0;
    };

    EntryScreen.prototype.getDataTransport = function() {
      return this.dataTransport;
    };

    EntryScreen.prototype.release = function() {
      return this.game.removeScene(this.scene);
    };

    return EntryScreen;

  })();

  FieldObject = (function() {

    FieldObject.TYPE_WALL = 0;

    FieldObject.TYPE_GROUND = 1;

    FieldObject.TYPE_BLOCK = 2;

    FieldObject.TYPE_BOMB = 3;

    FieldObject.TYPE_BLAST = 4;

    FieldObject.TYPE_ITEM = 5;

    function FieldObject(field, type, isBarrier) {
      this.field = field;
      this.type = type;
      this.isBarrier = isBarrier;
      this.objectId = this.field.generateId();
      this.isDestroyed = false;
    }

    FieldObject.prototype.update = function() {};

    FieldObject.prototype.destroy = function() {};

    FieldObject.prototype.kick = function(direction) {};

    return FieldObject;

  })();

  Wall = (function(_super) {

    __extends(Wall, _super);

    function Wall(field) {
      Wall.__super__.constructor.call(this, field, FieldObject.TYPE_WALL, true);
    }

    return Wall;

  })(FieldObject);

  Ground = (function(_super) {

    __extends(Ground, _super);

    function Ground(field) {
      Ground.__super__.constructor.call(this, field, FieldObject.TYPE_GROUND, false);
    }

    return Ground;

  })(FieldObject);

  Blast = (function(_super) {

    __extends(Blast, _super);

    Blast.prototype.DURATION = 10;

    function Blast(field, index, bomberman) {
      this.index = index;
      this.bomberman = bomberman;
      Blast.__super__.constructor.call(this, field, FieldObject.TYPE_BLAST, false);
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

    function Bomb(field, index, bomberman) {
      this.index = index;
      this.bomberman = bomberman;
      Bomb.__super__.constructor.call(this, field, FieldObject.TYPE_BOMB, true);
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
      this.count = 0;
      this.isKicked = false;
    }

    Bomb.prototype.update = function() {
      this.count += 1;
      if (this.count > this.TIME_LIMIT) {
        this.destroy();
        return;
      }
      if (this.isKicked) return this.move();
    };

    Bomb.prototype.kick = function(direction) {
      this.direction = direction;
      return this.isKicked = true;
    };

    Bomb.prototype.move = function() {
      var bounds, data, delta, ix, r;
      delta = [new Point(-3, 0), new Point(0, -3), new Point(3, 0), new Point(0, 3)][this.direction];
      this.x += delta.x;
      this.y += delta.y;
      bounds = new Point(this.x, this.y);
      if (this.direction === Direction.RIGHT) {
        bounds.x += this.field.tileSize - 1;
      } else if (this.direction === Direction.DOWN) {
        bounds.y += this.field.tileSize - 1;
      }
      ix = this.field.getIndex(bounds.x, bounds.y);
      if ((this.field.isBarrier(ix.x, ix.y) && !ix.equals(this.index)) || this.field.bombermanExists(ix)) {
        this.isKicked = false;
        this.x = this.field.tileSize * this.index.x;
        this.y = this.field.tileSize * this.index.y;
      }
      r = new Rectangle(this.x, this.y, this.field.tileSize, this.field.tileSize);
      ix = this.field.getNearestIndex(r);
      if (!ix.equals(this.index)) {
        data = this.field.getMapData(ix.x, ix.y);
        data.destroy();
        this.field.removeMapData(this.index.x, this.index.y);
        this.field.setMapData(ix.x, ix.y, this);
        this.index = ix;
        if (data.type === FieldObject.TYPE_BLAST) return this.destroy;
      }
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
      blast = new Blast(this.field, ix, this.bomberman);
      return this.field.setMapData(ix.x, ix.y, blast);
    };

    return Bomb;

  })(FieldObject);

  Block = (function(_super) {

    __extends(Block, _super);

    function Block(field, index) {
      this.index = index;
      Block.__super__.constructor.call(this, field, FieldObject.TYPE_BLOCK, true);
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
      return this.field.getRandom(3) === 0;
    };

    Block.prototype.generateItem = function() {
      var cs, klass;
      cs = [BombUp, FirePowerUp, SpeedUp, BombKick, Remocon];
      klass = cs[this.field.getRandom(cs.length)];
      return new klass(this.field, this.index);
    };

    return Block;

  })(FieldObject);

  Item = (function(_super) {

    __extends(Item, _super);

    function Item(field, index) {
      this.index = index;
      Item.__super__.constructor.call(this, field, FieldObject.TYPE_ITEM, false);
      this.x = this.field.tileSize * this.index.x;
      this.y = this.field.tileSize * this.index.y;
    }

    Item.prototype.destroy = function() {
      this.isDestroyed = true;
      return this.field.removeMapData(this.index.x, this.index.y);
    };

    Item.prototype.exertEffectOn = function(bomberman) {};

    return Item;

  })(FieldObject);

  BombUp = (function(_super) {

    __extends(BombUp, _super);

    function BombUp(field, index) {
      this.index = index;
      BombUp.__super__.constructor.call(this, field, this.index);
    }

    BombUp.prototype.exertEffectOn = function(bomberman) {
      return bomberman.incrementBombCapacity();
    };

    return BombUp;

  })(Item);

  FirePowerUp = (function(_super) {

    __extends(FirePowerUp, _super);

    function FirePowerUp(field, index) {
      this.index = index;
      FirePowerUp.__super__.constructor.call(this, field, this.index);
    }

    FirePowerUp.prototype.exertEffectOn = function(bomberman) {
      return bomberman.incrementPower();
    };

    return FirePowerUp;

  })(Item);

  SpeedUp = (function(_super) {

    __extends(SpeedUp, _super);

    function SpeedUp(field, index) {
      this.index = index;
      SpeedUp.__super__.constructor.call(this, field, this.index);
    }

    SpeedUp.prototype.exertEffectOn = function(bomberman) {
      return bomberman.incrementSpeed();
    };

    return SpeedUp;

  })(Item);

  Remocon = (function(_super) {

    __extends(Remocon, _super);

    function Remocon(field, index) {
      this.index = index;
      Remocon.__super__.constructor.call(this, field, this.index);
    }

    Remocon.prototype.exertEffectOn = function(bomberman) {
      return bomberman.hasRemocon = true;
    };

    return Remocon;

  })(Item);

  BombKick = (function(_super) {

    __extends(BombKick, _super);

    function BombKick(field, index) {
      this.index = index;
      BombKick.__super__.constructor.call(this, field, this.index);
    }

    BombKick.prototype.exertEffectOn = function(bomberman) {
      return bomberman.canKick = true;
    };

    return BombKick;

  })(Item);

  GameResult = (function() {

    function GameResult(game) {
      this.game = game;
      this.scene = new enchant.Scene();
      this.label = new enchant.Label();
      this.label.x = 4;
      this.scene.addChild(this.label);
      this.game.pushScene(this.scene);
      this.count = 0;
    }

    GameResult.prototype.setWinner = function(pn) {
      return this.label.text = "Winner: " + pn;
    };

    GameResult.prototype.setDraw = function() {
      return this.label.text = "Draw";
    };

    GameResult.prototype.update = function() {
      return this.count += 1;
    };

    GameResult.prototype.isFinished = function() {
      return this.count > 60;
    };

    GameResult.prototype.release = function() {
      return this.game.removeScene(this.scene);
    };

    return GameResult;

  })();

  InputManager = (function() {

    InputManager.NONE = 0;

    InputManager.LEFT = 1;

    InputManager.UP = 2;

    InputManager.RIGHT = 3;

    InputManager.DOWN = 4;

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

  WS_URI = 'ws://localhost:8080';

  WS_SUBPROTOCOL = 'bigbang';

  MAX_NUMBER_OF_PLAYERS = 4;

  ENCHANTJS_IMAGE_PATH = "enchantjs/images/";

  window.onload = function() {
    var game;
    game = new enchant.Game(320, 320);
    game.scale = 3.0;
    game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'effect0.gif');
    game.preload(ENCHANTJS_IMAGE_PATH + 'icon0.gif');
    game.preload('image/map0.png');
    game.preload('image/icon0.png');
    game.preload('image/char0.png');
    game.fps = 60;
    game.keybind("Z".charCodeAt(0), 'a');
    game.keybind("X".charCodeAt(0), 'b');
    game.onload = function() {
      var currentScene;
      currentScene = new EntryScreen(game);
      return game.addEventListener('enterframe', function() {
        var dataTransport, gameResult;
        if (currentScene.isFinished()) {
          if (currentScene instanceof EntryScreen) {
            dataTransport = currentScene.getDataTransport();
            currentScene.release();
            currentScene = new BattleGame(game, dataTransport);
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

  Random = (function() {

    function Random(seed) {
      this.mt19937 = new MersenneTwister(seed);
    }

    Random.prototype.getRandom = function(max) {
      return this.mt19937.nextInt(max);
    };

    return Random;

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

  Renderer = (function() {

    function Renderer(queue) {
      this.queue = queue;
      this.game = this.queue.getGame();
      this.scene = this.queue.getScene();
    }

    Renderer.prototype.stopUpdate = function(id) {
      return this.queue.remove(id);
    };

    Renderer.prototype.addNode = function(node) {
      return this.scene.addChild(node);
    };

    Renderer.prototype.removeNode = function(node) {
      return this.scene.removeChild(node);
    };

    Renderer.prototype.update = function() {};

    return Renderer;

  })();

  FieldRenderer = (function(_super) {

    __extends(FieldRenderer, _super);

    function FieldRenderer(queue, field) {
      this.queue = queue;
      this.field = field;
      FieldRenderer.__super__.constructor.call(this, this.queue);
      this.map = new enchant.Map(16, 16);
      this.map.image = this.game.assets['image/map0.png'];
      this.addNode(this.map);
    }

    FieldRenderer.prototype.update = function() {
      return this.map.loadData(this.getIdMap());
    };

    FieldRenderer.prototype.getIdMap = function() {
      var data, i, j, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.field.height; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this.field.width; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            data = this.field.staticDataMap[i][j];
            if (data.type === FieldObject.TYPE_GROUND) {
              _results2.push(1);
            } else {
              _results2.push(0);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    return FieldRenderer;

  })(Renderer);

  BombermanRenderer = (function(_super) {

    __extends(BombermanRenderer, _super);

    function BombermanRenderer(queue, bomberman) {
      this.queue = queue;
      this.bomberman = bomberman;
      BombermanRenderer.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets['image/char0.png'];
      this.sprite.x = this.sprite.y = 16;
      this.sprite.frame = [0];
      this.addNode(this.sprite);
      this.count = 0;
    }

    BombermanRenderer.prototype.update = function() {
      this.count += 1;
      if (this.bomberman.isDestroyed) {
        this.stopUpdate(this.bomberman.objectId);
        this.removeNode(this.sprite);
        return;
      }
      if (this.count > 20) {
        this.sprite.frame = [0];
        this.count = 0;
      }
      if (this.count > 15) {
        this.sprite.frame = [1];
      } else if (this.count > 10) {
        this.sprite.frame = [2];
      } else if (this.count > 5) {
        this.sprite.frame = [1];
      }
      this.sprite.x = this.bomberman.x;
      return this.sprite.y = this.bomberman.y;
    };

    return BombermanRenderer;

  })(Renderer);

  BombRenderer = (function(_super) {

    __extends(BombRenderer, _super);

    function BombRenderer(queue, bomb) {
      this.queue = queue;
      this.bomb = bomb;
      BombRenderer.__super__.constructor.call(this, this.queue);
      this.count = 0;
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'icon0.gif'];
      this.sprite.frame = [24];
      this.changePosition(this.bomb.x, this.bomb.y);
      this.addNode(this.sprite);
    }

    BombRenderer.prototype.update = function() {
      this.count += 1;
      if (this.count === 10) {
        this.sprite.frame = [25];
        this.sprite.scaleX = 0.9;
        this.sprite.scaleY = 0.9;
      } else if (this.count === 20) {
        this.count = 0;
        this.sprite.frame = [24];
        this.sprite.scaleX = 1.0;
        this.sprite.scaleY = 1.0;
      }
      this.changePosition(this.bomb.x, this.bomb.y);
      if (this.bomb.isDestroyed) {
        this.stopUpdate(this.bomb.objectId);
        return this.removeNode(this.sprite);
      }
    };

    BombRenderer.prototype.changePosition = function(x, y) {
      this.sprite.x = x;
      return this.sprite.y = y;
    };

    return BombRenderer;

  })(Renderer);

  BlastRenderer = (function(_super) {

    __extends(BlastRenderer, _super);

    function BlastRenderer(queue, blast) {
      this.queue = queue;
      this.blast = blast;
      BlastRenderer.__super__.constructor.call(this, this.queue);
      this.count = 0;
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'effect0.gif'];
      this.sprite.frame = [0];
      this.sprite.x = this.blast.x;
      this.sprite.y = this.blast.y;
      this.addNode(this.sprite);
    }

    BlastRenderer.prototype.update = function() {
      if (this.count > 8) {
        this.sprite.frame = [4];
      } else if (this.count > 6) {
        this.sprite.frame = [3];
      } else if (this.count > 4) {
        this.sprite.frame = [2];
      } else if (this.count > 2) {
        this.sprite.frame = [1];
      }
      if (this.count > this.blast.DURATION) {
        this.stopUpdate(this.blast.objectId);
        this.removeNode(this.sprite);
      }
      return this.count += 1;
    };

    return BlastRenderer;

  })(Renderer);

  BlockRenderer = (function(_super) {

    __extends(BlockRenderer, _super);

    function BlockRenderer(queue, block) {
      this.queue = queue;
      this.block = block;
      BlockRenderer.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif'];
      this.sprite.frame = [26];
      this.sprite.x = this.block.x;
      this.sprite.y = this.block.y;
      this.addNode(this.sprite);
    }

    BlockRenderer.prototype.update = function() {
      if (this.block.isDestroyed) {
        this.stopUpdate(this.block.objectId);
        return this.removeNode(this.sprite);
      }
    };

    return BlockRenderer;

  })(Renderer);

  ItemRenderer = (function(_super) {

    __extends(ItemRenderer, _super);

    function ItemRenderer(queue, item) {
      this.queue = queue;
      this.item = item;
      ItemRenderer.__super__.constructor.call(this, this.queue);
      this.sprite = new enchant.Sprite(16, 16);
      this.sprite.image = this.game.assets['image/icon0.png'];
      this.sprite.x = this.item.x;
      this.sprite.y = this.item.y;
      this.changeFrame();
      this.addNode(this.sprite);
    }

    ItemRenderer.prototype.update = function() {
      if (this.item.isDestroyed) {
        this.stopUpdate(this.item.objectId);
        return this.removeNode(this.sprite);
      }
    };

    ItemRenderer.prototype.changeFrame = function() {
      if (this.item instanceof BombUp) {
        return this.sprite.frame = [14];
      } else if (this.item instanceof FirePowerUp) {
        return this.sprite.frame = [27];
      } else if (this.item instanceof SpeedUp) {
        return this.sprite.frame = [19];
      } else if (this.item instanceof BombKick) {
        return this.sprite.frame = [5];
      } else if (this.item instanceof Remocon) {
        return this.sprite.frame = [4];
      } else {
        throw new Error("Unknown item");
      }
    };

    return ItemRenderer;

  })(Renderer);

  RenderingQueue = (function() {

    function RenderingQueue(game, scene) {
      this.game = game;
      this.scene = scene;
      this.table = {};
    }

    RenderingQueue.prototype.contains = function(id) {
      return !!this.table[id];
    };

    RenderingQueue.prototype.store = function(id, renderer) {
      return this.table[id] = renderer;
    };

    RenderingQueue.prototype.remove = function(id) {
      return delete this.table[id];
    };

    RenderingQueue.prototype.update = function() {
      var id, renderer, _ref, _results;
      _ref = this.table;
      _results = [];
      for (id in _ref) {
        if (!__hasProp.call(_ref, id)) continue;
        renderer = _ref[id];
        _results.push(renderer.update());
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

  Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
  };

}).call(this);

class FieldObject
  constructor: (@field, @type, @isBarrier) ->
    @objectId = @field.generateId()
    @isDestroyed = false

  update: ->
  destroy: ->
  kick: (direction) ->

FieldObject.TYPE_WALL   = 0
FieldObject.TYPE_GROUND = 1
FieldObject.TYPE_BLOCK  = 2
FieldObject.TYPE_BOMB   = 3
FieldObject.TYPE_BLAST  = 4
FieldObject.TYPE_ITEM   = 5

class Wall extends FieldObject
  constructor: (field) ->
    super(field, FieldObject.TYPE_WALL, true)

class Ground extends FieldObject
  constructor: (field) ->
    super(field, FieldObject.TYPE_GROUND, false)

class Blast extends FieldObject
  DURATION: 10

  constructor: (field, @index, @bomberman) ->
    super(field, FieldObject.TYPE_BLAST, false)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y
    @count = 0

  update: ->
    @count += 1
    @destroy() if @count > @DURATION

  destroy: ->
    @isDestroyed = true
    @field.removeMapData(@index.x, @index.y)

class Bomb extends FieldObject
  TIME_LIMIT: 80

  constructor: (field, @index, @bomberman) ->
    super(field, FieldObject.TYPE_BOMB, true)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y

    @count = 0
    @isKicked = false

  update: ->
    @count += 1

    if @count > @TIME_LIMIT
      @destroy()
      return

    @move() if @isKicked

  kick: (@direction) ->
    @isKicked = true

  move: ->
    delta = ([
      new Point(-3, 0),
      new Point(0, -3),
      new Point(3, 0),
      new Point(0, 3)
    ])[@direction]

    @x += delta.x
    @y += delta.y

    bounds = new Point(@x, @y)
    if @direction == Direction.RIGHT
      bounds.x += @field.tileSize - 1
    else if @direction == Direction.DOWN
      bounds.y += @field.tileSize - 1

    ix = @field.getIndex(bounds.x, bounds.y)
    if (@field.isBarrier(ix.x, ix.y) and !ix.equals(@index)) or
        @field.bombermanExists(ix)
      @isKicked = false
      @x = @field.tileSize * @index.x
      @y = @field.tileSize * @index.y

    r = new Rectangle(@x, @y, @field.tileSize, @field.tileSize)
    ix = @field.getNearestIndex(r)
    unless ix.equals(@index)
      data = @field.getMapData(ix.x, ix.y)
      data.destroy()

      @field.removeMapData(@index.x, @index.y)
      @field.setMapData(ix.x, ix.y, @)
      @index = ix

      @destroy if data.type == FieldObject.TYPE_BLAST

  destroy: ->
    @isDestroyed = true
    @bomberman.usedBomb -= 1

    @setBlast(@index)

    vs = [
      new Point(1, 0),
      new Point(-1, 0),
      new Point(0, 1),
      new Point(0, -1)
    ]

    for v in vs
      ix = @index.clone()
      for i in [0 ... @bomberman.power]
        ix.x += v.x
        ix.y += v.y

        data = @field.getMapData(ix.x, ix.y)
        continue if data.type == FieldObject.TYPE_BLAST
        data.destroy()
        break if data.type != FieldObject.TYPE_GROUND
        @setBlast(ix.clone())

  setBlast: (ix) ->
    blast = new Blast(@field, ix, @bomberman)
    @field.setMapData(ix.x, ix.y, blast)

class Block extends FieldObject
  constructor: (field, @index) ->
    super(field, FieldObject.TYPE_BLOCK, true)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y

  destroy: ->
    @isDestroyed = true

    if @hasItem()
      item = @generateItem()
      @field.setMapData(@index.x, @index.y, item)
    else
      @field.removeMapData(@index.x, @index.y)

  hasItem: ->
    @field.getRandom(3) == 0

  generateItem: ->
    cs = [BombUp, FirePowerUp, SpeedUp]
    klass = cs[@field.getRandom(cs.length)]
    new klass(@field, @index)

class Item extends FieldObject
  constructor: (field, @index) ->
    super(field, FieldObject.TYPE_ITEM, false)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y

  destroy: ->
    @isDestroyed = true
    @field.removeMapData(@index.x, @index.y)

  exertEffectOn: (bomberman) ->

class BombUp extends Item
  constructor: (field, @index) ->
    super(field, @index)

  exertEffectOn: (bomberman) ->
    bomberman.bombCapacity += 1

class FirePowerUp extends Item
  constructor: (field, @index) ->
    super(field, @index)

  exertEffectOn: (bomberman) ->
    bomberman.power += 1

class SpeedUp extends Item
  constructor: (field, @index) ->
    super(field, @index)

  exertEffectOn: (bomberman) ->
    bomberman.speed += 1

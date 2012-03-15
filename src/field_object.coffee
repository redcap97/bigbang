class FieldObject
  constructor: (@type, @isBarrier) ->
    @objectId    = Utils.generateId()
    @isDestroyed = false

  update: ->
  destroy: ->

FieldObject.TYPE_WALL   = 0
FieldObject.TYPE_GROUND = 1
FieldObject.TYPE_BLOCK  = 2
FieldObject.TYPE_BOMB   = 3
FieldObject.TYPE_BLAST  = 4
FieldObject.TYPE_ITEM   = 5

class Wall extends FieldObject
  constructor: (@field) ->
    super(FieldObject.TYPE_WALL, true)

class Ground extends FieldObject
  constructor: (@field) ->
    super(FieldObject.TYPE_GROUND, false)

class Blast extends FieldObject
  DURATION: 10

  constructor: (@field, @index, @bomberman) ->
    super(FieldObject.TYPE_BLAST, false)
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

  constructor: (@field, @index, @bomberman) ->
    super(FieldObject.TYPE_BOMB, true)
    @count = 0
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y

  update: ->
    @count += 1

    if @count > @TIME_LIMIT
      @destroy()

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
  constructor: (@field, @index) ->
    super(FieldObject.TYPE_BLOCK, true)
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
    Utils.random(3) == 0

  generateItem: ->
    cs = [BombUp, FirePowerUp, SpeedUp]
    klass = cs[Utils.random(cs.length)]
    new klass(@field, @index)

class Item extends FieldObject
  constructor: (@field, @index) ->
    super(FieldObject.TYPE_ITEM, false)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y

  destroy: ->
    @isDestroyed = true
    @field.removeMapData(@index.x, @index.y)

  exertEffectOn: (@bomberman) ->

class BombUp extends Item
  constructor: (@field, @index) ->
    super(@field, @index)

  exertEffectOn: (@bomberman) ->
    @bomberman.bombCapacity += 1

class FirePowerUp extends Item
  constructor: (@field, @index) ->
    super(@field, @index)

  exertEffectOn: (@bomberman) ->
    @bomberman.power += 1

class SpeedUp extends Item
  constructor: (@field, @index) ->
    super(@field, @index)

  exertEffectOn: (@bomberman) ->
    @bomberman.speed += 1

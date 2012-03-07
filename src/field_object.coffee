class FieldObject
  constructor: (@type, @isBarrier) ->
    @objectId    = Utils.generateId()
    @isDestroyed = false

  update: ->
  destroy: ->

FieldObject.TYPE_WALL   = 0
FieldObject.TYPE_GROUND = 1
FieldObject.TYPE_BOMB   = 2
FieldObject.TYPE_BLAST  = 3

class Blast extends FieldObject
  constructor: (@bomberman, @field, @index) ->
    super(FieldObject.TYPE_BLAST, false)
    @x = @field.tileSize * @index.x
    @y = @field.tileSize * @index.y
    @count = 0

  update: ->
    @count += 1
    @destroy() if @count > 10

  destroy: ->
    @isDestroyed = true
    @field.removeMapData(@index.x, @index.y)

class Bomb extends FieldObject
  TIME_LIMIT: 80

  constructor: (@bomberman, @field, @index) ->
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
    blast = new Blast(@bomberman, @field, ix)
    if @count <= @TIME_LIMIT or
        ix.x > @index.x or
        ix.y > @index.y
      blast.count -= 1
    @field.setMapData(ix.x, ix.y, blast)

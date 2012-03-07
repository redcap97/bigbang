class BattleField
  OUTSIDE_OF_FIELD_ERROR: "Point is outside of the field"

  constructor: ->
    @tileSize = 16
    @height   = 13
    @width    = 15

    @bomberman = new Bomberman(this, @tileSize, @tileSize)

    w = new FieldObject(FieldObject.TYPE_WALL,   true)
    g = new FieldObject(FieldObject.TYPE_GROUND, false)

    @staticDataMap = [
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, g, w, g, w, g, w, g, w, g, w, g, w, g, w],
      [w, g, g, g, g, g, g, g, g, g, g, g, g, g, w],
      [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
    ]

    @mutableDataMap = ((null for j in [0 ... @width]) for i in [0 ... @height])

    @setMapData(4, 1, new Block(this, new Point(4, 1)))
    @setMapData(5, 1, new Block(this, new Point(5, 1)))
    @setMapData(5, 2, new Block(this, new Point(5, 2)))
    @setMapData(1, 2, new BombUp(this, new Point(1, 2)))

    @updateMap()

  getMapData: (x, y) ->
    @mutableDataMap[y][x] or @staticDataMap[y][x]

  setMapData: (x, y, data) ->
    @mutableDataMap[y][x] = data

  removeMapData: (x, y) ->
    @setMapData(x, y, null)

  update: (input) ->
    ix = @bomberman.getCurrentIndex()
    data = @getMapData(ix.x, ix.y)

    switch data.type
      when FieldObject.TYPE_BLAST
        @bomberman.destroy()
      when FieldObject.TYPE_ITEM
        data.exertEffectOn(@bomberman)
        data.destroy()

    unless @bomberman.isDestroyed
      @bomberman.update(input)

    @updateMap()

  updateMap: ->
    for y in [0...@height]
      for x in [0...@width]
        @getMapData(x, y).update()

  getIndex: (x, y) ->
    if x < 0 or x >= @tileSize * @width or
        y < 0 or y >= @tileSize * @height
      throw new Error(@OUTSIDE_OF_FIELD_ERROR)
    new Point(x/@tileSize|0, y/@tileSize|0)

  getXIndexes: (xs...) ->
    rs = []
    for x in xs
      if x < 0 or x >= @tileSize * @width
        throw new Error(@OUTSIDE_OF_FIELD_ERROR)
      rs.push(x / @tileSize | 0)
    rs

  getYIndexes: (ys...) ->
    rs = []
    for y in ys
      if y < 0 or y >= @tileSize * @height
        throw new Error(@OUTSIDE_OF_FIELD_ERROR)
      rs.push(y / @tileSize | 0)
    rs

  getRectangleIndex: (r) ->
    [il, ir] = @getXIndexes(r.getLeft(), r.getRight())
    [it, ib] = @getYIndexes(r.getTop(), r.getBottom())
    [il, it, ir, ib]

  isBarrier: (x, y) ->
    @getMapData(x, y).isBarrier

  toString: ->
    ix = @bomberman.getCurrentIndex()
    "Index of Bomberman: #{ix.y}, #{ix.x}"

class BattleField
  OUTSIDE_OF_FIELD_ERROR: "Point is outside of the field"

  constructor: (numberOfPlayers) ->
    @tileSize = 16
    @height   = 13
    @width    = 15

    @bombermans = @createBombermans(numberOfPlayers)

    w = new Wall(@)
    g = new Ground(@)

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

    @setMapData(4, 1, new Block(@, new Point(4, 1)))
    @setMapData(5, 5, new Block(@, new Point(5, 5)))
    @setMapData(5, 2, new Block(@, new Point(5, 2)))
    @setMapData(1, 2, new SpeedUp(@, new Point(1, 2)))

    @updateMap()

  getMapData: (x, y) ->
    @mutableDataMap[y][x] or @staticDataMap[y][x]

  setMapData: (x, y, data) ->
    @mutableDataMap[y][x] = data

  removeMapData: (x, y) ->
    @setMapData(x, y, null)

  update: (inputs) ->
    for bomberman, i in @bombermans
      ix = bomberman.getCurrentIndex()
      data = @getMapData(ix.x, ix.y)

      switch data.type
        when FieldObject.TYPE_BLAST
          bomberman.destroy()
        when FieldObject.TYPE_ITEM
          data.exertEffectOn(bomberman)
          data.destroy()

      if inputs[i] and !bomberman.isDestroyed
        bomberman.update(inputs[i])

    @updateMap()

  updateMap: ->
    for y in [0...@height]
      for x in [0...@width]
        @getMapData(x, y).update()

  createBombermans: (n) ->
    if n < 2 and n > MAX_NUMBER_OF_PLAYERS
      throw Error("Cannot create bombermans")

    positions = [
      new Point(1,  1),
      new Point(13, 11),
      new Point(13, 1),
      new Point(1,  11),
    ]

    bombermans = []
    for i in [0 ... n]
      x = positions[i].x
      y = positions[i].y
      bombermans.push(new Bomberman(@, @tileSize*x, @tileSize*y))
    bombermans

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

  getRemainingBombermans: ->
    remainingBombermans = []
    for bomberman in @bombermans
      if bomberman.isDestroyed == false
        remainingBombermans.push(bomberman)
    remainingBombermans

  isFinished: ->
    @getRemainingBombermans().length < 2

  isDraw: ->
    @getRemainingBombermans().length == 0

  getWinner: ->
    unless @isFinished()
      throw new Error("Battle is not finished")

    for bomberman, i in @bombermans
      return i unless bomberman.isDestroyed

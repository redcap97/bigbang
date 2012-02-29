class BattleStage
  OUTSIDE_OF_STAGE_ERROR: "Point is outside of the stage"

  constructor: ->
    @tileSize = 16

    b = new StageObject(4, true)
    f = new StageObject(0, false)
    @dataMap = [
      [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
      [b, b, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, b, b, f, b, f, b, f, b, f, b, f, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
    ]

    @viewMap = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
    @bomberman = new Bomberman(this, @tileSize, @tileSize)

    @updateMaps()

  update: (input) ->
    @updateMaps()
    @bomberman.update(input)

  updateMaps: ->
    for i in [0...@dataMap.length]
      for j in [0...@dataMap[i].length]
        @dataMap[i][j].update()

    for i in [0...@dataMap.length]
      for j in [0...@dataMap[i].length]
        @viewMap[i][j] = @dataMap[i][j].id

  getIndex: (x, y) ->
    if x < 0 or x >= @tileSize * @dataMap[0].length or
        y < 0 or y >= @tileSize * @dataMap.length
      throw new Error(@OUTSIDE_OF_STAGE_ERROR)
    new Point(x/@tileSize|0, y/@tileSize|0)

  getXIndexes: (xs...) ->
    rs = []
    for x in xs
      if x < 0 or x >= @tileSize * @dataMap[0].length
        throw new Error(@OUTSIDE_OF_STAGE_ERROR)
      rs.push(x / @tileSize | 0)
    rs

  getYIndexes: (ys...) ->
    rs = []
    for y in ys
      if y < 0 or y >= @tileSize * @dataMap.length
        throw new Error(@OUTSIDE_OF_STAGE_ERROR)
      rs.push(y / @tileSize | 0)
    rs

  getRectangleIndex: (r) ->
    [il, ir] = @getXIndexes(r.getLeft(), r.getRight())
    [it, ib] = @getYIndexes(r.getTop(), r.getBottom())
    [il, it, ir, ib]

  isBarrier: (ix, iy) ->
    @dataMap[iy][ix].isBarrier

  toString: ->
    ix = @bomberman.getCurrentIndex()
    "Index of Bomberman: #{ix.y}, #{ix.x}"

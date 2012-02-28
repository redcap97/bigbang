class BattleStage
  constructor: ->
    @tileSize = 16

    b = new StageObject(4, true)
    f = new StageObject(0, false)
    @dataMap = [
      [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
      [b, f, f, f, f, f, f, f, f, f, f, f, f, f, b],
      [b, f, b, f, b, f, b, f, b, f, b, f, b, f, b],
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
    @bomberman = new Bomberman(this, 16, 16)

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
      return null

    x = x / @tileSize | 0
    y = y / @tileSize | 0
    {x: x, y: y}

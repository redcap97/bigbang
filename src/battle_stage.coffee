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

    @viewMap      = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
    @collisionMap = [[],[],[],[],[],[],[],[],[],[],[],[],[]]

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
        @viewMap[i][j]      = @dataMap[i][j].id
        @collisionMap[i][j] = if @dataMap[i][j].isBarrier then 0 else 1

  hitTest: ->
    true

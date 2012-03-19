class BattleGame
  NUMBER_OF_CHARACTERS = 16

  constructor: (@game, @dataTransport) ->
    @numberOfPlayers = @dataTransport.numberOfPlayers
    @field = new BattleField(@numberOfPlayers, @dataTransport.seed)

    @scene = new enchant.Scene()
    @game.pushScene(@scene)
    @queue = new RenderingQueue(@game, @scene)

    @scene2 = new enchant.Scene()
    @game.pushScene(@scene2)
    @queue2 = new RenderingQueue(@game, @scene2)

    @fieldRenderer = new FieldRenderer(@queue, @field)
    @fieldRenderer.update()

    @timer = new enchant.Label()
    @timer.color = "white"
    @timer.x = 4
    @timer.y = 1
    @scene2.addChild(@timer)

    @count = 0

    charaIds = @generateCharacterIds()
    for bomberman, i in @field.bombermans
      renderer = new BombermanRenderer(@queue2, bomberman, charaIds[i])
      @queue2.store(bomberman.objectId, renderer)

    @updateQueue()
    @updateRemainingTime()

  update: ->
    while @dataTransport.getBufferSize() > 0
      inputs = @dataTransport.getInput()
      @field.update(inputs)
      @updateQueue()
      @updateRemainingTime()

    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@queue.contains(data.objectId)
          @queue.store(data.objectId, @createRenderer(data))

    @count = (@count+1)%2
    @sendInput(@game.input) if @count == 0

  updateQueue: ->
    @queue.update()
    @queue2.update()

  updateRemainingTime: ->
    [min, sec] = @field.getRemainingTime()
    sm = if min < 10 then ('0'+String(min)) else String(min)
    ss = if sec < 10 then ('0'+String(sec)) else String(sec)
    @timer.text = "#{sm}:#{ss}"

  sendInput: (input) ->
    @dataTransport.sendInput(input)

  createRenderer: (data) ->
    switch data.type
      when FieldObject.TYPE_BOMB
        new BombRenderer(@queue,  data)
      when FieldObject.TYPE_BLAST
        new BlastRenderer(@queue, data)
      when FieldObject.TYPE_BLOCK
        new BlockRenderer(@queue, data)
      when FieldObject.TYPE_ITEM
        new ItemRenderer(@queue,  data)
      else
        throw Error("Unknown object")

  generateCharacterIds: ->
    hash = {}
    ids = []

    while ids.length < @numberOfPlayers
      id = @field.getRandom(NUMBER_OF_CHARACTERS)
      unless hash[id]
        hash[id] = true
        ids.push(id)
    ids

  isFinished: ->
    @field.isFinished()

  isDraw: ->
    @field.isDraw()

  getWinner: ->
    @field.getWinner()

  getPlayerId: ->
    @dataTransport.playerId

  release: ->
    @game.removeScene(@scene)
    @game.removeScene(@scene2)
    @dataTransport.release()

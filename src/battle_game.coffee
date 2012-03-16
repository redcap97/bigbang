class BattleGame
  constructor: (@game, @dataTransport) ->
    @field = new BattleField(
      @dataTransport.numberOfPlayers,
      @dataTransport.seed
    )

    @scene = new enchant.Scene()
    @game.pushScene(@scene)
    @queue = new RenderingQueue(@game, @scene)

    @scene2 = new enchant.Scene()
    @game.pushScene(@scene2)
    @queue2 = new RenderingQueue(@game, @scene2)

    @fieldRenderer = new FieldRenderer(@queue, @field)
    @fieldRenderer.update()

    @count = 0

    for bomberman in @field.bombermans
      bombermanRenderer = new BombermanRenderer(@queue2, bomberman)
      @queue2.store(bomberman.objectId, bombermanRenderer)

    @updateQueue()

  update: ->
    while @dataTransport.getBufferSize() > 0
      inputs = @dataTransport.getInput()
      @field.update(inputs)
      @updateQueue()

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

  isFinished: ->
    @field.isFinished()

  isDraw: ->
    @field.isDraw()

  getWinner: ->
    @field.getWinner()

  release: ->
    @game.removeScene(@scene)
    @game.removeScene(@scene2)
    @dataTransport.release()

class BattleGame
  constructor: (@game, @dataTransport) ->
    @field = new BattleField()

    @scene = new enchant.Scene()
    @game.pushScene(@scene)
    @queue = new RenderingQueue(@game, @scene)

    @scene2 = new enchant.Scene()
    @game.pushScene(@scene2)
    @queue2 = new RenderingQueue(@game, @scene2)

    @fieldView = new FieldView(@queue, @field)
    @fieldView.update()

    @count = 0

    for bomberman in @field.bombermans
      bombermanView = new BombermanView(@queue2, bomberman)
      @queue2.store(bomberman.objectId, bombermanView)

    @updateQueue()
    @dataTransport.clearBuffer()

  update: ->
    while @dataTransport.getBufferSize() > 0
      inputs = @dataTransport.getInput()
      @field.update(inputs)
      @updateQueue()

    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@queue.contains(data.objectId)
          @queue.store(data.objectId, @createView(data))

    @count = (@count+1)%2
    @sendInput(@game.input) if @count == 0

  updateQueue: ->
    @queue.update()
    @queue2.update()

  sendInput: (input) ->
    @dataTransport.sendInput(input)

  createView: (data) ->
    switch data.type
      when FieldObject.TYPE_BOMB
        new BombView(@queue,  data)
      when FieldObject.TYPE_BLAST
        new BlastView(@queue, data)
      when FieldObject.TYPE_BLOCK
        new BlockView(@queue, data)
      when FieldObject.TYPE_ITEM
        new ItemView(@queue,  data)
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

class BattleGame
  NUMBER_OF_CHARACTERS = 16

  RENDERER_TABLE = {}
  RENDERER_TABLE[FieldObject.TYPE_BLAST]  = BlastRenderer
  RENDERER_TABLE[FieldObject.TYPE_BLOCK]  = BlockRenderer
  RENDERER_TABLE[FieldObject.TYPE_BOMB]   = BombRenderer
  RENDERER_TABLE[FieldObject.TYPE_ITEM]   = ItemRenderer
  RENDERER_TABLE[FieldObject.TYPE_PBLOCK] = PressureBlockRenderer

  constructor: (@game, @dataTransport) ->
    {
      playerId: @playerId
      numberOfPlayers: @numberOfPlayers
    } = @dataTransport

    @parity = @finalCount = 0

    @field = new Field(@numberOfPlayers, @dataTransport.seed)

    @lowerScene = new enchant.Scene()
    @upperScene = new enchant.Scene()
    @game.pushScene(@lowerScene)
    @game.pushScene(@upperScene)

    @lowerQueue = @createLowerQueue()
    @upperQueue = @createUpperQueue()

    @updateQueue()

  update: ->
    while @dataTransport.getBufferSize() > 0
      @finalCount += 1 if @field.isFinished()

      @field.update(@dataTransport.getInput())
      @updateQueue()

    @storeNewRenderers()

    if @dataTransport.isClosed()
      alert(MESSAGE_DISCONNECT)
      throw new Error(MESSAGE_DISCONNECT)

    @parity = (@parity+1)%2
    @sendInput(@game.input) if @parity == 0

  updateQueue: ->
    @lowerQueue.update()
    @upperQueue.update()

  sendInput: (input) ->
    @dataTransport.sendInput(input)

  createRenderer: (data) ->
    klass = RENDERER_TABLE[data.type]
    if klass?
      new klass(@lowerQueue, data)
    else
      throw Error("Unknown object")

  storeNewRenderers: ->
    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@lowerQueue.contains(data.objectId)
          @lowerQueue.store(data.objectId, @createRenderer(data))

  createUpperQueue: ->
    upperQueue = new RenderingQueue(@game, @upperScene)
    charaIds = @generateCharacterIds()
    for bomberman, i in @field.bombermans
      renderer = new BombermanRenderer(upperQueue, bomberman, charaIds[i])
      upperQueue.store(bomberman.objectId, renderer)

    timerRenderer = new TimerRenderer(upperQueue, @field)
    upperQueue.store(timerRenderer.id, timerRenderer)

    initialNoticeRenderer = new InitialNoticeRenderer(upperQueue, @field, @playerId)
    upperQueue.store(initialNoticeRenderer.id, initialNoticeRenderer)

    upperQueue

  createLowerQueue: ->
    lowerQueue = new RenderingQueue(@game, @lowerScene)
    fieldRenderer = new FieldRenderer(lowerQueue, @field)
    fieldRenderer.update()
    lowerQueue

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
    @field.isFinished() and @finalCount > 30

  isDraw: ->
    @field.isDraw()

  getWinner: ->
    @field.getWinner()

  getPlayerId: ->
    @playerId

  release: ->
    @game.removeScene(@lowerScene)
    @game.removeScene(@upperScene)
    @dataTransport.release()

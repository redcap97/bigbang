class BattleGame
  NUMBER_OF_CHARACTERS = 16

  constructor: (@game, @dataTransport) ->
    @parity = @finalCount = 0
    @isStarted = false

    {
      playerId: @playerId
      numberOfPlayers: @numberOfPlayers
    } = @dataTransport

    @field = new BattleField(@numberOfPlayers, @dataTransport.seed)

    @lowerScene = new enchant.Scene()
    @upperScene = new enchant.Scene()
    @game.pushScene(@lowerScene)
    @game.pushScene(@upperScene)

    @lowerQueue = @createLowerQueue()
    @upperQueue = @createUpperQueue()

    @timer = @createTimer()
    @startMessage = @createStartMessage()
    @screenTip = @createScreenTip()

    @upperScene.addChild(@timer)
    @upperScene.addChild(@startMessage)
    @upperScene.addChild(@screenTip)

    @updateQueue()
    @updateRemainingTime()

  update: ->
    if @field.getCount() > 0 and !@isStarted
      @upperScene.removeChild(@startMessage)
      @upperScene.removeChild(@screenTip)
      @isStarted = true

    while @dataTransport.getBufferSize() > 0
      @finalCount += 1 if @field.isFinished()

      @field.update(@dataTransport.getInput())
      @updateQueue()
      @updateRemainingTime()

    @storeNewRenderers()

    @parity = (@parity+1)%2
    @sendInput(@game.input) if @parity == 0

  updateQueue: ->
    @lowerQueue.update()
    @upperQueue.update()

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
        new BombRenderer(@lowerQueue,  data)
      when FieldObject.TYPE_BLAST
        new BlastRenderer(@lowerQueue, data)
      when FieldObject.TYPE_BLOCK
        new BlockRenderer(@lowerQueue, data)
      when FieldObject.TYPE_ITEM
        new ItemRenderer(@lowerQueue,  data)
      else
        throw Error("Unknown object")

  storeNewRenderers: ->
    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@lowerQueue.contains(data.objectId)
          @lowerQueue.store(data.objectId, @createRenderer(data))

  createTimer: ->
    timer = new enchant.Label()
    timer.color = "white"
    timer.x = 4
    timer.y = 1
    timer

  createScreenTip: ->
    screenTip = new enchant.Label()
    screenTip.className = "screen-tip"
    screenTip.text = "You"

    p = ([
      new Point(12,  34),
      new Point(205, 162),
      new Point(205, 34),
      new Point(12,  162),
    ])[@playerId]

    screenTip.x = p.x
    screenTip.y = p.y
    screenTip.width = 24
    screenTip

  createStartMessage: ->
    startMessage = new enchant.Label()
    startMessage.className = "start-message"
    startMessage.text = "START!"
    startMessage.x = 45
    startMessage.y = 80
    startMessage

  createUpperQueue: ->
    upperQueue = new RenderingQueue(@game, @upperScene)
    charaIds = @generateCharacterIds()
    for bomberman, i in @field.bombermans
      renderer = new BombermanRenderer(upperQueue, bomberman, charaIds[i])
      upperQueue.store(bomberman.objectId, renderer)
    upperQueue

  createLowerQueue: ->
    fieldRenderer = new FieldRenderer(@lowerQueue, @field)
    fieldRenderer.update()

    new RenderingQueue(@game, @lowerScene)

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

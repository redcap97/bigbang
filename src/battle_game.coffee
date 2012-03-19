class BattleGame
  NUMBER_OF_CHARACTERS = 16

  constructor: (@game, @dataTransport) ->
    {
      playerId: @playerId
      numberOfPlayers: @numberOfPlayers
    } = @dataTransport

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

    @startMessage = new enchant.Label()
    @startMessage.className = "start-message"
    @startMessage.text = "START!"
    @startMessage.x = 45
    @startMessage.y = 80
    @scene2.addChild(@startMessage)

    @screenTip = new enchant.Label()
    @screenTip.className = "screen-tip"
    @screenTip.text = "You"

    p = ([
      new Point(12,  34),
      new Point(205, 162),
      new Point(205, 34),
      new Point(12,  162),
    ])[@playerId]

    @screenTip.x = p.x
    @screenTip.y = p.y
    @screenTip.width = 24
    @scene2.addChild(@screenTip)

    @parity = 0
    @finalCount = 0
    @isStarted = false

    charaIds = @generateCharacterIds()
    for bomberman, i in @field.bombermans
      renderer = new BombermanRenderer(@queue2, bomberman, charaIds[i])
      @queue2.store(bomberman.objectId, renderer)

    @updateQueue()
    @updateRemainingTime()

  update: ->
    if @field.getCount() > 0 and !@isStarted
      @scene2.removeChild(@startMessage)
      @scene2.removeChild(@screenTip)
      @startMessage = true


    while @dataTransport.getBufferSize() > 0
      @finalCount += 1 if @field.isFinished()

      inputs = @dataTransport.getInput()
      @field.update(inputs)

      @updateQueue()
      @updateRemainingTime()

    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@queue.contains(data.objectId)
          @queue.store(data.objectId, @createRenderer(data))

    @parity = (@parity+1)%2
    @sendInput(@game.input) if @parity == 0

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
    @field.isFinished() and @finalCount > 30

  isDraw: ->
    @field.isDraw()

  getWinner: ->
    @field.getWinner()

  getPlayerId: ->
    @playerId

  release: ->
    @game.removeScene(@scene)
    @game.removeScene(@scene2)
    @dataTransport.release()

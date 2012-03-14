ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

class BattleGame
  constructor: (@game) ->
    @field = new BattleField()

    @scene = new enchant.Scene()
    @game.pushScene(@scene)

    @scene2 = new enchant.Scene()
    @game.pushScene(@scene2)

    @queue = new RenderingQueue(@game, @scene)
    @queue2 = new RenderingQueue(@game, @scene2)

    @fieldView = new FieldView(@queue, @field)
    @fieldView.update()

    for bomberman in @field.bombermans
      bombermanView = new BombermanView(@queue2, bomberman)
      @queue2.store(bomberman.objectId, bombermanView)

    @inputBuffer = []
    @socket = new WebSocket('ws://localhost:8080', 'bigbang')
    @socket.binaryType = 'arraybuffer'
    @socket.onmessage = (event) =>
      byteArray = new Uint8Array(event.data)
      inputs = []
      for i in [0 ... byteArray.length]
        inputs.push(Utils.decodeInput(byteArray[i]))
      @inputBuffer.push(inputs)

    @count = 0
    @updateQueue()

  update: ->
    while @inputBuffer.length > 0
      inputs = @inputBuffer.shift()
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
    v = Utils.encodeInput(input)
    return if v == 0

    byteArray = new Uint8Array(1)
    byteArray[0] = v

    if @socket.readyState == 1
      @socket.send(byteArray.buffer)

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
    @socket.close()
    @game.removeScene(@scene)
    @game.removeScene(@scene2)

class GameResult
  constructor: (@game) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    @scene.addChild(@label)
    @game.pushScene(@scene)

  setWinner: (pn) ->
    @label.text = "Winner: #{pn}"

  setDraw: ->
    @label.text = "Draw"

  update: ->

  isFinished: ->
    false

  release: ->
    @game.removeScene(@scene)

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.fps = 60

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    currentScene = new BattleGame(game)

    game.addEventListener 'enterframe', ->
      if currentScene.isFinished()
        if currentScene instanceof BattleGame
          gameResult = new GameResult(game)
          if currentScene.isDraw()
            gameResult.setDraw()
          else
            gameResult.setWinner(currentScene.getWinner())
          currentScene.release()
          currentScene = gameResult
        else if currentScene instanceof GameResult
          currentScene.release()
          currentScene = new BattleGame(game)
        else
          throw new Error("Unknown scene")

      currentScene.update()

  game.start()

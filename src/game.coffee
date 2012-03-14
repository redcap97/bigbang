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
    @socket = new WebSocket('ws://ds.local:8080', 'echo-protocol')
    @socket.binaryType = 'arraybuffer'
    @socket.onmessage = (event) =>
      console.timeEnd('1')
      byteArray = new Uint8Array(event.data)
      inputs = []
      for i in [0 ... byteArray.length]
        inputs.push(Utils.decodeInput(byteArray[i]))
      @inputBuffer.push(inputs)

    @count = 0

  update: ->
    while @inputBuffer.length > 0
      inputs = @inputBuffer.shift()
      @field.update(inputs)

      @queue.update()
      @queue2.update()

    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@queue.contains(data.objectId)
          @queue.store(data.objectId, @createView(data))

    @count = (@count+1)%2
    @sendInput(@game.input) if @count == 0

  sendInput: (input) ->
    v = Utils.encodeInput(input)
    return if v == 0

    byteArray = new Uint8Array(1)
    byteArray[0] = v

    console.time('1')
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

class ScoreBoard
  constructor: (@game, @gameScore) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    @label.text = @getText()

    @scene.addChild(@label)
    @game.pushScene(@scene)

    @count = 0

  getText: ->
    text = ""
    if @gameScore.draw
      text += "Draw<br/>"

    for i in [0...@gameScore.scores.length]
      text += "P#{i}: #{@gameScore.scores[i]}<br/>"

    text

  update: ->
    @count += 1

  isFinished: ->
    @count > 30

  release: ->
    @game.removeScene(@scene)

class WinnerScene
  constructor: (@game, @gameScore) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    @label.text = "Winner: #{gameScore.getWinner()}"

    @scene.addChild(@label)
    @game.pushScene(@scene)

  update: ->

  isFinished: ->
    false

  release: ->
    @game.removeScene(@scene)

class GameScore
  constructor: ->
    @scores = (0 for i in [0...4])
    @draw = false

  setDraw: ->
    @draw = true

  setWinner: (pn) ->
    @draw = false
    @scores[pn] += 1

  gameOver: ->
    for i in [0 ... @scores.length]
      return true if @scores[i] == 3
    false

  getWinner: ->
    for i in [0 ... @scores.length]
      return i if @scores[i] == 3

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.fps = 60

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    currentGame = new BattleGame(game)
    gameScore = new GameScore()

    game.addEventListener 'enterframe', ->
      if currentGame.isFinished()
        if currentGame instanceof BattleGame
          if currentGame.isDraw()
            gameScore.setDraw()
          else
            gameScore.setWinner(currentGame.getWinner())

          currentGame.release()
          if gameScore.gameOver()
            currentGame = new WinnerScene(game, gameScore)
          else
            currentGame = new ScoreBoard(game, gameScore)

        else if currentGame instanceof ScoreBoard
          currentGame.release()
          currentGame = new BattleGame(game)

      currentGame.update()

  game.start()

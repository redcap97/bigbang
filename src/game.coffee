ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

class BattleGame
  constructor: (@game) ->
    @field = new BattleField()

    @scene = new enchant.Scene()
    @queue = new RenderingQueue(@game, @scene)

    @fieldView = new FieldView(@queue, @field)
    @fieldView.update()

    @scene2 = new enchant.Scene()
    @queue2 = new RenderingQueue(@game, @scene2)

    for bomberman in @field.bombermans
      bombermanView = new BombermanView(@queue2, bomberman)
      @queue2.store(bomberman.objectId, bombermanView)

    @game.pushScene(@scene)
    @game.pushScene(@scene2)

  update: ->
    @field.update(@game.input)

    @queue.update()
    @queue2.update()

    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.mutableDataMap[i][j]
        if data and !@queue.contains(data.objectId)
          @queue.store(data.objectId, @createView(data))

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

class ScoreBoard
  constructor: (@game, result) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    if result != null
      @label.text = "Winner: #{result}"
    else
      @label.text = "Draw"

    @scene.addChild(@label)
    @game.pushScene(@scene)

  update: ->

  isFinished: ->
    false

  release: ->

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    currentGame = null
    game.addEventListener 'enterframe', ->
      unless currentGame
        currentGame = new BattleGame(game)

      if currentGame.isFinished()
        result = if currentGame.isDraw()
          null
        else
          currentGame.getWinner()

        currentGame.release()
        currentGame = new ScoreBoard(game, result)

      currentGame.update()

  game.start()

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

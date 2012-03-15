class GameResult
  constructor: (@game) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    @scene.addChild(@label)
    @game.pushScene(@scene)

    @count = 0

  setWinner: (pn) ->
    @label.text = "Winner: #{pn}"

  setDraw: ->
    @label.text = "Draw"

  update: ->
    @count += 1

  isFinished: ->
    @count > 60

  release: ->
    @game.removeScene(@scene)

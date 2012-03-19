class GameResult
  constructor: (@game) ->
    @scene = new enchant.Scene()
    @scene.backgroundColor = "#217821"

    @label = new enchant.Label()

    @scene.addChild(@label)
    @game.pushScene(@scene)

    @count = 0

  win: ->
    @label.text = "YOU WIN"
    @label.className = "result-win"
    @label.x = 18
    @label.y = 60

  lose: ->
    @label.text = "YOU LOSE"
    @label.className = "result-lose"
    @label.x = 6
    @label.y = 60

  draw: ->
    @label.text = "DRAW"
    @label.className = "result-draw"
    @label.x = 65
    @label.y = 60

  update: ->
    @count += 1

  isFinished: ->
    @count > 60 * 2

  release: ->
    @game.removeScene(@scene)

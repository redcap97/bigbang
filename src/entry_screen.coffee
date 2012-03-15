class EntryScreen
  constructor: (@game) ->
    @finished = false

    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4
    @label.text = "Plese input Z to start game"

    @scene.addChild(@label)
    @game.pushScene(@scene)

  update: ->
    @finished = true if @game.input.a

  isFinished: ->
    @finished

  release: ->
    @game.removeScene(@scene)

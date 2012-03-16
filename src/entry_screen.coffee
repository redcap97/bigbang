class EntryScreen
  constructor: (@game) ->
    @scene = new enchant.Scene()

    @label = new enchant.Label()
    @label.x = 4

    @scene.addChild(@label)
    @game.pushScene(@scene)

    @setText("Plese input Z to start game")

    @dataTransport = null
    @isCanceling = false

    @finished = false

  update: ->
    if @game.input.a and @dataTransport == null
      @setText("Please wait")
      @dataTransport = new DataTransport()

    if @game.input.b and @dataTransport != null and !@isCanceling
      @setText("Canceling...")

      @dataTransport.release()
      @isCanceling = true

      id = setInterval =>
        if @dataTransport.isClosed()
          @setText("Plese input Z to start game")

          @dataTransport = null
          @isCanceling = false
          clearInterval(id)
      ,2 * 1000

  setText: (text) ->
    @label.text = text

  isFinished: ->
    @dataTransport?.hasBattleData()

  getDataTransport: ->
    @dataTransport

  release: ->
    @game.removeScene(@scene)

class EntryScreen
  MESSAGE_ENTRY_GAME = "Plese Input Z to Entry Game"
  MESSAGE_CANCEL = "Canceling..."
  MESSAGE_WAIT = "Please Wait... (X: Cancel)"

  constructor: (@game) ->
    @scene = new enchant.Scene()
    @scene.backgroundColor = "#217821"

    @title = new enchant.Label()
    @title.text = "Bigbang"
    @title.className = "game-title"
    @title.x = 10
    @title.y = 20

    @caption = new enchant.Label()
    @caption.text = MESSAGE_ENTRY_GAME
    @caption.className = "game-caption"
    @caption.x = 10
    @caption.y = 130

    @scene.addChild(@title)
    @scene.addChild(@caption)
    @game.pushScene(@scene)

    @dataTransport = null
    @isCanceling = false

    @finished = false

  update: ->
    if @game.input.a and @dataTransport == null
      @caption.text = MESSAGE_WAIT
      @dataTransport = new DataTransport()

    if @game.input.b and @dataTransport != null and !@isCanceling
      @caption.text = MESSAGE_CANCEL

      @dataTransport.release()
      @isCanceling = true

      id = setInterval =>
        if @dataTransport.isClosed()
          @caption.text = MESSAGE_ENTRY_GAME

          @dataTransport = null
          @isCanceling = false
          clearInterval(id)
      , 2 * 1000

  isFinished: ->
    @dataTransport?.hasBattleData()

  getDataTransport: ->
    @dataTransport

  release: ->
    @game.removeScene(@scene)

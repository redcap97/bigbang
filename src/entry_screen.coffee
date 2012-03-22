class EntryScreen
  MESSAGE_ENTRY_GAME = "Please Input Z to Enter Game"
  MESSAGE_CANCEL = "Canceling..."
  MESSAGE_WAIT = "Please Wait... (X: Cancel)"

  constructor: (@game) ->
    @scene = new enchant.Scene()
    @scene.backgroundColor = "#217821"

    @title = @createTitle()
    @caption = @createCaption()

    @scene.addChild(@title)
    @scene.addChild(@caption)
    @game.pushScene(@scene)

    @dataTransport = null
    @isCanceling = false

    @finished = false

  update: ->
    if @game.input.a and @dataTransport == null
      @caption.text = MESSAGE_WAIT
      @caption.x = 14

      @dataTransport = new DataTransport()

    if @game.input.b and @dataTransport != null and !@isCanceling
      @caption.text = MESSAGE_CANCEL

      @dataTransport.release()
      @isCanceling = true

      id = setInterval =>
        if @dataTransport.isClosed()
          @caption.text = MESSAGE_ENTRY_GAME
          @caption.x = 8

          @dataTransport = null
          @isCanceling = false
          clearInterval(id)
      , 2 * 1000

    if !@isCanceling and @dataTransport?.isClosed()
      alert(MESSAGE_DISCONNECT)
      throw new Error(MESSAGE_DISCONNECT)

  createTitle: ->
    title = new enchant.Label()
    title.text = "Bigbang"
    title.className = "game-title"
    title.x = 12
    title.y = 20
    title

  createCaption: ->
    caption = new enchant.Label()
    caption.text = MESSAGE_ENTRY_GAME
    caption.className = "game-caption"
    caption.x = 8
    caption.y = 130
    caption

  isFinished: ->
    @dataTransport?.hasBattleData()

  getDataTransport: ->
    @dataTransport

  release: ->
    @game.removeScene(@scene)

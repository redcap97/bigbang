class DataTransport
  constructor: ->
    @inputBuffer = []
    @playerId = @numberOfPlayers = @seed = null
    @oldInput = 0

    @socket = new WebSocket(WS_URI, WS_SUBPROTOCOL)
    @socket.binaryType = 'arraybuffer'

    @socket.onmessage = (event) =>
      unless @hasBattleData()
        @receiveBattleData(event.data)
      else
        @receiveInputs(event.data)

  receiveBattleData: (data) ->
    try
      {
        seed:            @seed
        numberOfPlayers: @numberOfPlayers
        playerId:        @playerId
      } = JSON.parse(data)
    catch e
      @release()
      throw e

    unless @validateBattleData()
      @release()
      throw Error("Invalid battle data")

  receiveInputs: (data) ->
    byteArray = new Uint8Array(data)
    inputs = []
    for i in [0 ... byteArray.length]
      inputs.push(Utils.decodeInput(byteArray[i]))
    @inputBuffer.push(inputs)

  sendInput: (input) ->
    return unless @isConnected()

    v = Utils.encodeInput(input)
    byteArray = new Uint8Array(1)
    byteArray[0] = v

    unless v == 0 and @oldInput == 0
      @socket.send(byteArray.buffer)

    @oldInput = v

  getInput: ->
    @inputBuffer.shift()

  getBufferSize: ->
    @inputBuffer.length

  clearBuffer: ->
    @inputBuffer.length = 0

  hasBattleData: ->
    @playerId? and @numberOfPlayers?

  validateBattleData: ->
    @seed? and
      @numberOfPlayers >= 2 and
      @numberOfPlayers <= MAX_NUMBER_OF_PLAYERS and
      @playerId >= 0 and
      @playerId < @numberOfPlayers

  isConnected: ->
    @socket.readyState == WebSocket.OPEN

  isClosed: ->
    @socket.readyState == WebSocket.CLOSED

  release: ->
    @clearBuffer()
    @socket.close()

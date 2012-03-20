BUFFER_LIMIT = 1200
MAX_CONNECTIONS = 100
FPS = 30
BATTLE_TIME_LIMIT = FPS * 60 * 3
MAX_NUMBER_OF_PLAYERS = 4

NONE_INPUT = 64

WebSocketServer = require('websocket').server
http = require('http')

numberOfConnections = 0

class Player
  constructor: (@connection) ->
    @inputBuffer = []

    @connection.on 'message', (message) =>
      data = message.binaryData
      if data.length > 1 or @inputBuffer.length > BUFFER_LIMIT
        console.error("#{new Date()} #{@connection.remoteAddress} sent bad message")
        @release()
        return
      @inputBuffer.push(data.readUInt8(0))

    @connection.on 'close', (reasonCode, description) =>
      numberOfConnections -= 1
      console.log((new Date()) + ' Peer ' + @connection.remoteAddress + ' disconnected.')

  sendBytes: (buffer) ->
    @connection.sendBytes(buffer)

  sendUTF: (text) ->
    @connection.sendUTF(text)

  getInput: ->
    @inputBuffer.shift() ? NONE_INPUT

  isConnected: ->
    @connection.connected

  clearBuffer: ->
    @inputBuffer.length = 0

  release: ->
    @clearBuffer()
    @connection.close()

class Group
  constructor: ->
    @players = []
    @count = 0

  add: (player) ->
    @players.push(player)

  purge: ->
    for i in ([0 ... @players.length].reverse())
      @players.splice(i, 1) unless @players[i].isConnected()

  startGame: ->
    @sendBattleData()

    setTimeout =>
      @clearBuffers()
      id = setInterval =>
        @count += 1

        if @count > BATTLE_TIME_LIMIT
          console.error("#{new Date()} Battle time limit is exceeded")
          clearInterval(id)
          @release()
          return

        if @gameOver()
          clearInterval(id)
          @release()
          return

        @sendInputs()
      , 1000 / FPS
    , 1000 * 1.5

  clearBuffers: ->
    for player in @players
      player.clearBuffer()

  sendBattleData: ->
    battleData =
      seed: [@getRandom(), @getRandom()],
      numberOfPlayers: @getNumberOfPlayers(),

    for player, i in @players
      battleData.playerId = i
      player.sendUTF(JSON.stringify(battleData))

  getRandom: ->
    (Math.random() * (Math.pow(2, 31)-1))|0

  sendInputs: ->
    buffer = new Buffer(@getNumberOfPlayers())
    for player, i in @players
      buffer.writeUInt8(player.getInput(), i)

    player.sendBytes(buffer) for player in @players

  canStartGame: ->
    @players.length == MAX_NUMBER_OF_PLAYERS

  getNumberOfPlayers: ->
    @players.length

  gameOver: ->
    for player in @players
      return false if player.isConnected()
    true

  release: ->
    player.release() for player in @players

httpServer = http.createServer (request, response) ->
  console.log((new Date()) + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()

webSocketServer = new WebSocketServer(
  httpServer: httpServer,
  autoAcceptConnections: false
)

originIsAllowed = (origin) -> true

timerId = null
group = new Group()

webSocketServer.on 'request', (request) ->
  if !originIsAllowed(request.origin)
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return

  if numberOfConnections > MAX_CONNECTIONS
    request.reject()
    console.log("#{new Date()} MAX_CONNECTIONS limit is exceeded")
    return

  if timerId != null
    clearTimeout(timerId)
    timerId = null

  numberOfConnections += 1
  connection = request.accept('bigbang', request.origin)

  console.log("#{new Date()} Connection accepted.")
  console.log("#{new Date()} The number of Connections: #{numberOfConnections}")

  group.purge()
  group.add(new Player(connection))

  if group.canStartGame()
    group.startGame()
    group = new Group()
  else if group.getNumberOfPlayers() > 1
    timerId = setTimeout ->
      group.purge()
      if group.getNumberOfPlayers() > 1
        group.startGame()
        group = new Group()
    , 3 * 1000

httpServer.listen 8080, ->
  console.log((new Date()) + ' Server is listening on port 8080')

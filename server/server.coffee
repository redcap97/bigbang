WebSocketServer = require('websocket').server
http = require('http')

class Player
  constructor: (@connection) ->
    @inputBuffer = []

    @connection.on 'message', (message) =>
      data = message.binaryData
      @inputBuffer.push(data.readUInt8(0))

    @connection.on 'close', (reasonCode, description) =>
      console.log((new Date()) + ' Peer ' + @connection.remoteAddress + ' disconnected.')

  sendBytes: (buffer) ->
    @connection.sendBytes(buffer)

  getInput: ->
    @inputBuffer.shift() || 0

  isConnected: ->
    @connection.connected

  clearBuffer: ->
    @inputBuffer.length = 0

class Group
  constructor: ->
    @players = []

  add: (player) ->
    @players.push(player)

  purge: ->
    for i in ([0 ... @players.length].reverse())
      unless @players[i].isConnected()
        @players.splice(i, 1)

  startGame: ->
    buffer = new Buffer(@getNumberOfPlayers())
    buffer.writeUInt8(@getNumberOfPlayers(), 0)

    for i in [0 ... @getNumberOfPlayers()]
      buffer.writeUInt8(i, 1)
      @players[i].sendBytes(buffer)
      @players[i].clearBuffer()

    id = setInterval =>
      if @gameOver()
        clearInterval(id)
        return

      buffer = new Buffer(@getNumberOfPlayers())
      for i in [0 ... @getNumberOfPlayers()]
        buffer.writeUInt8(@players[i].getInput(), i)

      player.sendBytes(buffer) for player in @players

    , 1000/30.0

  canStartGame: ->
    @players.length == 4

  getNumberOfPlayers: ->
    @players.length

  gameOver: ->
    for player in @players
      return false if player.isConnected()
    true

server = http.createServer (request, response) ->
  console.log((new Date()) + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()

webSocketServer = new WebSocketServer(
  httpServer: server,
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

  if timerId != null
    clearTimeout(timerId)
    timerId = null

  connection = request.accept('bigbang', request.origin)
  console.log((new Date()) + ' Connection accepted.')

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
    ,3 * 1000

server.listen 8080, ->
  console.log((new Date()) + ' Server is listening on port 8080')

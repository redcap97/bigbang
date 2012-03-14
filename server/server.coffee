WebSocketServer = require('websocket').server
http = require('http')

class Player
  constructor: (@connection) ->
    @inputBuffer = []

    @connection.on 'message', (message) =>
      if message.type == 'utf8'
        @connection.sendUTF(message.utf8Data)
      else if message.type == 'binary'
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
    player.clearBuffer() for player in @players

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
    @players.length == 2

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

group = new Group()
webSocketServer.on 'request', (request) ->
  if !originIsAllowed(request.origin)
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return

  connection = request.accept('bigbang', request.origin)
  console.log((new Date()) + ' Connection accepted.')

  group.purge()
  player = new Player(connection)
  group.add(player)

  if group.canStartGame()
    group.startGame()
    group = new Group()

server.listen 8080, ->
  console.log((new Date()) + ' Server is listening on port 8080')

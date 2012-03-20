WS_SUBPROTOCOL = 'bigbang'

MAX_NUMBER_OF_PLAYERS = 4
ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

createGameResult = (game, currentScene) ->
  gameResult = new GameResult(game)
  if currentScene.isDraw()
    gameResult.draw()
  else if currentScene.getWinner() == currentScene.getPlayerId()
    gameResult.win()
  else
    gameResult.lose()
  gameResult

window.onload = ->
  game = new enchant.Game(240, 208)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'effect0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'icon0.gif')
  game.preload('image/map0.png')
  game.preload('image/icon0.png')
  game.preload('image/char0.png')

  game.fps = 60

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    currentScene = new EntryScreen(game)
    game.addEventListener 'enterframe', ->
      if currentScene.isFinished()
        if currentScene instanceof EntryScreen
          dataTransport = currentScene.getDataTransport()
          currentScene.release()
          currentScene = new BattleGame(game, dataTransport)
        else if currentScene instanceof BattleGame
          gameResult = createGameResult()
          currentScene.release()
          currentScene = gameResult
        else if currentScene instanceof GameResult
          currentScene.release()
          currentScene = new EntryScreen(game)
        else
          throw new Error("Unknown scene")
      currentScene.update()
  game.start()

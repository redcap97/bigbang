ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.fps = 60

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    currentScene = new BattleGame(game)

    game.addEventListener 'enterframe', ->
      if currentScene.isFinished()
        if currentScene instanceof BattleGame
          gameResult = new GameResult(game)
          if currentScene.isDraw()
            gameResult.setDraw()
          else
            gameResult.setWinner(currentScene.getWinner())
          currentScene.release()
          currentScene = gameResult
        else if currentScene instanceof GameResult
          currentScene.release()
          currentScene = new BattleGame(game)
        else
          throw new Error("Unknown scene")
      currentScene.update()
  game.start()

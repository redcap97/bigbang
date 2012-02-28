ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')
  game.onload = ->
    stageModel = new BattleStage()

    stage = new enchant.Map(16, 16)
    stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    stage.loadData(stageModel.viewMap)
    stage.collisionData = stageModel.collisionMap

    sprite = new enchant.Sprite(16, 16)
    sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'chara0.gif']

    game.addEventListener('enterframe', ->
      stageModel.update(game.input)
      sprite.x = stageModel.bomberman.x
      sprite.y = stageModel.bomberman.y
    )

    scene = new enchant.Scene()
    scene.addChild(stage)
    scene.addChild(sprite)
    game.pushScene(scene)

  game.start()
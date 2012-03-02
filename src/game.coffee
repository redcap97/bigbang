window.onload = ->
  ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    field = new BattleField()

    stage = new enchant.Map(16, 16)
    stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    stage.loadData(field.viewMap)

    sprite = new enchant.Sprite(16, 16)
    sprite.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    sprite.x = sprite.y = 16
    sprite.frame = [2]

    label = new enchant.Label()
    label.color = "white"
    label.x = 4

    game.addEventListener('enterframe', ->
      field.update(game.input)
      sprite.x = field.bomberman.x
      sprite.y = field.bomberman.y
      stage.loadData(field.viewMap)

      label.text = field.toString()
    )

    scene = new enchant.Scene()
    scene.addChild(stage)
    scene.addChild(sprite)
    scene.addChild(label)
    game.pushScene(scene)

  game.start()

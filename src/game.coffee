ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

window.onload = ->
  game = new enchant.Game(320, 320)
  game.scale = 3.0
  game.preload(ENCHANTJS_IMAGE_PATH + 'chara0.gif')
  game.preload(ENCHANTJS_IMAGE_PATH + 'map0.gif')

  game.keybind("Z".charCodeAt(0), 'a')
  game.keybind("X".charCodeAt(0), 'b')

  game.onload = ->
    field = new BattleField()
    bomberman = field.bomberman

    scene = new enchant.Scene()

    queue = new RenderingQueue(game, scene)

    fieldView = new FieldView(queue, field)
    fieldView.update()

    bombermanView = new BombermanView(queue, bomberman)
    queue.store(bomberman.objectId, bombermanView)

    label = new enchant.Label()
    label.color = "white"
    label.x = 4
    scene.addChild(label)

    game.addEventListener('enterframe', ->
      field.update(game.input)
      label.text = field.toString()

      queue.update()

      for i in [0 ... field.height]
        for j in [ 0 ... field.width]
          data = field.mutableDataMap[i][j]
          if data and !queue.contains(data.objectId)
            view = null
            switch data.type
              when FieldObject.TYPE_BOMB
                view = new BombView(queue,  data)
              when FieldObject.TYPE_BLAST
                view = new BlastView(queue, data)
              when FieldObject.TYPE_BLOCK
                view = new BlockView(queue, data)
              else
                throw Error("Unknown object")
            queue.store(data.objectId, view)
    )
    game.pushScene(scene)

  game.start()

ENCHANTJS_IMAGE_PATH = "enchantjs/images/"

class View
  constructor: (@queue) ->
    @game = @queue.getGame()
    @scene = @queue.getScene()

class BombermanView extends View
  constructor: (@queue, @bomberman) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.x = @sprite.y = 16
    @sprite.frame = [2]
    @scene.addChild(@sprite)

  update: ->
    @sprite.x = @bomberman.x
    @sprite.y = @bomberman.y


class BombView extends View
  constructor: (@queue, @bomb) ->
    super(@queue)

    @count = 0
    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [5]
    @sprite.x = @bomb.field.tileSize * @bomb.x
    @sprite.y = @bomb.field.tileSize * @bomb.y
    @scene.addChild(@sprite)

  update: ->
    @count += 1

    if @count == 30
      @sprite.frame = [6]
    else if @count == 60
      @sprite.frame = [5]
      @count = 0

    if @bomb.isDestroyed
      @queue.remove(@bomb.objectId)
      @scene.removeChild(@sprite)

class RenderingQueue
  constructor: (@game, @scene) ->
    @table = {}

  contains: (key) ->
    !!(@table[key])

  store: (id, view) ->
    @table[id] = view

  remove: (id) ->
    delete @table[id]

  update: ->
    for own id, view of @table
      view.update()

  getScene: ->
    @scene

  getGame: ->
    @game

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

    stage = new enchant.Map(16, 16)
    stage.image = game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    stage.loadData(field.viewMap)
    scene.addChild(stage)

    label = new enchant.Label()
    label.color = "white"
    label.x = 4
    scene.addChild(label)

    queue = new RenderingQueue(game, scene)
    queue.store(bomberman.objectId, new BombermanView(queue, bomberman))

    game.addEventListener('enterframe', ->
      field.update(game.input)
      label.text = field.toString()

      queue.update()

      for i in [0 ... field.height]
        for j in [ 0 ... field.width]
          data = field.mutableDataMap[i][j]
          if data and !queue.contains(data.objectId)
            queue.store(data.objectId, new BombView(queue, data))
    )
    game.pushScene(scene)

  game.start()

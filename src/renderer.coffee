class Renderer
  constructor: (@queue) ->
    @game = @queue.getGame()
    @scene = @queue.getScene()

  stopUpdate: (id)->
    @queue.remove(id)

  addNode: (node) ->
    @scene.addChild(node)

  removeNode: (node) ->
    @scene.removeChild(node)

  update: ->

class FieldRenderer extends Renderer
  constructor: (@queue, @field) ->
    super(@queue)

    @map = new enchant.Map(16, 16)
    @map.image = @game.assets['image/map0.png']

    @addNode(@map)

  update: ->
    @map.loadData(@getIdMap())

  getIdMap: ->
    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        data = @field.staticDataMap[i][j]
        if data.type == FieldObject.TYPE_GROUND then 1 else 0

class BombermanRenderer extends Renderer
  constructor: (@queue, @bomberman) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets['image/char0.png']
    @sprite.x = @sprite.y = 16
    @sprite.frame = [0]

    @addNode(@sprite)

    @count = 0

  update: ->
    @count += 1

    if @bomberman.isDestroyed
      @stopUpdate(@bomberman.objectId)
      @removeNode(@sprite)
      return

    if @count > 20
      @sprite.frame = [0]
      @count = 0
    if @count > 15
      @sprite.frame = [1]
    else if @count > 10
      @sprite.frame = [2]
    else if @count > 5
      @sprite.frame = [1]

    @sprite.x = @bomberman.x
    @sprite.y = @bomberman.y

class BombRenderer extends Renderer
  constructor: (@queue, @bomb) ->
    super(@queue)

    @count = 0
    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'icon0.gif']
    @sprite.frame = [24]

    @changePosition(@bomb.x, @bomb.y)

    @addNode(@sprite)

  update: ->
    @count += 1

    if @count == 10
      @sprite.frame = [25]
      @sprite.scaleX = 0.9
      @sprite.scaleY = 0.9
    else if @count == 20
      @count = 0
      @sprite.frame = [24]
      @sprite.scaleX = 1.0
      @sprite.scaleY = 1.0

    @changePosition(@bomb.x, @bomb.y)

    if @bomb.isDestroyed
      @stopUpdate(@bomb.objectId)
      @removeNode(@sprite)

  changePosition: (x, y) ->
    @sprite.x = x
    @sprite.y = y

class BlastRenderer extends Renderer
  constructor: (@queue, @blast) ->
    super(@queue)

    @count = 0

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'effect0.gif']
    @sprite.frame = [0]
    @sprite.x = @blast.x
    @sprite.y = @blast.y

    @addNode(@sprite)

  update: ->
    if @count > 8
      @sprite.frame = [4]
    else if @count > 6
      @sprite.frame = [3]
    else if @count > 4
      @sprite.frame = [2]
    else if @count > 2
      @sprite.frame = [1]

    if @count > @blast.DURATION
      @stopUpdate(@blast.objectId)
      @removeNode(@sprite)

    @count += 1

class BlockRenderer extends Renderer
  constructor: (@queue, @block) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [26]
    @sprite.x = @block.x
    @sprite.y = @block.y

    @addNode(@sprite)

  update: ->
    if @block.isDestroyed
      @stopUpdate(@block.objectId)
      @removeNode(@sprite)

class ItemRenderer extends Renderer
  constructor: (@queue, @item) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets['image/icon0.png']
    @sprite.x = @item.x
    @sprite.y = @item.y

    @changeFrame()
    @addNode(@sprite)

  update: ->
    if @item.isDestroyed
      @stopUpdate(@item.objectId)
      @removeNode(@sprite)

  changeFrame: ->
    if @item instanceof BombUp
      @sprite.frame = [14]
    else if @item instanceof FirePowerUp
      @sprite.frame = [27]
    else if @item instanceof SpeedUp
      @sprite.frame = [19]
    else if @item instanceof BombKick
      @sprite.frame = [5]
    else if @item instanceof Remocon
      @sprite.frame = [4]
    else
      throw new Error("Unknown item")

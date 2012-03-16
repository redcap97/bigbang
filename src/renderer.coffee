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
    @map.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']

    @addNode(@map)

  update: ->
    @map.loadData(@getIdMap())

  getIdMap: ->
    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        if @field.staticDataMap[i][j].type == FieldObject.TYPE_GROUND
          0
        else
          4

class BombermanRenderer extends Renderer
  constructor: (@queue, @bomberman) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.x = @sprite.y = 16
    @sprite.frame = [2]

    @addNode(@sprite)

  update: ->
    if @bomberman.isDestroyed
      @stopUpdate(@bomberman.objectId)
      @removeNode(@sprite)
      return

    @sprite.x = @bomberman.x
    @sprite.y = @bomberman.y

class BombRenderer extends Renderer
  constructor: (@queue, @bomb) ->
    super(@queue)

    @count = 0
    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [5]
    @sprite.x = @bomb.x
    @sprite.y = @bomb.y

    @addNode(@sprite)

  update: ->
    @count += 1

    if @count == 10
      @sprite.frame = [6]
    else if @count == 20
      @sprite.frame = [5]
      @count = 0

    if @bomb.isDestroyed
      @stopUpdate(@bomb.objectId)
      @removeNode(@sprite)

class BlastRenderer extends Renderer
  constructor: (@queue, @blast) ->
    super(@queue)

    @count = 0

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [7]
    @sprite.x = @blast.x
    @sprite.y = @blast.y

    @addNode(@sprite)

  update: ->
    @count += 1
    if @count > @blast.DURATION
      @stopUpdate(@blast.objectId)
      @removeNode(@sprite)


class BlockRenderer extends Renderer
  constructor: (@queue, @block) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [8]
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
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [1]
    @sprite.x = @item.x
    @sprite.y = @item.y

    @addNode(@sprite)

  update: ->
    if @item.isDestroyed
      @stopUpdate(@item.objectId)
      @removeNode(@sprite)

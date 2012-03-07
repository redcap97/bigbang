class View
  constructor: (@queue) ->
    @game = @queue.getGame()
    @scene = @queue.getScene()

  update: ->

class FieldView extends View
  constructor: (@queue, @field) ->
    super(@queue)

    @map = new enchant.Map(16, 16)
    @map.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @scene.addChild(@map)

  update: ->
    @map.loadData(@getIdMap())

  getIdMap: ->
    for i in [0 ... @field.height]
      for j in [0 ... @field.width]
        if @field.staticDataMap[i][j].type == FieldObject.TYPE_GROUND
          0
        else
          4

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
    @sprite.x = @bomb.x
    @sprite.y = @bomb.y
    @scene.addChild(@sprite)

  update: ->
    @count += 1

    if @count == 10
      @sprite.frame = [6]
    else if @count == 20
      @sprite.frame = [5]
      @count = 0

    if @bomb.isDestroyed
      @queue.remove(@bomb.objectId)
      @scene.removeChild(@sprite)

class BlastView extends View
  constructor: (@queue, @blast) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = [7]
    @sprite.x = @blast.field.tileSize * @blast.index.x
    @sprite.y = @blast.field.tileSize * @blast.index.y
    @scene.addChild(@sprite)

  update: ->
    if @blast.isDestroyed
      @queue.remove(@blast.objectId)
      @scene.removeChild(@sprite)


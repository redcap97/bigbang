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

class TimerRenderer extends Renderer
  constructor: (@queue, @field) ->
    super(@queue)

    @id = @field.generateId()

    @timer = new enchant.Label()
    @timer.color = "white"
    @timer.x = 4
    @timer.y = 1

    @addNode(@timer)

  update: ->
    [min, sec] = @field.getRemainingTime()
    sm = if min < 10 then ('0'+String(min)) else String(min)
    ss = if sec < 10 then ('0'+String(sec)) else String(sec)
    @timer.text = "#{sm}:#{ss}"

class InitialNoticeRenderer extends Renderer
  TIP_POSITIONS = [
    new Point(12,  34),
    new Point(205, 162),
    new Point(205, 34),
    new Point(12,  162),
  ]

  constructor: (@queue, @field, playerId) ->
    super(@queue)

    @id = @field.generateId()

    @startMessage = @createStartMessage()
    @screenTip = @createScreenTip(playerId)

    @addNode(@startMessage)
    @addNode(@screenTip)

  update: ->
    if @field.getCount() > 0
      @removeNode(@startMessage)
      @removeNode(@screenTip)
      @stopUpdate(@id)

  createScreenTip: (playerId) ->
    screenTip = new enchant.Label()
    screenTip.className = "screen-tip"
    screenTip.text = "You"

    p = TIP_POSITIONS[playerId]
    screenTip.x = p.x
    screenTip.y = p.y
    screenTip.width = 24
    screenTip

  createStartMessage: ->
    startMessage = new enchant.Label()
    startMessage.className = "start-message"
    startMessage.text = "START!"
    startMessage.x = 45
    startMessage.y = 80
    startMessage

class WarningRenderer extends Renderer
  TEXT = "Hurry up!"
  constructor: (@queue, @field) ->
    super(@queue)

    @id = @field.generateId()

    @label = new enchant.Label()
    @label.className = "warning-message"
    @label.text = TEXT
    @label.x = -16 * TEXT.length
    @label.y = 80

    @addNode(@label)

  update: ->
    @label.x += 4

    if @label.x > @field.width * @field.tileSize
      @removeNode(@label)
      @stopUpdate(@id)

class BombermanRenderer extends Renderer
  constructor: (@queue, @bomberman, characterId) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets['image/char0.png']
    @sprite.x = @sprite.y = 16

    @framesIndex = [
      [6,  7,  8],
      [3,  4,  5],
      [9, 10, 11],
      [0,  1,  2]
    ]

    for frames in @framesIndex
      for frame, i in frames
        frames[i] += (12 * characterId)

    @sprite.frame = @framesIndex[InputManager.DOWN][1]

    @oldDirection = InputManager.NONE

    @addNode(@sprite)

  update: ->
    if @bomberman.isDestroyed
      @stopUpdate(@bomberman.objectId)
      @removeNode(@sprite)
      return

    direction = @bomberman.getInputDirection()

    if direction == InputManager.NONE and
        @oldDirection != InputManager.NONE
      frames = @framesIndex[@oldDirection]
      @sprite.frame = frames[1]
      @oldDirection = direction
    else if direction != InputManager.NONE
      frames = @framesIndex[direction]
      count = @bomberman.inputCount % 17

      if count == 4
        @sprite.frame = frames[1]
      else if count == 8
        @sprite.frame = frames[2]
      else if count == 12
        @sprite.frame = frames[1]
      else if count == 16
        @sprite.frame = frames[0]

      @oldDirection = direction

    @sprite.x = @bomberman.x
    @sprite.y = @bomberman.y

class PressureBlockRenderer extends Renderer
  constructor: (@queue, @pressureBlock) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets['image/map0.png']
    @sprite.frame = 0
    @sprite.x = @pressureBlock.x
    @sprite.y = @pressureBlock.y

    @addNode(@sprite)

class BombRenderer extends Renderer
  constructor: (@queue, @bomb) ->
    super(@queue)

    @count = 0
    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'icon0.gif']
    @sprite.frame = 24

    @changePosition(@bomb.x, @bomb.y)

    @addNode(@sprite)

  update: ->
    @count += 1

    if @count == 10
      @sprite.frame = 25
      @sprite.scaleX = 0.9
      @sprite.scaleY = 0.9
    else if @count == 20
      @count = 0
      @sprite.frame = 24
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
    @sprite.frame = 0
    @sprite.x = @blast.x
    @sprite.y = @blast.y

    @addNode(@sprite)

  update: ->
    if @count == 2
      @sprite.frame = 1
    else if @count == 4
      @sprite.frame = 2
    else if @count == 6
      @sprite.frame = 3
    else if @count == 8
      @sprite.frame = 4

    if @count > @blast.DURATION
      @stopUpdate(@blast.objectId)
      @removeNode(@sprite)

    @count += 1

class BlockRenderer extends Renderer
  constructor: (@queue, @block) ->
    super(@queue)

    @sprite = new enchant.Sprite(16, 16)
    @sprite.image = @game.assets[ENCHANTJS_IMAGE_PATH + 'map0.gif']
    @sprite.frame = 26
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
      @sprite.frame = 14
    else if @item instanceof FirePowerUp
      @sprite.frame = 27
    else if @item instanceof SpeedUp
      @sprite.frame = 19
    else if @item instanceof BombKick
      @sprite.frame = 5
    else if @item instanceof Remocon
      @sprite.frame = 4
    else
      throw new Error("Unknown item")

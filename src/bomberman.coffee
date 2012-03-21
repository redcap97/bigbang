class Bomberman
  MAX_SPEED = 8
  MAX_POWER = 9
  MAX_BOMB_CAPACITY = 9

  constructor: (@field, @x, @y) ->
    @objectId = @field.generateId()
    @width = @height = @field.tileSize
    @isDestroyed = false

    @speed = @power = 2
    @bombCapacity = 1
    @usedBomb = 0
    @hasRemocon = false
    @canKick = false

    @inputManager = new InputManager()
    @inputCount = 0

  update: (input) ->
    @inputManager.update(input)

    if @inputManager.aDown
      @putBomb()

    if @inputManager.bDown and @hasRemocon
      @explodeBomb()

    @move()

  incrementSpeed: ->
    @speed += 1 if @speed < MAX_SPEED

  incrementPower: ->
    @power += 1 if @power < MAX_POWER

  incrementBombCapacity: ->
    @bombCapacity += 1 if @bombCapacity < MAX_BOMB_CAPACITY

  move: ->
    switch(@inputManager.direction)
      when InputManager.LEFT
        @moveLeft()
      when InputManager.UP
        @moveUp()
      when InputManager.RIGHT
        @moveRight()
      when InputManager.DOWN
        @moveDown()

    if @inputManager.direction == InputManager.NONE
      @inputCount = 0
    else
      @inputCount += 1

  changePosition: (r) ->
    {x : @x, y : @y} = r

  putBomb: ->
    if @canPutBomb() and @usedBomb < @bombCapacity
      ix = @getCurrentIndex()
      @usedBomb += 1
      @field.setMapData(ix.x, ix.y, new Bomb(@field, ix, @))

  explodeBomb: ->
    for y in [0 ... @field.height]
      for x in [0 ... @field.width]
        data = @field.getMapData(x, y)
        if data.type == FieldObject.TYPE_BOMB and
            data.bomberman.objectId == @objectId
          data.destroy()

  canPutBomb: ->
    ix = @getCurrentIndex()
    data = @field.getMapData(ix.x, ix.y)
    if data.type != FieldObject.TYPE_GROUND
      return false

    [il, it, ir, ib] = @field.getRectangleIndex(@getRectangle())
    if il == ir and it == ib
      return true

    if (ix.equals(new Point(il, it)) and !@field.isBarrier(ir, ib)) or
        (ix.equals(new Point(ir, ib)) and !@field.isBarrier(il, it))
      return true

    false

  canMoveOnBomb: (ni) ->
    oi = @getCurrentIndex()
    @field.isBarrier(oi.x, oi.y) and oi.equals(ni)

  moveRight: ->
    new_rect = @getRectangle(@speed, 0)
    [il, it, ir, ib] = @field.getRectangleIndex(new_rect)

    if il != ir and it == ib and @field.isBarrier(il, it) and @field.isBarrier(ir, ib)
      return false

    if (!@field.isBarrier(ir, it) and !@field.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ir * @field.tileSize - 1
    old_rect = @getRectangle()
    if bound == old_rect.getRight()
      if it == ib and @canKick
        data = @field.getMapData(ir, it)
        data.kick(Direction.RIGHT)
        return false

      new_rect = @getRectangle(0, -@speed)
      if !@field.isBarrier(ir, it) and
          (!@field.isBarrier(il, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if it * @field.tileSize > new_rect.getTop()
          new_rect.y = it * @field.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(0, @speed)
      if !@field.isBarrier(ir, ib) and
          (!@field.isBarrier(il, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ib * @field.tileSize < new_rect.getTop()
          new_rect.y = ib * @field.tileSize
        @changePosition(new_rect)
        return true
    else if bound > old_rect.getRight()
      @changePosition(@getRectangle(bound - old_rect.getRight(), 0))
      return true

    false

  moveDown: ->
    new_rect = @getRectangle(0, @speed)
    [il, it, ir, ib] = @field.getRectangleIndex(new_rect)

    if it != ib and il == ir and @field.isBarrier(il, it) and @field.isBarrier(ir, ib)
      return false

    if (!@field.isBarrier(il, ib) and !@field.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ib * @field.tileSize - 1
    old_rect = @getRectangle()
    if bound == old_rect.getBottom()
      if ir == il and @canKick
        data = @field.getMapData(ir, ib)
        data.kick(Direction.DOWN)
        return false

      new_rect = @getRectangle(-@speed, 0)
      if !@field.isBarrier(il, ib) and
          (!@field.isBarrier(il, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if il * @field.tileSize > new_rect.getLeft()
          new_rect.x = il * @field.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(@speed, 0)
      if !@field.isBarrier(ir, ib) and
          (!@field.isBarrier(ir, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if ir * @field.tileSize < new_rect.getLeft()
          new_rect.x = ir * @field.tileSize
        @changePosition(new_rect)
        return true
    else if bound > old_rect.getBottom()
      @changePosition(@getRectangle(0, bound - old_rect.getBottom()))
      return true

    false

  moveLeft: ->
    new_rect = @getRectangle(-@speed, 0)
    [il, it, ir, ib] = @field.getRectangleIndex(new_rect)

    if il != ir and it == ib and @field.isBarrier(il, it) and @field.isBarrier(ir, ib)
      return false

    if (!@field.isBarrier(il, it) and !@field.isBarrier(il, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ir * @field.tileSize
    old_rect = @getRectangle()
    if bound == old_rect.getLeft()
      if it == ib and @canKick
        data = @field.getMapData(il, it)
        data.kick(Direction.LEFT)
        return false

      new_rect = @getRectangle(0, -@speed)
      if !@field.isBarrier(il, it) and
          (!@field.isBarrier(ir, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if it * @field.tileSize > new_rect.getTop()
          new_rect.y = it * @field.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(0, @speed)
      if !@field.isBarrier(il, ib) and
          (!@field.isBarrier(ir, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ib * @field.tileSize < new_rect.getTop()
          new_rect.y = ib * @field.tileSize
        @changePosition(new_rect)
        return true
    else if bound < old_rect.getLeft()
      @changePosition(@getRectangle(bound - old_rect.getLeft(), 0))
      return true

    false

  moveUp: ->
    new_rect = @getRectangle(0, -@speed)
    [il, it, ir, ib] = @field.getRectangleIndex(new_rect)

    if it != ib and il == ir and @field.isBarrier(il, it) and @field.isBarrier(ir, ib)
      return false

    if (!@field.isBarrier(il, it) and !@field.isBarrier(ir, it)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ib * @field.tileSize
    old_rect = @getRectangle()
    if bound == old_rect.getTop()
      if ir == il and @canKick
        data = @field.getMapData(ir, it)
        data.kick(Direction.UP)
        return false

      new_rect = @getRectangle(-@speed, 0)
      if !@field.isBarrier(il, it) and
          (!@field.isBarrier(il, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if il * @field.tileSize > new_rect.getLeft()
          new_rect.x = il * @field.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(@speed, 0)
      if !@field.isBarrier(ir, it) and
          (!@field.isBarrier(ir, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ir * @field.tileSize < new_rect.getLeft()
          new_rect.x = ir * @field.tileSize
        @changePosition(new_rect)
        return true
    else if bound < old_rect.getTop()
      @changePosition(@getRectangle(0, bound - old_rect.getTop()))
      return true

    false

  getRectangle: (dx = 0, dy = 0) ->
    new Rectangle(@x + dx, @y + dy, @width, @height)

  getIndex: (r) ->
    @field.getNearestIndex(r)

  getCurrentIndex: ->
    @getIndex(@getRectangle())

  getInputDirection: ->
    @inputManager.direction

  destroy: ->
    @isDestroyed = true

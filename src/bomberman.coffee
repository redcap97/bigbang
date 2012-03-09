class Bomberman
  constructor: (@field, @x, @y) ->
    @objectId = Utils.generateId()
    @width = @height = @field.tileSize
    @power = 2
    @speed = 2
    @bombCapacity = 2
    @usedBomb = 0
    @canThrow = @canKick = false
    @isDestroyed = false

    @inputManager = new InputManager()

  update: (input) ->
    @inputManager.update(input)

    @putBomb() if @inputManager.aDown
    @move()

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

  changePosition: (r) ->
    @x = r.x
    @y = r.y

  putBomb: ->
    if @canPutBomb() and @usedBomb < @bombCapacity
      ix = @getCurrentIndex()
      @usedBomb += 1
      @field.setMapData(ix.x, ix.y, new Bomb(this, @field, ix))

  canMoveOnBomb: (ni) ->
    oi = @getCurrentIndex()
    @field.isBarrier(oi.x, oi.y) and oi.equals(ni)

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
    ix = new Point()

    [il, ir] = @field.getXIndexes(r.getLeft(), r.getRight())
    if il == ir
      ix.x = il
    else
      if ((ir * @field.tileSize) - r.x) > (r.width/2|0)
        ix.x = il
      else
        ix.x = ir

    [it, ib] = @field.getYIndexes(r.getTop(), r.getBottom())
    if it == ib
      ix.y = it
    else
      if ((ib * @field.tileSize) - r.y) > (r.height/2|0)
        ix.y = it
      else
        ix.y = ib
    ix

  getCurrentIndex: ->
    @getIndex(@getRectangle())

  destroy: ->
    @isDestroyed = true

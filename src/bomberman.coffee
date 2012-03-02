class Bomberman
  constructor: (@stage, @x, @y) ->
    @power = @speed = @bombCapacity = 2
    @canThrow = @canKick = false
    @width = @height = @stage.tileSize

  update: (input) ->
    if input.right
      @moveRight()
    else if input.down
      @moveDown()
    else if input.left
      @moveLeft()
    else if input.up
      @moveUp()

    if input.a
      if @canPlaceBomb()
        i = @getCurrentIndex()
        b = new StageObject(4, true)
        @stage.dataMap[i.y][i.x] = b
        @stage.updateMaps()

  changePosition: (r) ->
    @x = r.x
    @y = r.y

  canMoveOnBomb: (ni) ->
    oi = @getCurrentIndex()
    @stage.isBarrier(oi.x, oi.y) and oi.equals(ni)

  canPlaceBomb: ->
    ix = @getCurrentIndex()
    if @stage.isBarrier(ix.x, ix.y)
      return false

    [il, it, ir, ib] = @stage.getRectangleIndex(@getRectangle())
    if il == ir and it == ib
      return true

    if (ix.equals(new Point(il, it)) and !@stage.isBarrier(ir, ib)) or
        (ix.equals(new Point(ir, ib)) and !@stage.isBarrier(il, it))
      return true

    false

  moveRight: ->
    new_rect = @getRectangle(@speed, 0)
    [il, it, ir, ib] = @stage.getRectangleIndex(new_rect)

    if il != ir and it == ib and @stage.isBarrier(il, it) and @stage.isBarrier(ir, ib)
      return false

    if (!@stage.isBarrier(ir, it) and !@stage.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ir * @stage.tileSize - 1
    old_rect = @getRectangle()
    if bound == old_rect.getRight()
      new_rect = @getRectangle(0, -@speed)
      if !@stage.isBarrier(ir, it) and
          (!@stage.isBarrier(il, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if it * @stage.tileSize > new_rect.getTop()
          new_rect.y = it * @stage.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(0, @speed)
      if !@stage.isBarrier(ir, ib) and
          (!@stage.isBarrier(il, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ib * @stage.tileSize < new_rect.getTop()
          new_rect.y = ib * @stage.tileSize
        @changePosition(new_rect)
        return true
    else if bound > old_rect.getRight()
      @changePosition(@getRectangle(bound - old_rect.getRight(), 0))
      return true
    false

  moveDown: ->
    new_rect = @getRectangle(0, @speed)
    [il, it, ir, ib] = @stage.getRectangleIndex(new_rect)

    if it != ib and il == ir and @stage.isBarrier(il, it) and @stage.isBarrier(ir, ib)
      return false

    if (!@stage.isBarrier(il, ib) and !@stage.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ib * @stage.tileSize - 1
    old_rect = @getRectangle()
    if bound == old_rect.getBottom()
      new_rect = @getRectangle(-@speed, 0)
      if !@stage.isBarrier(il, ib) and
          (!@stage.isBarrier(il, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if il * @stage.tileSize > new_rect.getLeft()
          new_rect.x = il * @stage.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(@speed, 0)
      if !@stage.isBarrier(ir, ib) and
          (!@stage.isBarrier(ir, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if ir * @stage.tileSize < new_rect.getLeft()
          new_rect.x = ir * @stage.tileSize
        @changePosition(new_rect)
        return true
    else if bound > old_rect.getBottom()
      @changePosition(@getRectangle(0, bound - old_rect.getBottom()))
      return true
    false

  moveLeft: ->
    new_rect = @getRectangle(-@speed, 0)
    [il, it, ir, ib] = @stage.getRectangleIndex(new_rect)

    if il != ir and it == ib and @stage.isBarrier(il, it) and @stage.isBarrier(ir, ib)
      return false

    if (!@stage.isBarrier(il, it) and !@stage.isBarrier(il, ib)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ir * @stage.tileSize
    old_rect = @getRectangle()
    if bound == old_rect.getLeft()
      new_rect = @getRectangle(0, -@speed)
      if !@stage.isBarrier(il, it) and
          (!@stage.isBarrier(ir, it) or @canMoveOnBomb(@getIndex(new_rect)))
        if it * @stage.tileSize > new_rect.getTop()
          new_rect.y = it * @stage.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(0, @speed)
      if !@stage.isBarrier(il, ib) and
          (!@stage.isBarrier(ir, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ib * @stage.tileSize < new_rect.getTop()
          new_rect.y = ib * @stage.tileSize
        @changePosition(new_rect)
        return true
    else if bound < old_rect.getLeft()
      @changePosition(@getRectangle(bound - old_rect.getLeft(), 0))
      return true
    false

  moveUp: ->
    new_rect = @getRectangle(0, -@speed)
    [il, it, ir, ib] = @stage.getRectangleIndex(new_rect)

    if it != ib and il == ir and @stage.isBarrier(il, it) and @stage.isBarrier(ir, ib)
      return false

    if (!@stage.isBarrier(il, it) and !@stage.isBarrier(ir, it)) or
        ((il == ir or it == ib) and @canMoveOnBomb(@getIndex(new_rect)))
      @changePosition(new_rect)
      return true

    bound = ib * @stage.tileSize
    old_rect = @getRectangle()
    if bound == old_rect.getTop()
      new_rect = @getRectangle(-@speed, 0)
      if !@stage.isBarrier(il, it) and
          (!@stage.isBarrier(il, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if il * @stage.tileSize > new_rect.getLeft()
          new_rect.x = il * @stage.tileSize
        @changePosition(new_rect)
        return true

      new_rect = @getRectangle(@speed, 0)
      if !@stage.isBarrier(ir, it) and
          (!@stage.isBarrier(ir, ib) or @canMoveOnBomb(@getIndex(new_rect)))
        if ir * @stage.tileSize < new_rect.getLeft()
          new_rect.x = ir * @stage.tileSize
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

    [il, ir] = @stage.getXIndexes(r.getLeft(), r.getRight())
    if il == ir
      ix.x = il
    else
      if ((ir * @stage.tileSize) - r.x) > (r.width/2|0)
        ix.x = il
      else
        ix.x = ir

    [it, ib] = @stage.getYIndexes(r.getTop(), r.getBottom())
    if it == ib
      ix.y = it
    else
      if ((ib * @stage.tileSize) - r.y) > (r.height/2|0)
        ix.y = it
      else
        ix.y = ib

    ix

  getCurrentIndex: ->
    @getIndex(@getRectangle())

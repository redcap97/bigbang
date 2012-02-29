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

  move: (r) ->
    @x = r.x
    @y = r.y

  onBarrier: (ni) ->
    oi = @getCurrentIndex()
    @stage.isBarrier(oi.x, oi.y) and oi.equals(ni)

  moveRight: ->
    new_rect = @getRect(@speed, 0)
    [il, ir] = @stage.getXIndexes(new_rect.getLeft(), new_rect.getRight())
    [it, ib] = @stage.getYIndexes(new_rect.getTop(), new_rect.getBottom())

    if (il != ir) and @stage.isBarrier(ir, it) and @stage.isBarrier(il, it)
      return false

    if (!@stage.isBarrier(ir, it) and !@stage.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @onBarrier(@getIndex(new_rect)))
      @move(new_rect)
      return true

    bound = ir * @stage.tileSize - 1
    old_rect = @getRect()
    if bound == old_rect.getRight()
      new_rect = @getRect(0, -@speed)
      if !@stage.isBarrier(ir, it) and
          (!@stage.isBarrier(il, it) or @onBarrier(@getIndex(new_rect)))
        if it * @stage.tileSize > new_rect.getTop()
          new_rect.y = it * @stage.tileSize
        @move(new_rect)
        return true

      new_rect = @getRect(0, @speed)
      if !@stage.isBarrier(ir, ib) and
          (!@stage.isBarrier(il, ib) or @onBarrier(@getIndex(new_rect)))
        if ib * @stage.tileSize < new_rect.getTop()
          new_rect.y = ib * @stage.tileSize
        @move(new_rect)
        return true
    else if bound > old_rect.getRight()
      @move(@getRect(bound - old_rect.getRight(), 0))
      return true
    false

  moveDown: ->
    new_rect = @getRect(0, @speed)

    [il, ir] = @stage.getXIndexes(new_rect.getLeft(), new_rect.getRight())
    [it, ib] = @stage.getYIndexes(new_rect.getTop(), new_rect.getBottom())

    if (it != ib) and @stage.isBarrier(il, it) and @stage.isBarrier(il, ib)
      return false

    if (!@stage.isBarrier(il, ib) and !@stage.isBarrier(ir, ib)) or
        ((il == ir or it == ib) and @onBarrier(@getIndex(new_rect)))
      @move(new_rect)
      return true

    bound = ib * @stage.tileSize - 1
    old_rect = @getRect()
    if bound == old_rect.getBottom()
      new_rect = @getRect(-@speed, 0)
      if !@stage.isBarrier(il, ib) and
          (!@stage.isBarrier(il, it) or @onBarrier(@getIndex(new_rect)))
        if il * @stage.tileSize > new_rect.getLeft()
          new_rect.x = il * @stage.tileSize
        @move(new_rect)
        return true

      new_rect = @getRect(@speed, 0)
      if !@stage.isBarrier(ir, ib) and
          (!@stage.isBarrier(ir, it) or @onBarrier(@getIndex(new_rect)))
        if ir * @stage.tileSize < new_rect.getLeft()
          new_rect.x = ir * @stage.tileSize
        @move(new_rect)
        return true
    else if bound > old_rect.getBottom()
      @move(@getRect(0, bound - old_rect.getBottom()))
      return true
    false

  moveLeft: ->
    new_rect = @getRect(-@speed, 0)

    [il, ir] = @stage.getXIndexes(new_rect.getLeft(), new_rect.getRight())
    [it, ib] = @stage.getYIndexes(new_rect.getTop(), new_rect.getBottom())

    if (il != ir) and @stage.isBarrier(ir, it) and @stage.isBarrier(il, it)
      return false

    if (!@stage.isBarrier(il, it) and !@stage.isBarrier(il, ib)) or
        ((il == ir or it == ib) and @onBarrier(@getIndex(new_rect)))
      @move(new_rect)
      return true

    bound = ir * @stage.tileSize
    old_rect = @getRect()
    if bound == old_rect.getLeft()
      new_rect = @getRect(0, -@speed)
      if !@stage.isBarrier(il, it) and
          (!@stage.isBarrier(ir, it) or @onBarrier(@getIndex(new_rect)))
        if it * @stage.tileSize > new_rect.getTop()
          new_rect.y = it * @stage.tileSize
        @move(new_rect)
        return true

      new_rect = @getRect(0, @speed)
      if !@stage.isBarrier(il, ib) and
          (!@stage.isBarrier(ir, ib) or @onBarrier(@getIndex(new_rect)))
        if ib * @stage.tileSize < new_rect.getTop()
          new_rect.y = ib * @stage.tileSize
        @move(new_rect)
        return true
    else if bound < old_rect.getLeft()
      @move(@getRect(bound - old_rect.getLeft(), 0))
      return true
    false

  moveUp: ->
    new_rect = @getRect(0, -@speed)

    [il, ir] = @stage.getXIndexes(new_rect.getLeft(), new_rect.getRight())
    [it, ib] = @stage.getYIndexes(new_rect.getTop(), new_rect.getBottom())

    if (it != ib) and @stage.isBarrier(il, it) and @stage.isBarrier(il, ib)
      return false

    if (!@stage.isBarrier(il, it) and !@stage.isBarrier(ir, it)) or
        ((il == ir or it == ib) and @onBarrier(@getIndex(new_rect)))
      @move(new_rect)
      return true

    bound = ib * @stage.tileSize
    old_rect = @getRect()
    if bound == old_rect.getTop()
      new_rect = @getRect(-@speed, 0)
      if !@stage.isBarrier(il, it) and
          (!@stage.isBarrier(il, ib) or @onBarrier(@getIndex(new_rect)))
        if il * @stage.tileSize > new_rect.getLeft()
          new_rect.x = il * @stage.tileSize
        @move(new_rect)
        return true

      new_rect = @getRect(@speed, 0)
      if !@stage.isBarrier(ir, it) and
          (!@stage.isBarrier(ir, ib) or @onBarrier(@getIndex(new_rect)))
        if ir * @stage.tileSize < new_rect.getLeft()
          new_rect.x = ir * @stage.tileSize
        @move(new_rect)
        return true
    else if bound < old_rect.getTop()
      @move(@getRect(0, bound - old_rect.getTop()))
      return true
    false

  getRect: (dx = 0, dy = 0) ->
    new Rect(@x + dx, @y + dy, @width, @height)

  getIndex: (r) ->
    i = new Point()

    xis = @stage.getXIndexes(r.getLeft(), r.getRight())
    if xis[0] == xis[1]
      i.x = xis[0]
    else
      if ((xis[1] * @stage.tileSize) - r.x) > (r.width/2|0)
        i.x = xis[0]
      else
        i.x = xis[1]

    yis = @stage.getYIndexes(r.getTop(), r.getBottom())
    if yis[0] == yis[1]
      i.y = yis[0]
    else
      if ((yis[1] * @stage.tileSize) - r.y) > (r.height/2|0)
        i.y = yis[0]
      else
        i.y = yis[1]
    i

  getCurrentIndex: ->
    @getIndex(@getRect())

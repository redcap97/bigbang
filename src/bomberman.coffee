class Bomberman
  constructor: (@stage, @x, @y) ->
    @power = @speed = @bombCapacity = 1
    @canThrow = @canKick = false
    @width = @height = @stage.tileSize

  update: (input) ->
    #r = @nextPosition(input)
    #if not @hitTest(r)
    #  @move(r)
    if input.right
      @moveRight()
    else if input.down
      console.log "down"
      @moveBottom()

  nextPosition: (input) ->
    r = @getRect()
    if input.left
      r.x -= @speed
    else if input.right
      r.x += @speed
    else if input.up
      r.y -= @speed
    else if input.down
      r.y += @speed
    r

  move: (r) ->
    @x = r.x
    @y = r.y

  moveRight: ->
    old_rect = @getRect()
    new_rect = @getRect(1, 0)

    [il, ir] = @stage.getXIndexes(new_rect.getLeft(), new_rect.getRight())
    [it, ib] = @stage.getYIndexes(new_rect.getTop(), new_rect.getBottom())

    oi = @getIndex(old_rect)
    ni = @getIndex(new_rect)

    if (il != ir) and @stage.isBarrier(ir, it) and @stage.isBarrier(il, it)
      return false

    if !@stage.isBarrier(ir, it) and !@stage.isBarrier(ir, ib)
      @move(new_rect)
      return true

    if (il == ir or it == ib) and @stage.isBarrier(oi.x, oi.y) and oi.equals(ni)
      @move(new_rect)
      return true

    lb = ir * @stage.tileSize - 1

    if lb == old_rect.getRight()
      new_rect = @getRect(0, -1)
      ni = @getIndex(new_rect)
      if !@stage.isBarrier(ir, it) and (!@stage.isBarrier(il, it) or (@stage.isBarrier(oi.x, oi.y) and oi.equals(ni)))
        @move(new_rect)
        return true
      new_rect = @getRect(0, 1)
      ni = @getIndex(new_rect)
      if !@stage.isBarrier(ir, ib) and (!@stage.isBarrier(il, ib) or (@stage.isBarrier(oi.x, oi.y) and oi.equals(ni)))
        @move(new_rect)
        return true
    else if lb > old_rect.getRight()
      @move(@getRect(lb - old_rect.getRight(), 0))
      return true

    false

  hitTest: (other) ->
    ps = [
      other.getTopLeft(),
      other.getTopRight(),
      other.getBottomLeft(),
      other.getBottomRight()
    ]

    for p in ps
      i = @stage.getIndex(p.x, p.y)
      if @stage.isBarrier(i.x, i.y)
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

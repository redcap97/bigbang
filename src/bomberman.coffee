class Bomberman
  constructor: (@stage, @x, @y) ->
    @power = @speed = @bombCapacity = 1
    @canThrow = @canKick = false
    @width = @height = @stage.tileSize

  update: (input) ->
    r = @nextPosition(input)
    if not @hitTest(r)
      @move(r)

  nextPosition: (input) ->
    r = new Rect(@x, @y, @width, @height)

    if input.left
      r.x -= @speed
    else if input.right
      r.x += @speed
    else if input.up
      r.y -= @speed
    else if input.down
      r.y += @speed
    return r

  move: (r) ->
    @x = r.x
    @y = r.y

  hitTest: (other) ->
    ps = [
      other.getTopLeft(),
      other.getTopRight(),
      other.getBottomLeft(),
      other.getBottomRight()
    ]

    for p in ps
      i = @stage.getIndex(p.x, p.y)
      if @stage.dataMap[i.y][i.x].isBarrier
        return true

    false

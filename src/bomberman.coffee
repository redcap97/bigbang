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

  getRect: ->
    new Rect(@x, @y, @width, @height)

  getCurrentIndex: ->
    i = {}
    r = @getRect()

    xis = @stage.getXIndexes(r.getLeft(), r.getRight())
    if xis[0] == xis[1]
      i.x = xis[0]
    else
      if ((xis[1] * @stage.tileSize) - @x) > (@width/2|0)
        i.x = xis[0]
      else
        i.x = xis[1]

    yis = @stage.getYIndexes(r.getTop(), r.getBottom())
    if yis[0] == yis[1]
      i.y = yis[0]
    else
      if ((yis[1] * @stage.tileSize) - @y) > (@height/2|0)
        i.y = yis[0]
      else
        i.y = yis[1]
    i

class Bomberman
  constructor: (@stage, @x, @y) ->
    @power = @speed = @bombCapacity = 1
    @canThrow = @canKick = false
    @width = @height = @stage.tileSize

  update: (input) ->
    pos = @nextPosition(input)
    if not @hitTest(pos)
      @move(pos)

  nextPosition: (input) ->
    pos =
      x:      @x
      y:      @y
      width:  @width
      height: @height

    if input.left
      pos.x -= @speed
    else if input.right
      pos.x += @speed
    else if input.up
      pos.y -= @speed
    else if input.down
      pos.y += @speed
    return pos

  move: (pos) ->
    @x = pos.x
    @y = pos.y

  hitTest: (other) ->
    p = @stage.getIndex(other.x, other.y)
    if @stage.dataMap[p.y][p.x].isBarrier
      return true

    p = @stage.getIndex(other.x + other.width - 1, other.y)
    if @stage.dataMap[p.y][p.x].isBarrier
      return true

    p = @stage.getIndex(other.x, other.y + other.height - 1)
    if @stage.dataMap[p.y][p.x].isBarrier
      return true

    p = @stage.getIndex(other.x + other.width - 1, other.y + other.height - 1)
    if @stage.dataMap[p.y][p.x].isBarrier
      return true

    false

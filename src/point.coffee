class Point
  constructor: (@x, @y) ->
  equals: (other) ->
    @x == other.x and @y == other.y

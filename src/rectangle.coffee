class Rectangle
  constructor: (@x, @y, @width, @height) ->

  getLeft: ->
    @x

  getRight: ->
    @x + @width - 1

  getTop: ->
    @y

  getBottom: ->
    @y + @height - 1

  getTopLeft: ->
    new Point(@getLeft(), @getTop())

  getTopRight: ->
    new Point(@getRight(), @getTop())

  getBottomLeft: ->
    new Point(@getLeft(), @getBottom())

  getBottomRight: ->
    new Point(@getRight(), @getBottom())

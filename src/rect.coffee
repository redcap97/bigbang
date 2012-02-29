class Rect
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
    {x: @getLeft(), y: @getTop()}

  getTopRight: ->
    {x: @getRight(), y: @getTop()}

  getBottomLeft: ->
    {x: @getLeft(), y: @getBottom()}

  getBottomRight: ->
    {x: @getRight(), y: @getBottom()}

class Bomb
  constructor: (@bomberman, @field, @x, @y) ->
    @objectId = Utils.generateId()
    @isBarrier = true
    @count = 0
    @isDestroyed = false

  update: ->
    @count += 1

    if @count > 80
      @destroy()

  destroy: ->
    @isDestroyed = true
    @field.setMapData(@x, @y, null)

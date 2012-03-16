class RenderingQueue
  constructor: (@game, @scene) ->
    @table = {}

  contains: (id) ->
    !!(@table[id])

  store: (id, renderer) ->
    @table[id] = renderer

  remove: (id) ->
    delete @table[id]

  update: ->
    for own id, renderer of @table
      renderer.update()

  getScene: ->
    @scene

  getGame: ->
    @game

class RenderingQueue
  constructor: (@game, @scene) ->
    @table = {}

  contains: (key) ->
    !!(@table[key])

  store: (id, view) ->
    @table[id] = view

  remove: (id) ->
    delete @table[id]

  update: ->
    for own id, view of @table
      view.update()

  getScene: ->
    @scene

  getGame: ->
    @game


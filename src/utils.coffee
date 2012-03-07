Utils =
  generateId: (->
    maxId = 0
    ->
      maxId += 1
      maxId
  )()

  random: (max) ->
    Math.floor(Math.random() * max)

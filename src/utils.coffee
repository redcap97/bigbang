Utils =
  generateId: (->
    maxId = 0
    ->
      maxId += 1
      maxId
  )()

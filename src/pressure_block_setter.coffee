class PressureBlockSetter
  constructor: (@field, @interval) ->
    @count = 0
    @indexes = []
    @width = @field.width
    @height = @field.height

    @createIndexes()

  set: (index) ->
    data = @field.getMapData(index.x, index.y)
    data.destroy()

    pressureBlock = new PressureBlock(@field, index)
    @field.setMapData(index.x, index.y, pressureBlock)

  update: ->
    if @count == @interval
      @count = 0
      index = @indexes.shift()
      @set(index) if index
    @count += 1

  createIndexes: ->
    for i in [0 .. 1]
      for y in [(@height-2-i) .. (2+i)]
        @addIndex(new Point(1+i, y))

      for x in [(1+i) .. (@width-3-i)]
        @addIndex(new Point(x, 1+i))

      for y in [(1+i) .. (@height-3-i)]
        @addIndex(new Point((@width-2-i), y))

      for x in [(@width-2-i) .. (2+i)]
        @addIndex(new Point(x, (@height-2-i)))

  addIndex: (index) ->
    data = @field.getMapData(index.x, index.y)
    @indexes.push(index) if data.type != FieldObject.TYPE_WALL

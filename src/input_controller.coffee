class InputController
  constructor: ->
    @a = @b = false
    @aDown = @aUp = false
    @bDown = @bUp = false
    @direction = @oldDirection = InputController.NONE
    @up = @down = @left = @right = false

  update: (input) ->
    @updateDirection(input)
    @updateAButton(input)
    @updateBButton(input)

  isSamePreviousDirections: (dirs) ->
    ((@direction == dirs[0] and @oldDirection == dirs[1]) or
      (@direction == dirs[1] and @oldDirection == dirs[0]))

  getInputDirections: (input) ->
    dirs = []
    if input.left
      dirs.push(InputController.LEFT)
    if input.up
      dirs.push(InputController.UP)
    if input.right
      dirs.push(InputController.RIGHT)
    if input.down
      dirs.push(InputController.DOWN)

    dirs.slice(0, 2)

  updateDirection: (input) ->
    dirs = @getInputDirections(input)
    if dirs.length == 0
      @direction = InputController.NONE
      @oldDirection = InputController.NONE
    else if dirs.length == 1
      @direction = dirs[0]
      @oldDirection = InputController.NONE
    else if not @isSamePreviousDirections(dirs)
      if @direction == dirs[0]
        @oldDirection = @direction
        @direction = dirs[1]
      else if @direction == dirs[1]
        @oldDirection = @direction
        @direction = dirs[0]
      else
        @direction = dirs[0]
        @oldDirection = dirs[1]

  updateAButton: (input) ->
    if @a == input.a
      @aDown = @aUp = false
    else if input.a == true
      @aDown = true
      @aUp = false
    else if input.a == false
      @aDown = false
      @aUp = true
    @a = input.a

  updateBButton: (input) ->
    if @b == input.b
      @bDown = @bUp = false
    else if input.b == true
      @bDown = true
      @bUp = false
    else if input.b == false
      @bDown = false
      @bUp = true
    @b = input.b

InputController.NONE  = 0
InputController.LEFT  = 1
InputController.UP    = 2
InputController.RIGHT = 3
InputController.DOWN  = 4

Utils =
  inputFlags:
    left:  1
    up:    2
    right: 4
    down:  8
    a:     16
    b:     32
    none:  64

  encodeInput: (input) ->
    value = 0
    for own key, flag of @inputFlags
      value |= flag if input[key]
    value

  decodeInput: (value) ->
    return null if value & @inputFlags.none

    input =
      a:     false
      b:     false
      left:  false
      up:    false
      right: false
      down:  false
    for own key, flag of @inputFlags
      input[key] = true if value & flag
    input

Direction =
  LEFT:  0
  UP:    1
  RIGHT: 2
  DOWN:  3

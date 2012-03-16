class Random
  constructor: (seed) ->
    @mt19937 = new MersenneTwister(seed)

  getRandom: (max) ->
    @mt19937.nextInt(max)

#coding: utf-8

SOURCE_FILES = %w{
  src/point.coffee
  src/rectangle.coffee
  src/input_manager.coffee
  src/random.coffee

  src/field.coffee
  src/field_object.coffee
  src/bomberman.coffee
  src/pressure_block_setter.coffee

  src/renderer.coffee
  src/rendering_queue.coffee
  src/data_transport.coffee
  src/entry_screen.coffee
  src/battle_game.coffee
  src/game_result.coffee

  src/main.coffee
}

task :default => 'main.js'

file 'main.js' => SOURCE_FILES do |t|
  sh "coffee --join #{t.name} --compile #{t.prerequisites.join(' ')}"
end

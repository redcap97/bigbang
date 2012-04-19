#coding: utf-8

NODE_MODULES = %w{
  opts
  websocket
}

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

task :install do
  cd "server"
  sh "npm install #{NODE_MODULES.join(" ")}"
end

file 'main.js' => SOURCE_FILES do |t|
  sh "coffee --join #{t.name} --compile #{t.prerequisites.join(' ')}"
end

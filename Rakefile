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

LICENSE = <<EOS
/*
Copyright (C) 2012 Akira Midorikawa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

EOS

def add_license(file)
  src = open(file).read
  open(file, "w") do |f|
    f.write LICENSE
    f.write src
  end
end

task :default => 'main.js'

task :install do
  cd "server"
  sh "npm install #{NODE_MODULES.join(" ")}"
end

file 'main.js' => SOURCE_FILES do |t|
  sh "coffee --join #{t.name} --compile #{t.prerequisites.join(' ')}"
  add_license(t.name)
end

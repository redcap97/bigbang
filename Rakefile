#coding: utf-8

task :default => 'main.js'

file 'main.js' => FileList.new('src/*.coffee') do
  sh 'coffee --join main.js --compile src/*.coffee'
end

Bigbang
=======

## Description

Bigbang is a online game like Bomberman.
You can play the game on your browser.
Supported browsers are recent versions of firefox and chrome.

### Server Prerequisites

+ node.js
+ CoffeeScript
+ Rake

### Server Setup

Installing Bigbang

    git clone git@github.com:redcap97/bigbang.git
    cd bigbang
    git submodule update --init
    rake install

Starting the server

    coffee server --allowed-origin http://akr97.com

If you only use the server in localhost, you don't have to specify the `--allowed-origin` option.
And if you want to change the server to connect to, please change a constant WS\_URI of index.html.

## Using Libraries and Materials

+ **enchant.js** [http://enchantjs.com/en/](http://enchantjs.com/en/)
+ **mt.js** [http://homepage2.nifty.com/magicant/sjavascript/mt.html](http://homepage2.nifty.com/magicant/sjavascript/mt.html)
+ **Mosamosa-v1.1.ttf** [http://lovalotta.pya.jp/mosamosa/](http://lovalotta.pya.jp/mosamosa/)
+ **char0.png/icon0.png** [http://www3.wind.ne.jp/DENZI/diary/](http://www3.wind.ne.jp/DENZI/diary/)

## License

Licensed under the GPLv3: [http://www.gnu.org/licenses/gpl-3.0.txt](http://www.gnu.org/licenses/gpl-3.0.txt)

## Link

+ [Bigbang - YouTube](http://www.youtube.com/watch?v=6qG8DSiJZIA)

# vimspector-config (for node-web-environment)
a tiny helper cli tool made for the [vimspector](https://github.com/puremourning/vimspector) plugin.<br />
this npm package automatically creates a ***.vimspector.json*** file for a node-web-app environment

## usage
inside your project directory run:
```bash
npx vimspector-config
```
by default, this will create the following *.vimspector.json* file inside this directory:
```json
{
  "configurations": {
    "node": {
      "adapter": "vscode-node",
      "breakpoints": {
        "exception": {
          "all": "N",
          "uncaught": "N"
        }
      },
      "configuration": {
        "request": "launch",
        "protocol": "auto",
        "stopOnEntry": true,
        "console": "integratedTerminal",
        "program": "${workspaceRoot}/index.js",
        "cwd": "${workspaceRoot}"
      }
    },
    "chrome": {
      "adapter": "chrome",
      "breakpoints": {
        "exception": {
          "all": "N",
          "uncaught": "N"
        }
      },
      "configuration": {
        "request": "launch",
        "url": "http://localhost:4000/",
        "webRoot": "${workspaceRoot}/public"
      }
    },
    "express": {
      "adapter": "vscode-node",
      "default": true,
      "breakpoints": {
        "exception": {
          "all": "N",
          "uncaught": "N"
        }
      },
      "configuration": {
        "name": "Attaching to a process ID",
        "type": "node",
        "request": "attach",
        "skipFiles": ["node_modules/**/*.js", "<node_internals>/**/*.js"],
        "processId": "${processId}"
      }
    }
  }
}
```

## .gitignore
if there is a *.gitignore* file in the directory, the *.vimspector.json* file will be automatically added to it.

## custom configurations
you can pass different arguements to setup custom configurations for the *.vimspector.json* file.
| ARGUMENTS | values | description | example |
|---|---|---|---|
| ```--setup``` | ["node", "chrome", "express"] | setup specific environments (adapters) multiple environments are separated by "-" | ```--setup=express``` will setup the .vimspector.json file with only ```express``` server configs ```--setup=node-chrome``` will setup the .vimspector.json file with  ```node``` and ```chrome``` environments |
| ```--port``` | [NUMERIC] | by default, the **chrome** debugger will start on ```http://localhost:4000``` you can set the ```--port``` value to make it start in a different port | ```--port=5555``` will set the chrome debugger (if presence) to run on ```http://localhost:5555``` |
| ```--webroot``` | [a relative path to the directory where you run the client] | ```--webroot``` will point the **chrome** debugger to the directory you would like to debug | ```--webroot=client/public``` will point the chrome debugger to ```$YOUR_PROJECT_ROOT/client/public```  (don't write "/" at the begining of the path) |
| ```--program``` | [a relative path to the main node file you're running] | ```--program``` will point the **node** debugger to the main file you would like to debug | ```--program=streamer/src/index.js``` will point the node debugger to ```$YOUR_PROJECT_ROOT/streamer/src/index.js``` |

## examples 

let's say we have this project tree:
```bash
~/project: tree
.
├── client
│   ├── index.html
│   └── script.js
├── server
│   ├── express-app.js
│   └── index.js
└── streamer
    ├── index.js
    └── src
```
suppose ```client``` is a web app, ```server``` is an express app and ```streamer``` is a node utility project.<br />
I'd like to create a *.vimspector.json* with configurations to support all 3 projects.<br />
for the ```client``` and the regular node project ```streamer``` I can ```cd``` to the root directory (named *"project"*)<br />
and run ```npx vimspector-config --setup=node-chrome --webroot=client --program=streamer/index.js```<br />
this will create the following *.vimspector.json* in the root directory: 
```json
{
  "configurations": {
    "node": {
      "adapter": "vscode-node",
      "breakpoints": {
        "exception": {
          "all": "N",
          "uncaught": "N"
        }
      },
      "configuration": {
        "request": "launch",
        "protocol": "auto",
        "stopOnEntry": true,
        "console": "integratedTerminal",
        "program": "${workspaceRoot}/streamer/index.js",
        "cwd": "${workspaceRoot}"
      }
    },
    "chrome": {
      "adapter": "chrome",
      "breakpoints": {
        "exception": {
          "all": "N",
          "uncaught": "N"
        }
      },
      "configuration": {
        "request": "launch",
        "url": "http://localhost:4000/",
        "webRoot": "${workspaceRoot}/client"
      }
    }
  }
}
```
for an **express** app configs, we should create another *.vimspector.json* file. this time, inside the express app directory.<br/>
```bash
~/project: cd /server
~/project/server: npx vimspector-config --setup=express
```
*note - to debug an express app, you should start the main file with "--inspect"*
```node --inspect index.js```


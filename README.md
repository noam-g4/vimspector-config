# vimspector-config (for node-web-environment)

a tiny helper cli tool made for the [vimspector](https://github.com/puremourning/vimspector) plugin.<br />
this npm package automatically creates a **_.vimspector.json_** file for a node-web-app environment

## usage

inside your project directory run:

```bash
npx vimspector-config
```

by default, this will create the following _.vimspector.json_ file inside this directory:

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

if there is a _.gitignore_ file in the directory, the _.vimspector.json_ file will be automatically added to it.

## custom configurations

you can pass different arguements to setup custom configurations for the _.vimspector.json_ file.
| ARGUMENTS | values | description | example |
|---|---|---|---|
| `--setup` | ["node", "chrome", "express"] | setup specific environments (adapters) multiple environments are separated by "-" | `--setup=express` will setup the .vimspector.json file with only `express` server configs `--setup=node-chrome` will setup the .vimspector.json file with `node` and `chrome` environments |
| `--port` | [NUMERIC] | by default, the **chrome** debugger will start on `http://localhost:4000` you can set the `--port` value to make it start in a different port | `--port=5555` will set the chrome debugger (if presence) to run on `http://localhost:5555` |
| `--webroot` | [a relative path to the directory where you run the client] | `--webroot` will point the **chrome** debugger to the directory you would like to debug | `--webroot=client/public` will point the chrome debugger to `$YOUR_PROJECT_ROOT/client/public` (don't write "/" at the begining of the path) |
| `--program` | [a relative path to the main node file you're running] | `--program` will point the **node** debugger to the main file you would like to debug | `--program=streamer/src/index.js` will point the node debugger to `$YOUR_PROJECT_ROOT/streamer/src/index.js` |

## examples

let's say we have this project tree:

```bash
~/project: tree
.
├── client
|   ├── public
│       ├── index.html
│       └── script.js
├── server
│   ├── express-app.js
│   └── index.js
└── streamer
    ├── index.js
    └── src
```

suppose `client` is a web app where the static assets are serverd inside the "public" directory and `server` is an express app.<br />
I'd like to create a _.vimspector.json_ with configurations to support a chrome debugger and an express server (node debugger).<br />
In root directory I'll run `npx vimspector-config --setup=express-chrome --webroot=client/public`<br />
this will create the following _.vimspector.json_ in the root directory:

```json
{
  "configurations": {
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
        "webRoot": "${workspaceRoot}/client/public"
      }
    },
    "express": {
      "adapter": "vscode-node",
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

from this point, you're good to go

- if you want to start the chrome debugger -> launch your client web server (on the same port as the debugger) -> launch Vimspector and choose "chrome"
- if you want to start the express debuger -> launch your express app with the `--inspect` flag -> fire up Vimspector, choose "express" -> Vimspector will ask you for a `processID` -> copy the one from the `node --inpect` process that you've started and start debugging! 😎
- (to start a normal integrated terminal node debugger, make a .vimspector.json with "node" settings (`--setup=node`), point the debugger to the program you want by running `--program=/path_to_main_file` and start Vimspector with the "node" configuration.

## update; go support (golang)

hey gophers, you're not alone.
run `npx vimspector-config --setup=go` and you're good to go (ha ha)
by default it start a debugging session from main.go, you can change it by adding `--main=<differentFilename.go>`
you can also specify a different delve path with `--delve=<differentDelvePath>` (default is `$HOME/go/bin/dlv`)

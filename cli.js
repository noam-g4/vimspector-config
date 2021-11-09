#!usr/bin/env node
const template = require('./template.json')
const { create, parseArgs } = require('./script.js')

const filename = '.vimspector.json'
const [, , ...args] = process.argv
const adapters = ['node', 'chrome', 'express']

function run(filename, args, data = template) {
  const content = {...data}
  const arguments = parseArgs(args)

  if (arguments.setup) {
    const modes = arguments.setup.split('-')
    adapters.forEach(dbgr => {
     if (!modes.some(d => d === dbgr) && content.configurations[dbgr])
      delete content.configurations[dbgr]
    })
  }

  if (arguments.port) {
    const p = parseInt(arguments.port, 10)
    if (!isNaN(p) && content.configurations.chrome)
      content.configurations.chrome.configuration.url = `https://localhost:${p}/`
  }

  if (arguments.webroot && content.configurations.chrome)
    content.configurations.chrome.configuration.webRoot = `\${workspaceRoot}/${arguments.webroot}`

  if (arguments.program && content.configurations.node)
    content.configurations.node.configuration.program = `\${workspaceRoot}/${arguments.program}`

  return create(filename, content)
}

run(filename, args)

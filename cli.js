#!/usr/bin/env node
const template = require('./template.json')
const { create, parseArgs } = require('./script.js')

const [, , ...args] = process.argv
const adapters = ['node', 'chrome', 'express', 'go']

function run(args, data = template) {
  const content = { ...data }
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

  if (arguments.setup.split('-').some(s => s === 'go')) {
    content.configurations.go.configuration.program =
      arguments.main || 'main.go'
    content.configurations.go.configuration.dlvToolPath =
      arguments.delve || '$HOME/go/bin/dlv'
  }

  return create(content)
}

run(args)

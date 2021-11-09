const path = require('path')
const {
  writeFileSync,
  existsSync,
  appendFileSync,
  readFileSync,
} = require('fs')

const makeFile = (data, filename) =>
  writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 4))

const setGitIgnore = filename => {
  const p = path.join(__dirname, '.gitignore')
  if (existsSync(p) && !readFileSync(p).includes(filename))
    appendFileSync(p, filename)
}

module.exports.parseArgs = args =>
  args.reduce((y, x) => {
    if (x.slice(0, 2) === '--') {
      const keyVal = x.slice(2).split('=')
      if (x.includes('=')) return { ...y, [keyVal[0]]: keyVal.pop() }
    }
    return y
  }, {})

module.exports.create = (filename, data) => {
  makeFile(data, filename)
  setGitIgnore(filename)
}

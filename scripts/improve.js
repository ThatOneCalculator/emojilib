const fs = require('fs')
const lang = process.argv[2]
const promptly = require('promptly')
if (!lang) {
  const files = fs.readdirSync('dist')
  const langs = files.map(tag => tag.match(/-(.+)\./)[1])
  console.log(`Please provide a langage tag: ${langs.join(', ')}`)
} else {
  start()
}

async function start() {
  const path = `dist/emoji-${lang}.json`
  const file = require(`../${path}`)
  for (const emoji in file) {
    const kws = file[emoji]
    // Remove todo comment
    const todo = kws.indexOf('// TODO')
    if (todo >= 0) kws.splice(todo, 1)
    
    if (needsWork(kws)) {
      console.log(`${emoji}: ${kws.join(', ')}`)
      let kw = null
      while (kw !== '') {
        kw = await promptly.prompt('Add a keyword:', {default: ''})
        if (kw) kws.push(kw)
      }
      if (kws.length >= 1) {
        console.log(`[saved] ${emoji}: ${kws.join(', ')}\n`)
        fs.writeFileSync(`./${path}`, JSON.stringify(file, null, 2))
      } else {
        continue
      }
    } else {
      continue
    }
  }
}

function needsWork(keywords) {
  if (keywords.length <= 1) return true
  if (keywords.includes('// TODO')) return true
  return false
}
const { resolve } = require('node:path')
const { cpSync } = require('node:fs')

const katexDistDir = 'node_modules/katex/dist'
const publicKatexDir = 'public/katex'

cpSync(resolve(katexDistDir, 'katex.min.css'), resolve(publicKatexDir, 'katex.min.css'))
cpSync(resolve(katexDistDir, 'fonts'), resolve(publicKatexDir, 'fonts'), { recursive: true })

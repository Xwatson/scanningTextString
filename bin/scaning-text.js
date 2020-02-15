#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const program = require('commander')
const fileDisplay = require('../lib/fileDisplay')
const { parse } = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')

program.usage('<dir-name>').parse(process.argv)

const startDir = program.args[0] || '' // 获取扫描启动文件夹
const suffix = program.args.length > 1 ? program.args[1] : '.tsx' // 后缀 默认tsx

const list = glob.sync('*')  // 当前目录
const cwd = process.cwd() // 根目录

if (list.length) {  // 如果当前目录不为空
    fileDisplay(path.join(cwd, startDir)).then(list => {
        const files = list.filter(item => item.includes(suffix))
        let texts = ''
        files.forEach(path => {
            const content = fs.readFileSync(path, 'utf-8')
            const ast = parse(content, {
                sourceType: "module",
                plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy']
            })
            traverse(ast, {
                JSXText(path) {
                    const { node } = path
                    const value = node.value.replace(/\n|\r|\s|(\r\n)/g, '')
                    if (value && !texts.includes(value)) {
                        texts += value
                    }
                }
            })
        })
        fs.writeFileSync(path.join(cwd, 'scaning-text.txt'), texts)
    }).catch(err => {
        console.log('err--', err)
    })
} else {
    console.error('当前目录没有任何文件！')
}
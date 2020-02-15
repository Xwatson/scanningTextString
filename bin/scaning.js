#!/usr/bin/env node
const program = require('commander')
const ver = require('../package.json').version

program.version(ver)
	.usage('<命令> <名称>')
	.command('text', '扫描文本')
	.parse(process.argv)

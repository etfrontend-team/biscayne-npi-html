#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'

const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.trim().endsWith('.html'))

let hasError = false

for (const file of staged) {
  if (!file.trim() || !existsSync(file)) {
    continue
  }

  const html = readFileSync(file, 'utf8')
  const headingRegex = /<h([1-6])[\s>][^>]*>/gi
  const headings = []
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const line = html.slice(0, match.index).split('\n').length
    headings.push({ level: parseInt(match[1]), line })
  }

  if (headings.length === 0) {
    continue
  }

  if (headings[0].level !== 1) {
    process.stderr.write(`\x1b[31mHEADING\x1b[0m ${file}:${headings[0].line} — First heading is h${headings[0].level}, must start with h1\n`)
    hasError = true
  }

  for (let i = 1; i < headings.length; i += 1) {
    const previous = headings[i - 1]
    const current = headings[i]

    if (current.level > previous.level + 1) {
      process.stderr.write(`\x1b[31mHEADING\x1b[0m ${file}:${current.line} — Heading level skips from h${previous.level} to h${current.level}. Use h${previous.level + 1} before h${current.level}\n`)
      hasError = true
    }
  }
}

if (hasError) {
  process.stderr.write('\nFix heading hierarchy errors before committing.\n\n')
  process.exit(1)
}

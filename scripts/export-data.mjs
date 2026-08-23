// export-data.mjs
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://mvxagipwzmuzawoaqdii.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12eGFnaXB3em11emF3b2FxZGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzcwMzcsImV4cCI6MjEwMjcxMzAzN30.3eSKUVDKyENZZoTT7hWXatBH88yYfFoE8QuT4VhG5F0'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const tables = ['orders', 'products', 'categories', 'telegram_settings']
const outputDir = './src/data'

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

for (const table of tables) {
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    console.error(`Ошибка при экспорте ${table}:`, error)
    continue
  }
  fs.writeFileSync(
    path.join(outputDir, `${table}.json`),
    JSON.stringify(data, null, 2)
  )
  console.log(`✅ ${table}.json сохранён (${data.length} записей)`)
}
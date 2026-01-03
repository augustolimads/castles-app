// scripts/csvToWeapons.ts
import fs from "fs"

const csv = fs.readFileSync("public/items-v1.csv", "utf-8")

const lines = csv.trim().split("\n")
const headers = lines[0].split(",").map(h => h.trim())

const items = lines.slice(1).map(line => {
  // Parse CSV line properly handling quoted fields
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/\r/g, ''))
      current = ''
    } else {
      current += char
    }
  }
  
  // Add the last value
  values.push(current.trim().replace(/\r/g, ''))
  
  const obj: any = {}

  headers.forEach((h, i) => {
    obj[h] = values[i] || ''
  })

  obj.id = String(obj.id)
  obj.type = String(obj.type)
  obj.name = String(obj.name)
  obj.effect = String(obj.effect)
  obj.gold = Number(obj.gold) || 0
  obj.ev = obj.ev === '' || obj.ev === undefined ? null : Number(obj.ev)
  obj.obs = String(obj.obs)
  obj.tags = String(obj.tags)
  obj.proficience = String(obj.proficience).split(',').map(p => p.trim()).filter(p => p !== '')
  obj.icon = String(obj.icon).split(',')[0].trim()
  obj.image = String(obj.image)

  return obj
})

fs.writeFileSync(
  "src/modules/market/items.ts",
  `export const items = ${JSON.stringify(items, null, 2)}`
)

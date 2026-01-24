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

  // Mapa de conversão de números para textos
  const obsNumberMap: Record<string, string> = {
    '1': 'projetil',
    '2': '+2 vs malha, placas, escamas',
    '3': 'CA +1',
    '4': 'agarra CA 15 + NV',
    '5': 'desarmar +3',
    '6': 'desarmar/subjugar +3',
    '7': 'investida montada dano 2x',
    '8': 'receber investida dano 2x',
    '9': 'dano 1d12 com 2 mãos',
    '10': '2 mãos',
    '12': 'haste'
  }

  obj.id = String(obj.id)
  obj.type = String(obj.type)
  obj.name = String(obj.name)
  obj.effect = String(obj.effect)
  obj.gold = Number(obj.gold) || 0
  obj.ev = obj.ev === '' || obj.ev === undefined ? null : Number(obj.ev)

  // Tratamento especial para obs
  const obsValue = String(obj.obs).trim()
  if (obsValue && /^[\d,\s]+$/.test(obsValue)) {
    // Se contém apenas números e vírgulas, converte
    const numbers = obsValue.split(',').map(n => n.trim()).filter(n => n !== '')
    const convertedTexts = numbers.map(num => obsNumberMap[num] || num).filter(text => text !== '')
    obj.obs = convertedTexts.join(', ')
  } else {
    // Se é string normal ou vazio, mantém como está
    obj.obs = obsValue
  }

  obj.tags = String(obj.tags)
  obj.proficience = String(obj.proficience).split(',').map(p => p.trim()).filter(p => p !== '')
  obj.icon = String(obj.icon).split(',')[0].trim()
  obj.image = String(obj.image)

  return obj
}).filter(item => {
  // Sanitização: remover itens sem ID válido
  return item.id && item.id.trim() !== '' && item.id !== 'undefined'
})

fs.writeFileSync(
  "src/modules/market/items.ts",
  `export const items = ${JSON.stringify(items, null, 2)}`
)

import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CharSheetUI } from '@/modules/char-sheet/ui'

function CharacterSheetById() {
    return (
        <div className='py-4 grid grid-cols-3 gap-3'>
            {/* Character info */}
            <CharSheetUI.CharCard title='Informações'>
                <CharSheetUI.TextInput label='Nome' id='nome' />
                <CharSheetUI.TextInput label='Títulos' id='titulos' />
                <CharSheetUI.TextInput label='Raça' id='raca' />
                <CharSheetUI.TextInput label='Classe' id='classe' />
                <CharSheetUI.TextInput label='Nível' id='nivel' />
                <div className='flex gap-1'>
                    <CharSheetUI.TextInput label='XP' id='xp' />
                    <CharSheetUI.TextInput label='Próx.' id='prox-nv' />
                </div>
                <CharSheetUI.TextInput label='Alinhamento' id='alinhamento' />
                <CharSheetUI.TextInput label='Idiomas' id='idiomas' />
            </CharSheetUI.CharCard>
            {/* Attributes */}
            <CharSheetUI.CharCard title='Atributos'>
                <CharSheetUI.NumberInput label='Força' id='forca' />
                <CharSheetUI.NumberInput label='Destreza' id='destreza' />
                <CharSheetUI.NumberInput label='Constituição' id='constituicao' />
                <CharSheetUI.NumberInput label='Inteligência' id='inteligencia' />
                <CharSheetUI.NumberInput label='Sabedoria' id='sabedoria' />
                <CharSheetUI.NumberInput label='Carisma' id='carisma' />
            </CharSheetUI.CharCard>
        </div>
    )
}

export default CharacterSheetById
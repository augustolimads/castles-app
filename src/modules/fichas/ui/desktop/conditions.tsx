import { Textarea } from '@/components/ui/textarea';
import { saveCharacter, useCharacterStore } from '../../stores/character';
import DiceSelector from './dice-selector';
import Title from './title';
import ValueInput from './value-input';

function Conditions() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);

    function updateLanguage(id = 'languages', value: string) {
        if (id === 'languages') {
            updateCharacter({
                ...character,
                info: {
                    ...character.info,
                    languages: value,
                },
            });
            saveCharacter();
        }
    }

    function updateValue(id: string, value: number) {
        if (
            id === 'water' ||
            id === 'food' ||
            id === 'arrows' ||
            id === 'torches'
        ) {
            updateCharacter({
                ...character,
                tracking: {
                    ...character.tracking,
                    [id]: value,
                },
            });
            saveCharacter();
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateLanguage('languages', e.target.value);
    };

    return (
        <div className="card flex flex-col gap-2 h-full">
            <Title name="Idiomas" />
            <Textarea
                id="languages"
                name="Idiomas"
                value={character.info.languages}
                onChange={handleTextareaChange}
            />
            <hr />
            <ValueInput
                id="water"
                label="Água"
                placeholder="Água"
                value={character.tracking.water}
                updateValue={updateValue}
            />
            <ValueInput
                id="food"
                label="Comida"
                placeholder="Comida"
                value={character.tracking.food}
                updateValue={updateValue}
            />
            <ValueInput
                id="arrows"
                label="Flechas"
                placeholder="Flechas"
                value={character.tracking.arrows}
                updateValue={updateValue}
            />
            <ValueInput
                id="torches"
                label="Tochas"
                placeholder="Tochas"
                value={character.tracking.torches}
                updateValue={updateValue}
            />
            <hr className="mb-2" />
            <DiceSelector />
        </div>
    );
}

export default Conditions;
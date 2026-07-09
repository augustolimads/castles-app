import { handleInputChange } from '../../appChanges';
import { saveCharacter, useCharacterStore } from '../../stores/character';

function Notes() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);

    function updateNotes(e: React.ChangeEvent<HTMLTextAreaElement>) {
        handleInputChange();
        updateCharacter({
            ...character,
            notes: e.target.value,
        });
        saveCharacter();
    }

    return (
        <textarea
            id="notes"
            className="h-162.5 w-full p-0.5"
            onInput={updateNotes}
            value={character.notes}
        />
    );
}

export default Notes;
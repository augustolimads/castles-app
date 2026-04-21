'use client';

import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';

function Ac() {
    const character = useCharacterStore();

    return (
        <div
            id="AC"
            className="flex flex-col justify-between relative card rounded-t-none!"
        >
            <div id="ACHead" className="flex flex-col w-10 text-center">
                <input
                    id="ACHeadValue"
                    className="border-b text-center input"
                    value={character.ac.head}
                    type="number"
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(event) => {
                        handleInputChange();
                        useCharacterStore.getState().updateCharacter({
                            ac: {
                                ...character.ac,
                                head: Number(event.currentTarget.value),
                            },
                        });
                        saveCharacter();
                    }}
                />
                <label htmlFor="ACHeadValue">CA Cabeça</label>
            </div>
            <div id="ACMain" className="flex flex-col flex-1">
                <input
                    id="ACMainValue"
                    className="text-4xl text-center input flex flex-1"
                    value={character.ac.main}
                    type="number"
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(event) => {
                        handleInputChange();
                        useCharacterStore.getState().updateCharacter({
                            ac: {
                                ...character.ac,
                                main: Number(event.currentTarget.value),
                            },
                        });
                        saveCharacter();
                    }}
                />
                <label htmlFor="ACMainValue">CA</label>
            </div>
        </div>
    );
}

export default Ac;
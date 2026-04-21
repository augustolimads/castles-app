'use client';

import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';

function Hp() {
    const character = useCharacterStore();

    return (
        <div id="HP">
            <div
                id="CurrentHP"
                className="card rounded-b-none! text-center flex justify-center mb-1 text-4xl"
            >
                <input
                    id="CurrentHPValue"
                    className="input text-center w-15 my-2"
                    placeholder="0"
                    value={character.hp.current}
                    type="number"
                    title="PV Atual"
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(event) => {
                        handleInputChange();
                        useCharacterStore.getState().updateCharacter({
                            hp: {
                                ...character.hp,
                                current: Number(event.currentTarget.value),
                            },
                        });
                        saveCharacter();
                    }}
                />
                <span className="px-1">/</span>
                <input
                    id="MaxHP"
                    className="input text-center w-15 my-2"
                    type="number"
                    title="PV Máximo"
                    placeholder="0"
                    value={character.hp.max}
                    min="0"
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(event) => {
                        handleInputChange();
                        useCharacterStore.getState().updateCharacter({
                            hp: {
                                ...character.hp,
                                max: Number(event.currentTarget.value),
                            },
                        });
                        saveCharacter();
                    }}
                />
            </div>
            <div
                id="TempHP"
                className="card rounded-none! px-3 py-1 text-card-foreground text-center flex flex-col relative"
            >
                <input
                    id="TempHPValue"
                    className="input text-center text-xl"
                    type="number"
                    placeholder="0"
                    title="PV Temporário"
                    value={character.hp.temp}
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(event) => {
                        handleInputChange();
                        useCharacterStore.getState().updateCharacter({
                            hp: {
                                ...character.hp,
                                temp: Number(event.currentTarget.value),
                            },
                        });
                        saveCharacter();
                    }}
                />
                <label htmlFor="TempHPValue" className="text-xs">PV Temp</label>
            </div>
        </div>
    );
}

export default Hp;
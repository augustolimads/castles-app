'use client';

import {
    setCharacterName,
    useCharacterStore,
} from '../stores/character';

function CharacterName() {
    const character = useCharacterStore();

    return (
        <div>
            <div className="flex items-center gap-1 justify-between">
                <div className="flex-1 pl-1">
                    <svg 
                        width="188" 
                        height="23" 
                        xmlns="http://www.w3.org/2000/svg" 
                        role="img"
                        aria-labelledby="brand-title"
                    >
                        <title id="brand-title">Castelos & Cruzadas</title>
                        <text
                            x="0"
                            y="16"
                            fontSize="18"
                            fontFamily="Arial, sans-serif"
                            fontWeight="bold"
                            fill="#030712"
                            stroke="white"
                            strokeWidth="2"
                            paintOrder="stroke fill"
                        >
                            Castelos & Cruzadas
                        </text>
                    </svg>
                </div>
            </div>
            <input
                id="CharacterName"
                className="input w-full card border-r-none! rounded-r-none! text-3xl py-2"
                placeholder="Nome do Personagem"
                onFocus={(e) => e.currentTarget.select()}
                onChange={setCharacterName}
                value={character.name}
            />
        </div>
    );
}

export default CharacterName;
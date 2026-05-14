import { saveCharacter, useCharacterStore } from '../../stores/character';
import ChangeImage from './change-image';

function Portrait() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);

    function setPortrait(newPortrait: string) {
        updateCharacter({
            ...character,
            portrait: newPortrait,
        });
        saveCharacter();
    }

    return (
        <div id="portrait" className="h-full md:h-auto">
            <div className="border rounded-2xl overflow-hidden relative h-full">
                <img
                    src={character.portrait}
                    alt="Personagem do jogador"
                    className="object-cover h-98.5 md:h-75 w-full"
                />
                <div
                    className="absolute left-0 right-0 top-0 bottom-0 bg-popover/95 opacity-0 hover:opacity-100 text-popover-foreground transition-opacity duration-300 flex flex-col items-center justify-center px-2 gap-2"
                >
                    <div>
                        <label htmlFor="portrait">Retrato</label>
                        <ChangeImage
                            id="portrait"
                            image={character.portrait}
                            onChange={setPortrait}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Portrait;
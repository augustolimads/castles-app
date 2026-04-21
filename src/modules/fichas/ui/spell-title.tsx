import { Plus } from 'lucide-react';
import { saveCharacter } from '../stores/character';
import { useSpellsStore } from '../stores/spell';
import TextInput from './text-input';

interface IAction {
    title: string;
    action: () => void;
}

interface SpellTitleProps {
    name: string;
    primary?: IAction;
    secondary?: IAction;
    lv: number;
}

function SpellTitle({ name, primary, secondary, lv }: SpellTitleProps) {
    const spells = useSpellsStore();
    const updateSpells = useSpellsStore((state) => state.updateSpells);

    const id = `${lv}slots`;
    const slots = spells.level[`lv${lv}` as keyof typeof spells.level];

    function handleUpdateSlots(_id: string, newValue: string | number) {
        updateSpells({
            ...spells,
            level: {
                ...spells.level,
                [`lv${lv}`]: Number(newValue)
            }
        });
        saveCharacter();
    }

    return (
        <div className="flex items-center justify-between pl-4 pr-2 bg-amber-50/15">
            <h2 className="font-bold text-xl text-left pb-1">{name}</h2>
            <div className="flex gap-2">
                <div className="flex gap-1 w-15 items-center">
                    <span>espaços</span>
                    <TextInput id={id} name="" value={slots} updateInput={handleUpdateSlots} isNumber />
                </div>
                {secondary?.action && (
                    <button
                        type="button"
                        className="btn-xs cursor-pointer flex justify-center"
                        onClick={() => secondary.action?.()}
                        title={secondary.title}
                    >
                        {secondary.title}
                    </button>
                )}

                {primary?.action && (
                    <button
                        type="button"
                        className="cursor-pointer flex justify-center"
                        onClick={() => primary.action?.()}
                        title={primary.title}
                    >
                        <Plus />
                    </button>
                )}
            </div>
        </div>
    );
}

export default SpellTitle;
'use client';

import { Plus } from 'lucide-react';

interface IAction {
    title: string;
    action: () => void;
}

interface TitleProps {
    name: string;
    primary?: IAction;
    secondary?: IAction;
}

function Title({ name, primary, secondary }: TitleProps) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-left pb-1">{name}</h2>
            <div className="flex gap-2">
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

export default Title;
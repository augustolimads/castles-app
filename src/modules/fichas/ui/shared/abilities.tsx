'use client'

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { charClasses } from '@/modules/compendium/charClasses';
import { races } from '@/modules/compendium/races';
import { useMemo } from 'react';
import { useCharacterStore } from '../../stores/character';

function Abilities() {
    const character = useCharacterStore();

    const raceInfo = useMemo(() => {
        const raceName = character.info.race?.toLowerCase().trim() || '';
        return races.find(race => 
            race.id === raceName || 
            race.name.toLowerCase() === raceName
        );
    }, [character.info.race]);

    const classInfo = useMemo(() => {
        const className = character.info.charClass?.toLowerCase().trim() || '';
        return charClasses.find(cls => 
            cls.id === className || 
            cls.name.toLowerCase() === className
        );
    }, [character.info.charClass]);

    const classLevel = useMemo(() => {
        const level = character.info.level || 1;
        return classInfo?.levels.find(l => l.level === level);
    }, [classInfo, character.info.level]);

    return (
        <div className="flex flex-col gap-2 md:h-[65vh] md:overflow-y-auto">
            {raceInfo && (
                <div id="raceInfo" className="md:flex-1 py-3">
                    <h2 className="font-bold text-2xl text-left mb-4">{raceInfo.name}</h2>
                    <div className="space-y-4">
                        {raceInfo.traits && raceInfo.traits.length > 0 && (
                            <div className="space-y-3">
                                {raceInfo.traits.map((trait, index) => (
                                    <div key={trait.id}>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">{index + 1}</Badge>
                                                <h3 className="font-semibold">{trait.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground pl-8 text-sm">
                                                {trait.description}
                                            </p>
                                        </div>
                                        {index < raceInfo.traits.length - 1 && (
                                            <Separator className="mt-3" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {raceInfo && classInfo && (
                <hr className="border-2 rounded-s-md my-2" />
            )}
            
            {classInfo && (
                <div id="classeInfo" className="flex-1 py-3">
                    <h2 className="font-bold text-2xl text-left mb-4">{classInfo.name}</h2>
                    {classLevel?.abilities?.length && classLevel.abilities.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Habilidades de Nível {classLevel.level}</h3>
                            {classLevel.abilities.map((ability, index) => (
                                <div key={ability.id}>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{index + 1}</Badge>
                                            <h4 className="font-semibold">{ability.name}</h4>
                                            {ability.check && ability.check !== '-' && (
                                                <Badge variant="outline" className="ml-2">
                                                    Teste: {ability.check}
                                                </Badge>
                                            )}
                                        </div>
                                        {ability.description && (
                                            <p className="text-muted-foreground pl-8 text-sm">
                                                {ability.description}
                                            </p>
                                        )}
                                    </div>
                                    {index < classLevel.abilities.length - 1 && (
                                        <Separator className="mt-3" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Abilities;
'use client'

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

function HitPoints() {
    const [currentHP, setCurrentHP] = useState(5);
    const [hpDelta, setHpDelta] = useState(0);
    const [lastModalHP, setLastModalHP] = useState<number | null>(null);
    const maxHP = 8;
    const minHP = -10;
    const maxCapHP = maxHP + 20;

    const hpState = currentHP > maxHP ? 'extra' : currentHP < 0 ? 'negative' : 'normal';
    const hpStateLabel = hpState === 'extra' ? 'PV Extra' : hpState === 'negative' ? 'Abaixo de 0' : 'PV Normal';

    const hpStateBadgeClass =
        hpState === 'extra'
            ? 'bg-sky-500/20 text-sky-600 border-sky-500/40'
            : hpState === 'negative'
              ? 'bg-red-900/30 text-red-900 border-red-800/70'
              : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40';

    const sliderStateClass =
        hpState === 'extra'
            ? '[&_[data-slot=slider-range]]:bg-sky-500 [&_[data-slot=slider-thumb]]:border-sky-500'
            : hpState === 'negative'
              ? '[&_[data-slot=slider-range]]:bg-red-900 [&_[data-slot=slider-thumb]]:border-red-900'
              : '[&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:border-emerald-500';

    const progressStateClass =
        hpState === 'extra'
            ? '[&_[data-slot=progress-indicator]]:bg-sky-500'
            : hpState === 'negative'
              ? '[&_[data-slot=progress-indicator]]:bg-red-900'
              : '[&_[data-slot=progress-indicator]]:bg-emerald-500';

    const normalizedHP = Math.min(Math.max(currentHP, 0), maxHP);
    const progressValue = (normalizedHP / maxHP) * 100;

    const minDelta = minHP - currentHP;
    const maxDelta = maxCapHP - currentHP;
    const sliderDeltaLimit = Math.max(Math.abs(minDelta), Math.abs(maxDelta));

    const applyModalHPChange = (nextHP: number) => {
        const clampedHP = Math.min(Math.max(nextHP, minHP), maxCapHP);

        if (clampedHP === currentHP) {
            return;
        }

        setLastModalHP(currentHP);
        setCurrentHP(clampedHP);
    };

    const applyDeltaHP = (delta: number) => {
        if (delta === 0) {
            return;
        }

        applyModalHPChange(currentHP + delta);
    };

    return (
        <div className="flex gap-2">
            <Button type="button" className="bg-accent text-card-foreground" onClick={() => setCurrentHP((prev) => Math.max(prev - 1, minHP))}>
                <Minus size={20} />
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="bg-card border border-card-foreground p-2 rounded-md flex-1 h-auto flex gap-2 items-center justify-start">
                        <Heart size={20} className="text-neutral-300" />
                        <span className="text-xs">{currentHP}/{maxHP}</span>
                        <Progress value={progressValue} className={`h-2 ${progressStateClass}`} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajustar Pontos de Vida</DialogTitle>
                        <DialogDescription>
                            Arraste para a esquerda para reduzir e para a direita para aumentar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                            <span className="text-sm font-medium">HP Atual: {currentHP}/{maxHP}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${hpStateBadgeClass}`}>{hpStateLabel}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Ajuste de PV</span>
                                <span>{hpDelta > 0 ? `+${hpDelta}` : hpDelta}</span>
                            </div>
                            <Slider
                                value={[hpDelta]}
                                min={-sliderDeltaLimit}
                                max={sliderDeltaLimit}
                                step={1}
                                onValueChange={(value) => {
                                    const next = value[0] ?? 0;
                                    const clamped = Math.min(Math.max(next, minDelta), maxDelta);
                                    setHpDelta(clamped);
                                }}
                                onValueCommit={(value) => {
                                    const next = value[0] ?? 0;
                                    const clamped = Math.min(Math.max(next, minDelta), maxDelta);
                                    applyDeltaHP(clamped);
                                    setHpDelta(0);
                                }}
                                className={sliderStateClass}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                applyModalHPChange(maxHP);
                                setHpDelta(0);
                            }}
                        >
                            Resetar para o maxHP
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={lastModalHP === null}
                            onClick={() => {
                                if (lastModalHP === null) {
                                    return;
                                }

                                setCurrentHP(lastModalHP);
                                setLastModalHP(null);
                                setHpDelta(0);
                            }}
                        >
                            Desfazer ultima acao
                        </Button>
                        <div className="text-xs text-muted-foreground">
                            Limites atuais: {minHP} a {maxCapHP} PV.
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Button type="button" className="bg-accent text-card-foreground" onClick={() => setCurrentHP((prev) => prev + 1)}>
                <Plus size={20} />
            </Button>
        </div>
    )
}

export default HitPoints
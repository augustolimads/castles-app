'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { syncedLocalStorage } from "@/lib/sync";
import { Bed, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Flame, Lightbulb, Moon, Plus, Sun, Swords, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface CustomEvent {
    id: string;
    label: string;
    turnNumber: number;
}

function Tempo() {
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const [explorationCounter, setExplorationCounter] = useState(0);
    const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
    const [newEventLabel, setNewEventLabel] = useState('');
    const [newEventTurn, setNewEventTurn] = useState('');
    const [isClient, setIsClient] = useState(false);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const minutesInputRef = useRef<HTMLInputElement>(null);
    const explorationInputRef = useRef<HTMLInputElement>(null);

    // Carregar dados do localStorage após montagem do componente
    useEffect(() => {
        setIsClient(true);
        const savedHours = syncedLocalStorage.getItem('tempo_hours');
        const savedMinutes = syncedLocalStorage.getItem('tempo_minutes');
        const savedCounter = syncedLocalStorage.getItem('tempo_explorationCounter');
        const savedEvents = syncedLocalStorage.getItem('tempo_customEvents');

        if (savedHours) setHours(parseInt(savedHours, 10));
        if (savedMinutes) setMinutes(parseInt(savedMinutes, 10));
        if (savedCounter) setExplorationCounter(parseInt(savedCounter, 10));
        if (savedEvents) setCustomEvents(JSON.parse(savedEvents));
    }, []);

    const addHour = useCallback(() => {
        setHours((prev) => (prev + 1) % 24);
    }, []);

    const subtractHour = useCallback(() => {
        setHours((prev) => (prev - 1 + 24) % 24);
    }, []);

    const add10Minutes = useCallback(() => {
        setMinutes((prevMinutes) => {
            const newMinutes = prevMinutes + 10;
            if (newMinutes >= 60) {
                setHours((prevHours) => (prevHours + 1) % 24);
                return newMinutes % 60;
            }
            return newMinutes;
        });
    }, []);

    const subtract10Minutes = useCallback(() => {
        setMinutes((prevMinutes) => {
            const newMinutes = prevMinutes - 10;
            if (newMinutes < 0) {
                setHours((prevHours) => (prevHours - 1 + 24) % 24);
                return 60 + newMinutes;
            }
            return newMinutes;
        });
    }, []);

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setHours(0);
            return;
        }
        const numValue = parseInt(value, 10);
        if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 23) {
            setHours(numValue);
        }
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setMinutes(0);
            return;
        }
        const numValue = parseInt(value, 10);
        if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 59 && numValue % 10 === 0) {
            setMinutes(numValue);
        }
    };

    const handleHoursBlur = () => {
        // Garantir que sempre tenha um valor válido ao perder o foco
        if (hoursInputRef.current) {
            hoursInputRef.current.value = String(hours).padStart(2, '0');
        }
    };

    const handleMinutesBlur = () => {
        // Garantir que sempre tenha um valor válido ao perder o foco
        if (minutesInputRef.current) {
            minutesInputRef.current.value = String(minutes).padStart(2, '0');
        }
    };

    const handleHoursFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleMinutesFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const incrementExploration = useCallback(() => {
        setExplorationCounter((prev) => prev + 1);
        add10Minutes();
    }, [add10Minutes]);

    const decrementExploration = useCallback(() => {
        setExplorationCounter((prev) => {
            if (prev > 0) {
                subtract10Minutes();
                return prev - 1;
            }
            return prev;
        });
    }, [subtract10Minutes]);

    const handleExplorationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setExplorationCounter(0);
            return;
        }
        const numValue = parseInt(value, 10);
        if (!Number.isNaN(numValue) && numValue >= 0) {
            setExplorationCounter(numValue);
        }
    };

    const handleExplorationBlur = () => {
        if (explorationInputRef.current) {
            explorationInputRef.current.value = String(explorationCounter);
        }
    };

    const handleExplorationFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const addCustomEvent = () => {
        if (newEventLabel.trim() && newEventTurn.trim()) {
            const turnNum = parseInt(newEventTurn, 10);
            if (!Number.isNaN(turnNum) && turnNum > explorationCounter) {
                const newEvent: CustomEvent = {
                    id: `custom-${Date.now()}`,
                    label: newEventLabel.trim(),
                    turnNumber: turnNum,
                };
                setCustomEvents((prev) => [...prev, newEvent].sort((a, b) => a.turnNumber - b.turnNumber));
                setNewEventLabel('');
                setNewEventTurn('');
            }
        }
    };

    const removeCustomEvent = (id: string) => {
        setCustomEvents((prev) => prev.filter((event) => event.id !== id));
    };

    // Remover eventos que já foram disparados (turno atual já passou)
    useEffect(() => {
        setCustomEvents((prev) => prev.filter((event) => event.turnNumber >= explorationCounter));
    }, [explorationCounter]);

    // Persistir estado no localStorage (com sincronização)
    useEffect(() => {
        if (isClient) {
            syncedLocalStorage.setItem('tempo_hours', String(hours));
        }
    }, [hours, isClient]);

    useEffect(() => {
        if (isClient) {
            syncedLocalStorage.setItem('tempo_minutes', String(minutes));
        }
    }, [minutes, isClient]);

    useEffect(() => {
        if (isClient) {
            syncedLocalStorage.setItem('tempo_explorationCounter', String(explorationCounter));
        }
    }, [explorationCounter, isClient]);

    useEffect(() => {
        if (isClient) {
            syncedLocalStorage.setItem('tempo_customEvents', JSON.stringify(customEvents));
        }
    }, [customEvents, isClient]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevenir ação se estiver digitando em um input
            const activeElement = document.activeElement;
            if (
                activeElement instanceof HTMLInputElement &&
                (activeElement === hoursInputRef.current ||
                    activeElement === minutesInputRef.current ||
                    activeElement === explorationInputRef.current)
            ) {
                return;
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                incrementExploration();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                decrementExploration();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                addHour();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                subtractHour();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [incrementExploration, decrementExploration, addHour, subtractHour]);


    const getDayPeriod = (hour: number) => {
        if (hour >= 0 && hour <= 2) {
            return {
                gradient: 'bg-gradient-to-b from-gray-900 to-black',
                icon: <Moon className="size-8 text-gray-300" />,
                label: 'Madrugada'
            };
        }
        if (hour === 3) {
            return {
                gradient: 'bg-gradient-to-b from-purple-900 to-purple-950',
                icon: <Moon className="size-8 text-purple-300" />,
                label: 'Madrugada'
            };
        }
        if (hour === 4) {
            return {
                gradient: 'bg-gradient-to-b from-orange-700 to-purple-900',
                icon: <Moon className="size-8 text-orange-200" />,
                label: 'Amanhecer'
            };
        }
        if (hour === 5) {
            return {
                gradient: 'bg-gradient-to-b from-yellow-500 to-orange-600',
                icon: <Moon className="size-8 text-yellow-100" />,
                label: 'Amanhecer'
            };
        }
        if (hour === 6) {
            return {
                gradient: 'bg-gradient-to-b from-sky-400 to-yellow-400',
                icon: <Sun className="size-8 text-yellow-100" />,
                label: 'Manhã'
            };
        }
        if (hour >= 7 && hour <= 15) {
            return {
                gradient: 'bg-gradient-to-b from-sky-500 to-blue-400',
                icon: <Sun className="size-8 text-yellow-100" />,
                label: hour <= 11 ? 'Manhã' : 'Tarde'
            };
        }
        if (hour === 16) {
            return {
                gradient: 'bg-gradient-to-b from-blue-400 to-sky-300',
                icon: <Sun className="size-8 text-yellow-200" />,
                label: 'Tarde'
            };
        }
        if (hour === 17) {
            return {
                gradient: 'bg-gradient-to-b from-orange-500 to-orange-700',
                icon: <Moon className="size-8 text-orange-100" />,
                label: 'Entardecer'
            };
        }
        if (hour === 18) {
            return {
                gradient: 'bg-gradient-to-b from-red-600 to-orange-700',
                icon: <Moon className="size-8 text-orange-100" />,
                label: 'Entardecer'
            };
        }
        if (hour >= 19 && hour <= 20) {
            return {
                gradient: 'bg-gradient-to-b from-purple-700 to-purple-900',
                icon: <Moon className="size-8 text-purple-200" />,
                label: 'Noite'
            };
        }
        if (hour === 21) {
            return {
                gradient: 'bg-gradient-to-b from-purple-900 to-purple-950',
                icon: <Moon className="size-8 text-purple-300" />,
                label: 'Noite'
            };
        }
        // 22-23
        return {
            gradient: 'bg-gradient-to-b from-gray-900 to-black',
            icon: <Moon className="size-8 text-gray-300" />,
            label: 'Noite'
        };
    };

    const period = getDayPeriod(hours);

    const getExplorationEvents = (count: number) => {
        if (count === 0) return [];

        const events = [];

        if (count % 2 === 0) {
            events.push({
                id: 'monster',
                label: 'Monstro errante!',
                icon: <Swords className="size-4" />,
                variant: 'destructive' as const
            });
        }

        if (count % 6 === 0) {
            events.push({
                id: 'torch',
                label: 'Consumir tocha!',
                icon: <Flame className="size-4" />,
                variant: 'default' as const
            });
            events.push({
                id: 'rest',
                label: 'Descansar!',
                icon: <Bed className="size-4" />,
                variant: 'secondary' as const
            });
        }

        if (count % 24 === 0) {
            events.push({
                id: 'lantern',
                label: 'Consumir lanterna!',
                icon: <Lightbulb className="size-4" />,
                variant: 'outline' as const
            });
        }

        // Adicionar eventos personalizados
        customEvents.forEach((customEvent) => {
            if (customEvent.turnNumber === count) {
                events.push({
                    id: customEvent.id,
                    label: customEvent.label,
                    icon: <Flame className="size-4" />,
                    variant: 'default' as const
                });
            }
        });

        return events;
    };

    const explorationEvents = getExplorationEvents(explorationCounter);

    return (
        <div className="flex flex-col gap-8 pt-8 max-w-4xl mx-auto md:px-4">
            <div className="flex gap-2">
                <SidebarTrigger />
                <h1 className="scroll-m-20 text-2xl lg:text-3xl font-extrabold tracking-tight text-balance">
                    Gerenciador de Tempo
                </h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader className={`${period.gradient} rounded-t-xl flex flex-row items-center justify-center gap-3 py-8 -mt-6`}>
                        {period.icon}
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 lg:gap-4">
                            <Button
                                onClick={subtractHour}
                                variant="outline"
                                size="icon"
                                title="Reduzir 1 hora"
                            >
                                <ChevronsLeft className="size-5" />
                            </Button>

                            <Button
                                onClick={subtract10Minutes}
                                variant="outline"
                                size="icon"
                                title="Reduzir 10 minutos"
                            >
                                <ChevronLeft className="size-5" />
                            </Button>

                            <div className="flex items-center text-2xl lg:text-6xl font-bold tabular-nums">
                                <input
                                    ref={hoursInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    value={String(hours).padStart(2, '0')}
                                    onChange={handleHoursChange}
                                    onBlur={handleHoursBlur}
                                    onFocus={handleHoursFocus}
                                    className="w-full lg:w-24 text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded-md"
                                    maxLength={2}
                                />
                                <span>:</span>
                                <input
                                    ref={minutesInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    value={String(minutes).padStart(2, '0')}
                                    onChange={handleMinutesChange}
                                    onBlur={handleMinutesBlur}
                                    onFocus={handleMinutesFocus}
                                    className="w-full lg:w-24 text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded-md"
                                    maxLength={2}
                                />
                            </div>

                            <Button
                                onClick={add10Minutes}
                                variant="outline"
                                size="icon"
                                title="Avançar 10 minutos"
                            >
                                <ChevronRight className="size-5" />
                            </Button>

                            <Button
                                onClick={addHour}
                                variant="outline"
                                size="icon"
                                title="Avançar 1 hora"
                            >
                                <ChevronsRight className="size-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-center">Tempo de Exploração</h2>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-center gap-6">
                                <Button
                                    onClick={decrementExploration}
                                    variant="outline"
                                    size="icon-lg"
                                    title="Reduzir 10 minutos"
                                    disabled={explorationCounter === 0}
                                >
                                    <ChevronLeft className="size-6" />
                                </Button>

                                <input
                                    ref={explorationInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    value={String(explorationCounter)}
                                    onChange={handleExplorationChange}
                                    onBlur={handleExplorationBlur}
                                    onFocus={handleExplorationFocus}
                                    className="text-5xl font-bold tabular-nums min-w-32 text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded-md w-full"
                                />

                                <Button
                                    onClick={incrementExploration}
                                    variant="outline"
                                    size="icon-lg"
                                    title="Avançar 10 minutos"
                                >
                                    <ChevronRight className="size-6" />
                                </Button>
                            </div>

                            {explorationEvents.length > 0 && (
                                <div className="flex flex-col gap-2 mt-2">
                                    {explorationEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${event.variant === 'destructive'
                                                ? 'bg-destructive/10 border-destructive text-destructive dark:bg-destructive/20'
                                                : event.variant === 'secondary'
                                                    ? 'bg-secondary border-secondary-foreground/20'
                                                    : event.variant === 'outline'
                                                        ? 'bg-background border-border'
                                                        : 'bg-primary/10 border-primary text-primary dark:bg-primary/20'
                                                }`}
                                        >
                                            {event.icon}
                                            <span className="font-medium">{event.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="max-w-2xl xl:max-w-none mx-auto w-full">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-center mb-4">Eventos dos Turnos</h2>
                    <div className="flex gap-2 items-center justify-end flex-wrap lg:flex-nowrap">
                        <input
                            type="text"
                            placeholder="Nome do evento"
                            value={newEventLabel}
                            onChange={(e) => setNewEventLabel(e.target.value)}
                            className="lg:flex-1 px-3 py-2 rounded-md border bg-background text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addCustomEvent();
                                }
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Turno"
                            value={newEventTurn}
                            onChange={(e) => setNewEventTurn(e.target.value)}
                            className="w-16 lg:w-24 px-3 py-2 rounded-md border bg-background text-sm"
                            min={explorationCounter + 1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addCustomEvent();
                                }
                            }}
                        />
                        <Button onClick={addCustomEvent} size="sm">
                            <Plus className="size-4" />
                            Adicionar
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {customEvents.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-4">
                            Nenhum evento registrado
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {customEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{event.label}</span>
                                        <span className="text-sm text-muted-foreground">
                                            Turno {event.turnNumber} (faltam {event.turnNumber - explorationCounter} turnos)
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => removeCustomEvent(event.id)}
                                        variant="ghost"
                                        size="icon-sm"
                                        title="Remover evento"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Tempo;

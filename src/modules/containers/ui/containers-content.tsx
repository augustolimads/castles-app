'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Item } from '@/modules/itens/use-items';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useContainers } from '../use-containers';
import { ContainerCard } from './container-card';

interface ContainersContentProps {
    items: Item[];
}

export function ContainersContent({ items }: ContainersContentProps) {
    const {
        containers,
        isLoaded,
        createContainer,
        deleteContainer,
        renameContainer,
        toggleContainer,
        updateMaxCapacity,
        addItemToContainer,
        addCustomItemToContainer,
        removeItemFromContainer,
        updateItemQuantity,
        moveItemBetweenContainers,
        reorderContainers,
        getTotalWeight,
        getTotalPrice,
    } = useContainers();

    const [newContainerName, setNewContainerName] = useState('');
    const [showNewContainerInput, setShowNewContainerInput] = useState(false);
    const [draggedContainerIndex, setDraggedContainerIndex] = useState<number | null>(null);

    const handleCreateContainer = () => {
        if (newContainerName.trim()) {
            createContainer(newContainerName.trim());
            setNewContainerName('');
            setShowNewContainerInput(false);
        }
    };

    const handleContainerDragStart = (index: number) => {
        setDraggedContainerIndex(index);
    };

    const handleContainerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleContainerDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        if (draggedContainerIndex !== null && draggedContainerIndex !== toIndex) {
            reorderContainers(draggedContainerIndex, toIndex);
        }
        setDraggedContainerIndex(null);
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col xl:flex-row gap-4 items-center xl:items-start justify-between">
                <div className='flex gap-2 flex-1'>
                    <SidebarTrigger />
                    <h1 className="text-xl font-bold">Containers & bagagens</h1>
                </div>

                <div className="flex gap-2">
                    {showNewContainerInput ? (
                        <div className="flex flex-col md:flex-row gap-2">
                            <Input
                                placeholder="Nome do container"
                                value={newContainerName}
                                onChange={(e) => setNewContainerName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateContainer()}
                                className="w-64"
                                autoFocus
                            />
                            <div className='flex gap-2 justify-end'>
                            <Button onClick={handleCreateContainer}>Criar</Button>
                            <Button variant="outline" onClick={() => setShowNewContainerInput(false)}>
                                Cancelar
                            </Button>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={() => setShowNewContainerInput(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Container
                        </Button>
                    )}
                </div>
            </div>

            {containers.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        Nenhum container criado ainda.
                    </p>
                    <Button onClick={() => setShowNewContainerInput(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Container
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-4">
                    {containers.map((container, index) => (
                        // biome-ignore lint: drag and drop zone
                        <div
                            key={container.id}
                            onDragOver={(e) => handleContainerDragOver(e)}
                            onDrop={(e) => handleContainerDrop(e, index)}
                            className={draggedContainerIndex === index ? 'opacity-50' : ''}
                        >
                            <ContainerCard
                                container={container}
                                items={items}
                                totalWeight={getTotalWeight(container.id)}
                                totalPrice={getTotalPrice(container.id)}
                                onDelete={() => deleteContainer(container.id)}
                                onRename={(name) => renameContainer(container.id, name)}
                                onToggle={() => toggleContainer(container.id)}
                                onUpdateMaxCapacity={(maxCapacity) => updateMaxCapacity(container.id, maxCapacity)}
                                onRemoveItem={(itemId) => removeItemFromContainer(container.id, itemId)}
                                onUpdateQuantity={(itemId, quantity) =>
                                    updateItemQuantity(container.id, itemId, quantity)
                                }
                                onMoveItem={moveItemBetweenContainers}
                                onAddItem={addItemToContainer}
                                onAddCustomItem={addCustomItemToContainer}
                                onDragStart={() => handleContainerDragStart(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

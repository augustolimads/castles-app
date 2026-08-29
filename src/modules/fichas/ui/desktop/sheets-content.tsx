'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { CharacterSheet } from '../../types';
import { DEFAULT_SHEET_GROUP_ID, useSheetGroups } from '../../use-sheet-groups';
import { useSheets } from '../../use-sheets';
import { CreateSheetDialog } from './create-sheet-dialog';
import { SheetCard } from './sheet-card';

export function SheetsContent() {
  const { sheets, addSheet, deleteSheet } = useSheets();
  const { groups, createGroup, deleteGroup, renameGroup, assignSheetToGroup } = useSheetGroups();
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [draggedSheetId, setDraggedSheetId] = useState<string | null>(null);
  const [dropTargetGroupId, setDropTargetGroupId] = useState<string | null>(null);

  const sortedSheets = useMemo(() => {
    return [...sheets].sort((a, b) => b.createdAt - a.createdAt);
  }, [sheets]);

  const sheetsById = useMemo(
    () => new Map(sortedSheets.map((sheet) => [sheet.id, sheet])),
    [sortedSheets]
  );

  const groupedSheets = useMemo(() => {
    return groups.map((group) => ({
      group,
      sheets: group.sheetIds
        .map((sheetId) => sheetsById.get(sheetId))
        .filter((sheet): sheet is CharacterSheet => Boolean(sheet)),
    }));
  }, [groups, sheetsById]);

  const assignedSheetIds = useMemo(() => {
    return new Set(groups.flatMap((group) => group.sheetIds));
  }, [groups]);

  const legacyUngrouped = useMemo(() => {
    return sortedSheets.filter((sheet) => !assignedSheetIds.has(sheet.id));
  }, [sortedSheets, assignedSheetIds]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    createGroup(newGroupName);
    setNewGroupName('');
    setShowNewGroupInput(false);
  };

  const startRenameGroup = (groupId: string, groupName: string) => {
    if (groupId === DEFAULT_SHEET_GROUP_ID) return;
    setEditingGroupId(groupId);
    setEditingGroupName(groupName);
  };

  const handleRenameGroup = () => {
    if (!editingGroupId || !editingGroupName.trim()) {
      setEditingGroupId(null);
      setEditingGroupName('');
      return;
    }

    renameGroup(editingGroupId, editingGroupName);
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  const handleDragStart = (sheetId: string) => {
    setDraggedSheetId(sheetId);
  };

  const handleDragEnd = () => {
    setDraggedSheetId(null);
    setDropTargetGroupId(null);
  };

  const handleDragOverGroup = (event: React.DragEvent, groupId: string) => {
    event.preventDefault();
    if (dropTargetGroupId !== groupId) {
      setDropTargetGroupId(groupId);
    }
  };

  const handleDragLeaveGroup = (event: React.DragEvent, groupId: string) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && event.currentTarget.contains(nextTarget)) return;
    if (dropTargetGroupId === groupId) {
      setDropTargetGroupId(null);
    }
  };

  const handleDropInGroup = (event: React.DragEvent, groupId: string) => {
    event.preventDefault();
    if (!draggedSheetId) return;

    assignSheetToGroup(draggedSheetId, groupId);
    setDraggedSheetId(null);
    setDropTargetGroupId(null);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-2 bg-secondary py-4 px-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger variant='outline' size='lg' className="p-4" />
            <h1 className="text-2xl font-bold">Fichas de Personagens</h1>
          </div>
          <CreateSheetDialog onCreateSheet={addSheet} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showNewGroupInput ? (
            <>
              <Input
                value={newGroupName}
                onChange={(event) => setNewGroupName(event.target.value)}
                placeholder="Nome do grupo"
                className="w-52"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCreateGroup();
                  }
                }}
                autoFocus
              />
              <Button onClick={handleCreateGroup}>Criar</Button>
              <Button variant="outline" onClick={() => setShowNewGroupInput(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setShowNewGroupInput(true)}>
              <Plus size={16} className="mr-2" />
              Novo grupo
            </Button>
          )}
          <Badge variant="secondary">{sheets.length} fichas</Badge>
        </div>
      </div>

      <div className="space-y-5">
        {groupedSheets.map(({ group, sheets: groupSheets }) => {
          const isDefaultGroup = group.id === DEFAULT_SHEET_GROUP_ID;
          const isEditing = editingGroupId === group.id;

          return (
            // biome-ignore lint: drag and drop zone
            <div
              key={group.id}
              onDragOver={(event) => handleDragOverGroup(event, group.id)}
              onDragLeave={(event) => handleDragLeaveGroup(event, group.id)}
              onDrop={(event) => handleDropInGroup(event, group.id)}
              className={`rounded-lg border bg-card/80 p-4 space-y-4 transition-colors ${dropTargetGroupId === group.id ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  {isEditing ? (
                    <Input
                      value={editingGroupName}
                      onChange={(event) => setEditingGroupName(event.target.value)}
                      onBlur={handleRenameGroup}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleRenameGroup();
                        if (event.key === 'Escape') {
                          setEditingGroupId(null);
                          setEditingGroupName('');
                        }
                      }}
                      className="h-8 w-56"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => startRenameGroup(group.id, group.name)}
                      disabled={isDefaultGroup}
                      className="truncate text-left text-lg font-semibold disabled:cursor-default"
                    >
                      {group.name}
                    </button>
                  )}
                  <Badge variant="outline">{groupSheets.length}</Badge>
                </div>

                {!isDefaultGroup && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGroup(group.id)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Excluir grupo"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Excluir
                  </Button>
                )}
              </div>

              {groupSheets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {groupSheets.map((sheet) => (
                    <SheetCard
                      key={sheet.id}
                      sheet={sheet}
                      onDelete={deleteSheet}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma ficha neste grupo.</p>
              )}
            </div>
          );
        })}

        {legacyUngrouped.length > 0 && (
          // biome-ignore lint: drag and drop zone
          <div
            onDragOver={(event) => handleDragOverGroup(event, DEFAULT_SHEET_GROUP_ID)}
            onDragLeave={(event) => handleDragLeaveGroup(event, DEFAULT_SHEET_GROUP_ID)}
            onDrop={(event) => handleDropInGroup(event, DEFAULT_SHEET_GROUP_ID)}
            className={`rounded-lg border border-dashed p-4 space-y-3 transition-colors ${dropTargetGroupId === DEFAULT_SHEET_GROUP_ID ? 'border-primary bg-primary/5' : ''}`}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Sem grupo</h2>
              <Badge variant="outline">{legacyUngrouped.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {legacyUngrouped.map((sheet) => (
                <SheetCard
                  key={sheet.id}
                  sheet={sheet}
                  onDelete={deleteSheet}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </div>
        )}

        {sortedSheets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma ficha cadastrada</p>
            <p className="text-sm">Clique em "Nova Ficha" para criar sua primeira ficha</p>
          </div>
        )}
      </div>
    </div>
  );
}

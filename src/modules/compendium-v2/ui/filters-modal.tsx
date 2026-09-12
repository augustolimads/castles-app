"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { COMPENDIUM_CATEGORIES } from "../domain/types";

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  category: string;
  tagsInput: string;
  onCategoryChange: (value: string) => void;
  onTagsInputChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FiltersModal({
  open,
  onOpenChange,
  category,
  tagsInput,
  onCategoryChange,
  onTagsInputChange,
  onApply,
  onClear,
}: FiltersModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>
            Filtre por categoria e tags separadas por vírgula.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="compendium-category">Categoria</Label>
            <Select value={category || "all"} onValueChange={onCategoryChange}>
              <SelectTrigger id="compendium-category">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {COMPENDIUM_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compendium-tags">Tags</Label>
            <Input
              id="compendium-tags"
              value={tagsInput}
              onChange={(event) => onTagsInputChange(event.target.value)}
              placeholder="ex: undead, chefe, raro"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClear} type="button">
            Limpar
          </Button>
          <Button type="button" onClick={onApply}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

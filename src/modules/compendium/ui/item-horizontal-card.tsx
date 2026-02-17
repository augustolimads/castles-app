import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Star, Swords } from "lucide-react";
import { useCallback } from "react";
import { useFavorites } from "../use-favorites";

type ItemHorizontalCardProps = {
  item: {
    id: string;
    nome: string;
    nivel: string;
    pv: string;
    ca: string;
    tamanho: string;
    disposicao: string;
    ataques: string;
    bioma: string;
    xp: string;
    habilidades: string;
  };
};

export function ItemHorizontalCard({ item }: ItemHorizontalCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(item);
  }, [toggleFavorite, item]);

  const favorited = isFavorite(item.id);

  return (
    <Card className="p-2">
      <div className="gap-4 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg font-extrabold">{item.nome}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Nível {item.nivel}
              </Badge>
              {item.tamanho && (
                <Badge variant="outline" className="text-xs">
                  {item.tamanho}
                </Badge>
              )}
              {item.disposicao && (
                <Badge variant="outline" className="text-xs">
                  {item.disposicao}
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="cursor-pointer shrink-0"
            onClick={handleToggleFavorite}
            variant={favorited ? "default" : "outline"}
          >
            <Star className={favorited ? "fill-current" : ""} size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-500" />
            <span className="font-semibold">PV:</span>
            <span>{item.pv}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-blue-500" />
            <span className="font-semibold">CA:</span>
            <span>{item.ca}</span>
          </div>
          {item.ataques && (
            <div className="flex items-center gap-1 col-span-2">
              <Swords size={14} className="text-orange-500" />
              <span className="font-semibold">Ataques:</span>
              <span className="truncate">{item.ataques}</span>
            </div>
          )}
        </div>

        {item.habilidades && (
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold">Habilidades: </span>
            <span className="line-clamp-2">{item.habilidades}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs pt-2 border-t">
          {item.bioma && (
            <span className="text-muted-foreground">
              <span className="font-semibold">Bioma:</span> {item.bioma}
            </span>
          )}
          {item.xp && (
            <Badge variant="secondary" className="text-xs">
              {item.xp} XP
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

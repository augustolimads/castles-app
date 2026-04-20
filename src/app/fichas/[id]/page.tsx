export default function SheetDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Ficha de Personagem</h1>
        <p className="text-muted-foreground">ID: {params.id}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Esta página será implementada em breve
        </p>
      </div>
    </div>
  );
}

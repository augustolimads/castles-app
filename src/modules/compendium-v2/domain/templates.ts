import type { CompendiumCategory } from "./types";

export interface CompendiumTemplate {
  id: string;
  label: string;
  content: string;
}

const templateByCategory: Record<CompendiumCategory, CompendiumTemplate[]> = {
  raça: [
    {
      id: "raca-base",
      label: "Raça base",
      content:
        "# {{nome}}\n\n## Visão geral\nDescreva a origem e o papel da raça no cenário.\n\n## Atributos\n- Ajustes: \n- Movimento: \n- Idiomas: \n\n## Habilidades raciais\n- \n\n## Observações para ficha\n- Como aplicar na criação de personagem\n",
    },
  ],
  classe: [
    {
      id: "classe-base",
      label: "Classe base",
      content:
        "# {{nome}}\n\n## Papel da classe\nDescreva identidade, estilo e função no grupo.\n\n## Requisitos\n- Atributos mínimos: \n- Restrições: \n\n## Progressão\n| Nível | BBA | JP | Habilidades |\n| --- | --- | --- | --- |\n| 1 |  |  |  |\n\n## Notas para uso na ficha\n- Campos que impactam cálculo\n",
    },
  ],
  regras: [
    {
      id: "regra-curta",
      label: "Regra resumida",
      content:
        "# {{nome}}\n\n## Quando usar\n\n## Regra\n\n## Exemplo de mesa\n\n## Referências cruzadas\n- \n",
    },
  ],
  habilidades: [
    {
      id: "habilidade-base",
      label: "Habilidade",
      content:
        "# {{nome}}\n\n## Tipo\nAtiva, passiva, reação etc.\n\n## Efeito\n\n## Custo/limite\n\n## Interações importantes\n- \n",
    },
  ],
  feitiços: [
    {
      id: "feitico-base",
      label: "Feitiço",
      content:
        "# {{nome}}\n\n## Dados rápidos\n- Nível: \n- Escola: \n- Alcance: \n- Duração: \n\n## Descrição\n\n## Componentes\n- Verbal: \n- Somático: \n- Material: \n",
    },
  ],
  itens: [
    {
      id: "item-base",
      label: "Item",
      content:
        "# {{nome}}\n\n## Dados rápidos\n- Tipo: \n- Preço: \n- Peso: \n\n## Descrição\n\n## Efeito em jogo\n\n## Observações\n",
    },
  ],
  monstros: [
    {
      id: "monstro-base",
      label: "Monstro",
      content:
        "# {{nome}}\n\n## Dados rápidos\n- Nível: \n- PV: \n- CA: \n- XP: \n\n## Ataques\n\n## Habilidades\n\n## Habitat e comportamento\n",
    },
  ],
};

export function getTemplatesByCategory(
  category: CompendiumCategory,
): CompendiumTemplate[] {
  return templateByCategory[category] ?? [];
}

export function createTemplateDocument(
  category: CompendiumCategory,
  templateId?: string,
): string {
  const templates = getTemplatesByCategory(category);

  if (templates.length === 0) {
    return "# Novo registro\n\nDescreva o conteúdo aqui.";
  }

  const selected =
    templates.find((template) => template.id === templateId) ?? templates[0];
  return selected.content.replaceAll("{{nome}}", "Novo registro");
}

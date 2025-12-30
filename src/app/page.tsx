import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as CharGen from "@/modules/char-gen";
import { LabeledCheckbox } from "@/modules/char-gen/ui/labeled-checkbox";
import { charClasses } from "@/modules/data/charClasses";
import { charRaces } from "@/modules/data/charRaces";

export default function Home() {
  return (
    <div>
      <main className="m-0 mx-auto max-w-3xl border min-h-screen flex flex-col gap-8 p-4">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">C&C: Gerador de personagem</h1>
        <CharGen.TextInput label="Nome" id="name" />

        <div id="attributes" className="grid grid-cols-3 gap-4">
          <CharGen.NumberInput label="Força" id="strength" />
          <CharGen.NumberInput label="Inteligência" id="intelligence" />
          <CharGen.NumberInput label="Sabedoria" id="wisdom" />
          <CharGen.NumberInput label="Destreza" id="dexterity" />
          <CharGen.NumberInput label="Constituição" id="constitution" />
          <CharGen.NumberInput label="Carisma" id="charisma" />
        </div>

        <div className="flex gap-4 items-center justify-between">
          <Button type="button">Rolar atributos</Button>
          <div className="flex gap-10">
            <p className="flex gap-1">
              <span>Mod. total:</span>
              <Badge>0</Badge>
            </p>
            <p className="flex gap-1">
              <span>Tentativas:</span>
              <Badge>0x</Badge>
            </p>
          </div>
        </div>
        <hr />

        <div className="grid grid-cols-2 gap-4">
          <CharGen.TextSelect placeholder="Selecione uma raça" label="Raça" values={charRaces} />
          <CharGen.TextSelect placeholder="Selecione uma classe" label="Classe" values={charClasses} />
        </div>

        <div>
          <p><span>Selecione os atributos Prime:</span> <Badge>2/2</Badge> </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <LabeledCheckbox value={true} label="Força" />
            <LabeledCheckbox value={false} label="Inteligência" />
            <LabeledCheckbox value={true} label="Sabedoria" />
            <LabeledCheckbox value={false} label="Destreza" />
            <LabeledCheckbox value={false} label="Constituição" />
            <LabeledCheckbox value={false} label="Carisma" />

            <Button className="mt-2">Rolar detalhes finais</Button>
          </div>
        </div>

        <hr />

        <div className="grid grid-cols-4 gap-4">
          <CharGen.TextInput disabled label="PV" id="pv" value="5" />
          <CharGen.TextInput disabled label="Tesouro inicial" id="treasure" value="160 PO" />
          <CharGen.TextInput disabled label="Idade" id="age" value="55 anos" />
          <CharGen.TextInput disabled label="Altura" id="height" value="167 cm" />
          <CharGen.TextInput disabled label="Peso" id="weight" value="70 kg" />
          <CharGen.TextInput disabled label="Gênero" id="gender" value="masc." />
          <CharGen.TextInput disabled label="Descrição" id="description" value="baixo" />
          <CharGen.TextInput disabled label="Sobrecarga" id="overload" value="15" />
        </div>
      </main>
    </div>
  );
}

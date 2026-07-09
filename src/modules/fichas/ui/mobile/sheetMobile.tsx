'use client';

import { useState } from "react";
import Abilities from "../shared/abilities";
import Attributes from "./attributes";
import Derivated from "./derivated";
import Header from "./header";
import Hp from "./hp";
import Inventory from "./inventory";
import TabsMobile from "./tabs-mobile";
import Spells from "../shared/spells";
import Notes from "../shared/notes";

function SheetMobile() {
  const [selectedTab, setSelectedTab] = useState("inventario");

  return (
    <div className="flex flex-col gap-2">
      <div id="sheet-fixed" className="flex flex-col gap-2">
        <Header />
        <Attributes />
        <Derivated />
        <Hp />
        <TabsMobile selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div id="sheet-scrollable" className="flex flex-col gap-2 overflow-y-auto">
        {selectedTab === "inventario" && <section id="inventario"><Inventory /></section>}
        {selectedTab === "habilidades" && <section id="habilidades"><Abilities /></section>}
        {selectedTab === "magias" && <section id="magias"><Spells /></section>}
        {selectedTab === "notas" && <section id="notas"><Notes /></section>}
      </div>
    </div>
  )
}

export default SheetMobile
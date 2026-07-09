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
      <div id="sheet-fixed" className="flex flex-col gap-2 absolute top-0 left-0 right-0 z-10 bg-card py-1 px-2">
        <Header />
        <Attributes />
        <Derivated />
        <Hp />
        <TabsMobile selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div id="sheet-scrollable" className="flex flex-col gap-2 overflow-y-auto mt-72 pb-24 h-[calc(100vh-18rem)]">
        {selectedTab === "inventario" && <section id="inventario"><Inventory /></section>}
        {selectedTab === "habilidades" && <section id="habilidades"><Abilities /></section>}
        {selectedTab === "magias" && <section id="magias" className="px-2"><Spells /></section>}
        {selectedTab === "notas" && <section id="notas"><Notes /></section>}
      </div>
    </div>
  )
}

export default SheetMobile
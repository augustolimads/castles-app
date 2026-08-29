'use client';

import { useState } from "react";
import Combat from "../desktop/combat";
import Inventory from "../desktop/inventory";
import Abilities from "../shared/abilities";
import Notes from "../shared/notes";
import Spells from "../shared/spells";
import Attributes from "./attributes";
import Derivated from "./derivated";
import { GroupNavigationFooter } from "./group-navigation-footer";
import Header from "./header";
import Hp from "./hp";
import TabsMobile from "./tabs-mobile";

interface SheetMobileProps {
  currentSheetId: string;
}

function SheetMobile({ currentSheetId }: SheetMobileProps) {
  const [selectedTab, setSelectedTab] = useState("inventory");

  return (
    <div className="flex flex-col gap-2">
      <div id="sheet-fixed" className="flex flex-col gap-2 absolute top-0 left-0 right-0 z-10 bg-card py-1 px-2">
        <Header />
        <Attributes />
        <Derivated />
        <Hp />
        <TabsMobile selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div
        id="sheet-scrollable"
        className="flex flex-col gap-2 mt-72"
        style={{ paddingBottom: 'calc(11rem + env(safe-area-inset-bottom))' }}
      >
        {selectedTab === "combat" && <section id="combat"><Combat /></section>}
        {selectedTab === "inventory" && <section id="inventory"><Inventory /></section>}
        {selectedTab === "abilities" && <section id="abilities"><Abilities /></section>}
        {selectedTab === "spells" && <section id="spells" className="px-2"><Spells /></section>}
        {selectedTab === "notes" && <section id="notes"><Notes /></section>}
      </div>

      <GroupNavigationFooter currentSheetId={currentSheetId} />
    </div>
  )
}

export default SheetMobile
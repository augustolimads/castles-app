'use client';

import Attributes from "./attributes";
import Derivated from "./derivated";
import Header from "./header";
import Hp from "./hp";
import TabsMobile from "./tabs-mobile";

function SheetMobile() {
  return (
    <div className="flex flex-col gap-2">
      <div id="sheet-fixed" className="flex flex-col gap-2">
        <Header />
        <Attributes />
        <Derivated />
        <Hp />
        <TabsMobile selectedTab="inventario" setSelectedTab={() => { }} />
      </div>
      <div id="sheet-scrollable" className="flex flex-col gap-2 overflow-y-auto">

      </div>
    </div>
  )
}

export default SheetMobile
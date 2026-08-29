import AttributeList from '@/modules/fichas/ui/desktop/attribute-list';
import CharacterName from '@/modules/fichas/ui/desktop/character-name';
import Combat from '@/modules/fichas/ui/desktop/combat';
import Conditions from '@/modules/fichas/ui/desktop/conditions';
import Info from '@/modules/fichas/ui/desktop/info';
import More from '@/modules/fichas/ui/desktop/more';
import Portrait from '@/modules/fichas/ui/desktop/portrait';
import StatList from '@/modules/fichas/ui/desktop/stat-list';
import { GroupNavigationFooter } from '@/modules/fichas/ui/mobile/group-navigation-footer';

interface SheetDesktopProps {
    currentSheetId: string;
}

function SheetDesktop({ currentSheetId }: SheetDesktopProps) {
  return (
      <main className="pb-20">
            {/* <DiceBox /> */}
            <div
                id="Grid"
                className="max-w-300 w-full m-auto px-2 md:px-4 grid grid-cols-4 md:grid-cols-10 character-grid-rows gap-x-2 md:gap-x-3 pt-2 md:pt-4"
            >
                <div
                    id="characterName"
                    className="row-start-1 col-start-1 md:col-start-1 col-span-4 md:col-span-5 row-span-2 self-center -mr-3.5"
                >
                    <CharacterName />
                </div>
                <div
                    id="attributes"
                    className="col-start-1 row-start-5 col-span-4 md:col-start-1 lg:col-start-1 md:col-span-2 lg:col-span-1 md:row-start-3 pb-1 flex flex-col justify-between md:pt-3"
                >
                    <AttributeList />
                </div>
                <div
                    className="col-start-1 md:col-start-6 col-span-4 md:col-span-5 row-start-3 md:row-start-1 row-span-2 card py-3! mb-3 md:mb-0"
                >
                    <Info />
                </div>
                <div
                    className="col-start-1 col-span-4 row-start-8 mt-4 md:col-start-3 lg:col-start-2 md:col-span-3 md:row-start-3 md:my-4"
                >
                    <StatList />
                </div>
                <div
                    className="hidden lg:block col-start-2 col-span-3 row-start-7 row-span-7 mb-4 mt-2 card"
                >
                    <Combat />
                </div>
                <div
                    className="col-start-1 col-span-4 row-start-12 row-span-10 mb-4 md:col-start-6 lg:col-start-5 md:col-span-5 lg:col-span-4 md:row-start-3 md:row-span-16 md:mb-9 lg:mb-4 lg:row-span-11 md:my-4"
                >
                    <More />
                </div>
                <div
                    className="col-start-1 col-span-4 row-start-24 mb-4 md:mb-0 md:mt-4 md:col-start-3 md:col-span-3 md:row-start-7 md:row-span-4 lg:col-start-9 lg:col-span-2 lg:row-start-3 lg:row-span-4"
                >
                    <Portrait />
                </div>
                <div
                    className="col-start-1 col-span-4 row-start-23 mb-4 md:my-4 lg:mb-4 md:col-start-3 md:col-span-3 md:row-start-12 lg:col-start-9 lg:col-span-2 lg:row-start-8 lg:row-span-6"
                >
                    <Conditions />
                </div>
            </div>

          <GroupNavigationFooter currentSheetId={currentSheetId} />
        </main>
    );
}

export default SheetDesktop
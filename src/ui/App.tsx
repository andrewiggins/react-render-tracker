import * as React from "react";
import Toolbar from "./components/toolbar/Toolbar";
import FiberTree from "./components/fiber-tree/Tree";
import FiberTreeHeader from "./components/fiber-tree/TreeHeader";
import Details from "./components/details/Details";
import StatusBar from "./components/statusbar/StatusBar";
import WaitingForReady from "./components/misc/WaitingForReady";
import { FindMatchContextProvider } from "./utils/find-match";
import {
  SelectedIdConsumer,
  SelectionContextProvider,
} from "./utils/selection";
import { EventsContextProvider } from "./utils/events";
import { PinnedContextProvider, PinnedIdConsumer } from "./utils/pinned";

function App() {
  const [groupByParent, setGroupByParent] = React.useState(false);
  const [showUnmounted, setShowUnmounted] = React.useState(true);
  const [showTimings, setShowTimings] = React.useState(false);

  return (
    <EventsContextProvider>
      <SelectionContextProvider>
        <PinnedContextProvider>
          <SelectedIdConsumer>
            {(selectedId: number | null) => (
              <div
                className="app"
                data-has-selected={selectedId !== null || undefined}
              >
                <FindMatchContextProvider>
                  <Toolbar
                    onGroupingChange={setGroupByParent}
                    groupByParent={groupByParent}
                    onShowUnmounted={setShowUnmounted}
                    showUnmounted={showUnmounted}
                    onShowTimings={setShowTimings}
                    showTimings={showTimings}
                  />

                  <WaitingForReady />

                  <PinnedIdConsumer>
                    {(pinnedId: number) => (
                      <>
                        <FiberTreeHeader
                          rootId={pinnedId}
                          groupByParent={groupByParent}
                          showTimings={showTimings}
                        />
                        <FiberTree
                          rootId={pinnedId}
                          groupByParent={groupByParent}
                          showUnmounted={showUnmounted}
                          showTimings={showTimings}
                        />
                      </>
                    )}
                  </PinnedIdConsumer>
                </FindMatchContextProvider>

                {selectedId !== null && (
                  <Details
                    rootId={selectedId}
                    groupByParent={groupByParent}
                    showUnmounted={showUnmounted}
                    showTimings={showTimings}
                  />
                )}
                <StatusBar />
              </div>
            )}
          </SelectedIdConsumer>
        </PinnedContextProvider>
      </SelectionContextProvider>
    </EventsContextProvider>
  );
}

export default App;

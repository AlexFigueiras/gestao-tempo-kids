import { useState } from "react";
import { ProfileSelector } from "./components/ProfileSelector";
import { PinLock } from "./components/PinLock";
import { ParentDashboard } from "./components/parent/ParentDashboard";
import { ChildDashboard } from "./components/child/ChildDashboard";

type View =
  | { screen: "select" }
  | { screen: "pin" }
  | { screen: "parent" }
  | { screen: "child"; childId: string };

function App() {
  const [view, setView] = useState<View>({ screen: "select" });

  if (view.screen === "select") {
    return (
      <ProfileSelector
        onSelectChild={(childId) => setView({ screen: "child", childId })}
        onSelectParent={() => setView({ screen: "pin" })}
      />
    );
  }

  if (view.screen === "pin") {
    return (
      <PinLock
        onSuccess={() => setView({ screen: "parent" })}
        onCancel={() => setView({ screen: "select" })}
      />
    );
  }

  if (view.screen === "parent") {
    return <ParentDashboard onExit={() => setView({ screen: "select" })} />;
  }

  return <ChildDashboard childId={view.childId} onExit={() => setView({ screen: "select" })} />;
}

export default App;

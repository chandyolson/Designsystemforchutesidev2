import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "./components/app-layout";
import { DashboardScreen } from "./components/dashboard-screen";
import { AnimalsScreen } from "./components/animals-screen";
import { AnimalDetailScreen } from "./components/animal-detail-screen";
import { AddAnimalScreen } from "./components/add-animal-screen";
import { CalvingScreen } from "./components/calving-screen";
import { CalvingDetailScreen } from "./components/calving-detail-screen";
import { AddCalfScreen } from "./components/add-calf-screen";
import { CowWorkScreen } from "./components/cow-work-screen";
import { ProjectDetailScreen } from "./components/project-detail-screen";
import { ProjectAnimalDetailScreen } from "./components/project-animal-detail-screen";
import { RedBookScreen } from "./components/red-book-screen";
import { RedBookEntryScreen } from "./components/red-book-entry-screen";
import { ReferenceScreen } from "./components/reference-screen";
import { DashboardExploreScreen } from "./components/dashboard-explore-screen";
import { FlagColorExplorer } from "./components/flag-color-explorer";
import { GradientExplorer } from "./components/gradient-explorer";
import { ColorExplorer } from "./components/color-explorer";
import { FontExplorer } from "./components/font-explorer";
import { GradientProvider } from "./components/gradient-context";

export default function App() {
  return (
    <GradientProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardScreen />} />
            <Route path="animals" element={<AnimalsScreen />} />
            <Route path="animals/new" element={<AddAnimalScreen />} />
            <Route path="animals/:id" element={<AnimalDetailScreen />} />
            <Route path="calving" element={<CalvingScreen />} />
            <Route path="calving/new" element={<AddCalfScreen />} />
            <Route path="calving/:calfTag" element={<CalvingDetailScreen />} />
            <Route path="cow-work" element={<CowWorkScreen />} />
            <Route path="cow-work/new" element={<ProjectDetailScreen />} />
            <Route path="cow-work/:id" element={<ProjectDetailScreen />} />
            <Route path="cow-work/:id/animal/:animalId" element={<ProjectAnimalDetailScreen />} />
            <Route path="red-book" element={<RedBookScreen />} />
            <Route path="red-book/new" element={<RedBookEntryScreen />} />
            <Route path="red-book/:id" element={<RedBookEntryScreen />} />
            <Route path="reference" element={<ReferenceScreen />} />
            <Route path="dashboard-explore" element={<DashboardExploreScreen />} />
            <Route path="flag-explore" element={<FlagColorExplorer />} />
            <Route path="gradient-explore" element={<GradientExplorer />} />
            <Route path="color-explore" element={<ColorExplorer />} />
            <Route path="font-explore" element={<FontExplorer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GradientProvider>
  );
}
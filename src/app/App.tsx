import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "./components/app-layout";
import { DashboardScreen } from "./components/dashboard-screen";
import { AnimalsScreen } from "./components/animals-screen";
import { AnimalDetailScreen } from "./components/animal-detail-screen";
import { AnimalEditScreen } from "./components/animal-edit-screen";
import { AddAnimalScreen } from "./components/add-animal-screen";
import { CalvingScreen } from "./components/calving-screen";
import { CalvingDetailScreen } from "./components/calving-detail-screen";
import { AddCalfScreen } from "./components/add-calf-screen";
import { CowWorkScreen } from "./components/cow-work-screen";
import { ProjectDetailScreen } from "./components/project-detail-screen";
import { NewProjectScreen } from "./components/new-project-screen";
import { ProjectCloseOutScreen } from "./components/project-close-out-screen";
import { ProjectReportScreen } from "./components/project-report-screen";
import { WorkTemplateListScreen } from "./components/work-template-list-screen";
import { WorkTemplateEditScreen } from "./components/work-template-edit-screen";
import { ProjectAnimalDetailScreen } from "./components/project-animal-detail-screen";
import { RedBookScreen } from "./components/red-book-screen";
import { RedBookEntryScreen } from "./components/red-book-entry-screen";
import { ReferenceScreen } from "./components/reference-screen";
import { DashboardExploreScreen } from "./components/dashboard-explore-screen";
import { FlagColorExplorer } from "./components/flag-color-explorer";
import { GradientExplorer } from "./components/gradient-explorer";
import { ColorExplorer } from "./components/color-explorer";
import { FontExplorer } from "./components/font-explorer";
import { EmptyStateExplorer } from "./components/empty-state-explorer";
import { VoiceInputExplorer } from "./components/voice-input-explorer";
import { MassSelectExplorer } from "./components/mass-select-explorer";
import { SkeletonExplorer } from "./components/skeleton-explorer";
import { SignInScreen } from "./components/sign-in-screen";
import { SignUpScreen } from "./components/sign-up-screen";
import { ForgotPasswordScreen } from "./components/forgot-password-screen";
import { ResetPasswordScreen } from "./components/reset-password-screen";
import { OnboardingScreen } from "./components/onboarding-screen";
import { GradientProvider } from "./components/gradient-context";
import { ToastProvider } from "./components/toast-context";
import { DeleteConfirmProvider } from "./components/delete-confirmation";
import { CalvingDataProvider } from "./components/calving-data-context";

export default function App() {
  return (
    <ToastProvider>
      <DeleteConfirmProvider>
        <CalvingDataProvider>
          <GradientProvider>
            <BrowserRouter>
              <Routes>
                {/* Standalone auth screen — no AppLayout header */}
                <Route path="sign-in" element={<SignInScreen />} />
                <Route path="sign-up" element={<SignUpScreen />} />
                <Route path="forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="reset-password" element={<ResetPasswordScreen />} />
                <Route path="onboarding" element={<OnboardingScreen />} />

                <Route element={<AppLayout />}>
                  <Route index element={<DashboardScreen />} />
                  <Route path="animals" element={<AnimalsScreen />} />
                  <Route path="animals/new" element={<AddAnimalScreen />} />
                  <Route path="animals/:id" element={<AnimalDetailScreen />} />
                  <Route path="animals/:id/edit" element={<AnimalEditScreen />} />
                  <Route path="calving" element={<CalvingScreen />} />
                  <Route path="calving/new" element={<AddCalfScreen />} />
                  <Route path="calving/:calfTag" element={<CalvingDetailScreen />} />
                  <Route path="cow-work" element={<CowWorkScreen />} />
                  <Route path="cow-work/new" element={<NewProjectScreen />} />
                  <Route path="cow-work/templates" element={<WorkTemplateListScreen />} />
                  <Route path="cow-work/templates/new" element={<WorkTemplateEditScreen />} />
                  <Route path="cow-work/templates/:id" element={<WorkTemplateEditScreen />} />
                  <Route path="cow-work/:id" element={<ProjectDetailScreen />} />
                  <Route path="cow-work/:id/close-out" element={<ProjectCloseOutScreen />} />
                  <Route path="cow-work/:id/report" element={<ProjectReportScreen />} />
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
                  <Route path="empty-states" element={<EmptyStateExplorer />} />
                  <Route path="voice-input" element={<VoiceInputExplorer />} />
                  <Route path="mass-select" element={<MassSelectExplorer />} />
                  <Route path="skeletons" element={<SkeletonExplorer />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </GradientProvider>
        </CalvingDataProvider>
      </DeleteConfirmProvider>
    </ToastProvider>
  );
}
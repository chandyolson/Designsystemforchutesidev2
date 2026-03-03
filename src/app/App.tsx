import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { GroupsScreen } from "./components/groups-screen";
import { ReferenceGroupsScreen } from "./components/reference-groups-screen";
import { GroupDetailScreen } from "./components/group-detail-screen";
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
import { ReferenceLocationsScreen } from "./components/reference-locations-screen";
import { ReferenceQuickNotesScreen } from "./components/reference-quick-notes-screen";
import { ReferenceDiseasesScreen } from "./components/reference-diseases-screen";
import { ReferencePreferencesScreen } from "./components/reference-preferences-screen";
import { ReferenceTeamScreen } from "./components/reference-team-screen";
import { ReferenceOperationScreen } from "./components/reference-operation-screen";
import { ReferenceProductsScreen } from "./components/reference-products-screen";
import { ReferenceVetPracticesScreen } from "./components/reference-vet-practices-screen";
import { ReferenceBreedsScreen } from "./components/reference-breeds-screen";
import { UserProfileScreen } from "./components/user-profile-screen";
import { TreatmentEntryScreen } from "./components/treatment-entry-screen";
import { TreatmentHistoryScreen } from "./components/treatment-history-screen";
import { BseExamScreen } from "./components/bse-exam-screen";
import { InventoryCloseOutScreen } from "./components/inventory-close-out-screen";
import { DiseaseDetailScreen } from "./components/disease-detail-screen";
import { ProductDetailScreen } from "./components/product-detail-screen";
import { GradientProvider } from "./components/gradient-context";
import { ToastProvider } from "./components/toast-context";
import { DeleteConfirmProvider } from "./components/delete-confirmation";
import { CalvingDataProvider } from "./components/calving-data-context";
import { AuthProvider } from "./components/auth-context";
import { ProtectedRoute } from "./components/protected-route";

export default function App() {
  return (
    <AuthProvider>
    <ToastProvider>
      <DeleteConfirmProvider>
        <CalvingDataProvider>
          <GradientProvider>
            <BrowserRouter>
              <Routes>
                {/* Standalone auth screens — no AppLayout, no auth gate */}
                <Route path="sign-in" element={<SignInScreen />} />
                <Route path="sign-up" element={<SignUpScreen />} />
                <Route path="forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="reset-password" element={<ResetPasswordScreen />} />
                <Route path="onboarding" element={<OnboardingScreen />} />

                {/* Auth-gated routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="groups" element={<GroupsScreen />} />

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
                    <Route path="cow-work/:id/inventory-close-out" element={<InventoryCloseOutScreen />} />
                    <Route path="cow-work/:id/report" element={<ProjectReportScreen />} />
                    <Route path="cow-work/:id/animal/:animalId" element={<ProjectAnimalDetailScreen />} />
                    <Route path="red-book" element={<RedBookScreen />} />
                    <Route path="red-book/new" element={<RedBookEntryScreen />} />
                    <Route path="red-book/:id" element={<RedBookEntryScreen />} />
                    <Route path="reference" element={<ReferenceScreen />} />
                    <Route path="reference/groups" element={<ReferenceGroupsScreen />} />
                    <Route path="reference/groups/:id" element={<GroupDetailScreen />} />
                    <Route path="reference/locations" element={<ReferenceLocationsScreen />} />
                    <Route path="reference/quick-notes" element={<ReferenceQuickNotesScreen />} />
                    <Route path="reference/diseases" element={<ReferenceDiseasesScreen />} />
                    <Route path="reference/diseases/:diseaseId" element={<DiseaseDetailScreen />} />
                    <Route path="reference/preferences" element={<ReferencePreferencesScreen />} />
                    <Route path="reference/team" element={<ReferenceTeamScreen />} />
                    <Route path="reference/operation" element={<ReferenceOperationScreen />} />
                    <Route path="reference/products" element={<ReferenceProductsScreen />} />
                    <Route path="reference/products/:productId" element={<ProductDetailScreen />} />
                    <Route path="reference/vet-practices" element={<ReferenceVetPracticesScreen />} />
                    <Route path="reference/breeds" element={<ReferenceBreedsScreen />} />
                    <Route path="user-profile" element={<UserProfileScreen />} />
                    <Route path="treatment/new" element={<TreatmentEntryScreen />} />
                    <Route path="treatments" element={<TreatmentHistoryScreen />} />
                    <Route path="bse/new" element={<BseExamScreen />} />
                    <Route path="dev/dashboard-explore" element={<DashboardExploreScreen />} />
                    <Route path="dev/flag-explore" element={<FlagColorExplorer />} />
                    <Route path="dev/gradient-explore" element={<GradientExplorer />} />
                    <Route path="dev/color-explore" element={<ColorExplorer />} />
                    <Route path="dev/font-explore" element={<FontExplorer />} />
                    <Route path="dev/empty-states" element={<EmptyStateExplorer />} />
                    <Route path="dev/voice-input" element={<VoiceInputExplorer />} />
                    <Route path="dev/mass-select" element={<MassSelectExplorer />} />
                    <Route path="dev/skeletons" element={<SkeletonExplorer />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </GradientProvider>
        </CalvingDataProvider>
      </DeleteConfirmProvider>
    </ToastProvider>
    </AuthProvider>
  );
}
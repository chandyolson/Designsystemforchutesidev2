import { createBrowserRouter, RouterProvider } from "react-router";
import { CalvingDataProvider } from "./components/calving-data-context";
import { AuthProvider } from "./components/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import { ToastProvider } from "./components/toast-context";
import { DeleteConfirmProvider } from "./components/delete-confirmation";
import { AppLayout } from "./components/app-layout";

/* ── Lazy-loaded screens ── */
import { DashboardScreen } from "./components/dashboard-screen";
import { AnimalsScreen } from "./components/animals-screen";
import { AddAnimalScreen } from "./components/add-animal-screen";
import { AnimalDetailScreen } from "./components/animal-detail-screen";
import { AnimalEditScreen } from "./components/animal-edit-screen";
import { CalvingScreen } from "./components/calving-screen";
import { AddCalfScreen } from "./components/add-calf-screen";
import { CalvingDetailScreen } from "./components/calving-detail-screen";
import { CowWorkScreen } from "./components/cow-work-screen";
import { NewProjectScreen } from "./components/new-project-screen";
import { ProjectDetailScreen } from "./components/project-detail-screen";
import { ProjectCloseOutScreen } from "./components/project-close-out-screen";
import { ProjectReportScreen } from "./components/project-report-screen";
import { ProjectAnimalDetailScreen } from "./components/project-animal-detail-screen";
import { InventoryCloseOutScreen } from "./components/inventory-close-out-screen";
import { WorkTemplateListScreen } from "./components/work-template-list-screen";
import { WorkTemplateEditScreen } from "./components/work-template-edit-screen";
import { RedBookScreen } from "./components/red-book-screen";
import { RedBookEntryScreen } from "./components/red-book-entry-screen";
import { ReferenceScreen } from "./components/reference-screen";
import { ReferenceGroupsScreen } from "./components/reference-groups-screen";
import { GroupDetailScreen } from "./components/group-detail-screen";
import { ReferenceLocationsScreen } from "./components/reference-locations-screen";
import { ReferenceQuickNotesScreen } from "./components/reference-quick-notes-screen";
import { ReferenceDiseasesScreen } from "./components/reference-diseases-screen";
import { DiseaseDetailScreen } from "./components/disease-detail-screen";
import { ReferencePreferencesScreen } from "./components/reference-preferences-screen";
import { ReferenceTeamScreen } from "./components/reference-team-screen";
import { ReferenceOperationScreen } from "./components/reference-operation-screen";
import { ReferenceProductsScreen } from "./components/reference-products-screen";
import { ProductDetailScreen } from "./components/product-detail-screen";
import { ReferenceVetPracticesScreen } from "./components/reference-vet-practices-screen";
import { ReferenceBreedsScreen } from "./components/reference-breeds-screen";
import { TreatmentEntryScreen } from "./components/treatment-entry-screen";
import { TreatmentHistoryScreen } from "./components/treatment-history-screen";
import { BseExamScreen } from "./components/bse-exam-screen";
import { GroupsScreen } from "./components/groups-screen";
import { UserProfileScreen } from "./components/user-profile-screen";
import { SignInScreen } from "./components/sign-in-screen";
import { SignUpScreen } from "./components/sign-up-screen";
import { ForgotPasswordScreen } from "./components/forgot-password-screen";
import { ResetPasswordScreen } from "./components/reset-password-screen";
import { OnboardingScreen } from "./components/onboarding-screen";
import { DashboardExploreScreen } from "./components/dashboard-explore-screen";

const router = createBrowserRouter([
  /* ── Public auth routes ── */
  { path: "/sign-in", Component: SignInScreen },
  { path: "/sign-up", Component: SignUpScreen },
  { path: "/forgot-password", Component: ForgotPasswordScreen },
  { path: "/reset-password", Component: ResetPasswordScreen },
  { path: "/onboarding", Component: OnboardingScreen },

  /* ── Protected app shell ── */
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          /* Dashboard */
          { path: "/", Component: DashboardScreen },

          /* Animals */
          { path: "/animals", Component: AnimalsScreen },
          { path: "/animals/new", Component: AddAnimalScreen },
          { path: "/animals/:id", Component: AnimalDetailScreen },
          { path: "/animals/:id/edit", Component: AnimalEditScreen },

          /* Calving */
          { path: "/calving", Component: CalvingScreen },
          { path: "/calving/new", Component: AddCalfScreen },
          { path: "/calving/:id", Component: CalvingDetailScreen },

          /* Cow Work */
          { path: "/cow-work", Component: CowWorkScreen },
          { path: "/cow-work/new", Component: NewProjectScreen },
          { path: "/cow-work/templates", Component: WorkTemplateListScreen },
          { path: "/cow-work/templates/new", Component: WorkTemplateEditScreen },
          { path: "/cow-work/templates/:id", Component: WorkTemplateEditScreen },
          { path: "/cow-work/:id", Component: ProjectDetailScreen },
          { path: "/cow-work/:id/close-out", Component: ProjectCloseOutScreen },
          { path: "/cow-work/:id/inventory-close-out", Component: InventoryCloseOutScreen },
          { path: "/cow-work/:id/report", Component: ProjectReportScreen },
          { path: "/cow-work/:id/animal/:animalId", Component: ProjectAnimalDetailScreen },

          /* Red Book */
          { path: "/red-book", Component: RedBookScreen },
          { path: "/red-book/new", Component: RedBookEntryScreen },
          { path: "/red-book/:id", Component: RedBookEntryScreen },

          /* Reference */
          { path: "/reference", Component: ReferenceScreen },
          { path: "/reference/groups", Component: ReferenceGroupsScreen },
          { path: "/reference/groups/:id", Component: GroupDetailScreen },
          { path: "/reference/locations", Component: ReferenceLocationsScreen },
          { path: "/reference/quick-notes", Component: ReferenceQuickNotesScreen },
          { path: "/reference/diseases", Component: ReferenceDiseasesScreen },
          { path: "/reference/diseases/:id", Component: DiseaseDetailScreen },
          { path: "/reference/preferences", Component: ReferencePreferencesScreen },
          { path: "/reference/team", Component: ReferenceTeamScreen },
          { path: "/reference/operation", Component: ReferenceOperationScreen },
          { path: "/reference/products", Component: ReferenceProductsScreen },
          { path: "/reference/products/:id", Component: ProductDetailScreen },
          { path: "/reference/vet-practices", Component: ReferenceVetPracticesScreen },
          { path: "/reference/breeds", Component: ReferenceBreedsScreen },

          /* Treatment / BSE */
          { path: "/treatment/new", Component: TreatmentEntryScreen },
          { path: "/treatments", Component: TreatmentHistoryScreen },
          { path: "/bse/new", Component: BseExamScreen },

          /* Groups */
          { path: "/groups", Component: GroupsScreen },

          /* User Profile */
          { path: "/user-profile", Component: UserProfileScreen },

          /* Dev / Exploration */
          { path: "/dev/dashboard-explore", Component: DashboardExploreScreen },
        ],
      },
    ],
  },
]);

// Main application component
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DeleteConfirmProvider>
          <CalvingDataProvider>
            <RouterProvider router={router} />
          </CalvingDataProvider>
        </DeleteConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
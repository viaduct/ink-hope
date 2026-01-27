import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TimeCapsuleMain from "./pages/TimeCapsuleMain";
import TimeCapsuleDetail from "./pages/TimeCapsuleDetail";
import TimeCapsuleCreate from "./pages/TimeCapsuleCreate";
import TimeCapsuleEdit from "./pages/TimeCapsuleEdit";
import TimeCapsuleWrite from "./pages/TimeCapsuleWrite";
import TimeCapsuleWriteB from "./pages/TimeCapsuleWriteB";
import AboutTimeCapsule from "./pages/AboutTimeCapsule";
import MyOrangeTree from "./pages/MyOrangeTree";
import ReviewWrite from "./pages/ReviewWrite";
import MyPage from "./pages/MyPage";

const queryClient = new QueryClient();

// 인증 없이 바로 접근 가능
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// /auth 접근 시 메인으로 리다이렉트
function PublicRoute({ children }: { children: React.ReactNode }) {
  return <Navigate to="/" replace />;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                }
              />
              <Route
                path="/time-capsule"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-capsule/create"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-capsule/:id/edit"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-capsule/:id/write"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleWrite />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-capsule/:id/write-b"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleWriteB />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-capsule/:id"
                element={
                  <ProtectedRoute>
                    <TimeCapsuleDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about/time-capsule"
                element={
                  <ProtectedRoute>
                    <AboutTimeCapsule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orange-tree/:id"
                element={
                  <ProtectedRoute>
                    <MyOrangeTree />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute>
                    <ReviewWrite />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mypage"
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

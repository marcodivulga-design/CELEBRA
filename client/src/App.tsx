import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import CatalogoMusical from "./pages/CatalogoMusical";
import Celebracoes from "./pages/Celebracoes";
import Ministerio from "./pages/Ministerio";
import HistoricoCelebracoes from "./pages/HistoricoCelebracoes";
import Leituras from "./pages/Leituras";
import Equipes from "./pages/Equipes";
import Exportacao from "./pages/Exportacao";

import Admin from "./pages/Admin";
import Noticias from "./pages/Noticias";
import PriestAudio from "./pages/PriestAudio";
import CatholicBlog from "./pages/CatholicBlog";
import SaintsCalendar from "./pages/SaintsCalendar";
import { ChatRoom } from "./pages/ChatRoom";
import { MusicSuggestions } from "./pages/MusicSuggestions";
import { PriestSpace } from "./pages/PriestSpace";
import { SpotifySearch } from "./components/SpotifySearch";
import { LayoutWithTopNav } from "./components/LayoutWithTopNav";

import { ChurchHierarchy } from "./pages/ChurchHierarchy";
import { CityChurches } from "./pages/CityChurches";
import { ChurchesMap } from "./pages/ChurchesMap";



import AdvancedSearch from "./pages/AdvancedSearch";
import { PlaybackHistory } from "./pages/PlaybackHistory";
import { SpotifySync } from "./pages/SpotifySync";
import HomeHero from "./pages/HomeHero";
import ChurchGalleryPage from "./pages/ChurchGalleryPage";
import DonationsMarketplacePage from "./pages/DonationsMarketplacePage";
import CatalogoMusicalDinamico from "./pages/CatalogoMusicalDinamico";
import SpotifyIntegration from "./pages/SpotifyIntegration";
import { PastoralMessagePage } from "./pages/PastoralMessagePage";
import DashboardEstatisticas from "./pages/DashboardEstatisticas";
import SunoAIIntegration from "./pages/SunoAIIntegration";
import CelebrationScheduling from "./pages/CelebrationScheduling";
import { NotificationSettingsPage } from "./pages/NotificationSettingsPage";
import { AdvancedAnalyticsDashboard } from "./pages/AdvancedAnalyticsDashboard";
import { WhatsAppTelegramIntegration } from "./pages/WhatsAppTelegramIntegration";
import { CalendarioLiturgico } from "./pages/CalendarioLiturgico";
import { BadgesAchievements } from "./pages/BadgesAchievements";
import { CommunityFeed } from "./pages/CommunityFeed";
import MinistriesPage from "./pages/MinistriesPage";
import RehearsalsPage from "./pages/RehearsalsPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsReports from "./pages/AnalyticsReports";
import LiturgicalCalendarPage from "./pages/LiturgicalCalendarPage";
import { EventbriteIntegration } from "./pages/EventbriteIntegration";
import { RecurringDonations } from "./pages/RecurringDonations";
import { TestimonialsSuccessCases } from "./pages/TestimonialsSuccessCases";
import { WhatsAppBusinessIntegration } from "./pages/WhatsAppBusinessIntegration";
import { AffiliateSystem } from "./pages/AffiliateSystem";
import { MobileAppReactNative } from "./pages/MobileAppReactNative";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={HomeHero} />
      <Route path={"/preview-hero"} component={HomeHero} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/catalogo"} component={CatalogoMusical} />
      <Route path={"/celebracoes"} component={Celebracoes} />
      <Route path={"/ministerio"} component={Ministerio} />
      <Route path={"/historico"} component={HistoricoCelebracoes} />
      <Route path={"/leituras"} component={Leituras} />
      <Route path={"/equipes"} component={Equipes} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/noticias"} component={Noticias} />
      <Route path={"/priest-audio"} component={PriestAudio} />
      <Route path={"/catholic-blog"} component={CatholicBlog} />
      <Route path={"/saints-calendar"} component={SaintsCalendar} />
      <Route path={"/exportacao"} component={Exportacao} />
      <Route path={"/chat"} component={ChatRoom} />
      <Route path={"/sugestoes"} component={MusicSuggestions} />
      <Route path={"/espaco-padres"} component={PriestSpace} />
      <Route path={"/spotify-search"} component={SpotifySearch} />
      <Route path={"/church-hierarchy"} component={ChurchHierarchy} />
      <Route path={"/city-churches"} component={CityChurches} />
      <Route path={"/churches-map"} component={ChurchesMap} />


      <Route path={"/advanced-search"} component={AdvancedSearch} />
      <Route path={"/playback-history"} component={PlaybackHistory} />
      <Route path={"/spotify-sync"} component={SpotifySync} />
      <Route path={"/igrejas"} component={ChurchGalleryPage} />
      <Route path={"/doacoes"} component={DonationsMarketplacePage} />
      <Route path={"/catalogo-dinamico"} component={CatalogoMusicalDinamico} />
      <Route path={"/spotify"} component={SpotifyIntegration} />
      <Route path={"/espaco-padres"} component={PastoralMessagePage} />
      <Route path={"/dashboard-estatisticas"} component={DashboardEstatisticas} />
      <Route path={"/suno-ai"} component={SunoAIIntegration} />
      <Route path={"/agendamento-celebracoes"} component={CelebrationScheduling} />
      <Route path={"/configuracoes-notificacoes"} component={NotificationSettingsPage} />
      <Route path={"/analytics-avancado"} component={AdvancedAnalyticsDashboard} />
      <Route path={"/whatsapp-telegram"} component={WhatsAppTelegramIntegration} />
      <Route path={"/calendario-liturgico"} component={CalendarioLiturgico} />
      <Route path={"/badges-achievements"} component={BadgesAchievements} />
      <Route path={"/comunidade"} component={CommunityFeed} />
      <Route path={"/ministerios"} component={MinistriesPage} />
      <Route path={"/ensaios"} component={RehearsalsPage} />
      <Route path={"/playlists"} component={PlaylistsPage} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/analytics"} component={AnalyticsReports} />
      <Route path={"/calendario-liturgico"} component={LiturgicalCalendarPage} />
      <Route path={"/venda-ingressos"} component={EventbriteIntegration} />
      <Route path={"/doacoes-recorrentes"} component={RecurringDonations} />
      <Route path={"/casos-sucesso"} component={TestimonialsSuccessCases} />
      <Route path={"/whatsapp-business"} component={WhatsAppBusinessIntegration} />
      <Route path={"/afiliados"} component={AffiliateSystem} />
      <Route path={"/mobile-app"} component={MobileAppReactNative} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <LayoutWithTopNav>
            <Router />
          </LayoutWithTopNav>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

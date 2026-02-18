import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NewHome from "./pages/NewHome";
import FloorPlans from "./pages/FloorPlans";
import Contact from "./pages/Contact";
import Budget from "./pages/Budget";
import Gallery from "./pages/Gallery";
import Progress from "./pages/Progress";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path={"/"} component={NewHome} />
        <Route path={"/floor-plans"} component={FloorPlans} />
        <Route path={"/budget"} component={Budget} />
        <Route path={"/gallery"} component={Gallery} />
        <Route path={"/progress"} component={Progress} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

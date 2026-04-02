import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
<<<<<<< HEAD
=======
import Projects from "@/pages/Projects";
>>>>>>> 7b82d10ed17bf03cdec81f5b5651510584054c53

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
<<<<<<< HEAD
=======
      <Route path="/projects" component={Projects} />
>>>>>>> 7b82d10ed17bf03cdec81f5b5651510584054c53
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

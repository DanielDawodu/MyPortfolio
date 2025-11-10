import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <h1
            data-testid="text-setup-message"
            className="text-4xl md:text-5xl font-bold text-center text-foreground"
          >
            Portfolio setup complete 💻
          </h1>
        </div>
      </main>
    </div>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import WhoItsFor from "@/components/WhoItsFor";
import InteractivePlanner from "@/components/planner/InteractivePlanner";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <InteractivePlanner />
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <WhoItsFor />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

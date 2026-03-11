import React from "react";
import Hero from "../components/landing/Hero";
import { useAuth } from "../context/AuthContext";
import LandingNav from "../components/landing/LandingNav";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";
import Payments from "../components/landing/Payments";
import CustomerLogos from "../components/landing/CustomerLogos";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <LandingNav />
        <Hero />
        <Features />
        <Payments />
        <CustomerLogos />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

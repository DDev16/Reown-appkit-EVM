// Home.js
import Hero from "@/components/sections/hero";
import FeaturesSection from "@/components/sections/features";
import MembershipTiers from "@/components/sections/membership";
import Blog from "@/components/sections/blog";
import HeroFeatures from "@/components/sections/hero-features";
import Stats from "@/components/sections/stats";
import FAQ from "@/components/sections/FAQ";
import TechStack from "@/components/sections/techStack";
// import Partners from "@/components/sections/partners";
import Flare from "@/components/sections/flare";

import SweepstakesComingSoon from "@/components/sections/sweepstakes";
import RoadmapComingSoon from "@/components/sections/coming";
import Roadmap from "@/components/sections/roadmap";
import AboutSection from "@/components/sections/about";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <AboutSection />
      <FeaturesSection />
      <MembershipTiers />
      <SweepstakesComingSoon />
      <TechStack />
      <Flare />
      {/* <Partners /> */}

      {/* <Roadmap /> */}

      <FAQ />
      <Blog />
    </main>
  );
}
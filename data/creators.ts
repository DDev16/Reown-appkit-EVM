// File: @/data/creators.ts

export interface Creator {
    name: string;
    image: string;
    contentType: string;
    bio: string;
    specialization: string;
    socials: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      discord?: string;
    };
  }
  
  export const creators: Creator[] = [
   // DeFi Educators
   {
    name: "Defi Bull",
    image: "/contributors/DB.jpg",
    contentType: "Founder",
    bio: "Founder of DeFi Bull, a leading DeFi education platform. Focuses on simplifying complex DeFi concepts for beginners and advanced users.",
    specialization: "Tier 1 Contributor",
    socials: {
      twitter: "https://twitter.com/michaelchen",
      discord: "https://discord.gg/defi-simplified"
    }
  },
  {
    name: "Dan Rocky",
    image: "/contributors/dan.jpg",
    contentType: "Tech Specialist",
    bio: "Dancocky is an Flare Network subject matter expert, SME, and has been involved in the Flare community since go-live on main net January 2023, but Dancocky has more than 10 years experience within the crypto industry within the BTC, ETH and XRP communities. Dancocky has been supporting the Flare community in various ways, from facilitating community X spaces to running his own YouTube channel focusing on Flare Networks. Dancocky has a wide profile which includes technical blockchain knowledge, specifically for Flare Network and the ecosystem.",
    specialization: "Tier 1 Contributor",
    socials: {
      twitter: "https://twitter.com/liwei_defi",
      github: "https://github.com/liwei-analytics"
    }
  },
    {
      name: "Staaal Staalesen",
      image: "/contributors/Staaal.png",
      contentType: "Graphic Designer",
      bio: "I’m a graphic designer interested in crypto, especially the Flare Network. I’ve been in the space since 2021, always learning and keeping up with the latest trends. I love mixing creativity with blockchain to bring ideas to life.",
      specialization: "Tier 1 Contributor",
      socials: {
        twitter: "https://twitter.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson"
      }
    },
    {
      name: "Anubis",
      image: "/contributors/Anubis.png",
      contentType: "Crypto Entusiast",
      bio: "Enthusiast of crypto from Poland, in the space since 2022 – I bring a fresh yet analytical perspective. By day, I optimize logistics processes, which fuels my drive to find efficient solutions in blockchain and AI. I see Flare as a 3rd-generation blockchain that, through decentralization, can bridge Web 2 and Web 3, freeing us from centralized systems. I write to break down the crypto world for everyone, not just coders.",
      specialization: "Tier 1 Contributor",
      socials: {
        twitter: "https://twitter.com/alexrivera",
        github: "https://github.com/alexrivera"
      }
    },
  
    // {
    //   name: "Priya Sharma",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Course Creator",
    //   bio: "Creator of comprehensive DeFi courses covering everything from basics to advanced yield strategies. Taught over 50,000 students globally.",
    //   specialization: "Tier 1 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/priyadefi",
    //     linkedin: "https://linkedin.com/in/priyasharma"
    //   }
    // },
    // {
    //   name: "Jamal Washington",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Podcaster & Educator",
    //   bio: "Host of 'DeFi Decoded' podcast interviewing protocol founders and DeFi innovators. Focuses on making DeFi accessible to mainstream audiences.",
    //   specialization: "Tier 1 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/jamaldefi",
    //     discord: "https://discord.gg/defidecoded"
    //   }
    // },
    
    // // Tier 2 Contributor",
    // {
    //   name: "Elena Rodriguez",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Market Analyst",
    //   bio: "Former Wall Street analyst providing institutional-grade DeFi market insights. Weekly newsletter with 15K+ subscribers focused on macro trends.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/elena_markets",
    //     linkedin: "https://linkedin.com/in/elenarodriguez"
    //   }
    // },
    // {
    //   name: "Thomas Wright",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Newsletter Writer",
    //   bio: "Connecting TradFi market movements with DeFi implications. Known for contrarian takes and spotting early market shifts across crypto ecosystems.",
    //   specialization: "Tier 2 Contributo",
    //   socials: {
    //     twitter: "https://twitter.com/thomaswright",
    //     discord: "https://discord.gg/wright-insights"
    //   }
    // },
    // {
    //   name: "Sophia Park",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Real-time Analyst",
    //   bio: "Live Tier 2 Contributor and rapid response analysis during major market events. Previously led research at a top crypto fund.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/sophia_defi",
    //     linkedin: "https://linkedin.com/in/sophiapark"
    //   }
    // },
    
    // // Technical Analysts
    // {
    //   name: "Marcus Johnson",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Technical Chart Analyst",
    //   bio: "Applying traditional TA to DeFi tokens and yield curves. Creates daily chart breakdowns with high accuracy rate for major DeFi assets.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/marcus_charts",
    //     discord: "https://discord.gg/defi-charts"
    //   }
    // },
    // {
    //   name: "Aisha Nkosi",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Quant Researcher",
    //   bio: "Developing quantitative models for DeFi yield optimization. Publishes papers on novel approaches to impermanent loss mitigation.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/aisha_quant",
    //     github: "https://github.com/aishanquant"
    //   }
    // },
    
    // // Protocol Reviewers
    // {
    //   name: "David Kim",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Protocol Reviewer",
    //   bio: "Deep dive analyses of DeFi protocol mechanics, tokenomics, and security considerations. Known for identifying potential vulnerabilities.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/davidkim_defi",
    //     github: "https://github.com/davidkim"
    //   }
    // },
    // {
    //   name: "Olivia Chen",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Tokenomics Specialist",
    //   bio: "Focusing on incentive structures and economic sustainability of DeFi protocols. Creator of the Tokenomics Health Index used by major investors.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/oliviachen_defi",
    //     linkedin: "https://linkedin.com/in/oliviachen"
    //   }
    // },
    
    // // DeFi News/Journalism
    // {
    //   name: "Carlos Mendez",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "DeFi Journalist",
    //   bio: "Breaking DeFi news and exclusive interviews with founders. Former tech journalist who transitioned to crypto in 2017, now running DeFiDaily.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/carlos_defi",
    //     discord: "https://discord.gg/defidaily"
    //   }
    // },
    // {
    //   name: "Zoe Anderson",
    //   image: "/assets/flareLogo1.png",
    //   contentType: "Investigative Reporter",
    //   bio: "Specializing in DeFi investigations and on-chain forensics. Known for exposing several major protocol exploits and following the money trail.",
    //   specialization: "Tier 2 Contributor",
    //   socials: {
    //     twitter: "https://twitter.com/zoe_onchain",
    //     github: "https://github.com/zoeanderson"
    //   }
    // }
  ];
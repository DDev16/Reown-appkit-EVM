import natural from 'natural';
import Fuse from 'fuse.js';

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Define types
type Topic = {
  id: string;
  keywords: string[];
  questions: string[];
  content: string;
};

type NLPMatch = {
  topic: Topic;
  matches: number;
};

// Knowledge base for the chatbot
export const knowledgeBase = {
  topics: [
    {
      id: 'nft_tiers',
      keywords: ['nft', 'membership', 'tier', 'levels', 'membership levels'],
      questions: [
        'What NFT tiers do you offer?',
        'What are your membership levels?',
        'Tell me about your tier structure',
        'What are the different tiers?'
      ],
      content: `DeFi Bull World offers a comprehensive range of NFT membership tiers:

1. Top Tier: The ultimate experience
   - Exclusive Tier
   - Premium access & most comprehensive benefits

2. Rhodium Tier: Premium membership
   - Premium access to advanced features
   - Dedicated support

3. Platinum Tier: Elite membership
   - Enhanced capabilities
   - Priority access

4. Gold Tier: Professional membership
   - Advanced features and benefits
   - Professional-level access

5. Ruthenium Tier: Advanced membership
   - Exclusive features
   - Advanced-level benefits

6. Iridium Tier: Starter membership
   - Perfect starting point for your DBW journey
   - Foundational access

7. Osmium Tier: Entry-level membership
   - Essential features to begin your DBW experience
   - Basic comprehensive access

8. Palladium Tier: Advanced basic tier
   - Basic access to fundamental DBW features
   - Additional supplementary benefits

9. Rhenium Tier: Basic membership
   - Basic access to fundamental DBW features
   - Core membership benefits

10. Silver Tier: Ultra Basic membership
    - Ultra basic access
    - Fundamental DBW features

Each tier is designed to provide progressively more advanced features, support, and opportunities in the DeFi space.`
    },
    {
      id: 'nft_basics',
      keywords: ['nft', 'membership', 'token', 'mint', 'holder'],
      questions: [
        'What are your NFT tiers?',
        'How do I mint an NFT?',
        'What benefits do holders get?'
      ],
      content: 'Our NFT membership program offers exclusive access to DeFi education and trading signals across multiple tier levels.'
    },
    {
      id: 'pricing',
      keywords: ['price', 'cost', 'worth', 'expensive', 'cheap', 'fee', 'nft price'],
      questions: [
        'How much does it cost?',
        'What are the membership prices?',
        'How much is each NFT tier?'
      ],
      content: 'Pricing varies by tier. The Top Tier offers the most comprehensive benefits, while the Silver Tier provides basic access. Specific pricing details can be found on our official website or by contacting our sales team.'
    },
    {
      id: 'trading',
      keywords: ['trade', 'signal', 'alert', 'market', 'analysis'],
      questions: [
        'What trading signals do you provide?',
        'How often do you send alerts?',
        'What kind of market analysis do you offer?'
      ],
      content: 'We provide daily trading signals and market analysis for various DeFi protocols. The depth and frequency of signals increase with higher-tier memberships.'
    },
  ] as Topic[]
};

// Initialize Fuse for fuzzy searching
const fuseOptions = {
  keys: ['questions', 'keywords'],
  includeScore: true,
  threshold: 0.4,
  distance: 100
};

const fuse = new Fuse(knowledgeBase.topics, fuseOptions);

// Process user input
export function processUserInput(input: string): Topic | null {
  // Tokenize and stem the input
  const tokens = tokenizer.tokenize(input.toLowerCase()) || [];
  const stems = tokens.map(token => stemmer.stem(token));

  // Perform fuzzy search
  const fuseResults = fuse.search(input);
  
  // Get NLP matches using stemming
  const nlpMatches = knowledgeBase.topics.map(topic => {
    const keywordMatches = topic.keywords
      .map(keyword => stemmer.stem(keyword))
      .filter(stem => stems.includes(stem));
    return {
      topic,
      matches: keywordMatches.length
    };
  });

  // Find the best NLP match
  const bestNlpMatch = nlpMatches.reduce<NLPMatch>((max, curr) => 
    curr.matches > max.matches ? curr : max, 
    { topic: knowledgeBase.topics[0], matches: 0 }
  );

  // Use the best match from either method
  if (fuseResults.length > 0 && fuseResults[0].score !== undefined && fuseResults[0].score < 0.4) {
    return fuseResults[0].item;
  }
  
  if (bestNlpMatch.matches > 0) {
    return bestNlpMatch.topic;
  }

  return null;
}
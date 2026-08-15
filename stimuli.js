/**
 * STIMULUS PAIRS — Human vs. AI authorship
 * ==========================================
 * Each pair = the same topic, written two independent ways:
 *   - human: written by you, from memory, cold — no source open, nothing
 *            to look up. Free composition, not summarization.
 *   - ai:    written by an LLM (e.g. ChatGPT), in a FRESH chat, given only
 *            the bare topic — never shown your sentence, never asked to
 *            summarize a specific source paragraph.
 *
 * Protocol (follow this for every pair):
 *   1. Pick a plain factual topic you already know, nothing open to consult.
 *   2. Write your sentence cold, ~15-20 words, on the spot.
 *   3. Only after that's saved, open a fresh LLM chat and prompt with just
 *      the topic: "Write one sentence, ~15-20 words, explaining what
 *      [topic] is." Don't show it your sentence.
 *   4. Trim both to within ~2-3 words of each other in length. Don't touch
 *      wording/structure beyond that — the natural stylistic difference
 *      between the two is what's being tested, not something to remove.
 *   5. Reject the pair if you realize you were half-recalling a specific
 *      source while writing your side — pick a different topic instead.
 *
 * After drafting the full set, read them all together and check whether
 * one side has a systematic structural tell (e.g. AI side always lists
 * things, human side never does) showing up in more than about half your
 * pairs — if so, note it honestly as a possible confound in your write-up.
 *
 * id: unique short string, kept stable across the exported data.
 */

const STIMULUS_PAIRS = [
  {
    id: "p01_money",
    human: "Money refers to a means of payment for goods and services, as agreed upon by all parties.",
    ai: "Money is anything generally accepted as payment for goods, services, and settling debts.",
  },

  {
    id: "p02_paper",
    human: "Paper is a thin sheet made from compressed wood on which one may write or print words, images, etc.",
    ai: "Paper is a thin material made from wood pulp, used for writing, printing, drawing, or packaging.",
  },

  {
    id: "p03_shakespeare",
    human: "William Shakespeare was an Elizabethan playwright, with notable works including Romeo and Juliet, Hamlet, Macbeth.",
    ai: "Shakespeare was an influential English playwright and poet, famous for tragedies, comedies, and historical plays.",
  },

  {
    id: "p04_haiku",
    human: "A haiku is a three-line poem, often about nature, with a 5-7-5 syllable pattern, originating in Japan.",
    ai: "A haiku is a three-line Japanese poem with a 5-7-5 syllable pattern, often about nature.",
  },

  {
    id: "p05_nature",
    human: "The natural environment refers to all biotic and abiotic components that are not artificial.",
    ai: "The natural environment includes all living and non-living things occurring naturally around us.",
  },

  {
    id: "p06_mango",
    human: "A mango is a sweet fruit that ripens in the summer, with different varieties found all across the world.",
    ai: "A mango is a sweet, juicy tropical fruit with soft flesh, a large seed, and fragrant flavor.",
  },

  {
    id: "p07_balloon",
    human: "A balloon is an inflatable object, often spherical and made of rubber, used as decoration.",
    ai: "A balloon is an inflatable object that becomes filled with air or gas and floats or expands.",
  },

  {
    id: "p08_boxing",
    human: "Boxing is a combat sport with two players who earn points by fighting under certain pre-established rules.",
    ai: "Boxing is a combat sport where two opponents fight using gloved fists under specific rules.",
  },

  {
    id: "p09_suitcase",
    human: "A suitcase is a wheeled trunk that is mostly used to transport clothes and other personal items.",
    ai: "A suitcase is a portable case used to carry clothes and other belongings while traveling.",
  },

  {
    id: "p10_france",
    human: "France is a country in Western Europe with its capital in Paris, famous for the Eiffel Tower.",
    ai: "France is a European country known for its rich history, culture, cuisine, art, and iconic landmarks.",
  },

  {
    id: "p11_custard",
    human: "Custard is a creamy dessert traditionally made by cooking whole milk with yolks, vanilla, and sugar.",
    ai: "Custard is a sweet, creamy dessert made by thickening milk or cream with eggs, sugar, and flavorings.",
  },

  {
    id: "p12_corset",
    human: "A corset is a supportive garment worn primarily by women, as a predecessor to the brassiere.",
    ai: "A corset is a fitted garment worn to shape and support the waist, torso, and bust.",
  },

  {
    id: "p13_broguing",
    human: "Broguing refers to artistic designs punched into leather shoes, specifically dress shoes.",
    ai: "Broguing is decorative perforation and punched detailing applied to leather footwear, especially traditionally on dress shoes.",
  },

  {
    id: "p14_fiddle",
    human: "The fiddle is a variation of the violin, often used to play fast-paced and upbeat tunes.",
    ai: "A fiddle is a bowed string instrument, commonly used in folk and traditional music.",
  },

  {
    id: "p15_myopia",
    human: "Myopia, or short-sightedness, is a medical condition where one cannot clearly see far away objects.",
    ai: "Myopia is a vision condition where distant objects appear blurry because light focuses in front of the retina.",
  },

  {
    id: "p16_silk",
    human: "Silk is a soft, shiny fabric derived from the cocoon of a silkworm.",
    ai: "Silk is a soft, strong, shiny natural fiber produced by silkworms to make their cocoons.",
  },
];

// Practice pairs — shown once before the real blocks, NOT included in analysis.
// Keep these obviously distinct so participants understand the task before
// the real trials start.
const PRACTICE_PAIRS = [
  {
    id: "practice_1",
    human: "My dog refuses to walk past the neighbor's cat without stopping to stare at it.",
    ai: "Many dogs display heightened attentiveness when encountering unfamiliar animals during walks.",
  },
];
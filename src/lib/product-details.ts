/**
 * Old WooCommerce product URLs redirect to the new pages via next.config.ts
 * (LEGACY_PRODUCT_SLUGS). Keep that map updated if a slug below changes.
 *
 * Editorial content for every DNYC product: names, slugs, and the copy shown
 * on product pages. This is the source of truth for anything a shopper reads;
 * prices, sizes, SKUs and stock come from products-snapshot.json.
 *
 * House rules for this file:
 *  - No CBD, hemp, cannabis or "sativa" references anywhere. The line was
 *    reformulated; labels and copy no longer mention them.
 *  - Keep claims to what the label says (color safe, paraben & sulfate free,
 *    ingredients, hair type). No medical claims.
 */

export type KeyIngredient = { name: string; why: string };

export type ProductDetail = {
  /** URL segment under /shop/ */
  slug: string;
  /** Clean display name (overrides the WooCommerce title) */
  name: string;
  /** Short line under the name, e.g. "Sulfate-free moisturizing shampoo" */
  tagline: string;
  /** Who it's for */
  hairType: string;
  /** 2–3 sentence description shown at the top of the page and in cards */
  summary: string;
  /** Bullet benefits */
  benefits: string[];
  /** Step-by-step directions */
  howToUse: string[];
  /** Hero ingredients with a one-line reason */
  keyIngredients: KeyIngredient[];
  /** Label badges */
  badges: string[];
  /** Product ids that pair well (shown as "Goes well with") */
  pairsWith: number[];
};

const CLEAN = ["Color Safe", "Paraben Free", "Sulfate Free"];

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  /* ------------------------------------------------------------ */
  /* Shampoos                                                       */
  /* ------------------------------------------------------------ */
  21984: {
    slug: "color-protect-shampoo",
    name: "Color Protect P.I. Shampoo",
    tagline: "Gentle color-safe cleanser that keeps your color vibrant",
    hairType: "Color-treated hair (permanent or demi-permanent color)",
    summary:
      "Your color is an investment. Color Protect P.I. Shampoo gently lifts product build-up and residue from chemical services without stripping natural oils, so color stays true longer and hair is left soft, shiny and bouncy.",
    benefits: [
      "Helps color last longer and stay vibrant",
      "Cleanses hair and scalp without stripping",
      "Enriched with kiwi fruit extract and ginseng root",
      "Made with our proprietary P.I. Protection Technology",
    ],
    howToUse: [
      "Wet hair thoroughly and apply a quarter-size amount to the scalp.",
      "Massage into a lather, working down to the ends.",
      "Rinse well. Repeat if hair is heavily styled.",
      "Follow with Color Protect P.I. Conditioner.",
    ],
    keyIngredients: [
      { name: "Kiwi Fruit Extract", why: "Rich in vitamins C and E to help protect color from environmental stress." },
      { name: "Ginseng Root", why: "Traditionally used to energize the scalp and support healthy-looking hair." },
    ],
    badges: CLEAN,
    pairsWith: [21985, 38421],
  },
  21978: {
    slug: "silver-screen-shampoo",
    name: "Silver Screen Shampoo",
    tagline: "Violet toning shampoo for blonde, silver and gray hair",
    hairType: "Blonde, highlighted, silver and gray hair",
    summary:
      "Silver Screen is our ultra-violet shampoo for cool, brass-free blondes. It removes dirt, oil and product while neutralizing the yellow and orange tones that creep into lightened and gray hair between salon visits.",
    benefits: [
      "Eliminates brassiness, yellow and orange tones",
      "Cleanses dirt, oils and cosmetics",
      "Vegan and cruelty free",
      "Contains certified organic extracts",
    ],
    howToUse: [
      "Apply to wet hair and lather from roots to ends.",
      "Leave on 1 to 3 minutes depending on how much toning you want (longer for more).",
      "Rinse thoroughly and follow with Silver Screen Conditioner.",
      "Use once or twice a week in place of your regular shampoo.",
    ],
    keyIngredients: [
      { name: "Violet Pigments", why: "Sit opposite yellow on the color wheel to cancel brassiness." },
      { name: "Certified Organic Extracts", why: "Gentle botanical cleansing that respects lightened hair." },
    ],
    badges: ["Vegan", ...CLEAN],
    pairsWith: [21979, 21988],
  },
  21976: {
    slug: "just-chill-shampoo",
    name: "Just Chill Moisturizing Shampoo",
    tagline: "Essential-oil shampoo for a calm scalp and soft, healthy hair",
    hairType: "All hair types, especially dry or tight-feeling scalps",
    summary:
      "Just Chill is a moisturizing shampoo built around a blend of eight essential oils. Rich in omega-3, 6 and 9 and containing all 21 amino acids, the building blocks of protein, it cleanses while helping strengthen and protect hair from root to end.",
    benefits: [
      "Helps improve the health of hair and scalp",
      "Enriched with 8 essential oils",
      "Rich in omega-3, omega-6 and omega-9",
      "Contains all 21 amino acids",
    ],
    howToUse: [
      "Apply to wet hair and massage into the scalp.",
      "Work the lather through to the ends and rinse.",
      "Follow with Just Chill Conditioner for best results.",
    ],
    keyIngredients: [
      { name: "8 Essential Oils", why: "Nourish the scalp and add slip and softness." },
      { name: "Omega 3, 6 & 9", why: "Fatty acids that help condition and protect the hair fiber." },
      { name: "21 Amino Acids", why: "Protein building blocks that help strengthen weak hair." },
    ],
    badges: CLEAN,
    pairsWith: [21977, 38422],
  },
  41152: {
    slug: "amnesia-haze-shampoo",
    name: "Amnesia Haze Moisturizing Shampoo",
    tagline: "Salt and sulfate free botanical shampoo",
    hairType: "All hair types, ideal for dry or damaged hair",
    summary:
      "Amnesia Haze Shampoo cleanses gently and helps improve the overall health of scalp and hair. Its botanical formula carries eight essential oils rich in omega-3, 6 and 9 plus all 21 amino acids, so every wash helps strengthen and protect.",
    benefits: [
      "Moisturizing, salt and sulfate free cleanse",
      "Helps strengthen and protect hair",
      "Aloe, keratin and wheat protein for softness",
      "Botanical hair care line",
    ],
    howToUse: [
      "Apply to wet hair and massage into a lather.",
      "Let it work for a few minutes for extra conditioning, then rinse.",
      "Repeat if necessary and follow with Amnesia Haze Conditioner.",
    ],
    keyIngredients: [
      { name: "Aloe Barbadensis Leaf Juice", why: "Soothes the scalp and leaves hair smooth and shiny." },
      { name: "Hydrolyzed Keratin", why: "Helps hair retain moisture and look fuller." },
      { name: "Green Tea & Apple Extracts", why: "Antioxidant-rich botanicals for a healthy scalp." },
    ],
    badges: ["Salt Free", ...CLEAN],
    pairsWith: [41158, 38425],
  },

  /* ------------------------------------------------------------ */
  /* Conditioners                                                   */
  /* ------------------------------------------------------------ */
  21985: {
    slug: "color-protect-conditioner",
    name: "Color Protect P.I. Conditioner",
    tagline: "Daily rinse-out conditioner that seals in color and moisture",
    hairType: "Color-treated hair (permanent or demi-permanent color)",
    summary:
      "A must-have if you color your hair. Color Protect P.I. Conditioner restores hydration, smooths frizz and helps shield color from sun, salt water and chlorine, so it stays vibrant and lasts longer with every wash.",
    benefits: [
      "Maintains color vibrancy and prevents fading",
      "Restores hydration and smooths frizz",
      "Improves manageability and helps repair damage",
      "Enriched with kiwi fruit extract and ginseng root",
    ],
    howToUse: [
      "After shampooing, squeeze out excess water.",
      "Apply from mid-lengths to ends and comb through.",
      "Leave 1 to 2 minutes, then rinse.",
      "Use daily or after every wash.",
    ],
    keyIngredients: [
      { name: "P.I. Protection Technology", why: "Our proprietary complex that helps lock color in and pollutants out." },
      { name: "Kiwi Fruit Extract", why: "Vitamin-rich fruit extract for shine and softness." },
      { name: "Ginseng Root", why: "Helps support a healthy scalp environment." },
    ],
    badges: CLEAN,
    pairsWith: [21984, 38421],
  },
  21979: {
    slug: "silver-screen-conditioner",
    name: "Silver Screen Conditioner",
    tagline: "Violet conditioner that tones while it softens",
    hairType: "Blonde, highlighted, silver and gray hair",
    summary:
      "The second step in the Silver Screen system. This violet conditioner reduces breakage and split ends while continuing to neutralize yellow and orange tones, leaving blondes and grays bright, cool and shiny.",
    benefits: [
      "Neutralizes brassiness as it conditions",
      "Reduces breakage and split ends",
      "Helps shield hair from sun exposure",
      "Vegan, with certified organic extracts",
    ],
    howToUse: [
      "After Silver Screen Shampoo, apply generously from roots to ends.",
      "Leave on 2 to 5 minutes for toning and softness.",
      "Rinse thoroughly.",
    ],
    keyIngredients: [
      { name: "Violet Pigments", why: "Keep cool tones cool between salon visits." },
      { name: "Certified Organic Extracts", why: "Nourish lightened hair that needs extra care." },
    ],
    badges: ["Vegan", ...CLEAN],
    pairsWith: [21978, 38425],
  },
  21977: {
    slug: "just-chill-conditioner",
    name: "Just Chill Conditioner",
    tagline: "Essential-oil conditioner for a comfortable scalp and soft ends",
    hairType: "All hair types, especially dry, itchy or tight-feeling scalps",
    summary:
      "Scalp feeling tight? Roots feeling dry? Just Chill Conditioner pairs eight essential oils with omega-3, 6 and 9 and all 21 amino acids to condition hair and comfort the scalp in one step.",
    benefits: [
      "Helps improve the health of hair and scalp",
      "Enriched with 8 essential oils",
      "Rich in omega-3, omega-6 and omega-9",
      "Strengthens and protects with 21 amino acids",
    ],
    howToUse: [
      "After shampooing with Just Chill Shampoo, apply from scalp to ends.",
      "Leave on 2 to 3 minutes.",
      "Rinse well.",
    ],
    keyIngredients: [
      { name: "8 Essential Oils", why: "Soften hair and soothe the scalp." },
      { name: "Omega 3, 6 & 9", why: "Condition and protect the hair fiber." },
      { name: "21 Amino Acids", why: "Help rebuild strength in weak hair." },
    ],
    badges: CLEAN,
    pairsWith: [21976, 38425],
  },
  41158: {
    slug: "amnesia-haze-conditioner",
    name: "Amnesia Haze Moisturizing Conditioner",
    tagline: "Botanical conditioner that detangles and repairs",
    hairType: "Dry or damaged hair, all textures",
    summary:
      "Amnesia Haze Conditioner detangles and helps repair dry, damaged hair while improving the health of the scalp. Eight essential oils rich in omega-3, 6 and 9 plus all 21 amino acids help strengthen and protect every strand.",
    benefits: [
      "Detangles and repairs dry, damaged hair",
      "Deeply moisturizing",
      "Castor, argan and jojoba oils for shine",
      "Botanical hair care line",
    ],
    howToUse: [
      "After Amnesia Haze Shampoo, apply a generous amount to wet hair.",
      "Cover the full length, or just the area you want to treat.",
      "Let it work for at least 10 minutes, then rinse. Repeat if necessary.",
    ],
    keyIngredients: [
      { name: "Castor Seed Oil", why: "Super-hydrating oil that helps repair split ends." },
      { name: "Argan & Jojoba Oils", why: "Lightweight oils for slip, shine and softness." },
      { name: "Hydrolyzed Keratin & Wheat Protein", why: "Rebuild strength and reduce porosity." },
    ],
    badges: CLEAN,
    pairsWith: [41152, 38424],
  },
  38424: {
    slug: "skywalker-omg-leave-in",
    name: "Skywalker OMG Super Smooth Leave-In",
    tagline: "Leave-in conditioner for wavy and curly hair",
    hairType: "Wavy or curly hair that fights dryness and frizz",
    summary:
      "Skywalker OMG is the leave-in for anyone who struggles with dry, frizzy waves and curls. With or without a blow-dry, it leaves hair feeling super soft, smooth and completely free of frizz. Finish with Northern Lights for maximum shine.",
    benefits: [
      "Smooths and softens without weighing hair down",
      "Controls frizz on wavy and curly textures",
      "Helps blow-outs go straighter and last longer",
      "Detangles gently",
    ],
    howToUse: [
      "Apply a generous, even amount to wet hair.",
      "Comb through and air-dry, or blow out and finish with a flat iron.",
      "Do not rinse. Finish with Northern Lights Radiant Shine Gloss.",
    ],
    keyIngredients: [
      { name: "Castor Seed Oil", why: "Hydrates, helps repair breakage and protects from heat." },
      { name: "Glycerin", why: "Draws moisture into the hair and keeps it there." },
    ],
    badges: CLEAN,
    pairsWith: [38425, 41158],
  },
  38423: {
    slug: "white-widow-liquid-conditioner",
    name: "White Widow Liquid Conditioner",
    tagline: "Fast-detangling liquid conditioner for very damaged hair",
    hairType: "Very damaged, dry, brittle or tangle-prone hair",
    summary:
      "White Widow works like magic on dry, damaged, tangled hair. Its liquid texture slips through knots as you work your fingers through, detangling gently and effectively while wheat protein, collagen and biotin help prevent further damage.",
    benefits: [
      "Detangles and conditions very damaged, unruly hair",
      "Helps prevent further breakage",
      "Gentle liquid texture, no tugging",
      "Available in 4 oz and 8 oz",
    ],
    howToUse: [
      "Apply a generous, even amount to wet hair after shampooing.",
      "Gently detangle with your fingers or a wide-tooth comb.",
      "Rinse. Repeat if needed.",
    ],
    keyIngredients: [
      { name: "Hydrolyzed Wheat Protein", why: "Reduces porosity and strengthens hair from within." },
      { name: "Collagen", why: "Amino acids that help build hair and fight free-radical damage." },
      { name: "Biotin & Vitamin E", why: "Support keratin production and scalp health." },
    ],
    badges: CLEAN,
    pairsWith: [41152, 21984],
  },

  /* ------------------------------------------------------------ */
  /* Treatments                                                     */
  /* ------------------------------------------------------------ */
  38403: {
    slug: "diamond-reconstruction-hair-mask",
    name: "Diamond Reconstruction Extreme Repair Mask",
    tagline: "Intensive reconstructing mask for damaged, brittle hair",
    hairType: "Very damaged, dry and brittle hair",
    summary:
      "Diamond Reconstruction helps rebuild damaged hair from the inside out. Keratin, wheat and rice proteins restructure weak strands while aloe, panthenol and collagen nourish and hydrate, leaving hair softer and visibly healthier after one use.",
    benefits: [
      "Nourishes, hydrates and restructures damaged hair",
      "Leaves hair softer and visibly healthier",
      "Protein-rich formula for strength",
      "Salon treatment you can do at home",
    ],
    howToUse: [
      "Shampoo and towel-dry hair.",
      "Apply a generous, even amount from roots to ends, making sure all hair is covered.",
      "Leave on at least 10 minutes. The longer it works, the better.",
      "Rinse and finish with Northern Lights for added shine. Use weekly.",
    ],
    keyIngredients: [
      { name: "Hydrolyzed Keratin Protein", why: "Increases fiber diameter and helps hair retain moisture." },
      { name: "Aloe Barbadensis Leaf Juice", why: "Soothes the scalp and leaves hair smooth and shiny." },
      { name: "Collagen & Panthenol", why: "Add elasticity, moisture and shine." },
    ],
    badges: CLEAN,
    pairsWith: [38425, 38423],
  },
  38421: {
    slug: "diesel-hayes-color-mask",
    name: "Diesel Hayes Color Enhancing Mask",
    tagline: "Color-boosting treatment mask for color-treated hair",
    hairType: "Color-treated hair",
    summary:
      "Diesel Hayes keeps your color vibrant longer while nourishing and repairing dryness. Keratin, castor oil, collagen and a garden of botanical extracts leave color-treated hair soft, shiny and easier to manage.",
    benefits: [
      "Helps color stay vibrant longer",
      "Adds softness and manageability",
      "Nourishes and repairs dry, color-treated hair",
      "Pairs with Jasper Moroccan Oil for extra shine",
    ],
    howToUse: [
      "Shampoo and towel-dry hair.",
      "Apply a generous, even amount from roots to ends.",
      "Leave on at least 10 minutes, longer if you have time.",
      "Rinse and finish with Jasper Moroccan Oil. Use once or twice a week.",
    ],
    keyIngredients: [
      { name: "Hydrolyzed Keratin Protein", why: "Strengthens and helps hair hold moisture and color." },
      { name: "Castor Seed Oil", why: "Hydrates and protects against heat." },
      { name: "Chamomile, Green Tea & Apple Extracts", why: "Antioxidant botanicals that soothe and nourish the scalp." },
    ],
    badges: CLEAN,
    pairsWith: [38422, 21984],
  },

  /* ------------------------------------------------------------ */
  /* Styling                                                        */
  /* ------------------------------------------------------------ */
  42263: {
    slug: "ocean-beach-sea-salt-spray",
    name: "Ocean Beach Sea Salt Texturizing Spray",
    tagline: "Beachy texture and volume without the crunch",
    hairType: "All hair types, best on waves and fine-to-medium hair",
    summary:
      "Bring the beach to your hair, no ocean required. Ocean Beach is a lightweight texturizing spray with Dead Sea salt, aloe vera and a nourishing blend of coconut, kiwi, bamboo and sunflower that gives you a tousled, windswept look with a soft, touchable finish.",
    benefits: [
      "Boosts natural waves and volume",
      "Hydrates while it texturizes, so no dryness or stiffness",
      "Refreshes second-day hair",
      "Clean, fresh scent inspired by summer on the coast",
    ],
    howToUse: [
      "Shake well. Spray onto damp or dry hair.",
      "Scrunch or twist sections to enhance texture.",
      "Air-dry or diffuse. Style as desired.",
    ],
    keyIngredients: [
      { name: "Dead Sea Salt", why: "Adds grit, volume and natural wave definition." },
      { name: "Aloe Vera Leaf Juice", why: "Hydrates and soothes so salt never dries hair out." },
      { name: "Coconut, Kiwi, Bamboo & Sunflower", why: "Nourish, soften and boost shine." },
    ],
    badges: CLEAN,
    pairsWith: [21986, 160],
  },
  40042: {
    slug: "dutch-treat-styling-mousse",
    name: "Dutch Treat Styling Mousse",
    tagline: "Curl-defining mousse with glycerin and panthenol",
    hairType: "Wavy and curly hair",
    summary:
      "Say goodbye to frizz and hello to beautifully defined curls. Dutch Treat styles and defines wavy and curly hair with long-lasting hold that never feels stiff or hard, while glycerin and panthenol hydrate and nourish.",
    benefits: [
      "Defines curls and waves without stiffness",
      "Long-lasting, touchable hold",
      "Hydrates with glycerin and panthenol",
      "Great for beachy waves or natural curls",
    ],
    howToUse: [
      "Shake well and dispense a golf-ball-size amount into palms.",
      "Work through damp hair from roots to ends, scrunching curls upward.",
      "Air-dry or diffuse. Do not touch until fully dry for maximum definition.",
    ],
    keyIngredients: [
      { name: "Glycerin", why: "Attracts and holds moisture inside the curl." },
      { name: "Panthenol (Pro-Vitamin B5)", why: "Adds moisture, shine and elasticity, and detangles." },
      { name: "Keratin, Wheat & Rice Proteins", why: "Strengthen hair and reduce frizz." },
    ],
    badges: CLEAN,
    pairsWith: [38424, 38425],
  },
  40040: {
    slug: "high-society-styling-gel",
    name: "High Society Styling Gel",
    tagline: "Medium-hold gel with bamboo extract and aloe",
    hairType: "Any hair type",
    summary:
      "Experience styling power for any hair type. High Society gives you a strong yet flexible hold that lasts all day, while bamboo extract and aloe leaf juice nourish and hydrate instead of drying hair out.",
    benefits: [
      "Styles and defines any type of hair",
      "Strong, flexible hold that lasts all day",
      "Nourishes with bamboo and aloe",
      "No flaking, no crunch",
    ],
    howToUse: [
      "Work a small amount through damp or dry hair.",
      "Style as desired: slick back, define curls or sculpt.",
      "Add more for extra hold.",
    ],
    keyIngredients: [
      { name: "Bamboo Extract", why: "Silica-rich for strength, texture and fewer split ends." },
      { name: "Aloe Barbadensis Leaf Juice", why: "Conditions and leaves hair smooth and shiny." },
      { name: "Hydrolyzed Rice Protein", why: "Adds volume, shine and flexibility." },
    ],
    badges: CLEAN,
    pairsWith: [160, 38425],
  },
  38425: {
    slug: "northern-lights-shine-gloss",
    name: "Northern Lights Radiant Shine Gloss",
    tagline: "Featherlight finishing gloss for radiant shine",
    hairType: "All hair types, especially fine or thinning hair",
    summary:
      "Northern Lights is the finishing touch. Lighter than an oil, this gloss stops frizz, softens and protects against flyaways while giving hair a radiant, glass-like shine. Light enough for thin hair, perfect after a blow-dry.",
    benefits: [
      "Radiant, gloss-like shine",
      "Tames frizz and flyaways",
      "Feels weightless on fine or thinning hair",
      "Doubles as a light leave-in on damp hair",
    ],
    howToUse: [
      "Spray directly onto dry or wet hair.",
      "For extra moisture, apply to damp or towel-dried hair before styling.",
      "Finish blow-outs and treatments with a light mist.",
    ],
    keyIngredients: [
      { name: "Castor Seed Oil", why: "Hydrates, helps repair split ends and protects from heat." },
      { name: "Glycerin", why: "Moisturizes and conditions, even on dry hair." },
    ],
    badges: CLEAN,
    pairsWith: [38424, 38403],
  },
  38422: {
    slug: "jasper-moroccan-oil-serum",
    name: "Jasper Moroccan Oil Argan Serum",
    tagline: "Argan oil serum that controls frizz and adds shine",
    hairType: "Any hair type",
    summary:
      "Jasper Moroccan Oil is our argan hair serum for frizz, flyaways and shine. Antioxidant-rich argan oil and capsicum fruit extract soften, protect and restore natural luster while helping shield hair from city pollutants.",
    benefits: [
      "Controls frizz and flyaways",
      "Adds softness and shine",
      "Helps protect against pollutants",
      "A couple of drops is all you need",
    ],
    howToUse: [
      "Apply a couple of drops to palms and rub together.",
      "Smooth evenly through mid-lengths and ends, avoiding the roots.",
      "Use less on fine hair, more on thick hair. Apply to damp or towel-dried thick hair for added moisture.",
    ],
    keyIngredients: [
      { name: "Argan Oil", why: "Antioxidants, fatty acids and vitamin E for elasticity and shine." },
      { name: "Capsicum Annuum Fruit Extract", why: "A vitamin C rich extract with antioxidant properties." },
    ],
    badges: CLEAN,
    pairsWith: [38421, 21989],
  },
  21989: {
    slug: "forever-young-smoothing-spray",
    name: "Forever Young B.T.X. Smoothing Spray",
    tagline: "Smoothing spray for blow-drying and flat ironing",
    hairType: "All hair types, ideal between keratin treatments",
    summary:
      "Forever Young smooths hair and eliminates frizz with a refreshing citrus scent. Use it to extend a keratin treatment, for touch-ups in between, or whenever you want a blow-out to stay straighter for longer.",
    benefits: [
      "Smooth, long-lasting results",
      "Helps maintain keratin treatments",
      "Made for blow-drying and flat ironing",
      "Fresh citrus scent",
    ],
    howToUse: [
      "Spray evenly onto towel-dried hair, section by section.",
      "Comb through, then blow-dry with a round or paddle brush.",
      "Finish with a flat iron for the smoothest result.",
    ],
    keyIngredients: [
      { name: "Smoothing Complex", why: "Coats the cuticle to block humidity and frizz." },
      { name: "Citrus Extracts", why: "Add shine and a clean, fresh scent." },
    ],
    badges: CLEAN,
    pairsWith: [38422, 21986],
  },
  21988: {
    slug: "quantum-leap-serum",
    name: "Quantum Leap V.R. Serum",
    tagline: "Frizz control and shine serum for blonde and gray hair",
    hairType: "All hair types, ideal for blonde and gray hair",
    summary:
      "Quantum Leap V.R. Serum is our finishing serum for healthy-looking hair. It controls frizz and adds shine and glow to any hairstyle, and its violet tint makes it especially flattering on blonde and gray hair.",
    benefits: [
      "Frizz control and shine in one step",
      "Ideal for blonde and gray hair",
      "Great for all hair types",
      "Paraben free",
    ],
    howToUse: [
      "Rub one or two pumps between palms.",
      "Smooth over dry or damp hair, focusing on ends.",
      "Style as usual. Use as a finishing touch on dry hair for extra glow.",
    ],
    keyIngredients: [
      { name: "Violet Tint", why: "Counteracts warm tones on blonde and gray hair." },
      { name: "Lightweight Conditioners", why: "Smooth the cuticle for shine without grease." },
    ],
    badges: ["Paraben Free"],
    pairsWith: [21978, 21979],
  },
  21986: {
    slug: "big-dreams-volume-spray",
    name: "Big Dreams R.E.M. Volume Spray",
    tagline: "Heat-protective volumizing spray with maximum hold",
    hairType: "All hair types, especially thick or coarse hair wanting lift",
    summary:
      "Big Dreams creates volume, body and movement with maximum hold and a healthy shine. Spray it on damp hair before styling to lift roots and protect against heat damage, without the stiffness or frizz.",
    benefits: [
      "Adds volume and form to any style",
      "Maximum hold that lasts all day",
      "Protects against heat damage",
      "Keeps softness and shine without frizz",
    ],
    howToUse: [
      "Spray onto damp hair at the roots and through the lengths.",
      "Blow-dry, lifting sections with a round brush for volume.",
      "Mist lightly on dry hair for a touch-up.",
    ],
    keyIngredients: [
      { name: "Heat Protection Complex", why: "Shields hair from blow-dryer and iron heat." },
      { name: "Flexible Polymers", why: "Hold and body that still moves." },
    ],
    badges: CLEAN,
    pairsWith: [42263, 21989],
  },
  160: {
    slug: "drama-putty",
    name: "Drama Putty",
    tagline: "Flexible matte molding cream for texture and control",
    hairType: "Coarse hair, and any texture that wants a matte, lived-in finish",
    summary:
      "Drama Putty is the styling product for everyone who wants flexible control. This molding cream gives hair texture, separation and hold with a matte finish and no oily residue, and it smooths and controls coarse hair with ease.",
    benefits: [
      "Texture, separation and control",
      "Flexible, re-workable hold",
      "Matte finish, no oily residue",
      "Smooths and controls coarse hair",
    ],
    howToUse: [
      "Rub a small amount between palms until warm and even.",
      "Work through dry or slightly damp hair from back to front.",
      "Shape, twist or piece out. Add more for extra hold.",
    ],
    keyIngredients: [
      { name: "Natural Waxes & Clays", why: "Grip and matte texture that stays flexible." },
      { name: "Conditioning Agents", why: "Keep coarse hair smooth and touchable." },
    ],
    badges: CLEAN,
    pairsWith: [40040, 42263],
  },
};

export function detailFor(id: number): ProductDetail {
  const d = PRODUCT_DETAILS[id];
  if (!d) throw new Error(`Missing product details for id ${id}`);
  return d;
}

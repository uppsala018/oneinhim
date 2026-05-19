// Hardcoded fallback arguments used when the Claude API is unavailable.
// These cover five distinct Arian theological angles not duplicated in
// useNicaeaGame.ts, giving variety if both systems run in the same session.

import type { AriusArgument } from "../hooks/useNicaeaGame";

export const FALLBACK_ARGUMENTS: AriusArgument[] = [
  // Round 1 — The Divine Monarchia
  {
    id: "fallback-r1",
    text:
      "The Father alone is the one God — unoriginate, without source, the sole monarchy of all existence. If the Son shares the same substance as the Father, you have introduced a second God alongside the first. This is not Christian monotheism; it is a return to paganism with two divine principles. The Shema itself declares 'The Lord our God, the Lord is one.'",
    historicalSource: "Letter of Arius to Alexander of Alexandria, c. 319 AD",
    responses: [
      {
        id: "fallback-r1-strong",
        strength: "strong",
        text:
          "You confuse unity of substance with multiplicity of persons. A father and son share one human nature without being two humans in the sense of two separate individuals. The Son's eternal generation from the Father does not add a second God alongside the first — it reveals the inner life of the one God. John 17:21 shows the Father and Son are genuinely one, while John 1:1 shows the Word was distinct from God and yet was God. Your Shema is fulfilled, not violated.",
        explanation:
          "This addresses Arius's central philosophical worry (ditheism) and distinguishes substance from person — the conceptual breakthrough of Nicene theology. The two scriptural citations work together to show unity and distinction simultaneously.",
        scriptureRef: "John 17:21; John 1:1; Deuteronomy 6:4",
      },
      {
        id: "fallback-r1-partial",
        strength: "partial",
        text:
          "Christian teachers before us — Tertullian, Origen, Gregory Thaumaturgus — all confessed one God while distinguishing Father, Son, and Spirit as real and distinct. The divine monarchy is not compromised by the eternal generation of the Son any more than a king's authority is shared away when he has a son who is truly royal. Monotheism does not require the Son to be a creature.",
        explanation:
          "A solid appeal to tradition that shows Arius's claim to orthodoxy is overstated, but it does not directly rebut his philosophical argument about the nature of divine unity.",
      },
      {
        id: "fallback-r1-weak",
        strength: "weak",
        text:
          "The Son is so supremely exalted above all created things that He stands in a wholly unique relationship to the Father. Surely we honor the divine unity by placing the Son in the highest possible position — the first of all God's works and the ruler of all creation.",
        explanation:
          "This concedes Arius's entire framework. Calling the Son 'the first of all God's works' grants that He is a creature, which is precisely Arius's position. It argues for His dignity while accepting His creaturely status.",
      },
    ],
  },

  // Round 2 — "The Father Is Greater Than I" (John 14:28)
  {
    id: "fallback-r2",
    text:
      "Our Lord himself declared it: 'The Father is greater than I.' Not greater in honor or office — the word is clear, He is greater in very being. If the Son were truly equal to and co-eternal with the Father, these words become meaningless or deceptive. Does the Christ speak falsehood? You must either accept His testimony about His own subordination or call Him a liar.",
    historicalSource: "Arius, Thalia, drawing on John 14:28; cf. Athanasius, De Synodis",
    responses: [
      {
        id: "fallback-r2-strong",
        strength: "strong",
        text:
          "John 14:28 was spoken by the Incarnate Word in the context of the Farewell Discourse, as He prepared His disciples for His departure and return to the Father. Philippians 2:6-7 is decisive: He who 'was in the form of God' and 'equal with God' took 'the form of a servant.' The 'greater' is spoken from within the assumed servanthood of the Incarnation, not from the eternal relation of the Son to the Father. It is the human voice of the God-Man speaking, not the eternal Son defining His ontological rank.",
        explanation:
          "This deploys the incarnational framework correctly: statements of subordination and limitation belong to the human nature assumed by the eternal Son, not to His divine nature. The Philippians passage directly undermines Arius by affirming equality prior to the Incarnation.",
        scriptureRef: "John 14:28; Philippians 2:6–7",
      },
      {
        id: "fallback-r2-partial",
        strength: "partial",
        text:
          "The context of John 14:28 is the farewell discourse, where Christ speaks to comfort disciples who will grieve at His departure. He says the Father is greater to explain why they should rejoice at His going — He returns to a place of greater glory and power than the humiliation of His earthly mission. This is economic language about His mission, not a metaphysical statement about the eternal Son's being relative to the Father.",
        explanation:
          "A useful contextual observation but incomplete — it explains away one statement without engaging Arius's broader theological framework or presenting the positive case for the Son's full divinity.",
        scriptureRef: "John 14:28",
      },
      {
        id: "fallback-r2-weak",
        strength: "weak",
        text:
          "Even among humans, a son may be subordinate to his father while still being of the same nature. Perhaps the Son is divine in some real sense and yet subordinate to the Father as source — a divine being of a secondary order, greater than all creatures but less than the Father who originated Him.",
        explanation:
          "This concedes the core of Arianism. A 'divine being of a secondary order' is exactly what Arius teaches. The attempt to grant some form of divinity while accepting ontological inferiority does not protect the faith — it is the Arian position under a different name.",
      },
    ],
  },

  // Round 3 — "First-born of All Creation" (Colossians 1:15)
  {
    id: "fallback-r3",
    text:
      "Paul himself is our witness. In Colossians 1:15 he calls the Son 'the firstborn of all creation.' The language is plain: He is the first-born within creation, prior to and supreme over all other creatures, but a creature. He is first among created things — the greatest of all God has made. Who are you to correct the Apostle by denying what he plainly wrote?",
    historicalSource:
      "Arius's argument from Colossians 1:15; documented by Athanasius, Contra Arianos I.37–38",
    responses: [
      {
        id: "fallback-r3-strong",
        strength: "strong",
        text:
          "'First-born' in biblical usage denotes pre-eminence, lordship, and inheritance — not birth order among creatures. Psalm 89:27 calls David 'my firstborn, the highest of the kings of the earth'; David was no firstborn king. But the fatal blow to your reading is Colossians 1:16 itself, the very next verse: 'For in him all things were created, in heaven and on earth, visible and invisible.' If the Son is within creation, He created Himself — an absurdity. He is therefore the Lord of creation, standing outside and prior to it as its Creator.",
        explanation:
          "This is the decisive exegetical answer: attack the meaning of 'firstborn' with clear OT parallels, then turn Colossians 1:16 directly against Arius. If all things are created through the Son, He cannot be among 'all things.' The argument is self-defeating.",
        scriptureRef: "Colossians 1:15–16; Psalm 89:27",
      },
      {
        id: "fallback-r3-partial",
        strength: "partial",
        text:
          "'First-born' in Jewish idiom meant heir, lord, and master of all the others — not the first member of a group. Joseph's sons received blessing with Ephraim, the younger, placed first as the true 'firstborn' in terms of precedence. The Son is 'firstborn' in the sense of being the supreme Lord over all creation — which means He rules it, not that He belongs to it.",
        explanation:
          "Correctly explains the OT idiom but does not deploy Colossians 1:16's self-refuting implication for Arius's reading. Solid but not as decisive as the strong rebuttal.",
        scriptureRef: "Colossians 1:15; Genesis 48:14–20",
      },
      {
        id: "fallback-r3-weak",
        strength: "weak",
        text:
          "Even granting that 'firstborn of creation' implies the Son is the first thing created, one must still ask what kind of creature He is. The Son may be a creature in a unique and elevated sense — called divine by participation, possessing divine attributes by the gift of the Father, and therefore worthy of our worship.",
        explanation:
          "This is the Arian compromise position: calling the Son divine 'by participation' while granting He is a creature. Arius can accept this entirely. It abandons the field while appearing to defend it.",
      },
    ],
  },

  // Round 4 — The Only True God (John 17:3)
  {
    id: "fallback-r4",
    text:
      "In His high-priestly prayer our Lord prays to the Father and defines eternal life: 'This is eternal life, that they know you, the only true God, and Jesus Christ whom you have sent.' The Father alone is 'the only true God.' The Son is placed alongside God as the one sent, not as the sender. Christ himself places a distinction between the only true God and himself. Are you wiser than the Son about His own nature?",
    historicalSource:
      "Arius's argument from John 17:3; cf. Athanasius, Contra Arianos III.7–8",
    responses: [
      {
        id: "fallback-r4-strong",
        strength: "strong",
        text:
          "The phrase 'the only true God' excludes idols and false gods — it is the Shema assertion against paganism, not a denial of the Son's divinity. The Son is not excluded from divinity here; He is the revealer of the only true God. Note that Thomas confesses to the Risen Christ directly: 'My Lord and my God!' (John 20:28) — and Christ accepts the title. Hebrews 1:8 has the Father himself address the Son: 'Your throne, O God, is forever and ever.' If the Father calls the Son God, your reading of John 17:3 is simply wrong.",
        explanation:
          "Identifies the correct referent of 'only true God' (idols, not the Son), then deploys multiple texts where the Son is called God — including one by the Father himself. The Arian reading cannot survive the cumulative weight of John 20:28 and Hebrews 1:8.",
        scriptureRef: "John 17:3; John 20:28; Hebrews 1:8",
      },
      {
        id: "fallback-r4-partial",
        strength: "partial",
        text:
          "John 17:3 is spoken by the Incarnate Son in the mode of His mission — He is the one sent, who reveals the Father. This is economic language about how God has acted in history for our salvation, not a definitive ontological statement about the eternal relation of Father and Son. The same Gospel that contains John 17:3 begins with 'the Word was God' (John 1:1). Any reading of verse 17:3 that contradicts verse 1:1 has misread it.",
        explanation:
          "A good point about the economic context and about internal Johannine consistency, but it does not directly refute the specific exegetical claim — it calls for a more nuanced reading without fully providing one.",
        scriptureRef: "John 17:3; John 1:1",
      },
      {
        id: "fallback-r4-weak",
        strength: "weak",
        text:
          "The prayer in John 17 reveals the deep intimacy between Father and Son. Whatever we conclude about their metaphysical relationship, it is clear that they share a unique bond that no other creature has. The Son's union with the Father may be greater than any creature's, even if He is not equal in nature.",
        explanation:
          "Concedes the Arian reading by retreating to vague 'uniqueness' without affirming the Son's divinity. An appeal to intimacy without ontological commitment leaves Arius's argument standing unchallenged.",
      },
    ],
  },

  // Round 5 — The Son's Will in Gethsemane
  {
    id: "fallback-r5",
    text:
      "In Gethsemane our Lord prayed: 'Not my will, but yours be done.' He distinguishes His own will from the Father's. A will distinct from the Father's will means a being distinct from the Father's being. If the Son had one will with the Father — as your homoousios implies — His prayer is theatrical performance, not genuine obedience. Either His prayer was real and He has a distinct, lesser will, or it was a pretense and He was not truly human. Both horns of the dilemma are fatal to your position.",
    historicalSource:
      "Arius's theological argument from Luke 22:42; developed by later Arians in the Eunomian controversy",
    responses: [
      {
        id: "fallback-r5-strong",
        strength: "strong",
        text:
          "The prayer of Gethsemane belongs to Christ's human will, not His divine will — and the Incarnation requires there be a genuine human will, lest He be less than fully human. The distinction is not between a lesser divine will and the Father's greater divine will; it is between the one divine will (which Father and Son share as homoousios) and the genuinely assumed human will of the Incarnate Son. Hebrews 2:17 requires that He be 'made like his brothers in every respect' — including having a real human will capable of real obedience. Your dilemma assumes there is only one will in Christ; the Incarnation requires two.",
        explanation:
          "The decisive move: distinguish two natures and therefore two wills in the one Person of Christ. The Gethsemane prayer is the human will in genuine submission — which is exactly what full Incarnation requires. This anticipates the Chalcedonian and Third Constantinople councils and is the correct theological answer.",
        scriptureRef: "Luke 22:42; Hebrews 2:17",
      },
      {
        id: "fallback-r5-partial",
        strength: "partial",
        text:
          "The distinction of wills in Gethsemane reflects the reality of Christ's human experience — He truly suffered, truly feared death, and truly submitted. This is not proof of an ontologically inferior divine will; it is proof that He took on full and genuine humanity. Philippians 2:8 says He 'humbled himself by becoming obedient to the point of death.' Obedience requires a real will capable of choosing — and that is His human will, not a deficient divine one.",
        explanation:
          "Points in the right direction by locating the will in His humanity, but does not fully articulate the two-wills doctrine or explain why this does not imply two competing divine wills. Solid but incomplete.",
        scriptureRef: "Luke 22:42; Philippians 2:8",
      },
      {
        id: "fallback-r5-weak",
        strength: "weak",
        text:
          "The mystery of how Christ could have both a human experience and a divine nature is one that the Church has not yet fully resolved. Perhaps there is a gradation of divine being such that the Son, while genuinely divine, has a will that is properly submitted to and derived from the Father's will — showing his filial obedience rather than his inferiority.",
        explanation:
          "This is the Arian answer dressed up in pious language. A 'gradation of divine being' in which the Son's will is derived from and submitted to the Father's is exactly what Arius teaches. It abandons the orthodox position while sounding conciliatory.",
      },
    ],
  },
];

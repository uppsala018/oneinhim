"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { saveScore } from "../services/firebaseGame";
import type { CouncilVerdict } from "../services/firebaseGame";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResponseStrength = "strong" | "partial" | "weak";
export type GamePhase = "intro" | "debate" | "verdict";
export type VerdictLabel =
  | "Champion of Nicaea"
  | "Defender of the Faith"
  | "Faithful Bishop"
  | "Wavering Presbyter"
  | "Swayed by Heresy"
  | "Lost to Arianism";

export interface DebateResponse {
  id: string;
  text: string;
  strength: ResponseStrength;
  explanation: string;
  scriptureRef?: string;
}

export interface AriusArgument {
  id: string;
  text: string;
  historicalSource: string;
  responses: DebateResponse[];
}

export interface RoundResult {
  round: number;
  ariusArgument: string;
  playerResponse: string;
  strength: ResponseStrength;
  pointsEarned: number;
}

export interface GameState {
  phase: GamePhase;
  round: number;
  totalRounds: number;
  score: number;
  timeRemaining: number;
  currentArgument: AriusArgument | null;
  selectedResponse: string | null; // response.id
  responseResult: ResponseStrength | null;
  roundHistory: RoundResult[];
  verdict: CouncilVerdict | null;
  verdictLabel: VerdictLabel | null;
  shareToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 5;
const TIMER_SECONDS = 30;
const TIME_BONUS_THRESHOLD = 10; // seconds to qualify for bonus
const TIME_BONUS_POINTS = 50;
const STRONG_POINTS = 200;
const PARTIAL_POINTS = 100;
const WEAK_POINTS = 0;

// ─── Game Data ────────────────────────────────────────────────────────────────

const NICAEA_ROUNDS: AriusArgument[] = [
  {
    id: "r1",
    text:
      "The Father alone is agenetos — without source or origin. If the Son is 'begotten,' He has a source, and therefore cannot be co-eternal. An unbegotten God cannot share His unbegottenness with another. The Son is subordinate in very being.",
    historicalSource: "Thalia of Arius, c. 318 AD",
    responses: [
      {
        id: "r1-strong",
        strength: "strong",
        text:
          "You confuse 'unbegotten' with 'uncreated.' The Son's eternal generation is not a moment in time — it is an eternal relation within the Godhead. John 1:1 is decisive: 'In the beginning was the Word' — ēn, continuous existence, not 'came to be.' The Son does not begin; He eternally is.",
        explanation:
          "This targets Arius's core logical error. 'Begotten' describes an eternal relationship, not a temporal act of origination. John 1:1's Greek imperfect tense (ēn) crushes the claim of a moment before the Son.",
        scriptureRef: "John 1:1",
      },
      {
        id: "r1-partial",
        strength: "partial",
        text:
          "Colossians 1:16 declares all things were created through the Son. If the Son were among created things, He would have created Himself — an absurdity. 'Begotten' and 'created' are not synonyms. The Son's relation to the Father is unique and prior to creation.",
        explanation:
          "A solid reductio ad absurdum: if the Son is a creature, He is in the set of 'all things,' but He is the one through whom all things were made. The argument lands but does not address the 'unbegottenness' issue directly.",
        scriptureRef: "Colossians 1:16",
      },
      {
        id: "r1-weak",
        strength: "weak",
        text:
          "The Son clearly possesses immense divine power and dignity — far above all angels and creatures. Surely He occupies a unique place that sets Him apart from ordinary created beings.",
        explanation:
          "This concedes Arius's framework: it argues for degree, not nature. Arius would agree the Son is the highest creature — this response does not challenge his position at all.",
      },
    ],
  },
  {
    id: "r2",
    text:
      "I have written it plainly: there was when He was not. Proverbs 8:22 records Wisdom saying, 'The Lord created me at the beginning of His work.' This Wisdom is the Son. Scripture itself calls Him created. How can the council deny what the Word of God plainly states?",
    historicalSource: "Letter of Arius to Eusebius of Nicomedia, c. 319 AD",
    responses: [
      {
        id: "r2-strong",
        strength: "strong",
        text:
          "You have mistranslated. The Hebrew qanah means 'possessed' or 'acquired,' not 'created.' Even your Septuagint's ektise is an interpretive choice disputed by scholars. And your reading collides with John 1:1: 'In the beginning was the Word' — ēn, not egeneto. The Word already was. Your 'there was when He was not' contradicts Scripture.",
        explanation:
          "The strongest possible counter: attack the textual foundation of Arius's proof-text directly. The Hebrew undermines the Greek rendering, and John 1:1's grammar is an explicit contradiction of Arius's slogan.",
        scriptureRef: "Proverbs 8:22; John 1:1",
      },
      {
        id: "r2-partial",
        strength: "partial",
        text:
          "Hebrews 1:10–12 quotes Psalm 102 and addresses it directly to the Son: 'In the beginning, Lord, you laid the foundations of the earth.' The Father calls the Son 'Lord' from before creation. Micah 5:2 likewise speaks of the Son's 'origins from of old, from ancient times.' These texts establish His eternal existence.",
        explanation:
          "Sound use of Scripture, but it does not directly rebut the Proverbs 8:22 argument — it offers counter-texts rather than dismantling his proof-text. Persuasive, not decisive.",
        scriptureRef: "Hebrews 1:10–12; Micah 5:2",
      },
      {
        id: "r2-weak",
        strength: "weak",
        text:
          "Even if Proverbs 8 speaks of the Son's origins, it does not follow that He is an ordinary creature. The Son occupies a place so far above creation that such language must be read carefully, not literally.",
        explanation:
          "Concedes that the text might mean 'created' and retreats to vagueness. Arius will simply agree that the Son is above ordinary creatures — this grants his entire framework.",
      },
    ],
  },
  {
    id: "r3",
    text:
      "Mark 13:32 — the Son declares He does not know the day or the hour of judgment. Luke 2:52 says He grew in wisdom and stature. A true God is omniscient and immutable. A being who grows in knowledge and does not know the judgment day is not truly God — He is a mutable, created mediator whom God indwelt.",
    historicalSource: "Arius's theological letters, drawing on Mark 13:32 and Luke 2:52",
    responses: [
      {
        id: "r3-strong",
        strength: "strong",
        text:
          "The Incarnation is precisely the explanation. The eternal Word assumed genuine human nature — flesh, mind, and will — with its real limitations. Athanasius teaches: the Son knew as God what He did not know as man. The ignorance and growth belong to the assumed humanity, not the divine nature. 1 Corinthians 2:8 calls the crucified one 'the Lord of glory' — divine Person, human suffering.",
        explanation:
          "The incarnational solution is the correct one: attribute limitations to the human nature, glory to the divine. This is proto-Chalcedonian theology and the strongest possible answer.",
        scriptureRef: "1 Corinthians 2:8",
      },
      {
        id: "r3-partial",
        strength: "partial",
        text:
          "The same Christ who says He does not know the hour also says 'I and the Father are one' (John 10:30) and 'He who has seen Me has seen the Father' (John 14:9). If He were a limited creature, these are blasphemy. You must account for both sets of statements — your theory handles only one.",
        explanation:
          "A fair challenge: Arius's theory handles the 'limitation' texts but cannot explain the 'divine identity' texts. It forces him to explain away explicit divine claims. Solid but incomplete without the incarnational framework.",
        scriptureRef: "John 10:30; John 14:9",
      },
      {
        id: "r3-weak",
        strength: "weak",
        text:
          "No human can fully comprehend the divine nature. The mystery of how Christ can both know and not know is among the deep things of God that we should approach with humility rather than confident pronouncements.",
        explanation:
          "An appeal to mystery without engaging the argument. Arius will accept this framing gladly — it leaves his position intact and implies the question is unanswerable, which serves him.",
      },
    ],
  },
  {
    id: "r4",
    text:
      "God is immutable and impassible — incapable of change or suffering. Yet your Christ wept at Lazarus's tomb, was troubled in the garden, and was crucified. He cried out, 'My God, my God, why have you forsaken me?' A true God cannot be forsaken, cannot weep, cannot die. The suffering Christ proves He is not God.",
    historicalSource: "Arius's letters; cf. Eusebius of Caesarea, Ecclesiastical Theology",
    responses: [
      {
        id: "r4-strong",
        strength: "strong",
        text:
          "You are arguing against the Incarnation, not for Arianism. The suffering belongs to the human nature the eternal Son assumed — He did not suffer in His divinity. The cry of dereliction is the human voice of the God-man bearing our abandonment. Athanasius: He 'appropriated' our human experiences by taking our nature. This is the scandal of the Gospel, not a refutation of His divinity.",
        explanation:
          "Correctly locates suffering in the human nature without denying the Incarnation. Shows Arius's argument proves too much — it would eliminate the Incarnation entirely, not just Nicene theology.",
        scriptureRef: "Matthew 27:46; Hebrews 2:14",
      },
      {
        id: "r4-partial",
        strength: "partial",
        text:
          "The Church has always spoken of the Son both according to His divinity and according to His humanity. Statements of suffering and growth pertain to His humanity; statements of omnipotence and eternal existence pertain to His divinity. Gregory Thaumaturgus taught this rule of interpretation before us.",
        explanation:
          "The two-natures hermeneutic is correct and important, but without naming it as 'assumed human nature,' it sounds like two separate modes rather than one Person in two natures. Partial credit.",
      },
      {
        id: "r4-weak",
        strength: "weak",
        text:
          "The depth of Christ's suffering shows the magnitude of His love for humanity. Whatever we conclude about His divine nature, His willingness to endure the cross is the greatest demonstration of love the world has ever seen.",
        explanation:
          "Entirely evades the philosophical challenge. Arius agrees Christ suffered greatly — that is his point. This response confirms rather than rebuts his argument.",
      },
    ],
  },
  {
    id: "r5",
    text:
      "Your proposed term homoousios — 'of one substance' — appears nowhere in Scripture. It is a Greek philosophical import, not an apostolic word. Worse, the Council of Antioch in 268 AD explicitly condemned this very term when Paul of Samosata used it. You propose to bind the whole Church to language already condemned and nowhere found in the Bible.",
    historicalSource:
      "Objections of Arius and Eusebius of Caesarea at Nicaea, 325 AD; cf. Socrates Scholasticus, Historia Ecclesiastica 1.8",
    responses: [
      {
        id: "r5-strong",
        strength: "strong",
        text:
          "Antioch condemned homoousios used by Paul of Samosata in a Sabellian sense — to deny any real distinction between Father and Son. We use it in the opposite sense, to affirm that the Son is fully divine while remaining distinct from the Father. The word means the opposite of what Paul meant. And you yourself accept 'like the Father in all things' — a phrase you can qualify away. Homoousios cannot be qualified. That is precisely why we need it.",
        explanation:
          "The strongest possible answer: turns the Antioch precedent back on Arius by showing the context was completely different, then exposes why a term Arius cannot re-interpret is necessary. This is the decisive argument for homoousios.",
        scriptureRef: "John 10:30; Hebrews 1:3",
      },
      {
        id: "r5-partial",
        strength: "partial",
        text:
          "The Church uses theological language not found verbatim in Scripture to express what Scripture teaches with precision. 'Trinity' is not in Scripture either, yet the doctrine is everywhere within it. Homoousios expresses what Hebrews 1:3 says — the Son is 'the exact imprint of God's very being.' A precise term guards against precise errors.",
        explanation:
          "A correct and important argument: extra-scriptural terminology is legitimate and necessary. But it does not address the Antioch condemnation directly, leaving that objection unanswered.",
        scriptureRef: "Hebrews 1:3",
      },
      {
        id: "r5-weak",
        strength: "weak",
        text:
          "Perhaps a formula drawn from scriptural phrases — 'God from God,' 'Light from Light,' 'true God from true God' — might satisfy all parties without the disputed term. The emperor desires unity, and unity has its own virtue in this hour.",
        explanation:
          "An appeal to compromise that Arius would accept eagerly — he could affirm all those scriptural phrases while maintaining the Son is a created being. This response wins peace at the cost of precision, which is exactly what the council must avoid.",
      },
    ],
  },
];

// ─── Scoring helpers ──────────────────────────────────────────────────────────

function pointsForStrength(strength: ResponseStrength): number {
  if (strength === "strong") return STRONG_POINTS;
  if (strength === "partial") return PARTIAL_POINTS;
  return WEAK_POINTS;
}

function calculateVerdict(score: number): CouncilVerdict {
  if (score >= 800) return "victory";
  if (score >= 400) return "draw";
  return "defeat";
}

function getVerdictLabel(score: number): VerdictLabel {
  if (score >= 1000) return "Champion of Nicaea";
  if (score >= 800) return "Defender of the Faith";
  if (score >= 600) return "Faithful Bishop";
  if (score >= 400) return "Wavering Presbyter";
  if (score >= 200) return "Swayed by Heresy";
  return "Lost to Arianism";
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type GameAction =
  | { type: "START_GAME" }
  | {
      type: "SELECT_RESPONSE";
      responseId: string;
      result: ResponseStrength;
      pointsEarned: number;
      roundResult: RoundResult;
    }
  | { type: "NEXT_ROUND"; nextArgument: AriusArgument }
  | { type: "ENTER_VERDICT"; verdict: CouncilVerdict; verdictLabel: VerdictLabel }
  | { type: "SET_TIMER"; timeRemaining: number }
  | { type: "SET_SHARE_TOKEN"; token: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "RESET" };

const INITIAL_STATE: GameState = {
  phase: "intro",
  round: 1,
  totalRounds: TOTAL_ROUNDS,
  score: 0,
  timeRemaining: TIMER_SECONDS,
  currentArgument: null,
  selectedResponse: null,
  responseResult: null,
  roundHistory: [],
  verdict: null,
  verdictLabel: null,
  shareToken: null,
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...INITIAL_STATE,
        phase: "debate",
        currentArgument: NICAEA_ROUNDS[0],
        timeRemaining: TIMER_SECONDS,
      };

    case "SET_TIMER":
      // Ignore timer ticks once the player has responded
      if (state.selectedResponse !== null) return state;
      return { ...state, timeRemaining: action.timeRemaining };

    case "SELECT_RESPONSE":
      // Idempotent — reject double-submission
      if (state.selectedResponse !== null) return state;
      return {
        ...state,
        selectedResponse: action.responseId,
        responseResult: action.result,
        score: state.score + action.pointsEarned,
        roundHistory: [...state.roundHistory, action.roundResult],
      };

    case "NEXT_ROUND":
      return {
        ...state,
        round: state.round + 1,
        currentArgument: action.nextArgument,
        selectedResponse: null,
        responseResult: null,
        timeRemaining: TIMER_SECONDS,
      };

    case "ENTER_VERDICT":
      return {
        ...state,
        phase: "verdict",
        currentArgument: null,
        verdict: action.verdict,
        verdictLabel: action.verdictLabel,
        isLoading: true, // while Firebase saves
      };

    case "SET_SHARE_TOKEN":
      return { ...state, shareToken: action.token, isLoading: false };

    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };

    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNicaeaGame() {
  const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Refs — these let interval callbacks and stable callbacks read current values
  // without stale closures. Updated every render before any callback runs.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRespondedRef = useRef(false);
  const timeRemainingRef = useRef(TIMER_SECONDS);
  const currentArgumentRef = useRef<AriusArgument | null>(null);
  const roundRef = useRef(1);
  const scoreRef = useRef(0);
  const roundHistoryRef = useRef<RoundResult[]>([]);

  // Keep refs current on every render
  currentArgumentRef.current = gameState.currentArgument;
  roundRef.current = gameState.round;
  scoreRef.current = gameState.score;
  roundHistoryRef.current = gameState.roundHistory;

  // ── Timer helpers ──────────────────────────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stable ref so the interval callback can call processResponse without
  // capturing a stale closure over it
  const processResponseRef = useRef<(r: DebateResponse, isTimeout: boolean) => void>(
    () => {}
  );

  const startTimer = useCallback(() => {
    clearTimer();
    hasRespondedRef.current = false;
    timeRemainingRef.current = TIMER_SECONDS;
    dispatch({ type: "SET_TIMER", timeRemaining: TIMER_SECONDS });

    timerRef.current = setInterval(() => {
      timeRemainingRef.current -= 1;
      dispatch({ type: "SET_TIMER", timeRemaining: timeRemainingRef.current });

      if (timeRemainingRef.current <= 0) {
        clearTimer();
        const arg = currentArgumentRef.current;
        if (arg && !hasRespondedRef.current) {
          // Auto-submit the weakest option — spec requirement on timeout
          const weakest =
            arg.responses.find((r) => r.strength === "weak") ??
            arg.responses[arg.responses.length - 1];
          processResponseRef.current(weakest, true);
        }
      }
    }, 1000);
  }, [clearTimer]);

  // Clear timer on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  // ── Core response logic ────────────────────────────────────────────────────

  // processResponse is kept in a ref so startTimer's interval can call the
  // latest version without capturing a stale copy at interval creation time.
  const processResponse = useCallback(
    (response: DebateResponse, isTimeout: boolean) => {
      if (hasRespondedRef.current) return; // guard against double-submission
      hasRespondedRef.current = true;
      clearTimer();

      const timeSpent = TIMER_SECONDS - timeRemainingRef.current;
      const timeBonus =
        !isTimeout && timeSpent < TIME_BONUS_THRESHOLD ? TIME_BONUS_POINTS : 0;
      const pointsEarned = pointsForStrength(response.strength) + timeBonus;

      dispatch({
        type: "SELECT_RESPONSE",
        responseId: response.id,
        result: response.strength,
        pointsEarned,
        roundResult: {
          round: roundRef.current,
          ariusArgument: currentArgumentRef.current?.text ?? "",
          playerResponse: response.text,
          strength: response.strength,
          pointsEarned,
        },
      });
    },
    [clearTimer]
  );

  // Keep the ref current after every render
  processResponseRef.current = processResponse;

  // ── Public API ─────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
    // startTimer must run after START_GAME has set the currentArgument;
    // the dispatch is synchronous inside React's batching, so startTimer
    // can rely on currentArgumentRef being updated on the next render.
    // We set it directly here so the interval sees the right arg immediately.
    currentArgumentRef.current = NICAEA_ROUNDS[0];
    startTimer();
  }, [startTimer]);

  const selectResponse = useCallback(
    (response: DebateResponse) => {
      processResponse(response, false);
    },
    [processResponse]
  );

  // Called by the UI after showing the round result, to advance to next round
  const nextRound = useCallback(async () => {
    const round = roundRef.current;
    const score = scoreRef.current;
    const history = roundHistoryRef.current;

    if (round < TOTAL_ROUNDS) {
      const nextArg = NICAEA_ROUNDS[round]; // round is 1-based; index `round` = next round
      currentArgumentRef.current = nextArg;
      dispatch({ type: "NEXT_ROUND", nextArgument: nextArg });
      startTimer();
    } else {
      // Final round complete — compute verdict and save to Firebase
      const finalVerdict = calculateVerdict(score);
      const finalLabel = getVerdictLabel(score);
      dispatch({ type: "ENTER_VERDICT", verdict: finalVerdict, verdictLabel: finalLabel });

      try {
        const token = await saveScore({
          displayName: "", // service resolves from Firebase auth user
          council: "nicaea",
          score,
          verdict: finalVerdict,
          roundsWon: history.filter((r) => r.strength === "strong").length,
          roundsLost: history.filter((r) => r.strength === "weak").length,
        });
        dispatch({ type: "SET_SHARE_TOKEN", token });
      } catch {
        // Score save failure is non-fatal — game result still shows
        dispatch({
          type: "SET_ERROR",
          error: "Score could not be saved to the leaderboard. Your result is shown below.",
        });
      }
    }
  }, [startTimer]);

  const resetGame = useCallback(() => {
    clearTimer();
    dispatch({ type: "RESET" });
  }, [clearTimer]);

  return { gameState, startGame, selectResponse, nextRound, resetGame };
}

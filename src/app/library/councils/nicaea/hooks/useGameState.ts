"use client";

import { useState, useCallback, useRef } from "react";

export type Phase = "intro" | "debate" | "verdict";

export interface DebateArgument {
  id: string;
  text: string;
  strength: 1 | 2 | 3;
}

export interface DebateExchange {
  round: number;
  playerArgument: DebateArgument;
  ariusResponse: string;
  pointsEarned: number;
}

export interface GameState {
  phase: Phase;
  round: number;
  playerScore: number;
  ariusScore: number;
  history: DebateExchange[];
  isAriusThinking: boolean;
  verdict: "orthodox" | "arian" | null;
}

// 3 rounds, 3 argument choices each. Strength = points awarded to player.
const DEBATE_ROUNDS: DebateArgument[][] = [
  // Round 1 — Eternity of the Son
  [
    {
      id: "r1-strong",
      text: "John 1:1 says 'In the beginning was the Word.' There was no time before the Word. He is eternal — not begotten into time.",
      strength: 3,
    },
    {
      id: "r1-medium",
      text: "If the Son had a beginning, then God was once without His own Logos — incomplete. A changeless God cannot gain a Son.",
      strength: 2,
    },
    {
      id: "r1-weak",
      text: "The Son is surely the highest and most exalted of all God has made, far above angels and all creation.",
      strength: 1,
    },
  ],
  // Round 2 — Salvation and Deification
  [
    {
      id: "r2-strong",
      text: "Only God can save. If Christ is not truly God, our salvation rests on a creature — utterly insufficient for the forgiveness of sins and eternal life.",
      strength: 3,
    },
    {
      id: "r2-medium",
      text: "Athanasius teaches that God became man so man might become God. A mere creature cannot deify us — only the Creator can unite us to divine life.",
      strength: 2,
    },
    {
      id: "r2-weak",
      text: "Christ performed greater miracles than any prophet. His power and authority clearly demonstrate a dignity higher than any other being.",
      strength: 1,
    },
  ],
  // Round 3 — The Homoousios
  [
    {
      id: "r3-strong",
      text: "We need homoousios — of the same substance, not merely similar. Arius himself accepts 'like the Father'; we need language he cannot reinterpret away.",
      strength: 3,
    },
    {
      id: "r3-medium",
      text: "Scripture calls the Son 'God' in Hebrews 1:8, and Thomas confesses 'My Lord and my God.' The Creed must reflect what Scripture plainly teaches.",
      strength: 2,
    },
    {
      id: "r3-weak",
      text: "The emperor desires unity above all. Perhaps homoiousios — of similar substance — is a compromise all parties could accept and sign.",
      strength: 1,
    },
  ],
];

// Arius scores 2 per round regardless — he argued well historically
const ARIUS_SCORE_PER_ROUND = 2;

const INITIAL_STATE: GameState = {
  phase: "intro",
  round: 1,
  playerScore: 0,
  ariusScore: 0,
  history: [],
  isAriusThinking: false,
  verdict: null,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const roundRef = useRef(state.round);
  roundRef.current = state.round;

  const currentArguments = DEBATE_ROUNDS[(state.round - 1)] ?? [];

  const startGame = useCallback(() => {
    setState((s) => ({ ...s, phase: "debate" }));
  }, []);

  const submitArgument = useCallback(async (argument: DebateArgument) => {
    const round = roundRef.current;
    setState((s) => ({ ...s, isAriusThinking: true }));

    let ariusResponse =
      "I maintain my position: the Son was begotten before all ages, the greatest of all that God has made — but made nonetheless.";

    try {
      const res = await fetch("/api/nicaea-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerArgument: argument.text, round }),
      });
      if (res.ok) {
        const data = (await res.json()) as { response?: string };
        if (data.response) ariusResponse = data.response;
      }
    } catch {
      // network failure — fallback response above is used
    }

    setState((s) => {
      const exchange: DebateExchange = {
        round: s.round,
        playerArgument: argument,
        ariusResponse,
        pointsEarned: argument.strength,
      };

      const newPlayerScore = s.playerScore + argument.strength;
      const newAriusScore = s.ariusScore + ARIUS_SCORE_PER_ROUND;
      const nextRound = s.round + 1;
      const isLastRound = nextRound > DEBATE_ROUNDS.length;

      return {
        ...s,
        round: isLastRound ? s.round : nextRound,
        playerScore: newPlayerScore,
        ariusScore: newAriusScore,
        history: [...s.history, exchange],
        isAriusThinking: false,
        phase: isLastRound ? "verdict" : "debate",
        // player needs strictly more points than Arius to carry the council
        verdict: isLastRound
          ? newPlayerScore > newAriusScore
            ? "orthodox"
            : "arian"
          : null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { state, currentArguments, startGame, submitArgument, resetGame };
}

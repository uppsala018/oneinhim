"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

type RosaryMysterySet = {
  key: "joyful" | "sorrowful" | "glorious" | "luminous";
  title: string;
  subtitle: string;
  decades: Array<{ title: string; scripture: string; focus: string }>;
};

type RosaryStep = {
  title: string;
  detail: string;
  decade?: string;
  scripture?: string;
};

const mysterySets: RosaryMysterySet[] = [
  {
    key: "joyful",
    title: "Joyful Mysteries",
    subtitle: "The Incarnation and early life of Christ.",
    decades: [
      { title: "The Annunciation", scripture: "Luke 1:26-38", focus: "The Word becomes flesh." },
      { title: "The Visitation", scripture: "Luke 1:39-56", focus: "Mary brings Christ to Elizabeth." },
      { title: "The Nativity", scripture: "Luke 2:1-20", focus: "The Savior is born in humility." },
      { title: "The Presentation", scripture: "Luke 2:22-38", focus: "Christ is offered in the Temple." },
      { title: "The Finding in the Temple", scripture: "Luke 2:41-52", focus: "Jesus reveals the Father's business." },
    ],
  },
  {
    key: "sorrowful",
    title: "Sorrowful Mysteries",
    subtitle: "The Passion and suffering of Christ.",
    decades: [
      { title: "The Agony in the Garden", scripture: "Matthew 26:36-46", focus: "Watch and pray." },
      { title: "The Scourging at the Pillar", scripture: "John 19:1", focus: "Christ suffers for our healing." },
      { title: "The Crowning with Thorns", scripture: "Matthew 27:27-31", focus: "The King is mocked." },
      { title: "The Carrying of the Cross", scripture: "Luke 23:26-32", focus: "Discipleship is a cross." },
      { title: "The Crucifixion", scripture: "John 19:17-30", focus: "Redemption is accomplished." },
    ],
  },
  {
    key: "glorious",
    title: "Glorious Mysteries",
    subtitle: "The Resurrection, Ascension, and life in the Spirit.",
    decades: [
      { title: "The Resurrection", scripture: "John 20:1-18", focus: "Christ is risen indeed." },
      { title: "The Ascension", scripture: "Acts 1:6-11", focus: "Christ reigns at the Father's right hand." },
      { title: "The Descent of the Holy Spirit", scripture: "Acts 2:1-4", focus: "The Church is filled with power from on high." },
      { title: "The Assumption", scripture: "Revelation 12:1", focus: "Mary is glorified by God's grace." },
      { title: "The Coronation of Mary", scripture: "Revelation 12:1", focus: "The saints share in Christ's victory." },
    ],
  },
  {
    key: "luminous",
    title: "Luminous Mysteries",
    subtitle: "The public ministry of Christ.",
    decades: [
      { title: "The Baptism of the Lord", scripture: "Matthew 3:13-17", focus: "The Father reveals the Son." },
      { title: "The Wedding at Cana", scripture: "John 2:1-11", focus: "Christ manifests His glory." },
      { title: "The Proclamation of the Kingdom", scripture: "Mark 1:14-15", focus: "Repent and believe the Gospel." },
      { title: "The Transfiguration", scripture: "Matthew 17:1-8", focus: "The disciples see Christ's glory." },
      { title: "The Institution of the Eucharist", scripture: "Luke 22:14-20", focus: "Christ gives His Body and Blood." },
    ],
  },
];

function buildRosarySteps(set: RosaryMysterySet): RosaryStep[] {
  const steps: RosaryStep[] = [
    { title: "Sign of the Cross", detail: "Begin in the name of the Father, and of the Son, and of the Holy Spirit." },
    { title: "Apostles' Creed", detail: "Profess the faith of the Church." },
    { title: "Our Father", detail: "Pray the Lord's Prayer." },
    { title: "Hail Mary", detail: "Pray three Hail Marys for faith, hope, and charity." },
    { title: "Glory Be", detail: "Glorify the Holy Trinity." },
  ];

  set.decades.forEach((decade, index) => {
    steps.push(
      {
        title: `Decade ${index + 1}`,
        detail: decade.title,
        decade: decade.title,
        scripture: decade.scripture,
      },
      { title: "Our Father", detail: "Pray one Our Father before the decade." },
    );

    for (let bead = 1; bead <= 10; bead += 1) {
      steps.push({
        title: `Hail Mary ${bead}`,
        detail: "Pray one Hail Mary on each bead.",
        decade: decade.title,
        scripture: decade.scripture,
      });
    }

    steps.push(
      { title: "Glory Be", detail: "Close the decade with praise to the Trinity.", decade: decade.title },
      { title: "Fatima Prayer", detail: "Optional traditional closing prayer.", decade: decade.title },
    );
  });

  steps.push(
    { title: "Hail Holy Queen", detail: "Ask Mary's intercession." },
    { title: "Closing Prayer", detail: "End with gratitude and peace." },
    { title: "Sign of the Cross", detail: "Conclude in the name of the Trinity." },
  );

  return steps;
}

export default function CatholicRosaryPage() {
  const [selectedSet, setSelectedSet] = useState<RosaryMysterySet["key"]>("joyful");
  const [activeStep, setActiveStep] = useState(0);

  const currentSet = mysterySets.find((set) => set.key === selectedSet) ?? mysterySets[0];
  const steps = useMemo(() => buildRosarySteps(currentSet), [currentSet]);
  const currentStep = steps[activeStep] ?? steps[0];

  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <section className="mobile-app-shell min-h-screen lg:hidden">
        <header className="catholic-mobile__topbar">
          <Link href="/library/catholic/saints-devotions" className="catholic-mobile__icon-button" aria-label="Back">
            ←
          </Link>
          <h1>Rosary</h1>
          <Link href="/library/settings" className="catholic-mobile__icon-button" aria-label="Settings">
            ⚙
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-28 pt-6 sm:px-6">
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Catholic Rosary
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              A guided prayer path through the mysteries of Christ.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              The rosary is a repeating prayer that keeps the Gospel before the mind and the heart.
              Use the buttons below to move through one decade at a time.
            </p>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Mystery Set
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {mysterySets.map((set) => (
                <button
                  key={set.key}
                  type="button"
                  onClick={() => {
                    setSelectedSet(set.key);
                    setActiveStep(0);
                  }}
                  className={`rounded-[1.4rem] border p-4 text-left ${
                    selectedSet === set.key
                      ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                      : "border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] text-[var(--color-ink)]"
                  }`}
                >
                  <p className="font-[family-name:var(--font-display)] text-2xl">{set.title}</p>
                  <p className="mt-2 text-sm leading-6 opacity-90">{set.subtitle}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Current Step
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              {currentStep.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{currentStep.detail}</p>
            {currentStep.decade ? (
              <div className="mt-4 rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">Mystery</p>
                <p className="mt-2 text-[var(--color-ink)]">{currentStep.decade}</p>
                {currentStep.scripture ? (
                  <p className="mt-1 text-sm text-[var(--color-highlight)]">{currentStep.scripture}</p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)]"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)]"
              >
                Reset
              </button>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--color-soft)]">
              {activeStep + 1} of {steps.length}
            </p>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Bead Path
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {steps.slice(0, 36).map((step, index) => (
                <button
                  key={`${step.title}-${index}`}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-[1rem] border px-3 py-3 text-left text-sm ${
                    index === activeStep
                      ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                      : "border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] text-[var(--color-ink)]"
                  }`}
                >
                  <span className="block text-xs uppercase tracking-[0.18em] opacity-80">
                    {index + 1}
                  </span>
                  <strong className="mt-1 block">{step.title}</strong>
                </button>
              ))}
            </div>
          </section>
        </main>

        <MobileBottomNav active="Home" />
      </section>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/catholic/saints-devotions"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Saints & Devotions
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Catholic Rosary
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            A guided rosary study path.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            The rosary is a contemplative prayer rooted in the Gospel. This page lets the reader move
            through the prayers and mysteries step by step.
          </p>
        </section>
      </main>
    </>
  );
}

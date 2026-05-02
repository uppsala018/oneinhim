import { Suspense } from "react";
import LxxReader from "@/components/lxx-reader";

export default function OrthodoxLxxPage() {
  return (
    <Suspense>
      <LxxReader />
    </Suspense>
  );
}

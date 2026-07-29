import type { IconName } from "./components/icons";

export type Item = {
  icon: IconName;
  title: string;
  description: string;
};

/* Our Services */
export const services: Item[] = [
  {
    icon: "search",
    title: "Architecture Audit & Diagnostics",
    description:
      "A rigorous, evidence-based assessment of your technology estate. We map dependencies, expose sprawl, and quantify the risk and cost hidden inside fragmented systems.",
  },
  {
    icon: "blueprint",
    title: "Target Architecture Design",
    description:
      "A precise blueprint for where you are going — reference architectures, domain boundaries, and decision records that give every team a single, authoritative direction.",
  },
  {
    icon: "route",
    title: "Modernization & Consolidation",
    description:
      "Pragmatic roadmaps to retire redundancy, consolidate platforms, and migrate workloads without disrupting the business that depends on them.",
  },
  {
    icon: "cloud",
    title: "Cloud & Platform Strategy",
    description:
      "Cloud, data, and platform decisions grounded in economics and resilience — not hype. We design landing zones and platforms your teams can actually operate.",
  },
  {
    icon: "shield",
    title: "Governance & Technology Risk",
    description:
      "Lightweight governance that accelerates rather than obstructs. We install the guardrails, standards, and review cadence that keep architecture coherent as you scale.",
  },
  {
    icon: "handshake",
    title: "Advisory & Fractional Leadership",
    description:
      "Ongoing counsel for boards, CIOs, and engineering leaders — from investment cases to hands-on architectural leadership through critical transitions.",
  },
];

/* Why organizations engage Digital Pearls */
export const whyEngage: Item[] = [
  {
    icon: "compass",
    title: "Clarity in complexity",
    description:
      "We turn tangled, opaque estates into a clear picture leaders can act on — and a direction engineers can build toward with confidence.",
  },
  {
    icon: "gauge",
    title: "Performance you can measure",
    description:
      "Every recommendation ties back to outcomes: lower run-cost, faster delivery, higher reliability. We are accountable to numbers, not narratives.",
  },
  {
    icon: "lock",
    title: "Independent and vendor-neutral",
    description:
      "We hold no product to sell and no platform to push. Our only interest is the architecture that serves your business best.",
  },
  {
    icon: "shield",
    title: "Built for high-stakes environments",
    description:
      "Regulated, mission-critical, and scale-sensitive systems are our home ground. We move deliberately where the cost of error is high.",
  },
];

/* Our Value — the outcomes clients realize */
export const values: Item[] = [
  {
    icon: "layers",
    title: "Consolidated estate",
    description:
      "Fewer systems, clearer ownership, and dramatically less duplication across your technology landscape.",
  },
  {
    icon: "chart",
    title: "Lower total cost",
    description:
      "Reduced licensing, infrastructure, and maintenance spend released back into innovation.",
  },
  {
    icon: "gauge",
    title: "Faster delivery",
    description:
      "Clean boundaries and shared platforms let teams ship with less friction and fewer collisions.",
  },
  {
    icon: "shield",
    title: "Resilience & control",
    description:
      "A controlled architecture that is observable, secure, and ready for what comes next.",
  },
];

/* Our Expertise — domains we work across */
export const expertise = [
  "Enterprise & Solution Architecture",
  "Cloud & Platform Engineering",
  "Data & Integration Architecture",
  "Application Modernization",
  "Security & Technology Risk",
  "Cost Optimization & FinOps",
  "Architecture Governance",
  "Post-Merger Technology Integration",
];

/* Engagement process */
export const process = [
  {
    step: "01",
    title: "Audit",
    description:
      "We begin with a structured audit of your architecture, uncovering sprawl, risk, and the true state of your estate.",
  },
  {
    step: "02",
    title: "Diagnose",
    description:
      "We interpret the evidence — pinpointing root causes, quantifying impact, and prioritizing what matters most.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We define a precise target architecture and a sequenced roadmap to reach it without disrupting the business.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "We guide execution — governing decisions, enabling your teams, and holding the line on architectural intent.",
  },
];

/* Our Philosophy principles */
export const principles = [
  {
    title: "Architecture is a decision, not an accident",
    description:
      "Sprawl is the residue of thousands of local choices made without a shared direction. We replace accidental complexity with deliberate design.",
  },
  {
    title: "Precision over proliferation",
    description:
      "The goal is never more technology. It is the right technology, well-governed, doing exactly what the business requires — and nothing it does not.",
  },
  {
    title: "Evidence before opinion",
    description:
      "We ground every recommendation in the measured reality of your estate. Data settles debates that opinion cannot.",
  },
  {
    title: "Control is a competitive advantage",
    description:
      "A controlled, coherent architecture is faster, cheaper, and safer. Discipline at the core is what lets the edges move quickly.",
  },
];

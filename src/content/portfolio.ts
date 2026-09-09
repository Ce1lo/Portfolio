/**
 * ---------------------------------------------------------------------------
 *  THE ONLY FILE YOU NEED TO EDIT
 * ---------------------------------------------------------------------------
 *  Every visible string on the site lives here: name, headline, about copy,
 *  skills, projects, links, SEO metadata. No component touches hard-coded text.
 *
 *  Any string that still starts with `EDIT:` is a placeholder. Search the file
 *  for `EDIT:` and replace each one before you deploy.
 *
 *  Images are NOT listed here. They come from Google Drive via `npm run sync`
 *  and are matched to slots by Drive folder name (see `imageSlots` below).
 */

export type ProjectStatus = "shipped" | "in-progress" | "planned";

export type SocialLink = {
  label: string;
  href: string;
  /** Phosphor icon name, resolved in src/components/Contact.tsx */
  icon: "github" | "linkedin" | "envelope" | "gitlab" | "globe";
};

export type SkillGroup = {
  title: string;
  /** One plain sentence. Not marketing copy. */
  note: string;
  items: string[];
};

export type Project = {
  name: string;
  status: ProjectStatus;
  period: string;
  /** Max 25 words. What it does and what is hard about it. */
  summary: string;
  /** Concrete engineering decisions, not buzzwords. Shown as a list. */
  highlights: string[];
  stack: string[];
  /** Drive subfolder this project pulls its screenshots from. See imageSlots. */
  imageFolder: string;
  repoUrl: string | null;
  demoUrl: string | null;
};

export type TimelineEntry = {
  period: string;
  title: string;
  detail: string;
};

export const profile = {
  name: "EDIT: Your Full Name",
  /** Short form used in the nav wordmark and the browser tab. */
  shortName: "EDIT: ShortName",
  role: "Backend Engineer",
  location: "Ho Chi Minh City, Vietnam",
  email: "EDIT: you@example.com",
  /** Set to a real path in /public once you have one, or leave null to hide the button. */
  resumeUrl: null as string | null,
  /** Availability is real semantic state, so it is rendered as a status pill in the hero. */
  availability: "Open to Backend Intern roles from March 2027",
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "EDIT: https://github.com/your-username", icon: "github" },
  { label: "LinkedIn", href: "EDIT: https://www.linkedin.com/in/your-handle", icon: "linkedin" },
  { label: "Email", href: "mailto:EDIT: you@example.com", icon: "envelope" },
];

/**
 * Nav labels double as section ids. Keep label and id in sync, because the
 * scroll-spy in src/components/Nav.tsx matches `id` against the viewport.
 */
export const nav = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * One label per intent across the whole page. The hero secondary CTA, the nav
 * CTA and the contact section button all say exactly this. Do not introduce a
 * second phrasing such as "Contact me" or "Let's talk".
 */
export const CTA_LABELS = {
  primary: "View projects",
  secondary: "Get in touch",
} as const;

export const hero = {
  /**
   * Max 2 lines at desktop. Font scale is set in Hero.tsx to match this length,
   * so if you make it longer, drop a size there.
   */
  headline: ["I build backend systems", "that stay correct under load."],
  /** Max 20 words, enforced by the copy audit in docs/DECISIONS.md. */
  subtext:
    "Final-year CS student at PTIT HCMC, building Java and Spring Boot services where the database is the source of truth.",
  /** Seed for the placeholder photo used until the first Drive sync lands a real one. */
  fallbackSeed: "backend-engineer-workspace-terminal",
} as const;

export const about = {
  headline: "Correctness first, then throughput.",
  paragraphs: [
    "I am in my final year of Computer Science at PTIT Ho Chi Minh City, working through a 25-week backend roadmap that runs from modern Java to distributed system design. The goal is a Backend Intern role in March 2027, and every week of the plan is built to produce something I can defend in a technical interview.",
    "My default position on concurrency is that the database is the only source of truth. A unique constraint, an optimistic lock version, or SELECT FOR UPDATE is what actually prevents overselling. Caches and distributed locks sit in front of that to shape user experience, never to replace it. If you delete every Redis key in the system, the invariants still hold.",
    "Outside the roadmap I keep a DSA practice log and write up what I get wrong. I would rather show a debugging trace and a corrected mental model than a screenshot of green tests.",
  ],
} as const;

export const skillGroups: SkillGroup[] = [
  {
    title: "Language and runtime",
    note: "Java 21 LTS, with the JVM treated as something to understand rather than ignore.",
    items: ["Java 21", "Records", "Sealed types", "Pattern matching", "Streams", "Virtual threads", "JMM", "GC basics"],
  },
  {
    title: "Framework and data",
    note: "Spring Boot pinned to 3.5.x through the whole roadmap, no mid-project framework hops.",
    items: [
      "Spring Boot 3.5",
      "Spring Security 6.5",
      "Spring Data JPA",
      "Hibernate",
      "PostgreSQL",
      "Flyway",
      "Redis",
      "RabbitMQ",
    ],
  },
  {
    title: "Delivery and verification",
    note: "A change is not done until it is measured, containerised, and covered by a test.",
    items: ["Docker", "GitHub Actions", "JUnit 5", "Testcontainers", "k6", "Prometheus", "Grafana", "Oracle Cloud ARM"],
  },
];

export const projects: Project[] = [
  {
    name: "High-Concurrency Ticket Booking",
    status: "in-progress",
    period: "2026 - 2027",
    summary:
      "A modular monolith for event ticket booking built to survive a flash sale. The interesting problem is never selling the same seat twice while thousands of requests race for it.",
    highlights: [
      "Oversell prevention lives in PostgreSQL: a unique constraint on (event_id, seat_id) plus an @Version optimistic lock, with SELECT FOR UPDATE on the hot checkout path.",
      "Redis seat holds exist purely for UX feedback. Flushing Redis degrades the experience but cannot produce a double booking.",
      "Seat map reads are cached and invalidated by write-through, never by TTL guessing.",
      "Checkout emits a domain event to RabbitMQ; notification and PDF ticket generation are separate consumers with idempotent handlers.",
      "Load is verified with k6 against a promotion target, with Prometheus scraping Micrometer and slow query logging on PostgreSQL.",
    ],
    stack: ["Java 21", "Spring Boot 3.5", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Flyway", "k6"],
    imageFolder: "projects/ticket-booking",
    repoUrl: null,
    demoUrl: null,
  },
  {
    name: "Order Analytics Pipeline",
    status: "in-progress",
    period: "2026",
    summary:
      "A pure-Java analytics exercise over an order dataset. Written to make the Stream API and the java.time classes automatic rather than something I look up.",
    highlights: [
      "Custom Collector implementations for windowed revenue aggregation instead of repeated imperative loops.",
      "Grouping and partitioning pipelines over a large in-memory dataset, measured for allocation rather than guessed at.",
      "All date arithmetic on java.time with explicit zones, no java.util.Date anywhere in the codebase.",
    ],
    stack: ["Java 21", "Stream API", "java.time", "JUnit 5"],
    imageFolder: "projects/order-analytics",
    repoUrl: null,
    demoUrl: null,
  },
  {
    name: "Product Sorter",
    status: "shipped",
    period: "2026",
    summary:
      "A sorting and filtering library built as a deliberate exercise in modern Java idioms: Optional, functional interfaces, method references, and Stream pipelines.",
    highlights: [
      "Comparator chains composed with thenComparing and nullsLast rather than nested if statements.",
      "Optional used as a return type for lookups, never as a field or a parameter.",
      "Functional interfaces extracted so callers can supply a strategy without inheriting a base class.",
    ],
    stack: ["Java 21", "Optional", "Stream API", "Lambda"],
    imageFolder: "projects/product-sorter",
    repoUrl: null,
    demoUrl: null,
  },
];

export const timeline: TimelineEntry[] = [
  {
    period: "2023 - 2027",
    title: "BEng, Computer Science",
    detail: "Posts and Telecommunications Institute of Technology, Ho Chi Minh City campus.",
  },
  {
    period: "Aug - Oct 2026",
    title: "Java core and modern language features",
    detail: "OOP, collections, generics, exceptions and IO, then Optional, Stream, functional interfaces and java.time.",
  },
  {
    period: "Oct - Dec 2026",
    title: "Networking, SQL and transaction semantics",
    detail: "HTTP, PostgreSQL modelling, indexing, isolation levels, and the failure modes each isolation level actually prevents.",
  },
  {
    period: "Dec 2026 - Feb 2027",
    title: "Spring Boot and the booking system build",
    detail: "Spring core, MVC, JPA, validation, security, testing, caching, then the eight-week ticket booking project.",
  },
  {
    period: "Mar 2027",
    title: "Backend Intern",
    detail: "Target start date. Interview preparation covers database internals, system design and mock technical rounds.",
  },
];

/**
 * Drive folder name -> page slot.
 *
 * Put a photo in a Drive subfolder with one of these names and `npm run sync`
 * will place it in the matching slot automatically. Anything that does not match
 * a slot lands in the Gallery.
 */
export const imageSlots = {
  hero: "hero",
  about: "about",
  gallery: "gallery",
} as const;

/**
 * Every value here must be verifiable from the repo or the roadmap. Invented
 * metrics are worse than no metrics, so this list stays short and factual.
 */
export const stats = [
  { value: "25", label: "week backend roadmap" },
  { value: "W4", label: "current phase, modern Java" },
  { value: "Mar 2027", label: "intern start target" },
] as const;

export const site = {
  /** Used for the canonical URL, sitemap and OG tags. Update after the first deploy. */
  url: "https://EDIT-your-project.vercel.app",
  title: `${profile.name} - Backend Engineer`,
  description:
    "Portfolio of a final-year CS student at PTIT HCMC building Java and Spring Boot backends, with a high-concurrency ticket booking system as the main project.",
  /** Locale for <html lang>. Change to "vi" if you rewrite the copy in Vietnamese. */
  locale: "en",
  themeColor: "#c2410c",
} as const;

/** Source: Heather's "NEW WEB DIRECTION" doc (11/11/26). Copy is hers; edit here to refine. */
export interface ProcessStep { n: string; title: string; body: string[] }
export interface ProcessPhase { n: string; title: string; intro: string; steps: ProcessStep[] }

export const PROCESS_INTRO = "Building or renovating a home involves hundreds of decisions. Our process brings structure and clarity to each stage—aligning your vision, design, and investment while guiding you from our first conversation through move-in and beyond.";

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    n: "1",
    title: "Discover & Plan",
    intro: "Every exceptional home begins with a thoughtful plan. We take the time to understand your vision, evaluate your property, and establish a clear direction before design begins.",
    steps: [
      { n: "01", title: "Introductory Meeting", body: ["We begin with a conversation about your vision, priorities, anticipated timeline, and investment expectations. We'll introduce you to John Buchan Homes, explain our approach, and explore whether we're the right fit for your project."] },
      { n: "02", title: "Your Vision & Program", body: ["Together, we'll establish what matters most in your new home. You'll develop a room-by-room program outlining your needs, preferences, and priorities, along with inspiration images that help communicate your architectural and design style. This becomes an important foundation for the design process."] },
      { n: "03", title: "Property Evaluation & Feasibility", body: ["Before moving forward, we evaluate your property to identify opportunities, constraints, and potential challenges. We consider site conditions, zoning requirements, and development regulations, and discuss a likely construction cost range based on the general scope of your project. This early evaluation helps determine what's achievable and whether your vision aligns with your intended investment."] },
    ],
  },
  {
    n: "2",
    title: "Design & Pre-Construction",
    intro: "Thoughtful preparation is the foundation of a successful build. We bring together the right design expertise, evaluate costs as plans develop, and coordinate the details necessary to move into construction with confidence.",
    steps: [
      { n: "04", title: "Design Team & Collaboration", body: ["The right team makes all the difference. Whether you've already selected an architect or designer or need help assembling your team, we tailor our approach to your project. With our in-house interior designers and trusted design partners, we bring together the expertise needed to ensure your vision, design decisions, and investment remain aligned throughout the process."] },
      { n: "05", title: "Concept & Preliminary Estimate", body: ["As your initial design takes shape, we develop preliminary specifications informed by our experience and understanding of your vision. These specifications provide a documented foundation for a realistic preliminary construction estimate.", "Together, the concept, specifications, and estimate allow us to evaluate costs, explore alternatives, and guide design decisions before committing to more detailed development."] },
      { n: "06", title: "Design Development & Selections", body: ["With a concept and budget direction established, the design moves into greater detail. Architectural elements, building systems, materials, fixtures, and finishes are developed and coordinated. Our team works collaboratively to ensure selections are cohesive, practical, and consistent with the project's overall investment."] },
      { n: "07", title: "Detailed Estimate & Construction Readiness", body: ["As the design is finalized, we coordinate the construction drawings, drafting, engineering, and permitting required to prepare your project for construction. We obtain detailed pricing from our trusted trade partners and develop a comprehensive construction estimate supported by clear specifications.", "Throughout this process, we work to resolve outstanding details, evaluate costs, and establish the scope, schedule, and construction arrangements needed for a well-organized start."] },
    ],
  },
  {
    n: "3",
    title: "Build Your Home",
    intro: "With plans and preparations in place, your home begins to take shape. Our experienced team manages construction with careful coordination, consistent communication, and an unwavering commitment to quality.",
    steps: [
      { n: "08", title: "Project Kickoff & Mobilization", body: ["Before construction begins, there's important work to do behind the scenes. We coordinate our field team and trade partners, confirm schedules, arrange materials and equipment, and prepare the site for construction.", "We'll also hold a project kickoff meeting to introduce you to your dedicated superintendent and our portal and warranty administrator. We'll walk you through the Homeowner Portal, explain how we'll communicate throughout construction, and answer your questions about what to expect as work gets underway."] },
      { n: "09", title: "Construction & Quality Control", body: ["Your dedicated superintendent oversees daily construction, coordinating our craftsmen and trade partners while maintaining our standards for workmanship and quality. We keep you informed through regular communication, project updates, and our Homeowner Portal, where important information, decisions, and project documentation are readily accessible."] },
      { n: "10", title: "Final Quality Review & Completion", body: ["Quality is monitored throughout construction, not just at the end. As your home nears completion, our team conducts detailed internal reviews to confirm that the work meets our standards and identify any outstanding items. We see those items through to completion, coordinate final inspections, and prepare your home for orientation and move-in."] },
    ],
  },
  {
    n: "4",
    title: "Welcome Home & Beyond",
    intro: "The completion of construction marks the beginning of life in your new home, not the end of our relationship. We're here to make the transition seamless and provide continued support for years to come.",
    steps: [
      { n: "11", title: "Home Orientation & Move-In", body: ["Before you settle in, we'll guide you through a personalized orientation of your new home. We'll introduce its systems, equipment, features, and maintenance requirements, answer your questions, and provide the information you'll need to care for your home with confidence."] },
      { n: "12", title: "Warranty & Long-Term Care", body: ["Our commitment to your home continues long after move-in. We stand behind our work with comprehensive warranty coverage and responsive service. When an issue affects your ability to use or enjoy your home, we prioritize prompt attention, typically arranging a service visit within 48 hours, often sooner. Non-urgent cosmetic adjustments are generally addressed during the one-year warranty review.", "Beyond warranty coverage, Buchan Residential Services offers ongoing maintenance and home improvement services, providing a trusted resource for caring for your home in the years ahead."] },
    ],
  },
];

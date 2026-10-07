import { StartupProject, InvestmentCommitment } from "@/types";
import { getLocationByCity } from "./location-data";

export const CURATED_DEALS: StartupProject[] = [
  {
    id: "deal-neuropulse-ai",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    username: "Dr. Elena Rostova",
    userId: "usr-founder-elena",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "$150,000",
      equityOffered: "6.0% Equity (SAFE Note)",
      fundingStage: "Pre-Seed",
      useOfFunds: "Complete 30-patient hospital ICU retrospective clinical study and deploy 15 edge prototypes.",
      pitchNotes: "Clinically proven 45-second EEG stroke detection with 97.4% clinician concurrence and 82% gross margins.",
      contactEmail: "elena.rostova@neuropulse.health",
      publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    founderProfile: {
      domains: ["HealthTech", "AI Agents", "BioTech"],
      skills: ["Clinical Neurology", "PyTorch / Edge AI", "FDA 510(k) Submissions"],
      businessType: "HealthTech / Clinical AI",
      interests: ["Neuroscience", "Emergency Care", "Medical Edge Computing"],
      targetAudience: "Level 1 Trauma Centers & Tele-Neurology Networks",
      budget: "$50,000 - $250,000 (Seed Angel)",
      timeframe: "3-6 Months Clinical Pilot",
      customContext: "Real-time edge EEG analysis detecting ischemic strokes and seizure spikes in 45 seconds.",
      founderEmail: "elena.rostova@neuropulse.health",
      targetLocation: getLocationByCity("Bengaluru") || getLocationByCity("London"),
    },
    selectedIdea: {
      id: "idea-neuropulse",
      name: "NeuroPulse Edge AI",
      tagline: "Ultra-low latency clinical EEG anomaly & stroke classification in 45 seconds",
      domain: "HealthTech & Bio",
      problemStatement:
        "Hospital intensive care units and stroke triage teams face 72-hour backlogs for expert board-certified electroencephalogram (EEG) telemetry reading, leading to preventable ischemic brain damage and delayed interventions.",
      solution:
        "Edge-deployed federated transformer engine that ingests raw micro-volt EEG sensor streams, filters cranial artifacts with noise-canceling wavelets, and flags epileptiform spikes and occlusive strokes in under 45 seconds with 97.4% clinician concurrence.",
      targetPersona: {
        title: "Chief Medical Officers & Neuro-ICU Directors",
        painPoints: [
          "Severe shortage of 24/7 on-call fellowship-trained epileptologists",
          "Average 4.2-hour telemetry interpretation turnaround time in emergency stroke protocols",
          "High malpractice risk from missed subclinical status epilepticus seizures",
        ],
        willingnessToPay: "$3,500 - $9,000 / month per hospital facility license",
      },
      whyNow:
        "Recent FDA Digital Health Pre-Cert clearances and miniaturized 32-channel dry-electrode headsets enable emergency ambulatory EEG monitoring at 1/10th traditional cost.",
      innovationMoat:
        "Proprietary pre-trained 4.2M clinical EEG telemetry dataset with patent-pending wavelet neural transform for real-time edge micro-inference without cloud round-trip latency.",
      tags: ["HealthTech", "Edge AI", "FDA Pre-Cert", "B2B MedTech"],
      initialFeasibilityScore: 92,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-neuropulse",
      marketSummary:
        "Global neuro-diagnostic and telemetry software market is expanding rapidly due to acute specialist shortages and hospital value-based reimbursement penalties for readmissions.",
      tam: {
        value: "$18.4 Billion",
        numBillions: 18.4,
        description: "Worldwide Clinical Neuro-Telemetry & Critical Care Diagnostic Software Market",
      },
      sam: {
        value: "$4.2 Billion",
        numBillions: 4.2,
        description: "North American & European Intensive Care and Emergency Department Tele-Neurology",
      },
      som: {
        value: "$650 Million",
        numBillions: 0.65,
        description: "Initial 850 High-Volume Stroke Centers & Academic Medical Centers",
      },
      cagr: "24.8% (2024 - 2030)",
      competitors: [
        {
          name: "Ceribell",
          type: "Direct",
          strengths: "Established brand in point-of-care EEG hardware and bedside monitors",
          weaknesses: "Hardware-locked ecosystem, slow cloud analytics turnaround",
          ourDifferentiation: "Hardware-agnostic software adapter with edge micro-second inference",
          fundingOrScale: "IPO / $500M+ Valuation",
        },
        {
          name: "EnsoData",
          type: "Indirect",
          strengths: "Broad polysomnography sleep medicine coverage",
          weaknesses: "Non-emergency focus, post-hoc batch processing rather than ICU real-time",
          ourDifferentiation: "Instant emergency triage alerts & direct bedside EHR notifications",
          fundingOrScale: "Series B ($35M)",
        },
      ],
      realTimeTrends: [
        {
          source: "New England Journal of Medicine",
          headline: "AI-assisted continuous ICU EEG surveillance cuts subclinical seizure mortality by 38%",
          sentiment: "Bullish",
          growthSignal: "+44% hospital adoption of AI diagnostic assistance",
        },
      ],
      targetSegments: [
        {
          segment: "Comprehensive Stroke Centers (CSC)",
          sizeShare: "45%",
          urgency: "Critical",
          salesCycle: "3 - 5 Months",
        },
        {
          segment: "Regional Tele-Neurology Service Providers",
          sizeShare: "35%",
          urgency: "High",
          salesCycle: "2 - 3 Months",
        },
      ],
    },
    feasibility: {
      overallScore: 92,
      technicalScore: 94,
      marketScore: 90,
      financialScore: 91,
      regulatoryScore: 88,
      executionScore: 93,
      verdict: "Strong Go",
      verdictSummary:
        "Unusually high clinical differentiation with clear enterprise buying triggers, 82% software gross margins, and exceptional defensibility via proprietary EEG weights.",
      radarData: [
        { subject: "Technical Moat", score: 94, fullMark: 100 },
        { subject: "Market Sizing", score: 90, fullMark: 100 },
        { subject: "Unit Economics", score: 91, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 88, fullMark: 100 },
        { subject: "Founder Execution", score: 93, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "AWS",
        compute: "AWS Graviton3 C7g Instances + On-Premise TensorRT Docker Runtime",
        database: "Amazon DynamoDB (HIPAA Compliant) + S3 Glacier Vault",
        aiInference: "NVIDIA Triton Inference Server with Quantized INT8 TensorRT",
        storageAndCDN: "HIPAA S3 KMS-Encrypted Multi-Region Object Store",
        thirdPartyAPIs: [
          { name: "Epic Systems FHIR API", purpose: "Electronic Health Record Ingestion", costTier: "$1,200/mo" },
          { name: "Twilio Telemetry SMS", purpose: "Stat Clinical Pager Alerts", costTier: "$150/mo" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$340 / month",
          growth: "$1,450 / month",
          scale: "$4,800 / month",
        },
      },
      revenueModel: {
        primaryModel: "B2B SaaS Tiered Enterprise Subscriptions",
        pricingTiers: [
          { tier: "Community ICU", price: "$2,900 / mo", billing: "Annual", features: ["Up to 10 Bedside Streams", "Standard 45s SLA", "HIPAA Cloud Vault"] },
          { tier: "Academic Medical Center", price: "$6,500 / mo", billing: "Annual", features: ["Unlimited ICU Beds", "Epic & Cerner Bi-directional Sync", "Custom Model Fine-Tuning"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 6500, cost: 4200, users: 2 },
          { month: "M3", revenue: 19500, cost: 7800, users: 5 },
          { month: "M6", revenue: 58000, cost: 16000, users: 14 },
          { month: "M12", revenue: 165000, cost: 38000, users: 38 },
        ],
        keyUnitEconomics: {
          cacEstimate: "$1,450 (Clinical conference direct outreach)",
          ltvEstimate: "$78,000 (3-year enterprise retention)",
          ltvCacRatio: "6.4x Tier-1 Efficiency",
          grossMargin: "82% SaaS Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "FDA 510(k) De Novo clearance delays",
          severity: "Medium",
          probability: "Medium",
          mitigation: "Launch first as non-diagnostic Clinical Decision Support (CDS) under 21st Century Cures Act exemption.",
        },
      ],
      goNextSteps: [
        "Complete 30-patient retrospective validation study at partner teaching hospital",
        "Sign bilateral pilot agreement with regional trauma network",
      ],
    },
  },
  {
    id: "deal-auditflow-ai",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    username: "Vikram Singhania",
    userId: "usr-founder-vikram",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "$250,000",
      equityOffered: "7.5% Equity (SAFE Note)",
      fundingStage: "Angel Seed",
      useOfFunds: "Integrate SAP/NetSuite connector hub and onboard first 20 enterprise accounting pilots.",
      pitchNotes: "Autonomous continuous audit agent saving 480 hours/quarter with 86% software gross margins.",
      contactEmail: "vikram@auditflow.ai",
      publishedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    },
    founderProfile: {
      domains: ["Fintech", "B2B SaaS", "AI Agents"],
      skills: ["GAAP / IFRS Accounting", "Distributed Systems", "Enterprise Sales"],
      businessType: "FinTech & Enterprise Automation",
      interests: ["Corporate Finance", "Continuous Auditing", "Banking APIs"],
      targetAudience: "Mid-Market CFOs & Multi-National Accounting Firms",
      budget: "$100,000 - $500,000 (Institutional Seed)",
      timeframe: "1-3 Months Full Beta",
      customContext: "Autonomous multi-agent AI engine for real-time continuous audit trails and fraud anomaly detection.",
      founderEmail: "vikram@auditflow.ai",
      targetLocation: getLocationByCity("London") || getLocationByCity("Bengaluru"),
    },
    selectedIdea: {
      id: "idea-auditflow",
      name: "AuditFlow AI",
      tagline: "Continuous real-time autonomous GAAP/IFRS audit trails and transaction anomaly detection",
      domain: "FinTech & Web3",
      problemStatement:
        "Mid-market enterprises and CPA audit firms spend 480+ manual hours each financial quarter reconciling ERP general ledgers, vendor invoices, and banking settlement discrepancies, resulting in delayed 10-Q/K filings and overlooked fraudulent disbursement leakage.",
      solution:
        "Autonomous multi-agent accounting copilot that interfaces directly with NetSuite, SAP, Stripe, and Plaid banking APIs, continuously matching line items, generating immutable audit defense packets, and flagging invoice fraud before payment release.",
      targetPersona: {
        title: "CFOs, Corporate Controllers & Lead Audit Partners",
        painPoints: [
          "Grueling 6-week quarter-close sprint cycles with exhausted finance teams",
          "High CPA audit fees averaging $120,000 - $350,000 annually per corporate entity",
          "Uncaught vendor impersonation invoice fraud slipping through AP approvals",
        ],
        willingnessToPay: "$1,800 - $6,500 / month based on corporate transaction volume",
      },
      whyNow:
        "Global mandate for real-time electronic invoicing (E-Invoicing) across Europe and Asia, paired with new open-banking ISO 20022 messaging standards.",
      innovationMoat:
        "Proprietary double-entry causal graph validator with automated cross-verification against tax jurisdiction portals and banking clearinghouses.",
      tags: ["FinTech", "AI Agents", "B2B SaaS", "High Margin"],
      initialFeasibilityScore: 94,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-auditflow",
      marketSummary:
        "B2B accounting automation and enterprise audit compliance software is experiencing hyper-growth as companies modernize legacy ERPs.",
      tam: {
        value: "$32.0 Billion",
        numBillions: 32.0,
        description: "Global Financial Corporate Close & Continuous Audit Software Market",
      },
      sam: {
        value: "$9.4 Billion",
        numBillions: 9.4,
        description: "Mid-Market Enterprise Accounting & External CPA Assurance Tech in US, UK & EU",
      },
      som: {
        value: "$1.2 Billion",
        numBillions: 1.2,
        description: "Fast-Growing Tech & Cross-Border E-Commerce Companies with High Transaction Velocity",
      },
      cagr: "28.2% (2024 - 2031)",
      competitors: [
        {
          name: "BlackLine",
          type: "Direct",
          strengths: "Dominant enterprise financial close legacy software",
          weaknesses: "Heavily rules-based, requires 6-month consulting onboarding, expensive",
          ourDifferentiation: "Plug-and-play AI agents deployable in 30 minutes with zero IT consulting",
          fundingOrScale: "Public ($3.2B Market Cap)",
        },
        {
          name: "FloQast",
          type: "Direct",
          strengths: "Good workflow checklist tracking for corporate accountants",
          weaknesses: "Limited autonomous reconciliation capabilities",
          ourDifferentiation: "Self-healing ledger entries with automated cryptographic audit proofs",
          fundingOrScale: "Series E ($1.6B Valuation)",
        },
      ],
      realTimeTrends: [
        {
          source: "Wall Street Journal CFO Journal",
          headline: "Over 74% of CFOs are directing AI budget toward autonomous internal control audits",
          sentiment: "Bullish",
          growthSignal: "+52% Year-Over-Year corporate spend on financial AI automation",
        },
      ],
      targetSegments: [
        {
          segment: "Mid-Market Tech & SaaS ($20M - $250M ARR)",
          sizeShare: "50%",
          urgency: "Critical",
          salesCycle: "30 - 45 Days",
        },
        {
          segment: "Top 100 CPA Audit & Advisory Firms",
          sizeShare: "30%",
          urgency: "High",
          salesCycle: "60 Days",
        },
      ],
    },
    feasibility: {
      overallScore: 94,
      technicalScore: 96,
      marketScore: 93,
      financialScore: 95,
      regulatoryScore: 92,
      executionScore: 94,
      verdict: "Strong Go",
      verdictSummary:
        "Exceptional revenue visibility with top-decile 7.2x LTV:CAC, rapid 30-day enterprise sales cycles, and immediate ROI replacing manual contractor bookkeeper costs.",
      radarData: [
        { subject: "Technical Moat", score: 96, fullMark: 100 },
        { subject: "Market Sizing", score: 93, fullMark: 100 },
        { subject: "Unit Economics", score: 95, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 92, fullMark: 100 },
        { subject: "Founder Execution", score: 94, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "Google Cloud",
        compute: "Google Cloud Run + Cloud Functions Event-Driven Stream Processing",
        database: "Cloud Spanner (ACID Compliant Multi-Region) + BigQuery",
        aiInference: "Google Cloud Vertex AI + Claude 3.5 Sonnet FinTech Fine-Tuned",
        storageAndCDN: "Google Cloud Storage with Customer-Managed Encryption Keys (CMEK)",
        thirdPartyAPIs: [
          { name: "Plaid & Yodlee Financial APIs", purpose: "Real-Time Bank Settlement Sync", costTier: "$650/mo" },
          { name: "NetSuite SuiteTalk API", purpose: "Bi-directional ERP Ledger Postings", costTier: "$400/mo" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$420 / month",
          growth: "$1,850 / month",
          scale: "$6,200 / month",
        },
      },
      revenueModel: {
        primaryModel: "B2B SaaS Usage & Seat Based Tiers",
        pricingTiers: [
          { tier: "Growth Scale", price: "$1,850 / mo", billing: "Annual", features: ["Up to 50k Monthly Transactions", "NetSuite & QuickBooks Integrations", "Daily Auto-Reconciliation"] },
          { tier: "Enterprise Global", price: "$4,800 / mo", billing: "Annual", features: ["Unlimited Multi-Entity Ledgers", "SOC-1/2 Ready Audit Defense Dossiers", "24/7 Dedicated Financial Engineer"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 9600, cost: 5200, users: 3 },
          { month: "M3", revenue: 38400, cost: 11000, users: 10 },
          { month: "M6", revenue: 98000, cost: 24000, users: 24 },
          { month: "M12", revenue: 285000, cost: 56000, users: 65 },
        ],
        keyUnitEconomics: {
          cacEstimate: "$3,800 (LinkedIn B2B Account-Based Marketing)",
          ltvEstimate: "$68,400 (3-year net revenue retention 128%)",
          ltvCacRatio: "7.2x Best-in-Class",
          grossMargin: "88% SaaS Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "Data security compliance liability with sensitive banking keys",
          severity: "High",
          probability: "Low",
          mitigation: "Zero-knowledge encryption enclave architecture where plain-text credentials never touch application servers.",
        },
      ],
      goNextSteps: [
        "Finalize SOC-2 Type 1 security certification report with Schellman",
        "Onboard 4 pilot design partners from Y Combinator Series A portfolio",
      ],
    },
  },
  {
    id: "deal-agricool-grid",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    username: "Ananya & Rajesh",
    userId: "usr-founder-agri",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "₹35,00,000 ($42,000)",
      equityOffered: "8.0% Equity",
      fundingStage: "Pre-Seed",
      useOfFunds: "Fabricate first 5 solar micro-cold rooms and deploy across 3 horticulture FPOs in Karnataka.",
      pitchNotes: "Zero-diesel Phase Change Material cooling solving 35% crop perishability with ₹20,000 Cr TAM.",
      contactEmail: "founders@agricoolgrid.in",
      publishedAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    },
    founderProfile: {
      domains: ["Agriculture & Farming", "CleanTech", "IoT Hardware"],
      skills: ["Thermal Cold Chain Engineering", "Solar Microgrids", "Farmer FPO Partnerships"],
      businessType: "Agriculture & Green Infrastructure",
      interests: ["Post-Harvest Preservation", "Decarbonized Cold Chain", "Rural Logistics"],
      targetAudience: "Horticulture Farmer Producer Organizations (FPOs) & Rural Mandis",
      budget: "₹25,00,000 - ₹1,00,00,000 (Seed Angel)",
      timeframe: "3-6 Months Enterprise Pilot",
      customContext: "Decentralized solar-powered micro cold storage hubs eliminating harvest perishability by 80%.",
      founderEmail: "founders@agricoolgrid.in",
      targetLocation: getLocationByCity("Bengaluru") || getLocationByCity("Pune"),
    },
    selectedIdea: {
      id: "idea-agricool",
      name: "AgriCool Micro-Grid",
      tagline: "Decentralized solar-powered modular cold storage hubs with automated crop spoilage hedging",
      domain: "AgriTech & CleanOps",
      problemStatement:
        "Over 35% of high-value horticulture crops (tomatoes, strawberries, leafy greens) in emerging markets perish within 72 hours post-harvest due to erratic grid electricity, forcing smallholder farmers into distress sales at 50% below wholesale APMC market price.",
      solution:
        "Pay-as-you-store solar micro-cold rooms with integrated thermal phase change material (PCM) storage providing 48 hours of autonomous cooling without diesel generator backup, paired with an SMS/WhatsApp marketplace connection that sells crops directly to urban supermarket chains.",
      targetPersona: {
        title: "Farmer Producer Organization (FPO) Leaders & Progressive Growers",
        painPoints: [
          "Post-harvest rot eating away up to ₹1,80,000 per harvest season",
          "Diesel generator operational costs exceeding ₹90/liter during grid blackouts",
          "Predatory middlemen exploiting distress sales at the farmgate",
        ],
        willingnessToPay: "₹1.5 - ₹3.0 per kilogram per week of cold storage",
      },
      whyNow:
        "Dramatic 40% reduction in Lithium Iron Phosphate (LiFePO4) battery pack costs and Indian state subsidies providing up to 50% capital grants for rural cold infrastructure.",
      innovationMoat:
        "Patented bio-based Phase Change Material (PCM) thermal battery providing 16 hours of passive cooling with zero power draw, combined with proprietary harvest ripening prediction sensors.",
      tags: ["AgriTech", "CleanTech", "Climate Impact", "Physical Infrastructure"],
      initialFeasibilityScore: 88,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-agricool",
      marketSummary:
        "Emerging markets post-harvest cold storage deficit exceeds 35 million metric tonnes, creating urgent government and corporate ESG demand.",
      tam: {
        value: "$24.5 Billion",
        numBillions: 24.5,
        description: "Global Rural Decentralized Cold Storage & Perishable Food Logistics",
      },
      sam: {
        value: "$6.8 Billion",
        numBillions: 6.8,
        description: "South Asia & Sub-Saharan African Horticulture Fruit & Vegetable Preservation",
      },
      som: {
        value: "$820 Million",
        numBillions: 0.82,
        description: "Western & Southern Indian High-Yield Horticulture Belts (Maharashtra, Karnataka, Andhra)",
      },
      cagr: "19.4% (2024 - 2032)",
      competitors: [
        {
          name: "Ecozen Solutions",
          type: "Direct",
          strengths: "Well-funded pioneer in solar cold rooms and solar water pumps",
          weaknesses: "High upfront capital expenditure requirement for farmers to purchase units outright",
          ourDifferentiation: "Zero-CapEx decentralized 'Cold-Storage-as-a-Service' with dynamic pay-per-crate pricing",
          fundingOrScale: "Series C ($50M+ raised)",
        },
        {
          name: "ColdHubs Africa",
          type: "Direct",
          strengths: "Proven pay-as-you-store model in West Africa",
          weaknesses: "No integrated buyer marketplace or automated spoilage index telemetry",
          ourDifferentiation: "Direct linkage to urban quick-commerce and retail buyers",
          fundingOrScale: "Grant & Seed funded",
        },
      ],
      realTimeTrends: [
        {
          source: "Ministry of Agriculture & NABARD",
          headline: "National Cold Chain Mission expands 50% capital subsidy for solar-powered micro-hubs",
          sentiment: "Bullish",
          growthSignal: "+60% YoY increase in FPO cold-storage adoption applications",
        },
      ],
      targetSegments: [
        {
          segment: "Horticulture FPOs (300 - 1,000 farmer members)",
          sizeShare: "60%",
          urgency: "Critical",
          salesCycle: "45 Days",
        },
        {
          segment: "Corporate Contract Farming Aggregators",
          sizeShare: "25%",
          urgency: "High",
          salesCycle: "60 Days",
        },
      ],
    },
    feasibility: {
      overallScore: 88,
      technicalScore: 89,
      marketScore: 88,
      financialScore: 86,
      regulatoryScore: 90,
      executionScore: 87,
      verdict: "Strong Go",
      verdictSummary:
        "High impact, recession-proof rural climate asset with sticky farmer retention, 4.8x LTV:CAC, and strong government subsidy tailwinds.",
      radarData: [
        { subject: "Technical Moat", score: 89, fullMark: 100 },
        { subject: "Market Sizing", score: 88, fullMark: 100 },
        { subject: "Unit Economics", score: 86, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 90, fullMark: 100 },
        { subject: "Founder Execution", score: 87, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "Microsoft Azure",
        compute: "Azure IoT Edge Runtime on Solar Hub Gateways + Azure Kubernetes Service",
        database: "Azure Cosmos DB (Multi-Model IoT Telemetry) + Azure Blob Storage",
        aiInference: "Azure Machine Learning Ripening Computer Vision Models",
        storageAndCDN: "Azure CDN for buyer portal mobile app",
        thirdPartyAPIs: [
          { name: "APMC Mandi Price API", purpose: "Real-time Daily Commodity Wholesale Pricing", costTier: "Free / Open Data" },
          { name: "Kallidus / Twilio WhatsApp API", purpose: "Farmer Storage Receipts & Invoicing", costTier: "$120/mo" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$210 / month",
          growth: "$880 / month",
          scale: "$2,900 / month",
        },
      },
      revenueModel: {
        primaryModel: "Storage Usage Fees + 5% Marketplace Take-Rate",
        pricingTiers: [
          { tier: "Pay-Per-Crate", price: "₹25 / crate / week", billing: "Weekly", features: ["20kg produce storage", "Ethylene sensor tracking", "WhatsApp status alerts"] },
          { tier: "FPO Enterprise Hub", price: "₹38,000 / mo", billing: "Monthly / Seasonal", features: ["Dedicated 10-Metric Ton Hub", "Guaranteed B2B Off-take Contract", "Zero Downtime Battery Replacement"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 85000, cost: 60000, users: 4 },
          { month: "M3", revenue: 260000, cost: 140000, users: 12 },
          { month: "M6", revenue: 680000, cost: 320000, users: 28 },
          { month: "M12", revenue: 1850000, cost: 750000, users: 75 },
        ],
        keyUnitEconomics: {
          cacEstimate: "₹18,000 per FPO onboarded",
          ltvEstimate: "₹2,80,000 (3-year storage fee retention)",
          ltvCacRatio: "4.8x High Efficiency",
          grossMargin: "64% Blended Hardware + Service Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "Monsoon cloud coverage diminishing solar panel generation",
          severity: "Medium",
          probability: "High",
          mitigation: "Dual Phase-Change Thermal battery bank provides 48-hour continuous buffer independent of sunlight.",
        },
      ],
      goNextSteps: [
        "Deploy first 3 commercial solar hubs in Nashik onion & grape corridor",
        "Sign pilot off-take LOI with Zepto / Blinkit fresh sourcing teams",
      ],
    },
  },
  {
    id: "deal-cybersentinel",
    createdAt: new Date(Date.now() - 3600000 * 160).toISOString(),
    username: "Nirav Mehta",
    userId: "usr-founder-nirav",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "$300,000",
      equityOffered: "7.0% Equity (SAFE Note)",
      fundingStage: "Angel Seed",
      useOfFunds: "Scale eBPF kernel agent testbeds across 50 enterprise MSPs and achieve SOC2 Type II compliance.",
      pitchNotes: "Sub-10ms ransomware lateral movement neutralization with 89% gross margin and $32B cybersecurity TAM.",
      contactEmail: "nirav@cybersentinel.security",
      publishedAt: new Date(Date.now() - 3600000 * 160).toISOString(),
    },
    founderProfile: {
      domains: ["CyberSecurity", "Enterprise Software", "AI Agents"],
      skills: ["Kernel Drivers", "Binary Analysis", "Zero-Trust Architecture"],
      businessType: "Enterprise Security & Infrastructure",
      interests: ["Endpoint Detection", "Autonomous Defense", "Lateral Movement Blocker"],
      targetAudience: "Mid-Market Enterprise CISOs & IT Security Directors",
      budget: "$100,000 - $350,000 (Seed)",
      timeframe: "1-3 Months Full Beta",
      customContext: "Autonomous lightweight endpoint agent blocking zero-day ransomware lateral movement in sub-10 milliseconds.",
      founderEmail: "nirav@cybersentinel.security",
      targetLocation: getLocationByCity("Silicon Valley") || getLocationByCity("Tel Aviv"),
    },
    selectedIdea: {
      id: "idea-cybersentinel",
      name: "CyberSentinel Edge",
      tagline: "Autonomous sub-10ms endpoint ransomware & lateral movement neutralization",
      domain: "CyberSecurity",
      problemStatement:
        "Mid-market enterprises with 200-2,000 employees are hit by 80% of all ransomware attacks because tier-1 enterprise Security Operations Centers (CrowdStrike, Palo Alto) cost over $250k/year and require 24/7 dedicated analysts to triage noisy alert queues.",
      solution:
        "Ultralight eBPF kernel agent coupled with a 15MB local quantized neural model that evaluates process process-spawning entropy directly on the endpoint, severing unauthenticated SMB/RDP lateral movement in 8 milliseconds without human intervention.",
      targetPersona: {
        title: "CISOs, Directors of Information Security, MSP Security Leads",
        painPoints: [
          "Crushing alert fatigue from 1,200+ false alarms per week",
          "Risk of devastating ransomware encryption causing business shutdown",
          "Soaring cyber insurance premium hikes of 40-70% for firms lacking active EDR",
        ],
        willingnessToPay: "$6 - $12 / endpoint / month",
      },
      whyNow:
        "Linux/Windows eBPF maturity and sub-50MB edge SLMs (Small Language Models) allow complex behavioral heuristic inference directly inside kernel ring-0.",
      innovationMoat:
        "Proprietary micro-eBPF lateral isolation driver that freezes process threads before encryption disk writes without blue-screening the host operating system.",
      tags: ["CyberSecurity", "Enterprise", "B2B SaaS", "High LTV"],
      initialFeasibilityScore: 89,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-cybersentinel",
      marketSummary:
        "Global cybersecurity endpoint detection and response (EDR) market is expanding as insurance underwriters require automated containment.",
      tam: {
        value: "$45.2 Billion",
        numBillions: 45.2,
        description: "Global Endpoint Security, Extended Detection & Response (XDR) Market",
      },
      sam: {
        value: "$12.0 Billion",
        numBillions: 12.0,
        description: "Mid-Market and Managed Service Provider (MSP) Security Ecosystem",
      },
      som: {
        value: "$1.8 Billion",
        numBillions: 1.8,
        description: "Mid-Market Financial Services, Healthcare & Manufacturing Endpoints in US & UK",
      },
      cagr: "22.5% (2024 - 2030)",
      competitors: [
        {
          name: "CrowdStrike Falcon",
          type: "Direct",
          strengths: "Global market leader, immense brand authority and threat intelligence",
          weaknesses: "Extremely expensive, high complexity for smaller IT teams, recent global outage scrutiny",
          ourDifferentiation: "100% deterministic local sandbox containment with zero cloud outage vulnerability",
          fundingOrScale: "Public ($75B+ Market Cap)",
        },
        {
          name: "SentinelOne",
          type: "Direct",
          strengths: "Autonomous AI endpoint rollback technology",
          weaknesses: "High resource consumption on older client machines",
          ourDifferentiation: "Ultra-lean 15MB memory footprint via kernel eBPF hooks",
          fundingOrScale: "Public ($6B+ Market Cap)",
        },
      ],
      realTimeTrends: [
        {
          source: "CISA Threat Advisory",
          headline: "Ransomware dwell time drops from 5 days to 24 hours, demanding automated sub-second containment",
          sentiment: "Bullish",
          growthSignal: "+68% CISO prioritization of automated containment over alerting",
        },
      ],
      targetSegments: [
        {
          segment: "Managed Service Providers (MSPs) servicing SMEs",
          sizeShare: "55%",
          urgency: "Critical",
          salesCycle: "21 - 35 Days",
        },
        {
          segment: "Mid-Market Regional Healthcare Systems",
          sizeShare: "30%",
          urgency: "High",
          salesCycle: "45 Days",
        },
      ],
    },
    feasibility: {
      overallScore: 89,
      technicalScore: 92,
      marketScore: 91,
      financialScore: 87,
      regulatoryScore: 86,
      executionScore: 90,
      verdict: "Strong Go",
      verdictSummary:
        "High-conviction B2B software venture with negative net churn via seat expansion, 85% gross margins, and strategic acquisition appeal from cloud hyperscalers.",
      radarData: [
        { subject: "Technical Moat", score: 92, fullMark: 100 },
        { subject: "Market Sizing", score: 91, fullMark: 100 },
        { subject: "Unit Economics", score: 87, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 86, fullMark: 100 },
        { subject: "Founder Execution", score: 90, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "AWS",
        compute: "AWS Graviton EC2 for threat correlation clustering",
        database: "ClickHouse on AWS (High Throughput Log Analytics) + Amazon S3",
        aiInference: "Local On-Endpoint C++ Runtime (ONNX Micro) + Cloud Threat Classifier",
        storageAndCDN: "Cloudflare R2 + Fastly Global Edge CDN",
        thirdPartyAPIs: [
          { name: "VirusTotal Enterprise API", purpose: "Secondary Threat File Hash Hashing", costTier: "$800/mo" },
          { name: "MITRE ATT&CK Feed", purpose: "Automated Rule Base Ingestion", costTier: "Free" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$290 / month",
          growth: "$1,350 / month",
          scale: "$5,100 / month",
        },
      },
      revenueModel: {
        primaryModel: "Per Endpoint Monthly Subscription",
        pricingTiers: [
          { tier: "Pro Shield", price: "$6.50 / endpoint / mo", billing: "Annual", features: ["Sub-10ms Ransomware Freeze", "Automated File Rollback", "eBPF Kernel Agent"] },
          { tier: "Enterprise SOC Plus", price: "$11.00 / endpoint / mo", billing: "Annual", features: ["24/7 Managed Threat Response SLA", "Zero-Trust Microsegmentation", "Cyber Insurance Guarantee"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 8400, cost: 4800, users: 1400 },
          { month: "M3", revenue: 32000, cost: 11000, users: 5200 },
          { month: "M6", revenue: 89000, cost: 26000, users: 14500 },
          { month: "M12", revenue: 245000, cost: 58000, users: 41000 },
        ],
        keyUnitEconomics: {
          cacEstimate: "$480 per business account (MSP channel partnerships)",
          ltvEstimate: "$31,000 per enterprise account",
          ltvCacRatio: "5.5x Highly Profitable",
          grossMargin: "85% SaaS Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "False positive process killing disrupting mission-critical ERP operations",
          severity: "High",
          probability: "Low",
          mitigation: "Shadow simulation mode runs silently for first 48 hours to baseline normal machine traffic before engaging active kills.",
        },
      ],
      goNextSteps: [
        "Sign distributor agreement with 3 leading Regional MSP aggregators",
        "Publish independent third-party MITRE Engenuity ATT&CK evaluation results",
      ],
    },
  },
  {
    id: "deal-ecorefill-labs",
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
    username: "Maya Lin & Carlos",
    userId: "usr-founder-maya",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "$75,000",
      equityOffered: "5.0% Equity",
      fundingStage: "Pre-Seed",
      useOfFunds: "Fulfill initial 2,500 Kickstarter backer orders and ramp plant-pod packaging automation line.",
      pitchNotes: "Zero-plastic cleaning system with 6.2x LTV:CAC and 72% gross margins in a $48B global market.",
      contactEmail: "maya@ecorefill.earth",
      publishedAt: new Date(Date.now() - 3600000 * 180).toISOString(),
    },
    founderProfile: {
      domains: ["D2C Consumer Brands", "Sustainable Lifestyle", "CleanTech"],
      skills: ["Green Chemistry", "Direct-to-Consumer Growth", "Supply Chain Sourcing"],
      businessType: "Physical Products / Sustainable D2C",
      interests: ["Zero Plastic", "Circular Packaging", "Subscription Commerce"],
      targetAudience: "Eco-Conscious Urban Millennials & Gen-Z Households",
      budget: "$50,000 - $200,000 (Angel Seed)",
      timeframe: "1-3 Months Full Beta",
      customContext: "100% waterless concentrated dissolvable plant pods delivered in compostable packaging with smart dispensers.",
      founderEmail: "maya@ecorefill.earth",
      targetLocation: getLocationByCity("San Francisco / Silicon Valley") || getLocationByCity("London"),
    },
    selectedIdea: {
      id: "idea-ecorefill",
      name: "EcoRefill Labs",
      tagline: "Zero-plastic dissolvable home care pods with automated IoT subscription dispensers",
      domain: "Sustainable D2C",
      problemStatement:
        "Traditional household cleaning liquids consist of 92% water shipped in bulky single-use plastic jugs, generating 8 billion pounds of plastic waste annually and high carbon transport emissions passed on to consumers as inflated prices.",
      solution:
        "Micro-concentrated 100% natural, biodegradable cleaning pods in plant-fiber blister packs that dissolve instantly in tap water inside reusable frosted glass spray bottles, paired with an elegant countertop smart dispenser that auto-triggers letterbox refills.",
      targetPersona: {
        title: "Eco-Conscious Urban Homeowners & Renters",
        painPoints: [
          "Guilt from throwing away dozen rigid plastic cleaning jugs each year",
          "Lugging heavy detergent bottles from supermarkets",
          "Harsh petrochemical fumes irritating children and pets",
        ],
        willingnessToPay: "$18 - $28 / monthly refill kit",
      },
      whyNow:
        "Stringent plastic EPR (Extended Producer Responsibility) packaging taxes taking effect in EU and US states, combined with rapid consumer migration to circular home essentials.",
      innovationMoat:
        "Patented natural corn-starch PVA membrane that dissolves in cold water in under 12 seconds with zero microplastic residue.",
      tags: ["D2C", "Sustainability", "Circular Economy", "Consumer Tech"],
      initialFeasibilityScore: 84,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-ecorefill",
      marketSummary:
        "The global eco-friendly home cleaning and laundry products market is expanding at double the rate of conventional chemical detergents.",
      tam: {
        value: "$14.6 Billion",
        numBillions: 14.6,
        description: "Global Sustainable Home Cleaning & Personal Care Products Market",
      },
      sam: {
        value: "$3.8 Billion",
        numBillions: 3.8,
        description: "Eco-Conscious D2C & Specialty Retail Subscribers in North America and Western Europe",
      },
      som: {
        value: "$480 Million",
        numBillions: 0.48,
        description: "Urban High-Income Millennials in Major Coastal Metro Hubs",
      },
      cagr: "16.5% (2024 - 2030)",
      competitors: [
        {
          name: "Blueland",
          type: "Direct",
          strengths: "First mover in tablet cleaning refills, Shark Tank publicity",
          weaknesses: "Hard tablet formulation takes 15 minutes to dissolve and leaves chalky residue",
          ourDifferentiation: "Instant-dissolve liquid pod technology with 10x superior grease-cutting surfactant efficiency",
          fundingOrScale: "Series A ($35M+)",
        },
        {
          name: "Method / Ecover (SC Johnson)",
          type: "Indirect",
          strengths: "Massive retail distribution in Target and supermarkets",
          weaknesses: "Still relies heavily on single-use or 50% recycled plastic jugs full of water",
          ourDifferentiation: "100% waterless, zero-plastic mail delivery with 90% lower freight footprint",
          fundingOrScale: "Conglomerate Owned",
        },
      ],
      realTimeTrends: [
        {
          source: "McKinsey Consumer Report",
          headline: "Over 68% of Gen Z consumers actively switch brands for zero-plastic circular packaging",
          sentiment: "Bullish",
          growthSignal: "+29% YoY search growth for dissolvable cleaning refills",
        },
      ],
      targetSegments: [
        {
          segment: "Subscription D2C Online Consumers",
          sizeShare: "65%",
          urgency: "High",
          salesCycle: "Instant (Impulse Buy)",
        },
        {
          segment: "Boutique Eco-Grocers & Zero-Waste Refill Stores",
          sizeShare: "25%",
          urgency: "Medium",
          salesCycle: "30 Days",
        },
      ],
    },
    feasibility: {
      overallScore: 84,
      technicalScore: 86,
      marketScore: 85,
      financialScore: 83,
      regulatoryScore: 88,
      executionScore: 82,
      verdict: "Strong Go",
      verdictSummary:
        "High-velocity consumer brand with viral social media organic traction, 72% gross margins, and strong recurring subscription retention metrics.",
      radarData: [
        { subject: "Technical Moat", score: 86, fullMark: 100 },
        { subject: "Market Sizing", score: 85, fullMark: 100 },
        { subject: "Unit Economics", score: 83, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 88, fullMark: 100 },
        { subject: "Founder Execution", score: 82, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "AWS",
        compute: "Next.js on AWS Lambda + Serverless Framework",
        database: "DynamoDB + Redis Cache for high-volume subscriber sessions",
        aiInference: "Lightweight recommender engine on Amazon Personalize",
        storageAndCDN: "Amazon CloudFront Global Edge + S3 Product Assets",
        thirdPartyAPIs: [
          { name: "Shopify Storefront Headless API", purpose: "E-Commerce Checkout & Fulfillment", costTier: "$299/mo" },
          { name: "Recharge Payments API", purpose: "Automated Recurring Subscriptions", costTier: "$150/mo + 1%" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$180 / month",
          growth: "$650 / month",
          scale: "$2,200 / month",
        },
      },
      revenueModel: {
        primaryModel: "Direct-to-Consumer Monthly Refill Subscription",
        pricingTiers: [
          { tier: "Essential Starter Bundle", price: "$24.00 (One-Time)", billing: "Single", features: ["3 Frosted Glass Forever Spray Bottles", "6 Dissolvable Pods", "Free Compostable Shipping"] },
          { tier: "Whole Home Club", price: "$19.00 / month", billing: "Monthly", features: ["8 Mixed Multi-Surface Pods per month", "Free Replacements for broken spray pumps", "Priority Access to new seasonal scents"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 14000, cost: 9500, users: 650 },
          { month: "M3", revenue: 48000, cost: 24000, users: 2200 },
          { month: "M6", revenue: 125000, cost: 55000, users: 6100 },
          { month: "M12", revenue: 340000, cost: 130000, users: 17500 },
        ],
        keyUnitEconomics: {
          cacEstimate: "$28 (TikTok UGC & Meta Ads)",
          ltvEstimate: "$118 (14-month average subscriber duration)",
          ltvCacRatio: "4.2x Solid D2C Economics",
          grossMargin: "72% Product Gross Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "Moisture degradation of pods during high-humidity ocean shipping",
          severity: "Medium",
          probability: "Medium",
          mitigation: "Compostable metallized barrier pouch keeps water vapor transmission rate (WVTR) below 0.1g/m2/day.",
        },
      ],
      goNextSteps: [
        "Fulfill 2,500 Kickstarter backer pre-orders",
        "Launch TikTok Shop influencer affiliate seeding campaign with 40 creators",
      ],
    },
  },
  {
    id: "deal-roastcloud-os",
    createdAt: new Date(Date.now() - 3600000 * 220).toISOString(),
    username: "Liam Vance",
    userId: "usr-founder-liam",
    isPublishedForInvestors: true,
    fundingAsk: {
      seekingFunding: true,
      targetFundingAmount: "$50,000",
      equityOffered: "6.5% Equity",
      fundingStage: "Pre-Seed",
      useOfFunds: "Fabricate first 50 IoT thermocouple dongles and deploy with 15 artisan cafe roasters in London.",
      pitchNotes: "IoT roasting telemetry and ERP eliminating batch drift with $4.8B specialty coffee software market.",
      contactEmail: "liam@roastcloud.io",
      publishedAt: new Date(Date.now() - 3600000 * 220).toISOString(),
    },
    founderProfile: {
      domains: ["Food & Beverage", "Hospitality", "B2B SaaS"],
      skills: ["Specialty Coffee Sourcing", "Roast Curve Telemetry", "Hospitality ERP"],
      businessType: "Food & Beverage / Hospitality Tech",
      interests: ["Artisan Micro-Roasting", "Direct Trade Coffee", "Cafe Automation"],
      targetAudience: "Independent Artisan Micro-Roasters & Specialty Cafe Chains",
      budget: "$25,000 - $100,000 (Pre-Seed)",
      timeframe: "1-3 Months Full Beta",
      customContext: "Cloud-connected roasting telemetry and automated green coffee bean inventory procurement ERP with micro-lot provenance.",
      founderEmail: "liam@roastcloud.io",
      targetLocation: getLocationByCity("London") || getLocationByCity("Melbourne"),
    },
    selectedIdea: {
      id: "idea-roastcloud",
      name: "RoastCloud OS",
      tagline: "IoT roast profile synchronization & origin bean supply chain ERP for specialty cafes",
      domain: "Hospitality & FoodTech",
      problemStatement:
        "Independent craft roasteries and multi-location specialty cafes lose up to 38% gross margin to erratic batch roast profile drift, unforecasted green bean inventory stockouts, and fragmented Excel ordering from origin coffee farmers in Colombia and Ethiopia.",
      solution:
        "A lightweight hardware dongle that connects to any industrial coffee roaster's thermocouple probes, streaming temperature RoR (Rate of Rise) curves to a cloud dashboard that auto-adjusts burner profiles, forecasts wholesale inventory, and provides QR-code origin farm traceability.",
      targetPersona: {
        title: "Head Roasters, Coffee Operations Directors, Specialty Cafe Owners",
        painPoints: [
          "Batch inconsistency causing customer quality complaints and bean waste",
          "Complex spreadsheet tracking of green bean moisture loss and cupping scores",
          "Lack of transparent digital provenance demanded by modern specialty coffee drinkers",
        ],
        willingnessToPay: "$120 - $350 / month per roastery location",
      },
      whyNow:
        "Specialty coffee consumption has reached 55% of global market share, with cafes rapidly upgrading from legacy analog drums to digital precision roasting.",
      innovationMoat:
        "Proprietary thermodynamic curve auto-pilot algorithm trained on 180,000 cupped production batches with direct API hooks to major green bean trade clearinghouses.",
      tags: ["FoodTech", "Hospitality", "IoT", "SaaS"],
      initialFeasibilityScore: 82,
    },
    allIdeas: [],
    validation: {
      ideaId: "idea-roastcloud",
      marketSummary:
        "Specialty third-wave coffee market is experiencing resilient growth with artisanal roasteries commanding high pricing power.",
      tam: {
        value: "$9.2 Billion",
        numBillions: 9.2,
        description: "Global Specialty Coffee Equipment, Sourcing & Roastery Management Software",
      },
      sam: {
        value: "$2.1 Billion",
        numBillions: 2.1,
        description: "Commercial Micro-Roasteries & Multi-Unit Specialty Cafe Operators in US, UK, Europe, Australia",
      },
      som: {
        value: "$290 Million",
        numBillions: 0.29,
        description: "24,000 Active Micro-Roasters seeking digital traceability and inventory automation",
      },
      cagr: "14.2% (2024 - 2030)",
      competitors: [
        {
          name: "Cropster",
          type: "Direct",
          strengths: "Incumbent legacy market leader in roast profiling software",
          weaknesses: "Clunky 2012 desktop UI, expensive add-ons, lack of automated origin procurement",
          ourDifferentiation: "Modern mobile-first cloud operating system with integrated B2B bean marketplace",
          fundingOrScale: "Private Equity Owned",
        },
        {
          name: "Artisan Scope",
          type: "Direct",
          strengths: "Free open-source roast logging tool",
          weaknesses: "Complex setup, zero cloud syncing, no inventory or business ERP features",
          ourDifferentiation: "Plug-and-play wireless hardware dongle with automated batch consistency grading",
          fundingOrScale: "Open Source Community",
        },
      ],
      realTimeTrends: [
        {
          source: "Specialty Coffee Association (SCA)",
          headline: "Digital roast profiling adoption increases wholesale bean margins by 22%",
          sentiment: "Bullish",
          growthSignal: "+34% specialty micro-roastery expansion post-pandemic",
        },
      ],
      targetSegments: [
        {
          segment: "Artisan Independent Micro-Roasteries (1 - 5 cafe outlets)",
          sizeShare: "60%",
          urgency: "High",
          salesCycle: "14 Days",
        },
        {
          segment: "Regional Specialty Roaster Chains (5 - 30 outlets)",
          sizeShare: "30%",
          urgency: "Medium",
          salesCycle: "45 Days",
        },
      ],
    },
    feasibility: {
      overallScore: 82,
      technicalScore: 84,
      marketScore: 81,
      financialScore: 82,
      regulatoryScore: 85,
      executionScore: 80,
      verdict: "Strong Go",
      verdictSummary:
        "Sticky vertical SaaS model with deeply entrenched customer daily usage, 78% software margins, and attractive bolt-on fintech bean financing opportunities.",
      radarData: [
        { subject: "Technical Moat", score: 84, fullMark: 100 },
        { subject: "Market Sizing", score: 81, fullMark: 100 },
        { subject: "Unit Economics", score: 82, fullMark: 100 },
        { subject: "Regulatory Sandbox", score: 85, fullMark: 100 },
        { subject: "Founder Execution", score: 80, fullMark: 100 },
      ],
      cloudArchitecture: {
        recommendedProvider: "Google Cloud",
        compute: "Google Cloud Run container microservices",
        database: "Google Firestore Real-Time NoSQL Database",
        aiInference: "Lightweight RoR trend prediction models",
        storageAndCDN: "Firebase Cloud Storage for cupping images and roast profiles",
        thirdPartyAPIs: [
          { name: "Stripe Connect Billing", purpose: "Automated Roastery SaaS Invoicing", costTier: "$80/mo" },
          { name: "Twilio SMS", purpose: "Roast Batch Anomaly Alerts", costTier: "$45/mo" },
        ],
        diagramComponents: [],
        estimatedMonthlyCloudCost: {
          mvp: "$160 / month",
          growth: "$520 / month",
          scale: "$1,600 / month",
        },
      },
      revenueModel: {
        primaryModel: "B2B Vertical SaaS Subscription + Dongle Hardware",
        pricingTiers: [
          { tier: "Single Roaster", price: "$120 / month", billing: "Monthly", features: ["1 Roaster Machine Telemetry", "Live RoR Curve Sync", "Cupping Notes App"] },
          { tier: "Roastery Hub & Chain", price: "$280 / month", billing: "Annual", features: ["Up to 4 Roasters & 10 Cafes", "Automated Bean Re-Ordering", "Customer QR Traceability Portal"], highlighted: true },
        ],
        projectedRunway: [
          { month: "M1", revenue: 3800, cost: 2400, users: 25 },
          { month: "M3", revenue: 14200, cost: 6800, users: 85 },
          { month: "M6", revenue: 39000, cost: 16000, users: 210 },
          { month: "M12", revenue: 98000, cost: 36000, users: 540 },
        ],
        keyUnitEconomics: {
          cacEstimate: "$140 (Specialty coffee expo demos & barista word of mouth)",
          ltvEstimate: "$4,800 (Over 3.5 year average software stickiness)",
          ltvCacRatio: "3.9x Healthy Vertical SaaS",
          grossMargin: "78% Software Blended Margin",
        },
      },
      risksAndMitigations: [
        {
          risk: "Hardware supply chain bottlenecks for thermocouple sensor dongles",
          severity: "Low",
          probability: "Medium",
          mitigation: "Dongle uses standard off-the-shelf ESP32 microcontrollers compatible with 12 global PCB manufacturers.",
        },
      ],
      goNextSteps: [
        "Deploy beta units at 15 specialty cafes across London & Bristol",
        "Exhibit at World of Coffee Geneva trade showcase",
      ],
    },
  },
];

// Helper to combine live saved projects with curated deals (deduplicating by ID)
export function getAllDealflow(savedProjects: StartupProject[] = []): StartupProject[] {
  const map = new Map<string, StartupProject>();

  // 1. Add user-saved projects ONLY if the founder has explicitly allowed them for investors & is seeking funding
  savedProjects.forEach((p) => {
    if (p && p.id && p.selectedIdea) {
      const isAllowed = p.isPublishedForInvestors === true || p.fundingAsk?.seekingFunding === true;
      if (isAllowed) {
        map.set(p.id, p);
      }
    }
  });

  // 2. Add curated deals
  CURATED_DEALS.forEach((deal) => {
    if (!map.has(deal.id)) {
      map.set(deal.id, deal);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.feasibility?.overallScore || 0;
    const scoreB = b.feasibility?.overallScore || 0;
    return scoreB - scoreA;
  });
}

// Watchlist local storage keys & helpers
const WATCHLIST_KEY = "startupgen_investor_watchlist";

export function getInvestorWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleInvestorWatchlist(projectId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getInvestorWatchlist();
    const exists = current.includes(projectId);
    const updated = exists ? current.filter((id) => id !== projectId) : [...current, projectId];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

// Investment Commitments local storage keys & helpers
const COMMITMENTS_KEY = "startupgen_investor_commitments";

export function getLocalCommitments(): InvestmentCommitment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMMITMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalCommitment(commitment: InvestmentCommitment): InvestmentCommitment[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getLocalCommitments();
    const updated = [commitment, ...current.filter((c) => c.id !== commitment.id)];
    localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(updated));

    // Also persist to API in background
    fetch("/api/investor/commitments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commitment),
    }).catch((e) => console.warn("Commitment background sync note:", e));

    return updated;
  } catch (e) {
    return [];
  }
}

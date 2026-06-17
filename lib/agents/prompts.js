const PROMPTS = {
  "sales-director": [
    {
      id: "sd-01",
      title: "Solar Lead Qualification",
      category: "Lead Management",
      prompt: "Analyze this incoming lead and qualify them based on: project size (kWp), timeline, budget range, location, and installer certification status. Assign a lead score (1-100) and recommend the next action. Lead details: {lead_info}",
    },
    {
      id: "sd-02",
      title: "Installer Partnership Proposal",
      category: "B2B Sales",
      prompt: "Generate a partnership proposal for a solar installer applying to join our distributor network. Include: volume pricing tiers, payment terms, technical support SLA, marketing co-op opportunities, and training program access. Installer profile: {installer_profile}",
    },
    {
      id: "sd-03",
      title: "Competitive Quote Generator",
      category: "Pricing",
      prompt: "Create a competitive quote for a solar system project. Analyze competitor pricing for equivalent components, recommend our pricing strategy (match, undercut, or premium with justification), and calculate projected margins. Project requirements: {project_specs}",
    },
    {
      id: "sd-04",
      title: "Sales Pipeline Review",
      category: "Pipeline",
      prompt: "Review the current Odoo CRM pipeline and provide: deals at risk of stalling, recommended follow-up actions for each stage, weekly revenue forecast, and bottleneck analysis. Pipeline data: {pipeline_data}",
    },
    {
      id: "sd-05",
      title: "Upsell Opportunity Detector",
      category: "Revenue Growth",
      prompt: "Analyze this customer's purchase history and identify upsell/cross-sell opportunities. Suggest complementary products (batteries for existing solar owners, monitoring systems, mounting upgrades) with personalized messaging. Customer data: {customer_data}",
    },
    {
      id: "sd-06",
      title: "Territory Sales Plan",
      category: "Strategy",
      prompt: "Create a quarterly sales plan for the {region} territory. Include: target revenue, key accounts to develop, installer recruitment goals, competitive landscape, and promotional calendar aligned with solar installation seasons.",
    },
    {
      id: "sd-07",
      title: "Win/Loss Analysis",
      category: "Analytics",
      prompt: "Analyze our recent wins and losses in the {segment} segment. Identify patterns in: pricing decisions, product preferences, competitor advantages, sales cycle length, and decision-maker profiles. Recommend strategic adjustments.",
    },
  ],

  "marketing-strategist": [
    {
      id: "ms-01",
      title: "LinkedIn Content Calendar",
      category: "Social Media",
      prompt: "Create a 30-day LinkedIn content calendar for our solar eCommerce brand. Mix content types: thought leadership (3/week), product spotlights (2/week), industry news commentary (2/week), behind-the-scenes (1/week), engagement posts (2/week). Include hooks and key messages for each post.",
    },
    {
      id: "ms-02",
      title: "Solar Buyer Persona Builder",
      category: "Strategy",
      prompt: "Build detailed buyer personas for our target segments: (1) Residential homeowners going solar, (2) Professional solar installers, (3) Commercial/industrial project managers, (4) Solar distributors. Include: pain points, buying triggers, information sources, decision criteria, and Odoo CRM tagging strategy.",
    },
    {
      id: "ms-03",
      title: "Product Launch Campaign",
      category: "Campaigns",
      prompt: "Design a multi-channel launch campaign for the new {product_name}. Include: pre-launch teaser sequence, launch day content across all channels, installer-focused webinar plan, email drip campaign, and social media strategy. Emphasize technical advantages and ROI for end customers.",
    },
    {
      id: "ms-04",
      title: "Email Drip Sequence — Installer Onboarding",
      category: "Email",
      prompt: "Create a 7-email welcome/onboarding drip sequence for new installer partners. Cover: welcome & account setup, product catalog overview, ordering process, technical support resources, volume pricing benefits, co-marketing opportunities, and success story showcase.",
    },
    {
      id: "ms-05",
      title: "SEO Content Cluster Plan",
      category: "Content Strategy",
      prompt: "Design a topic cluster strategy around '{topic}' for our solar eCommerce blog. Create: 1 pillar page outline, 8-10 supporting articles with keywords and search intent, internal linking map, and content production timeline. Target both informational and commercial intent.",
    },
    {
      id: "ms-06",
      title: "Trade Show Strategy",
      category: "Events",
      prompt: "Plan our presence at {trade_show_name}. Include: booth messaging and design brief, pre-show outreach campaign, on-site lead capture strategy, post-show follow-up sequence, social media coverage plan, and ROI tracking framework.",
    },
    {
      id: "ms-07",
      title: "Brand Voice & Messaging Guide",
      category: "Brand",
      prompt: "Create a brand voice and messaging guide for PV Partner across all channels. Define: brand personality traits, tone of voice guidelines, key messages per audience segment, tagline options, and sample copy for common use cases (product descriptions, emails, social posts, support responses).",
    },
    {
      id: "ms-08",
      title: "Competitor Marketing Analysis",
      category: "Intelligence",
      prompt: "Analyze the marketing strategies of our top 3 competitors in the solar eCommerce space. Evaluate: website UX, content strategy, social media presence, email marketing, paid advertising, and SEO positioning. Identify gaps and opportunities for PV Partner.",
    },
  ],

  "ecommerce-manager": [
    {
      id: "ec-01",
      title: "Product Page Optimization",
      category: "Conversion",
      prompt: "Optimize this product page for the {product_name}. Improve: title structure for SEO, product description (technical + benefits), specification table format, image requirements, cross-sell suggestions, trust signals, and CTA placement. Current page: {current_page}",
    },
    {
      id: "ec-02",
      title: "Solar System Bundle Creator",
      category: "Merchandising",
      prompt: "Design product bundles for complete solar systems. Create 3 tiers: (1) Residential Starter (3-5kWp), (2) Residential Premium (6-10kWp), (3) Commercial Standard (15-30kWp). For each: select compatible components, calculate bundle discount, write compelling descriptions, and define Odoo product configuration.",
    },
    {
      id: "ec-03",
      title: "Checkout Flow Optimization",
      category: "UX",
      prompt: "Audit our Odoo eCommerce checkout flow and recommend improvements. Analyze: cart abandonment points, form field optimization, payment method options, shipping calculator accuracy, mobile checkout experience, and trust signals. Provide wireframe-level recommendations.",
    },
    {
      id: "ec-04",
      title: "Multi-Language Store Review",
      category: "Localization",
      prompt: "Review our product catalog localization for the {language} market. Check: product descriptions quality, currency and pricing, shipping options, local certifications displayed, measurement units, and culturally appropriate imagery. Flag issues and suggest fixes.",
    },
    {
      id: "ec-05",
      title: "Conversion Rate Audit",
      category: "Analytics",
      prompt: "Perform a conversion rate optimization audit of our Odoo eCommerce store. Analyze: traffic sources vs. conversion rates, product page performance, category page layout effectiveness, search functionality, mobile vs. desktop metrics, and seasonal trends. Provide prioritized action items.",
    },
    {
      id: "ec-06",
      title: "B2B Portal Design",
      category: "B2B",
      prompt: "Design the Odoo B2B portal experience for registered installer partners. Include: custom pricing display, bulk ordering interface, order history and reorder functionality, technical documentation access, credit limit visibility, and dedicated account manager contact.",
    },
    {
      id: "ec-07",
      title: "Product Category Architecture",
      category: "Information Architecture",
      prompt: "Redesign the product category structure for our solar equipment store. Consider: how installers browse (by brand vs. by type vs. by application), filter and facet requirements, category page content strategy, and breadcrumb/navigation design. Current categories: {categories}",
    },
  ],

  "customer-success": [
    {
      id: "cs-01",
      title: "Installer Onboarding Playbook",
      category: "Onboarding",
      prompt: "Create a comprehensive onboarding playbook for new solar installer partners. Include: Day 1 welcome process, Week 1 training schedule, product catalog walkthrough, ordering tutorial, technical support introduction, key contact assignments, and 30-60-90 day success milestones.",
    },
    {
      id: "cs-02",
      title: "Customer Health Score Model",
      category: "Retention",
      prompt: "Design a customer health scoring model for our Odoo CRM. Define metrics: order frequency, order value trend, support ticket volume, payment punctuality, product return rate, and engagement score. Create thresholds for Green/Yellow/Red status and automated intervention triggers.",
    },
    {
      id: "cs-03",
      title: "Support Ticket Response Templates",
      category: "Support",
      prompt: "Create 15 response templates for common support scenarios: (1) order status inquiry, (2) shipping delay notification, (3) product compatibility question, (4) warranty claim initiation, (5) return/exchange request, (6) bulk pricing request, (7) technical installation question, and more. Make them warm, professional, and solution-focused.",
    },
    {
      id: "cs-04",
      title: "Churn Prevention Campaign",
      category: "Retention",
      prompt: "Design a churn prevention campaign for installers who haven't ordered in {days} days. Include: trigger criteria, multi-channel outreach sequence (email, phone, LinkedIn), special re-engagement offers, win-back incentives, and Odoo automation workflow configuration.",
    },
    {
      id: "cs-05",
      title: "Knowledge Base Structure",
      category: "Self-Service",
      prompt: "Design the knowledge base structure for our Odoo Helpdesk. Categories: Product FAQs, Installation Guides, Ordering Help, Warranty & Returns, Technical Specifications, Compatibility Guides, Account Management. Create 5 sample articles per category with solar-specific content.",
    },
    {
      id: "cs-06",
      title: "NPS Survey & Action Plan",
      category: "Feedback",
      prompt: "Design an NPS survey program for PV Partner. Include: survey timing (post-purchase, quarterly relationship), question set, follow-up workflow for Promoters (referral program) vs. Passives (improvement offers) vs. Detractors (immediate outreach), and Odoo automation for the entire flow.",
    },
    {
      id: "cs-07",
      title: "Escalation Protocol",
      category: "Support",
      prompt: "Create a support escalation protocol for critical issues: defective equipment in-field, delayed shipments affecting installation schedules, warranty disputes, and billing discrepancies. Define: severity levels, response time SLAs, escalation paths, communication templates, and resolution authority matrix.",
    },
  ],

  "operations-logistics": [
    {
      id: "ol-01",
      title: "Inventory Reorder Strategy",
      category: "Inventory",
      prompt: "Design automated reorder rules for our top 20 solar products in Odoo Inventory. For each product category (panels, inverters, batteries): define minimum stock levels, reorder quantities, lead time buffers, and seasonal adjustment factors. Consider warehouse capacity and cash flow impact.",
    },
    {
      id: "ol-02",
      title: "Shipping Optimization Plan",
      category: "Logistics",
      prompt: "Optimize our shipping strategy for solar panels (fragile, heavy, oversized). Address: carrier selection by destination and weight, packaging specifications for panel protection, pallet configuration for full-truck loads, tracking integration with Odoo, and cost reduction opportunities.",
    },
    {
      id: "ol-03",
      title: "Supplier Scorecard",
      category: "Procurement",
      prompt: "Create a supplier performance scorecard for our manufacturers. Metrics: on-time delivery rate, quality defect rate, pricing competitiveness, communication responsiveness, MOQ flexibility, and warranty support quality. Apply this framework to evaluate: {supplier_list}",
    },
    {
      id: "ol-04",
      title: "Demand Forecasting Model",
      category: "Planning",
      prompt: "Build a demand forecasting framework for solar equipment. Incorporate: historical sales data, seasonal installation patterns (spring/summer peak), government incentive announcements, new construction permits data, and competitor stock-out opportunities. Output a 6-month rolling forecast.",
    },
    {
      id: "ol-05",
      title: "Warehouse Layout Optimization",
      category: "Warehouse",
      prompt: "Design an optimized warehouse layout for solar equipment storage. Consider: panel rack systems for different sizes, inverter shelving by brand, battery storage safety requirements (lithium), picking route optimization for common order combinations, and quality inspection area placement.",
    },
    {
      id: "ol-06",
      title: "Returns & RMA Process",
      category: "Returns",
      prompt: "Design the returns and RMA (Return Merchandise Authorization) process for solar equipment in Odoo. Include: return eligibility criteria by product type, inspection workflow, refund vs. replacement decision tree, manufacturer warranty claim process, and restocking procedures.",
    },
    {
      id: "ol-07",
      title: "Supply Chain Risk Assessment",
      category: "Risk",
      prompt: "Conduct a supply chain risk assessment for our solar equipment sourcing. Evaluate: single-source dependencies, geopolitical risks for Asian manufacturing, shipping route vulnerabilities, currency fluctuation exposure, and raw material shortage scenarios. Recommend mitigation strategies.",
    },
  ],

  "finance-controller": [
    {
      id: "fc-01",
      title: "Pricing Strategy Review",
      category: "Pricing",
      prompt: "Analyze our current pricing strategy across product categories. Compare: our margins vs. industry benchmarks, price positioning vs. top 3 competitors, volume discount effectiveness, and currency impact on imported products. Recommend adjustments with projected revenue impact.",
    },
    {
      id: "fc-02",
      title: "Cash Flow Forecast",
      category: "Planning",
      prompt: "Create a 12-month cash flow forecast for PV Partner. Include: revenue projections by channel, inventory purchase schedules, operating expenses, seasonal patterns, payment term impact (net-30/60 for B2B), and working capital requirements. Highlight months requiring attention.",
    },
    {
      id: "fc-03",
      title: "Odoo Accounting Automation",
      category: "Automation",
      prompt: "Design automation workflows for Odoo Accounting. Cover: automatic invoice generation on order confirmation, payment reminder sequences (7/14/30 days overdue), bank reconciliation rules, multi-currency transaction handling, and month-end closing checklist automation.",
    },
    {
      id: "fc-04",
      title: "Tax & Incentive Optimizer",
      category: "Compliance",
      prompt: "Analyze tax optimization opportunities for solar equipment sales across our markets. Research: VAT exemptions for renewable energy equipment by country, green energy tax credits we should highlight to customers, import duty structures, and compliance requirements for each market.",
    },
    {
      id: "fc-05",
      title: "B2B Credit Policy",
      category: "Credit",
      prompt: "Design a credit management policy for B2B installer accounts in Odoo. Define: credit application process, credit limit calculation formula, payment term tiers (based on relationship length and volume), credit monitoring alerts, and collection escalation procedures.",
    },
    {
      id: "fc-06",
      title: "Product Profitability Analysis",
      category: "Analytics",
      prompt: "Perform a product-level profitability analysis. For each product category (panels, inverters, batteries, accessories): calculate true margin including shipping costs, warehousing, returns, and support overhead. Identify loss leaders and cash cows. Recommend portfolio adjustments.",
    },
    {
      id: "fc-07",
      title: "Financial Dashboard Design",
      category: "Reporting",
      prompt: "Design a financial KPI dashboard for PV Partner's Odoo instance. Include: daily revenue, gross margin by category, accounts receivable aging, inventory turnover, cash position, month-to-date vs. target, and year-over-year comparison. Define refresh frequencies and alert thresholds.",
    },
  ],

  "partnership-manager": [
    {
      id: "pm-01",
      title: "Partner Tier Program Design",
      category: "Program",
      prompt: "Design a 3-tier partner program for solar installers. Define for each tier (Authorized, Premium, Elite): qualification criteria (volume, certifications, territory), benefits (pricing, support SLA, co-marketing budget, lead sharing), annual review process, and upgrade/downgrade rules.",
    },
    {
      id: "pm-02",
      title: "Manufacturer Negotiation Brief",
      category: "Procurement",
      prompt: "Prepare a negotiation brief for our annual review with {manufacturer}. Include: our current purchase volume and growth trajectory, competitive alternatives, requested improvements (pricing, payment terms, exclusivity, marketing support), and our value proposition as their distribution partner.",
    },
    {
      id: "pm-03",
      title: "Partner Portal Requirements",
      category: "Technology",
      prompt: "Define requirements for the Odoo Partner Portal. Features: self-service ordering with partner pricing, real-time inventory visibility, order tracking, technical documentation library, marketing asset downloads, co-branded quote generator, and performance dashboard with commission tracking.",
    },
    {
      id: "pm-04",
      title: "Co-Marketing Campaign Template",
      category: "Marketing",
      prompt: "Create a co-marketing campaign template for brand manufacturer partnerships. Include: joint webinar format, co-branded case study template, social media cross-promotion plan, trade show collaboration framework, and shared lead generation programs. Template for use with: {brand_partner}",
    },
    {
      id: "pm-05",
      title: "Installer Certification Program",
      category: "Training",
      prompt: "Design an installer certification program for PV Partner authorized installers. Include: curriculum outline (product knowledge, installation best practices, safety, customer service), assessment criteria, certification levels, renewal requirements, and Odoo training module integration.",
    },
    {
      id: "pm-06",
      title: "Strategic Alliance Evaluation",
      category: "Strategy",
      prompt: "Evaluate a potential strategic alliance with {company_name} in the {sector} space. Analyze: strategic fit, mutual benefits, competitive implications, integration requirements, risk factors, and recommended deal structure. Provide a go/no-go recommendation with rationale.",
    },
    {
      id: "pm-07",
      title: "Partner Performance Review",
      category: "Analytics",
      prompt: "Create a quarterly partner performance review template. Metrics: purchase volume vs. target, customer satisfaction scores, market coverage, certification compliance, co-marketing participation, and growth trajectory. Include conversation guide for review meetings and action plan template.",
    },
  ],

  "product-specialist": [
    {
      id: "ps-01",
      title: "Product Comparison Guide",
      category: "Content",
      prompt: "Create a detailed comparison guide for {product_category} products in our catalog. Compare: key specifications, performance ratings, warranty terms, price-to-performance ratio, ideal use cases, and compatibility with our other products. Format for both web page and downloadable PDF.",
    },
    {
      id: "ps-02",
      title: "New Product Evaluation",
      category: "Product Management",
      prompt: "Evaluate the {product_name} for addition to our catalog. Assess: technical specifications vs. market requirements, competitive positioning, margin potential, compatibility with existing products, market demand indicators, and required inventory investment. Provide a recommendation with launch timeline.",
    },
    {
      id: "ps-03",
      title: "System Design Calculator",
      category: "Tools",
      prompt: "Design the logic for a solar system design calculator tool. Inputs: roof area, location/irradiance, energy consumption, budget. Outputs: recommended panel count and model, inverter sizing, optional battery storage, estimated annual production (kWh), payback period, and component list from our catalog.",
    },
    {
      id: "ps-04",
      title: "Compatibility Matrix",
      category: "Technical",
      prompt: "Create a compatibility matrix for {product_type} across our catalog. Map: which inverters work with which panels (voltage/current matching), which batteries are compatible with which hybrid inverters, and which monitoring systems support which brands. Flag any known issues.",
    },
    {
      id: "ps-05",
      title: "Technical Datasheet Writer",
      category: "Documentation",
      prompt: "Write a technical datasheet for the {product_name}. Include: product overview, key features and benefits, full technical specifications table, performance curves/graphs description, installation requirements, certifications, warranty terms, and ordering information. Tone: professional and precise.",
    },
    {
      id: "ps-06",
      title: "Product Lifecycle Review",
      category: "Strategy",
      prompt: "Review the lifecycle status of products in the {category} category. Classify each as: Introduction, Growth, Maturity, or Decline. Recommend: products to promote, products approaching EOL, replacement product candidates, and clearance pricing strategy for declining products.",
    },
    {
      id: "ps-07",
      title: "Technology Trend Report",
      category: "Research",
      prompt: "Write a quarterly technology trend report for solar PV equipment. Cover: emerging cell technologies (TOPCon, HJT, Perovskite), inverter innovations, battery chemistry advancements, smart home integration trends, and regulatory changes affecting product requirements. Recommend catalog adjustments.",
    },
  ],

  "seo-content": [
    {
      id: "sc-01",
      title: "Product Page SEO Audit",
      category: "Technical SEO",
      prompt: "Audit the SEO health of our top 20 product pages. Check: title tags, meta descriptions, H1 structure, image alt texts, schema markup (Product, Offer, Review), page speed, mobile usability, and internal linking. Provide a prioritized fix list with expected traffic impact.",
    },
    {
      id: "sc-02",
      title: "Solar Blog Article Writer",
      category: "Content",
      prompt: "Write an SEO-optimized blog article on '{topic}'. Target keyword: {keyword}. Include: compelling headline, meta description, 1500-2000 words with proper H2/H3 structure, internal links to relevant products, external authoritative sources, and a CTA. Write for solar-interested homeowners and installers.",
    },
    {
      id: "sc-03",
      title: "Keyword Research — Product Category",
      category: "SEO Strategy",
      prompt: "Conduct keyword research for the {product_category} category page. Identify: primary keyword (highest volume commercial intent), secondary keywords (10-15), long-tail keywords (20+), questions people ask, and competitor keyword gaps. Organize by search intent: informational, navigational, commercial, transactional.",
    },
    {
      id: "sc-04",
      title: "Local SEO Strategy",
      category: "Local",
      prompt: "Design a local SEO strategy for PV Partner targeting the {region} market. Include: Google Business Profile optimization, local keyword targeting, local content strategy, citation building plan, review generation strategy, and local link building opportunities in the solar/renewable energy space.",
    },
    {
      id: "sc-05",
      title: "Technical Installation Guide",
      category: "Content",
      prompt: "Write a comprehensive installation guide for {product_type}. Include: step-by-step instructions, safety precautions, required tools, wiring diagrams description, common mistakes to avoid, and troubleshooting tips. Optimize for SEO targeting 'how to install {product_type}' queries.",
    },
    {
      id: "sc-06",
      title: "Content Performance Review",
      category: "Analytics",
      prompt: "Analyze our content performance for the past quarter. Review: top 10 pages by organic traffic, keyword ranking changes, content gaps vs. competitors, conversion rates by content type, and pages losing rankings. Recommend: content updates, new content priorities, and pruning candidates.",
    },
    {
      id: "sc-07",
      title: "Schema Markup Generator",
      category: "Technical SEO",
      prompt: "Generate structured data markup for our solar eCommerce pages. Create: Product schema for individual products, LocalBusiness schema for company pages, FAQ schema for help pages, HowTo schema for installation guides, and BreadcrumbList schema for navigation. Output ready-to-implement JSON-LD.",
    },
  ],

  "linkedin-brand": [
    {
      id: "lb-01",
      title: "LinkedIn Profile Optimization",
      category: "Profile",
      prompt: `Optimize my LinkedIn profile to position me as an elite Odoo Mentor & AI Manager for eCommerce. Create:

HEADLINE: Craft a compelling headline (max 220 chars) that combines Odoo expertise, AI innovation, and solar eCommerce leadership.

ABOUT SECTION: Write a magnetic 'About' section (2000 chars max) that tells my story: from Odoo implementation expert to AI-powered eCommerce innovator in the solar industry. Include: credibility markers, transformation narrative, what I help people achieve, and a clear CTA.

EXPERIENCE: Rewrite experience descriptions that showcase impact metrics (revenue growth, automation savings, partner network size).

FEATURED: Recommend 3-5 types of featured content to showcase.

SKILLS: Top 15 skills to list for maximum endorsement potential.`,
    },
    {
      id: "lb-02",
      title: "Weekly LinkedIn Post — Odoo Tip",
      category: "Content",
      prompt: "Write a LinkedIn post sharing an Odoo eCommerce tip. Topic: {topic}. Format: Hook (pattern interrupt or contrarian take) → Context (why this matters) → Insight (the actual tip with specifics) → Result (what happens when applied) → CTA (engagement question). 150-200 words. Add 3-5 relevant hashtags.",
    },
    {
      id: "lb-03",
      title: "LinkedIn Article — AI in Solar eCommerce",
      category: "Thought Leadership",
      prompt: "Write a LinkedIn article (800-1200 words) on how AI is transforming solar eCommerce. Cover: AI-powered product recommendations, intelligent inventory management, automated customer support, predictive demand forecasting, and personalized installer portals. Include real examples from our PV Partner implementation. Position as thought leadership from an Odoo + AI expert.",
    },
    {
      id: "lb-04",
      title: "Case Study Post — Client Success",
      category: "Social Proof",
      prompt: "Write a LinkedIn post showcasing a client success story. Structure: Situation (what challenge they faced) → Solution (how we used Odoo + AI to solve it) → Results (specific metrics: revenue increase, time saved, efficiency gains). Keep it authentic and relatable. Include a takeaway lesson for the audience. 200-250 words.",
    },
    {
      id: "lb-05",
      title: "Engagement Comment Templates",
      category: "Networking",
      prompt: "Create 10 thoughtful comment templates for engaging with posts in the Odoo, eCommerce, solar energy, and AI communities on LinkedIn. Each should: add genuine value, showcase expertise subtly, invite further conversation, and be adaptable to different post types (questions, achievements, insights, news).",
    },
    {
      id: "lb-06",
      title: "LinkedIn Newsletter Strategy",
      category: "Newsletter",
      prompt: "Design a LinkedIn Newsletter strategy. Name: suggest 3 options combining Odoo + AI + eCommerce themes. Frequency: bi-weekly. Content pillars: (1) Odoo implementation deep-dives, (2) AI use cases in eCommerce, (3) Solar industry insights, (4) Digital transformation playbooks. Create outlines for the first 6 editions.",
    },
    {
      id: "lb-07",
      title: "LinkedIn Connection Request Messages",
      category: "Networking",
      prompt: "Write 5 personalized connection request message templates for different target personas: (1) Solar installer business owners, (2) Odoo implementation partners, (3) eCommerce entrepreneurs, (4) Solar industry executives, (5) AI/tech enthusiasts. Each under 300 characters, referencing a specific shared interest or mutual value.",
    },
  ],
};

function getAllPrompts() {
  const all = [];
  for (const [agentSlug, agentPrompts] of Object.entries(PROMPTS)) {
    for (const p of agentPrompts) {
      all.push({ ...p, agentSlug });
    }
  }
  return all;
}

function getPromptsByAgent(slug) {
  return PROMPTS[slug] || [];
}

function getPromptCategories(slug) {
  const prompts = PROMPTS[slug] || [];
  return [...new Set(prompts.map((p) => p.category))];
}

export { PROMPTS, getAllPrompts, getPromptsByAgent, getPromptCategories };

export const stats = [
  { value: 12, suffix: 'K+', label: 'Functions indexed in testing' },
  { value: 180, suffix: '%', prefix: '+', label: 'More viva questions covered per session' },
  { value: 30, suffix: 's', label: 'Avg. time to a sourced answer' },
  { value: 2, suffix: '', label: 'Retrieval engines, working together' },
];

export const capabilities = [
  {
    tag: 'ask',
    title: 'Ask your own codebase',
    copy: 'Point CodeUtil at your project and ask it anything — "why does this loop exist," "what calls this function" — and get an answer sourced from your actual code, not a guess.',
    tags: ['FAISS', 'BM25', 'Groq'],
  },
  {
    tag: 'drill',
    title: 'Generate viva questions',
    copy: 'CodeUtil reads every function and class you wrote and drafts questions examiners actually ask — easy, medium, and hard — then answers them itself so you can check your understanding.',
    tags: ['AST parsing', 'LLM'],
  },
  {
    tag: 'trace',
    title: 'Trace every claim to a line',
    copy: 'Every answer comes with the file, the function, and the exact lines it was pulled from. Nothing is invented — if it isn\u2019t in your code, CodeUtil says so.',
    tags: ['Source-grounded', 'No hallucination'],
  },
];

export const skillset = [
  {
    n: '01',
    title: 'Parse',
    desc: 'Your files are walked with Python\u2019s own AST. Every function, class, argument, loop, and call gets pulled out and structured.',
    result: 'Nothing is skimmed — every branch and condition is captured before anything is indexed.',
  },
  {
    n: '02',
    title: 'Chunk & Embed',
    desc: 'Each function becomes a self-contained chunk of source and metadata, then gets embedded into vector space alongside a keyword index.',
    result: 'Two ways to find the same code, so a vague question and an exact-term question both land.',
  },
  {
    n: '03',
    title: 'Retrieve',
    desc: 'A question triggers a hybrid search — semantic similarity from FAISS, keyword overlap from BM25 — merged and de-duplicated.',
    result: 'The four most relevant chunks in your codebase, not the whole repo dumped into a prompt.',
  },
  {
    n: '04',
    title: 'Answer',
    desc: 'Retrieved context is handed to the LLM with a strict instruction: answer only from what was given, or say it isn\u2019t there.',
    result: 'A grounded answer with file, function, and line numbers attached.',
  },
];

export const pricingTiers = [
  {
    name: 'Student',
    monthly: 0,
    annual: 0,
    tagline: 'For your next viva',
    features: ['1 active codebase', 'Unlimited Q&A on that project', '10 viva questions per session', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    monthly: 9,
    annual: 7,
    tagline: 'For every project this semester',
    features: ['Unlimited codebases', 'Unlimited viva generation', 'Priority retrieval speed', 'Export Q&A as study sheet'],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Team',
    monthly: 24,
    annual: 19,
    tagline: 'For labs and project groups',
    features: ['Everything in Pro', 'Shared codebase sessions', 'Per-member usage view', 'Priority email support'],
    cta: 'Talk to us',
  },
];

export const testimonials = [
  { quote: 'I could explain my own recursion function for the first time in front of my panel, because I\u2019d already been asked about it by CodeUtil the night before.', name: 'Aarav', role: 'Final-year CS student' },
  { quote: 'It found a helper function I\u2019d completely forgotten I wrote. My examiner asked about it two minutes later.', name: 'Meera', role: 'B.Tech, Information Technology' },
  { quote: 'The line-level sourcing is what sold me — it never makes something up, it just tells me it\u2019s not in the code.', name: 'Devansh', role: 'Teaching assistant' },
  { quote: 'Ran it on a group project the night before submission and it caught two functions none of us could explain.', name: 'Priya', role: 'Capstone project lead' },
];

export const stack = ['Python', 'FastAPI', 'FAISS', 'BM25', 'Groq', 'React', 'AST', 'JWT'];

export const faqs = [
  {
    q: 'Does CodeUtil send my code anywhere permanent?',
    a: 'Your files are parsed and indexed in-session to answer your questions. Nothing is used to train a model, and sessions are cleared when you end them.',
  },
  {
    q: 'What languages does it support right now?',
    a: 'Python, end to end — parsing, chunking, and retrieval are all built around Python\u2019s AST. Support for other languages is on the roadmap.',
  },
  {
    q: 'Can it answer questions that aren\u2019t in my code?',
    a: 'No, and that\u2019s deliberate. If the retrieved context doesn\u2019t contain the answer, CodeUtil tells you it couldn\u2019t find it rather than guessing.',
  },
  {
    q: 'How is this different from just asking a general AI chatbot?',
    a: 'A general chatbot doesn\u2019t know your code exists. CodeUtil indexes your actual files first, so every answer is grounded in the functions you wrote, with the lines to prove it.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. Upload your files, and indexing happens on the server. You ask questions from the browser.',
  },
];

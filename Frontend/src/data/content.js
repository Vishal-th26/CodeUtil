export const stats = [
  { value: 12, suffix: 'K+', label: 'Functions reviewed in testing' },
  { value: 180, suffix: '%', prefix: '+', label: 'More viva questions covered per session' },
  { value: 30, suffix: 's', label: 'Avg. time to an answer' },
  { value: 2, suffix: '', label: 'Two ways to find the right code' },
];

export const capabilities = [
  {
    tag: 'ask',
    title: 'Ask your own codebase',
    copy: 'Point CodeUtil at your project and ask it anything — "why does this loop exist," "what calls this function" — and get a clear answer from your own work, not a guess.',
    tags: ['Code-aware', 'Trustworthy', 'Practical'],
  },
  {
    tag: 'drill',
    title: 'Generate viva questions',
    copy: 'It scans your files and creates the kind of viva questions your examiners are likely to ask, so you can practice with confidence.',
    tags: ['Fast review', 'Smart practice'],
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
    title: 'Login',
    desc: 'Sign in so CodeUtil can keep your project and questions in one place.',
    result: 'Start from a secure session and move straight to the next step.',
  },
  {
    n: '02',
    title: 'Upload',
    desc: 'Send in your codebase so the app can read the project you want to ask about.',
    result: 'Your code is ready to be used for questions and practice.',
  },
  {
    n: '03',
    title: 'Ask',
    desc: 'Ask anything about your code and get an answer based on what you uploaded.',
    result: 'CodeUtil answers from your own project, not from a generic chatbot.',
  },
  {
    n: '04',
    title: 'Viva',
    desc: 'Generate viva-style questions and see the answers that help you prepare.',
    result: 'A practical question-and-answer review built from your own code.',
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
  {
    quote: "Walked into my DBMS viva having already answered three of the exact questions my professor asked. Wasn't even nervous.",
    name: "Ananya Rao",
    role: "B.Tech CSE, 3rd year",
  },
  {
    quote: "I forgot why I wrote a whole recursive helper six months ago. This found it and explained it back to me in ten seconds.",
    name: "Rohit Mehta",
    role: "MSc Computer Science",
  },
  {
    quote: "Uploaded my entire capstone repo the night before submission. It flagged two functions with zero test coverage I'd completely missed.",
    name: "Sneha Iyer",
    role: "Final year, Information Tech",
  },
  {
    quote: "My guide asked why I used a hashmap instead of a list in one function. I had the answer memorized because it was literally in my drafted Q&A.",
    name: "Kabir Singh",
    role: "B.E. Computer Engineering",
  },
  {
    quote: "Honestly didn't expect line-level citations to actually work this well. Every answer pointed to the real file, not a guess.",
    name: "Priya Nair",
    role: "Backend Developer, Intern",
  },
  {
    quote: "Used it to prep for a code review at my internship, not just college. Same panic, same fix.",
    name: "Arjun Malhotra",
    role: "SDE Intern",
  },
  {
    quote: "The ten drafted viva questions were harder than what my actual panel asked. Good problem to have.",
    name: "Divya Krishnan",
    role: "B.Tech IT, 4th year",
  },
  {
    quote: "I have ADHD and re-reading my own code the night before an exam never worked. This turned it into search instead of rereading.",
    name: "Aditya Verma",
    role: "MCA student",
  },
  {
    quote: "Found an entire module I'd copy-pasted from a tutorial two years ago and forgotten about. My guide would've asked about it for sure.",
    name: "Meera Pillai",
    role: "B.Tech CSE, 3rd year",
  },
  {
    quote: "The under-60-second indexing claim actually held up on a 4,000 line repo. I timed it out of disbelief.",
    name: "Vikram Desai",
    role: "Software Engineer, Grad hire",
  },
  {
    quote: "My teammate wrote half the backend and disappeared before submissions. This is the only reason I could explain his code convincingly.",
    name: "Ishaan Kapoor",
    role: "B.E. Final year",
  },
  {
    quote: "Every answer traced back to an actual line range, so I could just open the file and double check instead of trusting a black box.",
    name: "Neha Choudhary",
    role: "MSc Data Science",
  },
  {
    quote: "Went from dreading 'why did you write it this way' to actually wanting someone to ask.",
    name: "Aryan Bhatt",
    role: "B.Tech CSE, 2nd year",
  },
  {
    quote: "I used it on a legacy Django project at work, not just my thesis. Same relief, honestly bigger stakes.",
    name: "Tanya Sharma",
    role: "Junior Backend Developer",
  },
  {
    quote: "Graded difficulty on the practice questions meant I wasn't just drilling easy ones and feeling falsely confident.",
    name: "Karthik Subramaniam",
    role: "M.Tech, Software Systems",
  },
  {
    quote: "My viva examiner asked about edge cases in a function I hadn't touched in months. I'd already seen that exact question drafted.",
    name: "Riya Deshmukh",
    role: "B.Tech IT, 3rd year",
  },
  {
    quote: "Compared it to just re-reading my own README the night before. Not close. This actually understood the control flow.",
    name: "Nikhil Agarwal",
    role: "Final year, CSE",
  },
  {
    quote: "Used it the morning of my defense, not the night before, and it still only took a minute to reindex my last-minute changes.",
    name: "Ayesha Khan",
    role: "MSc Computer Applications",
  },
  {
    quote: "The 100% traceability thing sounds like a marketing line until you're the one getting grilled and need the receipts.",
    name: "Siddharth Rao",
    role: "B.E. Computer Science",
  },
  {
    quote: "I've recommended this to my entire study group. We all walked in with different weak spots and it covered every one of them.",
    name: "Pooja Varma",
    role: "B.Tech CSE, 3rd year",
  },
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

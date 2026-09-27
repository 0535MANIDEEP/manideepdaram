/**
 * Single source of truth for every string and data point on the site.
 *
 * Rules encoded here (design-taste-frontend):
 *  - Zero em-dashes or en-dashes in any user-visible string (SS 9.G).
 *  - No filler verbs, no poetic labels, no micro-meta sentences (SS 9.F).
 *  - Every number here is real and supplied by the candidate. Nothing invented.
 *  - No "tailored" / "curated" resume language. He shares his resume on request.
 */

export const identity = {
  name: 'Manideep Daram',
  nameDisplay: 'MANIDEEP DARAM',
  initials: 'MD',
  role: 'Computer Science & Engineering Graduate',
  roleSecondary: 'Software Engineer, Fresher',
  location: 'Hyderabad, Telangana, India',
  email: 'manideepdaram@gmail.com',
  phone: '+917386296828',
  phoneHref: 'tel:+917386296828',
  linkedin: 'https://linkedin.com/in/manideep-daram',
  github: 'https://github.com/0535MANIDEEP',
  availableForWork: true,
};

/** Hero. Max 4 text elements total (SS 4.7): eyebrow, headline, subtext, CTAs. */
export const hero = {
  eyebrow: 'Open to Software Engineer roles',
  headlineLines: ['MANIDEEP', 'DARAM'],
  subtext:
    'B.Tech Computer Science graduate, 8.53 CGPA, with a published research paper and two shipped projects.',
  primaryCta: { label: 'Request Resume', target: '#contact' },
  secondaryCta: { label: 'Explore Work', target: '#projects' },
};

/**
 * Hero backdrop only. Re-requested from the supplied Unsplash ID at 1200x800
 * webp; the original was 1.1 MB. It sits at low opacity behind the canvas
 * particle field as texture, so it makes no claim about the work.
 */
export const images = {
  hero: 'https://images.unsplash.com/photo-1672872476232-da16b45c9001?w=1200&h=800&fit=crop&q=70&fm=webp',
};

/**
 * Project visuals.
 *
 * There are no stock photographs here on purpose. A picture of somebody else's
 * desk says nothing about a blood bank app, and generic imagery is exactly the
 * filler this site should not contain. Each project is represented by a diagram
 * of how it actually works, drawn only from the real project descriptions.
 */
export const projectFlows = {
  'android-blood-bank': {
    caption: 'How the app works',
    steps: [
      { icon: 'userPlus', label: 'Donor registers', detail: 'Blood group and contact stored on device' },
      { icon: 'drop', label: 'Inventory tracked', detail: 'Blood bank stock updated in real time' },
      { icon: 'usersThree', label: 'Request is matched', detail: 'Algorithm pairs a request to eligible donors' },
      { icon: 'mapPin', label: 'Nearby donors alerted', detail: 'Location proximity ranks who gets notified' },
      { icon: 'chat', label: 'Donor and bank talk', detail: 'One thread for the whole handover' },
    ],
  },
  foodforward: {
    caption: 'How the platform works',
    steps: [
      { icon: 'storefront', label: 'Surplus is reported', detail: 'Events and restaurants log what is left' },
      { icon: 'path', label: 'Routing is computed', detail: 'Nearest shelter hub picked for the load' },
      { icon: 'usersThree', label: 'Hub is notified', detail: 'Collection window and quantity agreed' },
      { icon: 'chartLine', label: 'Impact is recorded', detail: 'Meals redirected tracked per collection' },
    ],
    citation: {
      journal: 'JETIR',
      detail: 'Vol. 11, Issue 4, April 2024',
      id: 'JETIR2404570',
    },
  },
};

/** Metrics band sits directly under the hero, never inside it (SS 4.7). */
export const metrics = [
  { value: '8.53', label: 'B.Tech CGPA', sub: 'out of 10.0' },
  { value: 'JETIR', label: 'Published research', sub: 'UGC approved, April 2024' },
  { value: '2', label: 'Shipped projects', sub: 'Android and full stack' },
  { value: '2024', label: 'Graduate', sub: 'Vidya Jyothi Institute' },
];

/** Exactly ONE marquee on the page (SS 5). No locale strip inside it (SS 9.F). */
export const marqueeItems = [
  'DATA STRUCTURES & ALGORITHMS',
  'DBMS & SQL',
  'FULL STACK WEB',
  'PUBLISHED RESEARCHER',
  'ANDROID MOBILE APPS',
  'AGILE & SOFTWARE ENGINEERING',
  'JAVA & JAVASCRIPT',
  'B.TECH COMPUTER SCIENCE',
];

export const about = {
  heading: 'A graduate who ships, not just studies',
  body: [
    'I am a 2024 Computer Science graduate from Vidya Jyothi Institute of Technology in Hyderabad, now looking for a Software Engineer role.',
    'Most of my work has been end to end. The Android Blood Bank app handled donor matching, location alerts and blood bank communication in one native build. FoodForward was a full stack platform for redirecting surplus food, and the research behind it became a published JETIR paper.',
    'I work in Java, JavaScript and Python, and I am comfortable across the stack rather than locked to one layer.',
  ],
  strengths: [
    { label: 'Backend and APIs', detail: 'REST services in Node and Express, SQL and MongoDB' },
    { label: 'Android', detail: 'Native Java apps with Firebase and Google Maps' },
    { label: 'Research', detail: 'Co-author on a UGC approved JETIR publication' },
    { label: 'Practice', detail: 'Agile delivery, code review, Git branching' },
  ],
};

export const education = {
  heading: 'Education',
  institution: 'Vidya Jyothi Institute of Technology, Hyderabad',
  degree: 'Bachelor of Technology, Computer Science & Engineering',
  timeline: '2020 - 2024',
  cgpa: '8.53 / 10.0',
  coursework: [
    'Data Structures & Algorithms',
    'DBMS',
    'Software Engineering & Agile',
    'Web Technologies',
    'OOP',
    'Computer Networks',
  ],
};

export const skills = {
  heading: 'Skills',
  categories: [
    {
      name: 'Programming',
      items: ['Java', 'Python', 'JavaScript', 'C / C++', 'SQL'],
    },
    {
      name: 'Web and Core CS',
      items: ['React.js', 'Node.js', 'HTML5 / CSS3', 'Tailwind CSS', 'REST APIs'],
    },
    {
      name: 'Data and Systems',
      items: ['DBMS', 'SQLite', 'Firebase', 'MongoDB', 'MySQL'],
    },
    {
      name: 'Engineering and Tools',
      items: ['Agile', 'Git and GitHub', 'Android Studio', 'Data Structures', 'Computer Networks'],
    },
  ],
};

export const projects = {
  heading: 'Selected work',
  items: [
    {
      id: 'android-blood-bank',
      title: 'Android Blood Bank Management App',
      kicker: 'Key academic project',
      body: 'A native Android application for real time blood inventory tracking. It matches donors to requests, alerts nearby donors by location, and keeps donors and blood banks talking in one place.',
      stack: ['Android Studio', 'Java', 'Firebase', 'Google Maps API', 'XML UI', 'SQLite'],
    },
    {
      id: 'foodforward',
      title: 'FoodForward',
      kicker: 'Published research, built in full',
      body: 'A full stack platform that redirects surplus food from events and restaurants to nearby shelter hubs, with routing logic and impact tracking. The research became a JETIR paper.',
      stack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs'],
    },
  ],
};

export const research = {
  heading: 'Research',
  paperTitle: 'Foodforward: An Initiative To Reduce Food Wastage',
  journal: 'Journal of Emerging Technologies and Innovative Research',
  approval: 'UGC Approved',
  volumeIssue: 'Vol. 11, Issue 4, April 2024',
  issn: 'ISSN 2349-5162',
  paperId: 'JETIR2404570',
  role: 'Co-author and core researcher',
  body: 'Research and implementation of a platform to move surplus food from commercial sources to people who need it, reducing waste at the point of generation rather than after it.',
};

export const milestones = {
  heading: 'Milestones I am proud of',
  items: [
    {
      title: 'Paper accepted to JETIR',
      detail: 'Foodforward published in a UGC approved journal, April 2024.',
    },
    {
      title: 'Mini-project exhibition',
      detail: 'The Android Blood Bank app was presented at a college project exhibition.',
    },
    {
      title: '8.53 CGPA',
      detail: 'Graduated Computer Science with distinction from Vidya Jyothi Institute.',
    },
    {
      title: 'Two projects shipped end to end',
      detail: 'A native Android app and a deployed full stack platform, both built solo.',
    },
  ],
};

/**
 * Contact. No resume download button anywhere on the site.
 * The form is the only conversion path, so it must actually submit.
 */
export const contact = {
  heading: 'Want to hire me? Request my resume.',
  body: 'Tell me the role you are hiring for and I will send you my resume, along with anything relevant to that position.',
  fields: {
    name: { label: 'Full name', placeholder: 'Priya Sharma', testId: 'contact-form-name' },
    email: { label: 'Email address', placeholder: 'priya@company.com', testId: 'contact-form-email' },
    role: {
      label: 'Role you are hiring for',
      placeholder: 'Software Engineer Trainee',
      testId: 'contact-form-role',
      required: true,
    },
    company: { label: 'Company', placeholder: 'Company name', testId: 'contact-form-company' },
    message: {
      label: 'Job description or message',
      placeholder: 'Role, team, and what you are looking for.',
      testId: 'contact-form-message',
      optional: true,
    },
  },
  submitLabel: 'Request Resume',
  successTitle: 'Request received',
  successBody: 'Thank you. I will respond with my resume shortly.',
  errors: {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    role: 'Please enter the role you are hiring for.',
    network: 'Could not reach the server. Please try again.',
    generic: 'Something went wrong. Please try again.',
  },
};

export const footer = {
  note: 'Built and maintained by Manideep Daram.',
  socials: [
    { name: 'LinkedIn', href: identity.linkedin, icon: 'linkedinLogo', testId: 'social-linkedin-link' },
    { name: 'GitHub', href: identity.github, icon: 'githubLogo', testId: 'social-github-link' },
    { name: 'Email', href: `mailto:${identity.email}`, icon: 'envelopeSimple', testId: 'social-email-link' },
    { name: 'Phone', href: identity.phoneHref, icon: 'phone', testId: 'social-phone-link' },
  ],
};

export const nav = [
  { label: 'About', target: '#about', testId: 'nav-link-about' },
  { label: 'Education', target: '#education', testId: 'nav-link-education' },
  { label: 'Skills', target: '#skills', testId: 'nav-link-skills' },
  { label: 'Projects', target: '#projects', testId: 'nav-link-projects' },
  { label: 'Research', target: '#research', testId: 'nav-link-research' },
  { label: 'Milestones', target: '#milestones', testId: 'nav-link-achievements' },
  { label: 'Request Resume', target: '#contact', testId: 'nav-link-contact', cta: true },
];

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
    // Every step here was checked against the source in blood-bank-android. The
    // previous version claimed a chat thread and real time stock updates, and
    // neither exists: there is no messaging code, no Firebase, and the manifest
    // has no INTERNET permission, so nothing could be real time. Two features
    // that were never built had been described as if they had.
    steps: [
      { icon: 'userPlus', label: 'Donor registers', detail: 'Blood group, phone and city, stored in SQLite on the device' },
      { icon: 'drop', label: 'Request is raised', detail: 'A hospital asks for units of a group and gives its location' },
      { icon: 'mapPin', label: 'Donors are matched', detail: 'Compatible groups only, ranked nearest first from the hospital' },
      { icon: 'list', label: 'Stock is listed', detail: 'Blood bank units held locally, and a tap opens the dialer pre-filled' },
    ],
  },
  foodforward: {
    caption: 'How the platform works',
    steps: [
      { icon: 'storefront', label: 'Surplus is listed', detail: 'Weight, category, pickup window, and the safe-until time or its absence' },
      { icon: 'x', label: 'Safety check refuses it', detail: 'No expiry recorded, or already past, never reaches a hub' },
      { icon: 'path', label: 'Routing is computed', detail: 'Nearest hub with room, open hours, and matching category' },
      { icon: 'chartLine', label: 'Handover is recorded', detail: 'Counted once, from the collection rather than the listing' },
    ],
    citation: {
      journal: 'International Journal of Emerging Technologies and Innovative Research',
      detail: 'Vol. 11, Issue 4, pp. f645-f647, April 2024',
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
    'Most of my work has been end to end. The Android Blood Bank app handled donor matching, location alerts and blood bank communication in one native build. FoodForward routes surplus food to shelter hubs and refuses anything unsafe to send, and the research behind it became a published JETIR paper.',
    'I work in Java, JavaScript and Python, and I am comfortable across the stack rather than locked to one layer.',
  ],
  strengths: [
    { label: 'Backend and APIs', detail: 'REST services in Node and Express, relational schema design in MySQL' },
    { label: 'Android', detail: 'Native Java apps, local SQLite, on-device matching' },
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
      // Firebase came off this list for the same reason MongoDB did. Nothing in
      // either shipped project uses it, and the Android app's manifest has no
      // INTERNET permission at all.
      items: ['DBMS', 'MySQL', 'Schema design', 'SQLite', 'JDBC'],
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
      kicker: 'Native Android',
      body: 'A native Android application for blood bank stock and donor matching. Register donors with their blood group, raise a request for units from a hospital, and the app returns donors of compatible groups ranked by distance, with a tap to open the dialer pre-filled. Everything runs on the device.',
      stack: ['Android Studio', 'Java', 'XML UI', 'SQLite', 'Material 3'],
      repo: 'https://github.com/0535MANIDEEP/blood-bank-android',
      /**
       * What the detail page offers, in the order it should be read.
       *
       * `kind` is only a hint for the icon and the wording, never for whether
       * the link works. Every href here is real and resolves.
       */
      actions: [
        {
          label: 'Download the APK',
          href: 'https://github.com/0535MANIDEEP/blood-bank-android/releases/download/v1.0/BloodBank-v1.0.apk',
          kind: 'download',
          detail: 'Signed release build. Installs on Android 7.0 and newer, and runs fully offline with no account, no API keys and no INTERNET permission.',
        },
      ],
      facts: [
        { label: 'Platform', value: 'Android 7.0 and newer' },
        { label: 'Language', value: 'Java, XML layouts' },
        { label: 'Storage', value: 'SQLite, on device' },
        { label: 'Network', value: 'None required' },
      ],
      note: 'Installs on Android 7.0 and newer. Runs fully offline, no account or API keys. The build above is the release asset, not a page describing one.',
    },
    {
      id: 'foodforward',
      title: 'FoodForward',
      kicker: 'Published research, built in full',
      body: 'A platform that routes surplus food from restaurants and events to nearby shelter hubs, and refuses anything unsafe to send. A listing with no safe-until time, or one already past it, is rejected inside the assignment transaction rather than flagged and routed anyway, so no code path can produce a valid assignment for food that could make somebody ill. The research behind it became a JETIR paper.',
      /**
       * MySQL, not MongoDB.
       *
       * The earlier list claimed MongoDB, which contradicts the published paper:
       * the JETIR abstract names MySQL. The paper is the source of truth for a
       * published claim, so the stack follows it. React and Tailwind are the
       * interface, rebuilt after the 2024 prototype, and the MySQL schema and
       * routing rules are the paper's.
       */
      stack: ['Node.js', 'Express', 'MySQL', 'React.js', 'Tailwind CSS', 'REST APIs'],
      repo: 'https://github.com/0535MANIDEEP/foodforward',
      actions: [
        {
          label: 'Visit the live interface',
          href: 'https://0535manideep.github.io/foodforward/',
          kind: 'demo',
          detail: 'Deployed to GitHub Pages. The API is a separate deployment, so until it is running the interface reports itself as unconnected rather than showing invented figures. The repository is the better evidence.',
        },
        {
          label: 'Read the paper',
          href: 'https://www.jetir.org/papers/JETIR2404570.pdf',
          kind: 'paper',
          detail: 'JETIR2404570, pp. f645-f647, April 2024. Co-authored, and the reason the schema uses MySQL.',
        },
      ],
      facts: [
        { label: 'Database', value: 'MySQL 8, no ORM' },
        { label: 'Safety rule', value: 'Refused in the transaction' },
        { label: 'Tests', value: '148, 69 need no setup' },
        { label: 'Double counting', value: 'Blocked by the schema' },
      ],
      /**
       * The repository is the proof, so the card says so plainly rather than
       * apologising for the API not being deployed. 69 of the 148 tests run from
       * a fresh clone with no install and no database, which is a stronger claim
       * than a screenshot of a working demo would be: anybody can check it in ten
       * seconds instead of taking it on trust.
       */
      note: 'Clone it and run npm run test:domain. No install, no database, 69 tests covering the safety refusals, the routing rules and the impact accounting. The API is a separate deployment, and the interface says so rather than faking data.',
    },
  ],
};

/**
 * The published paper, as it actually appears.
 *
 * Two things here were wrong before and are now corrected against the PDF at
 * http://www.jetir.org/papers/JETIR2404570.pdf, which returns HTTP 200 and
 * 1,010,538 bytes of application/pdf:
 *
 *   - the journal name was missing "International". The full title is
 *     "International Journal of Emerging Technologies and Innovative Research".
 *   - the ISSN read 2349-5162. It is 2349-9162.
 *
 * A wrong ISSN on a published citation is the kind of error that makes a real
 * publication look fabricated, which is the opposite of what this section is for.
 * Page range uses a hyphen rather than an en-dash to keep the site's own rule
 * against dashes in user-visible strings.
 *
 * The link is https, not http. Both resolve and both return the same 1,010,538
 * byte PDF, but a portfolio should not hand a reader a plaintext link when the
 * publisher serves TLS.
 */
export const research = {
  heading: 'Research',
  paperTitle: 'FoodForward: An Initiative to Reduce Food Wastage',
  journal: 'International Journal of Emerging Technologies and Innovative Research',
  approval: 'UGC Approved',
  volumeIssue: 'Vol. 11, Issue 4, pp. f645-f647, April 2024',
  issn: 'ISSN 2349-9162',
  paperId: 'JETIR2404570',
  paperUrl: 'https://www.jetir.org/papers/JETIR2404570.pdf',
  role: 'Co-author and core researcher',
  authors: 'RVN Vijayanand, D Manideep, B Mohari, D Pramod, K. Spandana Kumari',
  body: 'Research and implementation of a platform to move surplus food from commercial sources to people who need it, reducing waste at the point of generation rather than after it. The prototype was built in HTML, CSS, JavaScript, Node.js and MySQL.',
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
      detail: 'A native Android app, and a surplus food routing platform with a live interface, a deployable API and 148 automated tests.',
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

/**
 * Primary navigation.
 *
 * Five items, not seven. Education and Milestones are still real sections and
 * are still reachable by scrolling, but seven links plus the brand do not fit on
 * one line at 1024px. They wrapped onto two rows inside a 72px bar, which is the
 * other half of the header problem. A test asserts a single row at every desktop
 * width, so adding an item without checking that fails the build rather than
 * shipping a broken header.
 */
export const nav = [
  { label: 'About', target: '#about', testId: 'nav-link-about' },
  { label: 'Skills', target: '#skills', testId: 'nav-link-skills' },
  { label: 'Projects', target: '#projects', testId: 'nav-link-projects' },
  { label: 'Research', target: '#research', testId: 'nav-link-research' },
  { label: 'Request Resume', target: '#contact', testId: 'nav-link-contact', cta: true },
];

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
  role: 'Frontend Developer',
  roleStack: ['React', 'Vue', 'TypeScript'],
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
    'B.Tech Computer Science graduate, 8.53 CGPA, with seven months of frontend internship on a production risk-management application.',
  primaryCta: { label: 'Request Resume', target: '#contact' },
  secondaryCta: { label: 'Explore Work', target: '#experience' },
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
};

/** Metrics band sits directly under the hero, never inside it (SS 4.7). */
export const metrics = [
  { value: '8.53', label: 'B.Tech CGPA', sub: 'out of 10.0' },
  { value: '7 months', label: 'Frontend internship', sub: 'Dec 2023 to Jun 2024' },
  { value: 'JETIR', label: 'Published research', sub: 'UGC approved, April 2024' },
  { value: '2024', label: 'Graduate', sub: 'Vidya Jyothi Institute' },
];

/** Exactly ONE marquee on the page (SS 5). No locale strip inside it (SS 9.F). */
export const marqueeItems = [
  'DATA STRUCTURES & ALGORITHMS',
  'DBMS & SQL',
  'FULL STACK WEB',
  'PUBLISHED RESEARCHER',
  'REACT, VUE & TYPESCRIPT',
  'AGILE & SOFTWARE ENGINEERING',
  'ACCESS CONTROL IN THE API',
  'B.TECH COMPUTER SCIENCE',
];

export const about = {
  heading: 'A graduate who ships, not just studies',
  body: [
    'I am a 2024 Computer Science graduate from Vidya Jyothi Institute of Technology in Hyderabad, now looking for a Software Engineer role.',
    'Seven of those months were spent inside a team, building forms, screens, tabs and navigation for a production risk-management application in Vue.js, and then integrating the REST endpoints behind it. The research behind one of my own projects became a published JETIR paper.',
    'I work in Java, JavaScript, TypeScript and Python, and I am comfortable across the stack rather than locked to one layer.',
  ],
  strengths: [
    { label: 'Interfaces', detail: 'Vue.js, React.js and TypeScript, with validated forms and the loading, empty and error states that go with them' },
    { label: 'Backend and APIs', detail: 'REST services in Node and Express, relational schema design in MySQL' },
    { label: 'Access control', detail: 'Role based permissions enforced by the API, not only hidden in the interface' },
    { label: 'Practice', detail: 'Agile delivery, code review, Git branching, and CI on every push' },
  ],
};

/**
 * Experience.
 *
 * The internship is the entry that carries this site for the first
 * application. It is commercial work, so there is no repository behind it and
 * the only thing that can be offered is an accurate description of it.
 *
 * The role based access control bullet carries a public build of the same idea
 * beside it, because a claim about authorization that cannot be checked is a
 * claim nobody can verify. DocVault is that check: the same permission matrix
 * enforced in the API, in public code.
 */
export const experience = {
  heading: 'Experience',
  entries: [
    {
      id: 'crystalline',
      company: 'Crystalline Software Technologies',
      location: 'Hyderabad, India',
      role: 'Frontend Development Intern',
      period: 'Dec 2023 to Jun 2024',
      bullets: [
        { label: 'Developed forms, screens, tabs and navigation for a production risk-management single page application in Vue.js, delivering assigned tasks in an Agile team.' },
        { label: 'Implemented client-side form validation, loading screens and empty states to handle invalid input and asynchronous or missing data.' },
        {
          label: 'Implemented role based access control authorization logic for document management, controlling document access by user role.',
          proof: {
            label: 'Public build',
            href: 'https://github.com/0535MANIDEEP/docvault',
            live: 'https://docvault-blond-rho.vercel.app',
            note: 'The same permission model, in public code.',
          },
        },
        { label: 'Supported the migration of legacy JavaScript files to TypeScript.' },
        { label: 'Integrated REST API responses into frontend components, tested endpoints in Postman, and investigated and debugged application issues.' },
      ],
    },
    {
      id: 'self-directed',
      company: 'Self-directed learning and job search',
      location: 'Hyderabad, India',
      role: 'Building and shipping',
      period: 'Jul 2024 to Present',
      bullets: [
        { label: 'Continued developing in Vue.js, React.js, TypeScript and REST API integration while applying for software engineering roles.' },
      ],
    },
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
      items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      name: 'Web and Core CS',
      // Vue.js came from six months of internship work, and TypeScript from
      // the migration of that same code. Neither was on this list before, and
      // both are on the resume now, so the site and the resume agree.
      items: ['React.js', 'Vue.js', 'Node.js', 'HTML5 / CSS3', 'Tailwind CSS', 'REST APIs'],
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
      items: ['Agile', 'Git and GitHub', 'GitHub Actions', 'Android Studio', 'Data Structures', 'Computer Networks'],
    },
  ],
};

export const projects = {
  heading: 'Selected work',
  /**
   * One project is left here and the section is not on the page.
   *
   * The section was switched off rather than deleted because the projects
   * coming next are the ones worth showing a recruiter: a full stack task
   * manager, an object oriented library console app and a risk register
   * dashboard. Until those are live, a section headed "Selected work" with
   * one entry in it reads worse than no section at all.
   *
   * To bring it back, render <Projects /> in App.jsx and put the link back in
   * nav. The data is already here and already tested.
   */
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
 *   - The ISSN read 2349-5162. It is 2349-9162.
 *
 * A wrong ISSN on a published citation is the kind of error that makes a real
 * publication look fabricated, which is the opposite of what this section is for.
 * Page range uses a hyphen rather than an en-dash to keep the site's own rule
 * against dashes in user-visible strings.
 *
 * The link is https, not http. Both resolve and both return the same 1,010,538
 * byte PDF, but a portfolio should not hand a reader a plaintext link when the
 * publisher serves TLS.
 *
 * The project entry for this system was taken off the site when the section
 * was switched off, because the deployed interface never had its API behind
 * it. The paper is a different claim and it stands on its own.
 */
export const research = {
  heading: 'Publication',
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
      detail: 'Published in a UGC approved journal, April 2024.',
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
      title: 'Seven months in a product team',
      detail: 'Shipped Vue.js screens for a production risk-management application, then migrated legacy JavaScript to TypeScript.',
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
 *
 * There is no Projects link while that section is switched off. A link to a
 * section that is not on the page scrolls nowhere, which reads as a dead link.
 */
export const nav = [
  { label: 'About', target: '#about', testId: 'nav-link-about' },
  { label: 'Skills', target: '#skills', testId: 'nav-link-skills' },
  { label: 'Experience', target: '#experience', testId: 'nav-link-experience' },
  { label: 'Publication', target: '#research', testId: 'nav-link-research' },
  { label: 'Request Resume', target: '#contact', testId: 'nav-link-contact', cta: true },
];

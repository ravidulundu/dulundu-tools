export interface Section {
  id: string;
  name: string;
  emoji: string;
  content: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'title-and-description',
    name: 'Title and Description',
    emoji: '📝',
    content: `# Project Title

A brief description of what this project does and who it's for.
`,
  },
  {
    id: 'logo',
    name: 'Logo',
    emoji: '🖼️',
    content: `![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)
`,
  },
  {
    id: 'badges',
    name: 'Badges',
    emoji: '🛡️',
    content: `[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![API Status](https://img.shields.io/website-up-down-green-red/http/monip.org.svg)](http://monip.org-status.com/)
`,
  },
  {
    id: 'screenshots',
    name: 'Screenshots',
    emoji: '📸',
    content: `## Screenshots
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
`,
  },
  {
    id: 'demo',
    name: 'Demo',
    emoji: '🎬',
    content: `## Demo

Insert gif or link to demo

![Demo](https://via.placeholder.com/600x400?text=Demo+GIF+Here)
`,
  },
  {
    id: 'features',
    name: 'Features',
    emoji: '✨',
    content: `## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform
`,
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    emoji: '💻',
    content: `## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express
`,
  },
  {
    id: 'installation',
    name: 'Installation',
    emoji: '⬇️',
    content: `## Installation

Install my-project with npm

\`\`\`bash
  npm install my-project
  cd my-project
\`\`\`
`,
  },
  {
    id: 'run-locally',
    name: 'Run Locally',
    emoji: '🏃',
    content: `## Run Locally
Clone the project
\`\`\`bash
  git clone https://link-to-project
\`\`\`
Go to the project directory
\`\`\`bash
  cd my-project
\`\`\`
Install dependencies
\`\`\`bash
  npm install
\`\`\`
Start the server
\`\`\`bash
  npm run start
\`\`\`
`,
  },
  {
    id: 'env',
    name: 'Environment Variables',
    emoji: '🔑',
    content: `## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

\`API_KEY\`

\`ANOTHER_VARIABLE\`
`,
  },
  {
    id: 'running-tests',
    name: 'Running Tests',
    emoji: '🧪',
    content: `## Running Tests
To run tests, run the following command
\`\`\`bash
  npm run test
\`\`\`
`,
  },
  {
    id: 'usage',
    name: 'Usage/Examples',
    emoji: '�',
    content: `## Usage/Examples

\`\`\`javascript
import Component from 'my-project'

function App() {
  return <Component />
}
\`\`\`
`,
  },
  {
    id: 'api',
    name: 'API Reference',
    emoji: '�',
    content: `## API Reference

#### Get all items

\`\`\`http
  GET /api/items
\`\`\`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`api_key\` | \`string\` | **Required**. Your API key |

#### Get item

\`\`\`http
  GET /api/items/\${id}
\`\`\`

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| \`id\`      | \`string\` | **Required**. Id of item to fetch |
`,
  },
  {
    id: 'deployment',
    name: 'Deployment',
    emoji: '🚀',
    content: `## Deployment
To deploy this project run
\`\`\`bash
  npm run deploy
\`\`\`
`,
  },
  {
    id: 'color-reference',
    name: 'Color Reference',
    emoji: '🎨',
    content: `## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#0a192f](https://placehold.co/15x15/0a192f/0a192f.png) #0a192f |
| Example Color | ![#f8f8f8](https://placehold.co/15x15/f8f8f8/f8f8f8.png) #f8f8f8 |
| Example Color | ![#00b48a](https://placehold.co/15x15/00b48a/00b48a.png) #00b48a |
| Example Color | ![#00d1a0](https://placehold.co/15x15/00d1a0/00d1a0.png) #00d1a0 |
`,
  },
  {
    id: 'optimizations',
    name: 'Optimizations',
    emoji: '⚡',
    content: `## Optimizations

What optimizations did you make in your code? E.g. refactors, performance improvements, accessibility
`,
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    emoji: '🗺️',
    content: `## Roadmap

- Additional browser support

- Add more integrations

- Improve documentation
`,
  },
  {
    id: 'contributing',
    name: 'Contributing',
    emoji: '🙏',
    content: `## Contributing
Contributions are always welcome!
See \`contributing.md\` for ways to get started.
Please adhere to this project's \`code of conduct\`.
`,
  },
  {
    id: 'authors',
    name: 'Authors',
    emoji: '�',
    content: `## Authors

- [@octocat](https://www.github.com/octocat)
`,
  },
  {
    id: 'acknowledgements',
    name: 'Acknowledgements',
    emoji: '💎',
    content: `## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
`,
  },
  {
    id: 'related',
    name: 'Related Projects',
    emoji: '🔗',
    content: `## Related Projects
Here are some related projects
[Awesome Readme](https://github.com/matiassingers/awesome-readme)
`,
  },
  {
    id: 'used-by',
    name: 'Used By',
    emoji: '🏢',
    content: `## Used By

This project is used by the following companies:

- Company 1
- Company 2
`,
  },
  {
    id: 'support',
    name: 'Support',
    emoji: '🤝',
    content: `## Support
For support, email fake@fake.com or join our Slack channel.
`,
  },
  {
    id: 'feedback',
    name: 'Feedback',
    emoji: '💬',
    content: `## Feedback

If you have any feedback, please reach out to us at fake@fake.com
`,
  },
  {
    id: 'faq',
    name: 'FAQ',
    emoji: '❓',
    content: `## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2
`,
  },
  {
    id: 'license',
    name: 'License',
    emoji: '📜',
    content: `## License

[MIT](https://choosealicense.com/licenses/mit/)
`,
  },
  {
    id: 'lessons',
    name: 'Lessons Learned',
    emoji: '�',
    content: `## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?
`,
  },
  {
    id: 'appendix',
    name: 'Appendix',
    emoji: '📎',
    content: `## Appendix

Any additional information goes here
`,
  },
  {
    id: 'documentation',
    name: 'Documentation',
    emoji: '�',
    content: `## Documentation

[Documentation](https://linktodocumentation)
`,
  },
  {
    id: 'github-profile-intro',
    name: 'GitHub Profile - Introduction',
    emoji: '👋',
    content: `# Hi, I'm Katherine! 👋

I'm a full stack developer...
`,
  },
  {
    id: 'github-profile-about',
    name: 'GitHub Profile - About Me',
    emoji: '🚀',
    content: `## 🚀 About Me

I'm a full stack developer with experience in React, Node.js, and cloud technologies.
`,
  },
  {
    id: 'github-profile-skills',
    name: 'GitHub Profile - Skills',
    emoji: '🛠️',
    content: `## 🛠 Skills

Javascript, HTML, CSS, React, Node.js, Express, MongoDB
`,
  },
  {
    id: 'github-profile-links',
    name: 'GitHub Profile - Links',
    emoji: '🔗',
    content: `## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katerifenbach.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)
`,
  },
  {
    id: 'github-profile-other',
    name: 'GitHub Profile - Other',
    emoji: '✨',
    content: `## Other Common Github Profile Sections

👩‍💻 I'm currently working on...

🧠 I'm currently learning...

👯‍♀️ I'm looking to collaborate on...

🤔 I'm looking for help with...

💬 Ask me about...

📫 How to reach me...

😄 Pronouns...

⚡️ Fun fact...
`,
  },
];

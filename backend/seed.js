require('dotenv').config()
const mongoose = require('mongoose')
const { Admin, About, Project, Skill, Achievement, Workshop } = require('./models')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  console.log('Connected to MongoDB')

  // Admin
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' })
  if (!existingAdmin) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    })
    console.log('Admin user created:', process.env.ADMIN_EMAIL || 'admin@portfolio.com')
  } else {
    console.log('Admin already exists, skipping')
  }

  // About
  const existingAbout = await About.findOne()
  if (!existingAbout) {
    await About.create({
      name: 'Your Name',
      title: 'AI/ML Engineer & Data Scientist',
      tagline: 'Building intelligent systems that shape the future',
      description: 'I craft elegant machine learning solutions, data pipelines, and AI-driven applications. Passionate about turning complex problems into beautiful, working software.',
      email: 'hello@example.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    })
    console.log('About section seeded')
  }

  // Skills
  const skillCount = await Skill.countDocuments()
  if (skillCount === 0) {
    const skills = [
      { name: 'Python', category: 'Programming', order: 1 },
      { name: 'JavaScript', category: 'Programming', order: 2 },
      { name: 'React', category: 'Programming', order: 3 },
      { name: 'Node.js', category: 'Programming', order: 4 },
      { name: 'TensorFlow', category: 'AI/ML', order: 1 },
      { name: 'PyTorch', category: 'AI/ML', order: 2 },
      { name: 'Scikit-Learn', category: 'AI/ML', order: 3 },
      { name: 'Keras', category: 'AI/ML', order: 4 },
      { name: 'OpenCV', category: 'AI/ML', order: 5 },
      { name: 'Pandas', category: 'Data Analysis', order: 1 },
      { name: 'NumPy', category: 'Data Analysis', order: 2 },
      { name: 'SQL', category: 'Data Analysis', order: 3 },
      { name: 'Power BI', category: 'Data Analysis', order: 4 },
      { name: 'Matplotlib', category: 'Data Analysis', order: 5 },
      { name: 'Docker', category: 'Tools', order: 1 },
      { name: 'Git', category: 'Tools', order: 2 },
      { name: 'AWS', category: 'Tools', order: 3 },
      { name: 'MongoDB', category: 'Tools', order: 4 },
    ]
    await Skill.insertMany(skills)
    console.log(`${skills.length} skills seeded`)
  }

  // Projects
  const projectCount = await Project.countDocuments()
  if (projectCount === 0) {
    const projects = [
      {
        title: 'Neural Style Transfer',
        category: 'Deep Learning',
        description: 'Real-time artistic style transfer using convolutional neural networks with custom perceptual loss functions. Processes images at 30fps on GPU.',
        techStack: ['Python', 'TensorFlow', 'OpenCV', 'Flask'],
        github: 'https://github.com',
        live: 'https://example.com',
        featured: true,
        order: 1,
      },
      {
        title: 'Stock Prediction LSTM',
        category: 'Machine Learning',
        description: 'LSTM-based time series model predicting stock prices with 92% directional accuracy. Trained on 5 years of market data with attention mechanisms.',
        techStack: ['Python', 'PyTorch', 'Pandas', 'Plotly'],
        github: 'https://github.com',
        featured: true,
        order: 2,
      },
      {
        title: 'NLP Sentiment Engine',
        category: 'NLP',
        description: 'Transformer-based sentiment analysis pipeline processing 10k+ reviews per second with 96% accuracy. Deployed via FastAPI with Redis caching.',
        techStack: ['Python', 'HuggingFace', 'FastAPI', 'Redis'],
        github: 'https://github.com',
        live: 'https://example.com',
        featured: false,
        order: 3,
      },
    ]
    await Project.insertMany(projects)
    console.log(`${projects.length} projects seeded`)
  }

  // Achievements
  const achCount = await Achievement.countDocuments()
  if (achCount === 0) {
    const achievements = [
      {
        title: '1st Place — National AI Hackathon 2024',
        date: 'March 2024',
        description: 'Won first place among 500+ teams by building a real-time disaster prediction system using satellite imagery and deep learning.',
        tags: ['Hackathon', 'Deep Learning', 'Award'],
        order: 1,
      },
      {
        title: 'Google Professional ML Engineer',
        date: 'January 2024',
        description: 'Completed the Professional Machine Learning Engineer certification with a top 5% score globally, demonstrating expertise in ML architecture and deployment.',
        tags: ['Certification', 'Google', 'ML'],
        order: 2,
      },
      {
        title: 'IEEE Research Publication',
        date: 'November 2023',
        description: 'Published research on efficient transformer architectures for edge devices, achieving 3x speed improvement with minimal accuracy loss.',
        tags: ['Research', 'IEEE', 'Publication'],
        order: 3,
      },
    ]
    await Achievement.insertMany(achievements)
    console.log(`${achievements.length} achievements seeded`)
  }

  // Workshops
  const wsCount = await Workshop.countDocuments()
  if (wsCount === 0) {
    const workshops = [
      {
        title: 'Introduction to Machine Learning',
        date: 'February 2024',
        location: 'IIT Delhi',
        attendees: 120,
        description: 'Hands-on workshop covering ML fundamentals, scikit-learn, and real-world project deployment. Participants built and deployed their first ML model.',
        tags: ['ML', 'Beginner', 'Workshop'],
        order: 1,
      },
      {
        title: 'Deep Learning Bootcamp',
        date: 'December 2023',
        location: 'Online (Zoom)',
        attendees: 80,
        description: 'Intensive 2-day bootcamp covering neural networks, CNNs, transfer learning with TensorFlow and PyTorch. 80% completion rate with live projects.',
        tags: ['Deep Learning', 'Advanced', 'Bootcamp'],
        order: 2,
      },
    ]
    await Workshop.insertMany(workshops)
    console.log(`${workshops.length} workshops seeded`)
  }

  console.log('\nSeed complete!')
  console.log('---------------------------------')
  console.log(`Admin Email:    ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`)
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`)
  console.log('---------------------------------')
  console.log('Change the admin password immediately after first login.')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Award, 
  BookOpen, 
  Coffee, 
  PenTool, 
  Users,
  MapPin,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  Star,
  Phone
} from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { AnimatedUnderline } from '../components/shared/AnimatedUnderline'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '../animations/variants'
import { Target } from 'lucide-react'

// Custom Icon Medium
const MediumIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

// Komponen Stats dibiarkan (angka placeholder) sesuai permintaan
const stats = [
  { icon: BookOpen, value: '50+', label: 'Scripts & Copy Created', color: 'from-accent-purple to-accent-blue' },
  { icon: Coffee, value: '2+', label: 'Years Experience', color: 'from-accent-blue to-accent-cyan' },
  { icon: Users, value: '10+', label: 'Brand Clients', color: 'from-accent-cyan to-accent-green' },
  { icon: Award, value: '3', label: 'Awards & Mentions', color: 'from-accent-pink to-accent-orange' },
]

// Diperbarui sesuai CV
const experiences = [
  {
    year: 'Nov 2024 - Present',
    role: 'Creative Writer',
    company: 'SVO Jakarta Palmerah',
    description: 'Developed creative scripts to support content production and created/executed creative copy concepts for Meta Ads campaigns.',
    achievements: ['Achieved sales growth through impactful and high-performing advertisements']
  },
  {
    year: 'May 2024 - Present',
    role: 'Freelance Screenwriter',
    company: 'Multiple Clients (Ads & Series)',
    description: 'Developed engaging storytelling for brand campaigns, short films, and web series.',
    achievements: ['Consulted on story development for 5+ successful productions', 'Crafted engaging narratives and dynamic characters that resonated with a wide audience']
  },
  {
    year: 'Jun 2024 - Nov 2024',
    role: 'Creative Advertising',
    company: 'Filmore Global Creative',
    description: 'Created comprehensive creative decks to support high-impact advertising campaigns. Developed unique storytelling concepts and visual frameworks.',
    achievements: ['Successfully delivered creative ads for Buttonscarves and So Klin']
  },
  {
    year: 'Aug 2023 - Nov 2023',
    role: 'Creative Advertising Intern',
    company: 'Ceritera Storytelling Agency',
    description: 'Developed unique storytelling concepts, visual frameworks, and brand narratives tailored to target audiences.',
    achievements: ['Crafted impactful advertising messages with clear brand communication', 'Made complex ads easy to understand']
  }
]

// Diperbarui sesuai Skill di CV
const skills = [
  { name: 'Creative Writing & Storytelling', level: 95 },
  { name: 'Scriptwriting (Film & Series)', level: 92 },
  { name: 'Copywriting (Meta Ads)', level: 88 },
  { name: 'Brand Storytelling & Awareness', level: 85 },
  { name: 'Content Creative & Deck Creation', level: 85 },
]

// Tools dibiarkan sesuai permintaan
const tools = [
  'Grammarly', 'Storyist', 'Final Draft',
  'WordPress', 'Webflow', 'WriterDuet',
  'Google Docs', 'Scrivener', 'ChatGPT',
  'Adobe Premiere', 'Canva', 'Highland'
]

// Diperbarui sesuai Edukasi di CV
const education = [
  {
    degree: 'Bachelor of Applied Arts with Honours',
    school: 'Indonesian Institute of Arts and Culture (ISBI Bandung)',
    year: 'Jul 2020 - Jun 2024',
    thesis: 'Major in Film and Television | GPA: 3.78/4.00'
  }
]

// Diperbarui sesuai Awards/Certifications di CV
const achievements = [
  { title: 'Top 5 Finalist', org: 'National Film Critique Writing Competition (2023)', icon: Star },
  { title: 'Jury Mention Award', org: 'Festival Budaya Nusantara (2024)', icon: Award },
  { title: 'Screenwriting Certificate', org: 'ISBI', icon: PenTool },
  { title: 'Digital Journalism Writing', org: 'detik.com', icon: BookOpen },
]

const socialLinks = [
  { icon: Twitter, label: 'Twitter', url: 'https://x.com/FaqihAtthoriq', color: 'hover:text-sky-400', Target: '_blank' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/faqihatthoriq/', color: 'hover:text-pink-500', Target: '_blank' },
  { icon: Linkedin, label: 'LinkedIn', url: '#', color: 'hover:text-blue-600', Target: '_blank' },
  { icon: MediumIcon, label: 'Medium', url: 'https://medium.com/@faqihatthoriq', color: 'hover:text-slate-800 dark:hover:text-white', Target: '_blank' },
]

export const About = () => {
  const [activeTimeline, setActiveTimeline] = useState(0)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* HEADER SECTION */}
        <SectionReveal>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-accent-purple mb-6">
                About Me
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Crafting Words, <br />
                <AnimatedUnderline>Building Worlds</AnimatedUnderline>
              </h1>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Hello, I'm <strong className="text-slate-900 dark:text-white">Istawa Faqih Atthoriq</strong>. I am a passionate individual with a strong penchant for creativity. Since my college years, I have been actively involved in developing creative decks from pre-production to post-production. From 2022 to the present, I have created various works, including audio visual short films, advertisements, events, and festivals.
                </p>
                <p>
                  I am highly experienced in delivering authentic, engaging, and strategic brand storytelling across various genres. My skills, refined through personal development, enable me to bring a unique vision and artistic touch to every project I undertake.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin size={18} className="text-accent-purple" />
                  <span>Bandung, Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail size={18} className="text-accent-blue" />
                  <span>istawafaqihatthoriq@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone size={18} className="text-accent-cyan" />
                  <span>089-697-539-670</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    className={`w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                    target={social.Target}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img 
                  src="src/assets/uwiq.jpg" 
                  alt="Istawa Faqih Atthoriq" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 glass rounded-2xl p-6 shadow-2xl max-w-xs hidden md:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Available for Work</div>
                    <div className="text-xs text-slate-500">Open to freelance projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* STATS SECTION */}
        <SectionReveal variants={staggerContainer}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-3xl p-8 text-center group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <stat.icon className="text-white" size={28} />
                </div>
                <div className="text-4xl font-bold mb-2 gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </SectionReveal>

        {/* EXPERIENCE TIMELINE */}
        <div className="mb-32">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Career Journey</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">My professional path in writing and creative advertising</p>
            </div>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Timeline Navigation */}
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <SectionReveal key={index} delay={index * 0.1}>
                  <motion.button
                    onClick={() => setActiveTimeline(index)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                      activeTimeline === index
                        ? 'bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 border-2 border-accent-purple/30'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    whileHover={{ x: 8 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium mb-1 ${
                          activeTimeline === index ? 'text-accent-purple' : 'text-slate-500'
                        }`}>
                          {exp.year}
                        </div>
                        <div className="font-bold text-lg">{exp.role}</div>
                        <div className="text-slate-500 text-sm">{exp.company}</div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className={`transition-transform ${
                          activeTimeline === index ? 'rotate-90 text-accent-purple' : 'text-slate-400'
                        }`} 
                      />
                    </div>
                  </motion.button>
                </SectionReveal>
              ))}
            </div>

            {/* Timeline Detail */}
            <SectionReveal variants={slideInRight}>
              <div className="glass rounded-3xl p-8 lg:p-10 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white">
                    <PenTool size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{experiences[activeTimeline].role}</h3>
                    <p className="text-accent-purple font-medium">{experiences[activeTimeline].company}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg">
                  {experiences[activeTimeline].description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-4">Key Achievements</h4>
                  {experiences[activeTimeline].achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Star size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* SKILLS & TOOLS */}
        <div className="grid lg:grid-cols-2 gap-16 mb-32">
          {/* Technical Skills */}
          <div className='min-w-0'>
            <SectionReveal>
              <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center">
                  <Award className="text-accent-purple" size={24} />
                </span>
                Technical Skills
              </h2>
            </SectionReveal>
            
            <div className="space-y-8">
              {skills.map((skill, index) => (
                <SectionReveal key={index} delay={index * 0.1}>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                      <span className="text-accent-purple font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan relative"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>

          {/* Tools Marquee */}
          <div className='min-w-0'>
            <SectionReveal>
              <h2 className="text-4xl font-bold mb-12">Writing Stack</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Tools and platforms I use daily to craft, optimize, and deliver content.
              </p>
            </SectionReveal>

            <div className="relative overflow-hidden rounded-2xl glass p-6">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 animate-marquee whitespace-nowrap">
                  {[...tools, ...tools].map((tool, i) => (
                    <span 
                      key={i} 
                      className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium inline-flex items-center gap-2 hover:bg-accent-purple hover:text-white transition-colors cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                  {[...tools.slice().reverse(), ...tools.slice().reverse()].map((tool, i) => (
                    <span 
                      key={i} 
                      className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium inline-flex items-center gap-2 hover:bg-accent-blue hover:text-white transition-colors cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="mb-32">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Education</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Academic foundation for creative excellence</p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <SectionReveal key={index} delay={index * 0.15} variants={index % 2 === 0 ? slideInLeft : slideInRight}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="glass rounded-3xl p-8 h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white">
                      <BookOpen size={28} />
                    </div>
                    <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {edu.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                  <p className="text-accent-purple font-medium mb-4">{edu.school}</p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      <span className="font-medium">Information:</span> {edu.thesis}
                    </p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS SECTION */}
        <div className="mb-32">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Certifications & Recognitions</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Awards and milestones along the journey</p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass rounded-3xl p-8 text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-orange to-accent-pink flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-accent-orange/30 transition-shadow">
                    <achievement.icon className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.org}</p>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>

        {/* DOWNLOAD CV CTA */}
        <SectionReveal>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-accent-purple/20 dark:to-accent-blue/20 p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-purple/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-blue/30 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Want the full story?
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                Download my complete CV to see detailed work history, skills, and references. 
                Let's create something amazing together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="src/assets/CV_Istawa_Faqih_Atthoriq.pdf"
                  download="CV-Istawa.pdf"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center gap-3 hover:shadow-xl transition-shadow w-fit"
                >
                  <Download size={20} />
                  Download CV
                </motion.a>

                <motion.a
                  href="src/assets/PORTFOLIO_ISTAWA_FAQIH_ATTHORIQ.pdf"
                  download="Portfolio-Istawa.pdf"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center gap-3 hover:shadow-xl transition-shadow w-fit"
                >
                  <Download size={20} />
                  Download Portfolio
                </motion.a>
                
                <motion.a
                  href="mailto:istawafaqihatthoriq@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full glass text-white font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-colors"
                >
                  <Mail size={20} />
                  Get In Touch
                </motion.a>
              </div>
            </div>
          </motion.div>
        </SectionReveal>

      </div>
    </div>
  )
}
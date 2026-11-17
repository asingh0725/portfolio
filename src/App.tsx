import { useEffect, useRef, useState } from 'react'
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent
} from 'react'

type SimpleIcon = {
  path: string
}
import portrait from '../assets/about-pic.png'
import resumePdf from '../assets/resume.pdf'
import agronomistImg from '../assets/projects/ai-agronomist-advisor.png'

import {
  siOpenai,
  siAnthropic,
  siReact,
  siNextdotjs,
  siAmazonaws,
  siTypescript,
  siPostgresql,
  siVercel,
  siLinkedin,
  siGithub
} from 'simple-icons/icons'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

const badges = ['Backend Architecture', 'Distributed Systems', 'LLM Orchestration']

const logos = [
  { label: 'OpenAI', icon: siOpenai },
  { label: 'Anthropic', icon: siAnthropic },
  { label: 'TypeScript', icon: siTypescript },
  { label: 'Next.js', icon: siNextdotjs },
  { label: 'AWS', icon: siAmazonaws },
  { label: 'PostgreSQL', icon: siPostgresql },
  { label: 'React', icon: siReact },
  { label: 'Vercel', icon: siVercel }
]

const experienceBlocks = [
  {
    title: 'Core Architecture & Backend',
    items: ['System Architecture', 'API Design', 'Backend-for-Frontend (BFF)', 'Workflow Orchestration (Temporal)', 'Serverless', 'Node.js']
  },
  {
    title: 'AI & ML Systems',
    items: ['LLM Orchestration', 'Anthropic Claude', 'RAG Pipelines', 'AI Agents', 'LangChain']
  },
  {
    title: 'Cloud & Data Infrastructure',
    items: ['AWS (DynamoDB, ECS, Lambda, CDK, S3)', 'PostgreSQL', 'pgvector', 'Vercel']
  },
  {
    title: 'Languages & Frontend',
    items: ['TypeScript', 'Python', 'Next.js', 'React', 'Electron']
  }
]

const projects = [
  {
    title: 'AI Agronomist Advisor',
    description:
      'Architected a full-stack AI application leveraging Claude and OpenAI, implementing provider-agnostic APIs to handle complex reasoning, vision, and embedding workflows. Designed semantic search and retrieval pipelines (RAG) using text and image embeddings to strictly ground AI responses and eliminate hallucinations. Built the end-to-end backend infrastructure to manage LLM orchestration, cost controls, and latency for real-world user workflows.',
    tags: ['RAG + Vision', 'Provider-Agnostic APIs', 'TypeScript / Node.js'],
    href: 'https://github.com/asingh0725/ai-agronomist-advisor',
    icons: [siOpenai, siTypescript],
    image: agronomistImg
  }
]

const featuredProjects = [
  {
    title: 'AI Agronomist Advisor',
    summary: 'Research-backed agronomy intelligence for field diagnostics and recommendations.',
    description:
      'Architected a full-stack AI application leveraging Claude and OpenAI, implementing provider-agnostic APIs to handle complex reasoning, vision, and embedding workflows. Built the end-to-end backend infrastructure to manage LLM orchestration, cost controls, and latency for real-world user workflows.',
    tags: ['RAG + Vision', 'Provider-Agnostic APIs', 'TypeScript / Node.js'],
    href: 'https://github.com/asingh0725/ai-agronomist-advisor',
    icons: [siOpenai, siTypescript],
    image: agronomistImg
  }
]

function LogoMark({ icon, label }: { icon: SimpleIcon; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
          <path fill="currentColor" d={icon.path} />
        </svg>
      </span>
      <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/70">{label}</span>
    </div>
  )
}

function ProjectIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" aria-hidden="true">
        <path fill="currentColor" d={icon.path} />
      </svg>
    </span>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: SimpleIcon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60 transition hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" aria-hidden="true">
          <path fill="currentColor" d={icon.path} />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  )
}

const rootSpotlightStyle = { '--mx': '50%', '--my': '20%' } as CSSProperties
const cardSpotlightStyle = { '--cx': '50%', '--cy': '50%' } as CSSProperties

export default function App() {
  const appRef = useRef<HTMLDivElement | null>(null)
  const featuredCardRef = useRef<HTMLDivElement | null>(null)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)
  const [isCarouselHover, setIsCarouselHover] = useState(false)
  const [visibleCount, setVisibleCount] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dragState = useRef({ startX: 0, startOffset: 0, dragging: false })

  useEffect(() => {
    const root = appRef.current
    if (!root) return

    let frame: number | null = null
    const handleMove = (event: MouseEvent) => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--mx', `${event.clientX}px`)
        root.style.setProperty('--my', `${event.clientY}px`)
      })
    }

    const handleLeave = () => {
      root.style.setProperty('--mx', '50%')
      root.style.setProperty('--my', '20%')
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  useEffect(() => {
    let frame: number | null = null
    const updateProgress = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
        setScrollProgress(progress)
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (media.matches) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => {
      if (featuredCardRef.current) {
        setSlideWidth(featuredCardRef.current.offsetWidth)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => setVisibleCount(media.matches ? 2 : 1)
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const maxIndex = Math.max(0, featuredProjects.length - visibleCount)

  useEffect(() => {
    if (featuredIndex > maxIndex) {
      setFeaturedIndex(maxIndex)
    }
  }, [featuredIndex, maxIndex])

  useEffect(() => {
    if (isCarouselHover) return
    if (maxIndex === 0) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % (maxIndex + 1))
    }, 5200)
    return () => window.clearInterval(timer)
  }, [isCarouselHover, maxIndex])

  const handleCardMove = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.style.setProperty('--cx', `${x}px`)
    event.currentTarget.style.setProperty('--cy', `${y}px`)
  }

  const handleCardLeave = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--cx', '50%')
    event.currentTarget.style.setProperty('--cy', '50%')
  }

  const slideGap = 24
  const clampedIndex = Math.min(featuredIndex, maxIndex)
  const trackStyle: CSSProperties = {
    transform: `translateX(-${clampedIndex * (slideWidth + slideGap) + dragOffset}px)`,
    transition: isDragging ? 'none' : undefined
  }

  const handlePrev = () => {
    if (maxIndex === 0) return
    setFeaturedIndex((current) => (current === 0 ? maxIndex : current - 1))
  }

  const handleNext = () => {
    if (maxIndex === 0) return
    setFeaturedIndex((current) => (current + 1) % (maxIndex + 1))
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = {
      startX: event.clientX,
      startOffset: dragOffset,
      dragging: true
    }
    setIsDragging(true)
    setIsCarouselHover(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return
    const delta = event.clientX - dragState.current.startX
    setDragOffset(dragState.current.startOffset + delta)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return
    dragState.current.dragging = false
    event.currentTarget.releasePointerCapture(event.pointerId)
    const delta = event.clientX - dragState.current.startX
    const total = slideWidth + slideGap
    if (total > 0) {
      const baseOffset = -clampedIndex * total
      const nextOffset = baseOffset + delta
      const rawIndex = Math.round(-nextOffset / total)
      const nextIndex = Math.max(0, Math.min(maxIndex, rawIndex))
      setFeaturedIndex(nextIndex)
    }
    setDragOffset(0)
    setIsDragging(false)
    setIsCarouselHover(false)
  }

  return (
    <div
      ref={appRef}
      className="relative min-h-screen bg-[#050505] text-white"
      style={rootSpotlightStyle}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(600px circle at var(--mx) var(--my), rgba(123,57,252,0.45), transparent 60%)'
          }}
        />
      </div>

      <div className="relative z-10">
        <section id="about" className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-glow bg-[radial-gradient(circle_at_top,rgba(123,57,252,0.35),transparent_55%)]" />
          <div className="absolute inset-0 animate-glow-delay bg-[radial-gradient(circle_at_20%_30%,rgba(250,147,250,0.25),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:120px_120px] opacity-30" />
        </div>

        <header className="fixed left-0 top-4 z-30 w-full px-6">
          <nav className="relative mx-auto flex w-full max-w-[1100px] items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl animate-fade-down">
            <div className="text-sm font-semibold uppercase tracking-[0.4em]">Aviraj Singh</div>
            <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.35em] text-white/70 md:flex">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:avirajdhooria2001@gmail.com"
                className="hidden text-xs uppercase tracking-[0.35em] text-white/70 transition hover:text-white sm:block"
              >
                Email
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] transition hover:bg-white hover:text-black"
              >
                Let&apos;s Talk
              </a>
            </div>
            <div className="absolute inset-x-6 bottom-2 h-[2px] overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full bg-gradient-to-r from-accent via-accentSoft to-white/80 transition-[width] duration-200"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </nav>
        </header>

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1100px] flex-col justify-center gap-12 px-6 pb-24 pt-32 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Software Engineer
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold uppercase tracking-[-0.02em] text-white">
              Product Oriented Software Engineer
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/70">
              Product-Oriented Software Engineer specializing in full-stack architecture, bridging the gap between user-facing clients and complex distributed systems. Proven track record of translating ambiguous technical constraints into scalable, production-ready infrastructure. Expertise in designing robust Backend-for-Frontend (BFF) layers, orchestrating state across asynchronous workflows, and building secure LLM integrations and data pipelines.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={resumePdf} download className="cta-primary group">
                <span className="cta-glow" />
                <span className="cta-label">Download CV</span>
                <span className="cta-icon">→</span>
              </a>
              <a href="#projects" className="cta-secondary group">
                <span className="cta-border" />
                <span className="cta-label">View Projects</span>
                <span className="cta-icon">→</span>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <SocialLink
                href="https://www.linkedin.com/in/avirajsingh25/"
                label="LinkedIn"
                icon={siLinkedin}
              />
              <SocialLink href="https://github.com/asingh0725" label="GitHub" icon={siGithub} />
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-fade-up-delay">
            <div className="absolute -inset-6 rounded-[40px] bg-[conic-gradient(from_140deg,rgba(123,57,252,0.25),rgba(250,147,250,0.18),rgba(123,57,252,0.25))] blur-3xl" />
            <div className="relative w-[min(86vw,420px)] rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-xl animate-float lg:w-[420px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-[#0e0e0e]">
                <img
                  src={portrait}
                  alt="Portrait of Aviraj Singh"
                  className="h-full w-full origin-center scale-105 object-cover saturate-110 contrast-110 brightness-95"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-white/12" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
              </div>
              <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                <span>Backend Architecture</span>
                <span>Distributed Systems</span>
              </div>
            </div>
          </div>
        </main>
      </section>

      
      <section id="featured" className="scroll-mt-32 bg-[#070707]">
        <div className="reveal mx-auto w-full max-w-[1100px] px-6 py-20" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Featured</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em]">Featured Builds</h2>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Selected work with real-world impact
            </p>
          </div>
          <div
            onMouseEnter={() => setIsCarouselHover(true)}
            onMouseLeave={() => setIsCarouselHover(false)}
            className="relative mt-10 overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#070707] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#070707] to-transparent" />
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] cursor-grab active:cursor-grabbing touch-pan-y select-none"
              style={trackStyle}
            >
              {featuredProjects.map((project, index) => (
                <article
                  key={project.title}
                  ref={index === 0 ? featuredCardRef : null}
                  onMouseMove={handleCardMove}
                  onMouseLeave={handleCardLeave}
                  style={cardSpotlightStyle}
                  className="group relative w-full flex-none overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_35px_70px_rgba(0,0,0,0.4)]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(320px circle at var(--cx) var(--cy), rgba(123,57,252,0.2), transparent 65%)'
                      }}
                    />
                  </div>
                  <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                  <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-accent/60 bg-accent/20 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-white">
                          Featured
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
                          Case Study
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl uppercase tracking-[0.2em]">{project.title}</h3>
                      <p className="mt-2 text-sm text-white/60">{project.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-white/15 px-3 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 hidden md:block">
                        <p className="mt-2 text-sm text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
                          {project.description}
                        </p>
                      </div>
                      <details className="mt-6 md:hidden">
                        <summary className="cursor-pointer text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
                          Read insight
                        </summary>
                        <p className="mt-2 text-sm text-white/70">{project.description}</p>
                      </details>
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {project.icons.map((icon, iconIndex) => (
                            <ProjectIcon key={`${project.title}-${iconIndex}`} icon={icon} />
                          ))}
                        </div>
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 transition hover:text-white"
                        >
                          View Project →
                        </a>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      <div className="aspect-[16/10]">
                        <img
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tooling" className="scroll-mt-32 bg-[#070707]">
        <div className="reveal mx-auto w-full max-w-[1100px] px-6 py-20" data-reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Tooling</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em]">Production Stack</h2>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
              <span>Tooling</span>
              <span className="h-px w-10 bg-white/20" />
              <span>Production Stack</span>
            </div>
            <div className="relative mt-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#070707] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#070707] to-transparent" />
              <div className="flex w-max items-center gap-6 animate-marquee hover:[animation-play-state:paused]">
                {logos.concat(logos).map((logo, index) => (
                  <LogoMark key={`${logo.label}-${index}`} {...logo} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="scroll-mt-32 bg-[#050505]">
        <div className="reveal mx-auto w-full max-w-[1100px] px-6 py-20" data-reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Experience</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em]">Skills Snapshot</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {experienceBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg uppercase tracking-[0.25em]">{block.title}</h3>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                  {block.items.map((item) => (
                    <span key={item} className="rounded-full border border-white/15 px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="projects" className="scroll-mt-32 bg-[#050505]">
        <div className="reveal mx-auto w-full max-w-[1100px] px-6 py-20" data-reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Projects</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em]">All Projects</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.title}
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
                style={cardSpotlightStyle}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(240px circle at var(--cx) var(--cy), rgba(123,57,252,0.18), transparent 65%)'
                    }}
                  />
                  <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
                </div>
                <div className="relative">
                  <div className="absolute right-5 top-5 z-10 hidden w-44 translate-y-2 rounded-xl border border-white/20 bg-black/70 p-3 opacity-0 shadow-glass backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                    <div className="text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
                      Quick Preview
                    </div>
                    <div className="mt-2 overflow-hidden rounded-lg border border-white/10">
                      <img
                        src={project.image}
                        alt={`${project.title} mini preview`}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-white/70 transition hover:border-white hover:text-white"
                    >
                      Open →
                    </a>
                  </div>
                  <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <div className="aspect-[16/9]">
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col">
                    <h3 className="text-lg uppercase tracking-[0.2em]">{project.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 hidden md:block">

                      <div className="mt-3 max-h-0 overflow-hidden text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:max-h-32 group-hover:opacity-100">
                        {project.description}
                      </div>
                    </div>
                    <details className="mt-4 md:hidden">
                      <summary className="cursor-pointer text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
                        Read brief
                      </summary>
                      <p className="mt-2 text-sm text-white/70">{project.description}</p>
                    </details>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {project.icons.map((icon, index) => (
                          <ProjectIcon key={`${project.title}-${index}`} icon={icon} />
                        ))}
                      </div>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 transition hover:text-white"
                      >
                        View Project →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-32 bg-[#050505]">
        <div className="reveal mx-auto w-full max-w-[1100px] px-6 py-20" data-reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Contact</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em]">Let&apos;s Build</h2>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            I&apos;m open to backend architecture, platform engineering, and AI/LLM infrastructure roles. Let&apos;s connect and build something bold.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm uppercase tracking-[0.3em]">
            <a
              href="mailto:avirajdhooria2001@gmail.com"
              className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white hover:text-black"
            >
              avirajdhooria2001@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/avirajsingh25/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white hover:text-black"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
    </div>
  )
}

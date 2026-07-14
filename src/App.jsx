import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import blogPosts from "./content/blogs.json";
import certificationGroups from "./content/certifications.json";
import projects from "./content/projects.json";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Box,
  Braces,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cloud,
  CloudCog,
  Code2,
  Container,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Gauge,
  GitBranch,
  HardDrive,
  KeyRound,
  Medal,
  Mail,
  Menu,
  Network,
  Package,
  Search,
  Server,
  ServerCog,
  ShieldCheck,
  Terminal,
  Timer,
  Waypoints,
  Workflow,
  X,
} from "lucide-react";

const profile = {
  name: "Awais Mansha",
  role: "DevOps Engineer",
  email: "awaismansha97@gmail.com",
  github: "https://github.com/awaismansha-00",
  linkedin: "https://www.linkedin.com/in/awaismansha/",
  medium: "https://medium.com/@awaismansha",
  image: "/assets/profile.png",
};

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "#blog" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const skillGroups = [
  {
    title: "Cloud and Infrastructure",
    icon: CloudCog,
    items: [
      { label: "AWS", icon: Cloud },
      { label: "Terraform", icon: Box },
      { label: "Linux", icon: Terminal },
      { label: "Python", icon: Code2 },
    ],
  },
  {
    title: "Containers and Orchestration",
    icon: ServerCog,
    items: [
      { label: "Docker", icon: Container },
      { label: "Kubernetes", icon: Waypoints },
      { label: "Istio Service Mesh", icon: Network },
    ],
  },
  {
    title: "Delivery and Version Control",
    icon: Workflow,
    items: [
      { label: "Git", icon: GitBranch },
      { label: "GitHub Actions", icon: Workflow },
      { label: "Argo CD", icon: Timer },
    ],
  },
  {
    title: "Observability",
    icon: ShieldCheck,
    items: [
      { label: "Prometheus", icon: ShieldCheck },
      { label: "Grafana", icon: Gauge },
      { label: "Elasticsearch", icon: Search },
      { label: "Fluent Bit", icon: Braces },
      { label: "Kibana", icon: Database },
      { label: "Jaeger", icon: Network },
      { label: "OpenTelemetry", icon: Cpu },
    ],
  },
];

const processSteps = [
  [
    "01",
    "Understand Before Choosing",
    "I start with the problem, not the tool. I study the application, constraints, risks, and operational needs before deciding whether Kubernetes, GitOps, serverless, or another approach is appropriate.",
  ],
  [
    "02",
    "Design for the Real Environment",
    "I treat architecture as more than a diagram. I think about networking, environments, failure points, scalability, security boundaries, deployment strategy, and operational ownership before implementation begins.",
  ],
  [
    "03",
    "Build Reusable Foundations",
    "When I solve a problem, I try to turn the solution into a reusable module, workflow, or pattern. Instead of rebuilding the same VPC, EKS cluster, or CI pipeline for every project, I improve the existing foundation and spend more time on the parts that make each system unique.",
  ],
  [
    "04",
    "Secure by Design",
    "I do not treat security as a final checklist. I consider identity, least-privilege access, secrets, supply-chain risks, workload isolation, and security scanning while designing and building the system.",
  ],
  [
    "05",
    "Validate Through Failure",
    "I test assumptions by troubleshooting deployments, permissions, networking, scaling, and pipeline failures. I use those failures to improve both the system and the reusable patterns behind it.",
  ],
  [
    "06",
    "Document and Share",
    "I turn the final implementation and lessons learned into architecture diagrams, documentation, GitHub projects, and technical articles so that the reasoning behind the system is as clear as the code.",
  ],
];

function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0, suppressClick: false });

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    document.body.style.userSelect = "";

    if (drag.current.moved) {
      drag.current.suppressClick = true;
      window.setTimeout(() => {
        drag.current.suppressClick = false;
        drag.current.moved = false;
      }, 0);
    }
  };

  return {
    ref,
    dragProps: {
      onPointerDown: (event) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return;
        drag.current.active = true;
        drag.current.moved = false;
        drag.current.startX = event.pageX;
        drag.current.scrollLeft = ref.current.scrollLeft;
        ref.current.setPointerCapture(event.pointerId);
        document.body.style.userSelect = "none";
      },
      onPointerMove: (event) => {
        if (event.pointerType !== "mouse") return;
        if (!drag.current.active || !ref.current) return;
        const distance = event.pageX - drag.current.startX;
        if (Math.abs(distance) > 5) {
          drag.current.moved = true;
        }
        ref.current.scrollLeft = drag.current.scrollLeft - distance;
        event.preventDefault();
      },
      onPointerUp: (event) => {
        if (event.pointerType !== "mouse") return;
        endDrag();
      },
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onDragStart: (event) => event.preventDefault(),
      onClickCapture: (event) => {
        if (!drag.current.suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}

function getCarouselScrollAmount(track) {
  const card = track?.querySelector("[data-carousel-card]");
  if (!track || !card) return 0;
  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
  return card.getBoundingClientRect().width + gap;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useActiveSection(["top", "work", "skills", "blog", "process", "contact"]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-4 transition duration-200 md:px-8 ${
        isScrolled || isOpen
          ? "border-white/10 bg-[#0f1211]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label={`${profile.name} home`}>
          <span className="grid size-11 overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-300/15 transition group-hover:border-cyan-300">
            <img src={profile.image} alt="" className="h-full w-full object-cover object-[50%_30%]" aria-hidden="true" />
          </span>
          <span className="grid leading-tight">
            <strong className="text-sm font-extrabold text-[#f5efe4]">{profile.name}</strong>
            <span className="text-xs font-medium text-[#b6c1ba]">{profile.role}</span>
          </span>
        </a>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-[#f5efe4] md:hidden"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav
          id="site-nav"
          className={`absolute left-4 right-4 top-[78px] grid gap-2 rounded-lg border border-white/10 bg-[#0f1211]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl transition md:static md:flex md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"
          }`}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeId === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition md:rounded-full md:px-3 md:py-2 ${
                  isActive ? "bg-white/10 text-[#f5efe4]" : "text-[#b6c1ba] hover:bg-white/8 hover:text-[#f5efe4]"
                } ${item.href === "#contact" ? "border border-amber-300/35 text-[#f5efe4]" : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function InfrastructureScene() {
  const group = useRef();
  const nodePositions = useMemo(
    () => [
      [-3.8, -1.35, -0.2],
      [-2.2, -0.35, 0.2],
      [-0.6, -1.1, -0.25],
      [0.75, 0.08, 0.18],
      [2.2, -0.72, -0.16],
      [3.4, 0.62, 0.22],
      [1.25, 1.22, -0.22],
      [-1.8, 1.12, 0.14],
    ],
    [],
  );

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.16 + pointer.x * 0.07;
    group.current.rotation.x = -0.08 + pointer.y * 0.04;
  });

  const lineSegments = [
    [nodePositions[0], nodePositions[1]],
    [nodePositions[1], nodePositions[2]],
    [nodePositions[1], nodePositions[7]],
    [nodePositions[2], nodePositions[3]],
    [nodePositions[3], nodePositions[4]],
    [nodePositions[3], nodePositions[6]],
    [nodePositions[4], nodePositions[5]],
    [nodePositions[6], nodePositions[5]],
    [nodePositions[7], nodePositions[6]],
  ];

  return (
    <group ref={group} position={[0.8, -0.1, 0]} scale={0.92}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.34}>
        <mesh position={[0, 0.12, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.75, 0.018, 8, 180]} />
          <meshStandardMaterial color="#18c7bb" emissive="#0d8d84" emissiveIntensity={0.55} transparent opacity={0.68} />
        </mesh>

        {lineSegments.map(([start, end], index) => (
          <Line
            key={`${start.join("-")}-${index}`}
            points={[start, end]}
            color={index % 3 === 0 ? "#f2b84b" : "#18c7bb"}
            lineWidth={1.4}
            transparent
            opacity={0.75}
          />
        ))}

        {nodePositions.map((position, index) => (
          <Float key={position.join("-")} speed={1.4 + index * 0.08} rotationIntensity={0.25} floatIntensity={0.16}>
            <mesh position={position}>
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <meshStandardMaterial
                color={index % 3 === 0 ? "#f2b84b" : "#18c7bb"}
                emissive={index % 3 === 0 ? "#8f5d12" : "#0d8d84"}
                emissiveIntensity={0.45}
                roughness={0.38}
                metalness={0.55}
              />
            </mesh>
          </Float>
        ))}

        <mesh position={[0, 0.05, 0.38]}>
          <sphereGeometry args={[0.72, 40, 40]} />
          <meshStandardMaterial color="#f5efe4" emissive="#18c7bb" emissiveIntensity={0.18} roughness={0.2} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.05, 0.38]}>
          <sphereGeometry args={[0.84, 40, 40]} />
          <meshBasicMaterial color="#18c7bb" transparent opacity={0.1} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

function HeroScene() {
  return (
    <Canvas
      className="canvas-probe"
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      aria-hidden="true"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 7.2]} fov={42} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#f5efe4" />
      <pointLight position={[-4, -2, 3]} intensity={1.4} color="#18c7bb" />
      <Suspense fallback={null}>
        <InfrastructureScene />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.18} autoRotate autoRotateSpeed={0.38} />
    </Canvas>
  );
}

function SectionHeading({ eyebrow, title, children, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="mb-4 text-xs font-black uppercase text-amber-300">{eyebrow}</p>
      <h2 className="text-balance text-4xl font-black leading-[1.05] text-[#f5efe4] md:text-5xl">{title}</h2>
      {children ? <div className="mt-5 text-base leading-8 text-[#b6c1ba] md:text-lg">{children}</div> : null}
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[92svh] overflow-hidden px-4 pb-14 pt-32 md:px-8 md:pt-36">
      <img
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/assets/devops-hero.png"
        alt=""
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,18,17,0.98)_0%,rgba(15,18,17,0.82)_38%,rgba(15,18,17,0.45)_74%,rgba(15,18,17,0.82)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,18,17,0.08),rgba(15,18,17,0.98)_94%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-45 md:opacity-55 [mask-image:linear-gradient(90deg,transparent_0%,transparent_34%,black_58%,black_100%)]" data-canvas-frame>
        <HeroScene />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl items-center lg:min-h-[calc(92svh-9rem)]">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-black uppercase text-amber-300">Cloud platforms / CI/CD / Reliability</p>
          <h1 className="max-w-[12ch] text-balance text-5xl font-black leading-[0.98] text-[#f5efe4] md:text-7xl xl:text-8xl">
            Awais Mansha builds resilient delivery platforms.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d7dfd8] md:text-xl">
            DevOps engineer focused on infrastructure as code, Kubernetes operations, automated release systems, and observability that makes production easier to understand.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-cyan-300/60 bg-cyan-300 px-5 py-3 text-sm font-black text-[#071211] transition hover:-translate-y-0.5 hover:bg-[#7ee7df] focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              View Projects <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <Mail size={18} aria-hidden="true" /> Email Awais
            </a>
          </div>

          <dl className="mt-10 grid overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-3">
            {[
              ["Current focus", "Kubernetes, Terraform, GitOps"],
              ["Best with", "Platform, cloud, and SRE teams"],
              ["Operating style", "Automated, observable, secure"],
            ].map(([label, value]) => (
              <div key={label} className="border-white/10 p-4 md:border-r md:last:border-r-0">
                <dt className="text-xs font-bold uppercase text-[#b6c1ba]">{label}</dt>
                <dd className="mt-2 text-sm font-extrabold text-[#f5efe4]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const { ref: projectsTrack, dragProps: projectDragProps } = useDragScroll();
  const scrollProjects = (direction) => {
    const track = projectsTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="work" className="border-t border-white/10 bg-[#0f1211] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Selected Work" title="DevOps projects built around cloud, Kubernetes, and delivery systems.">
            <p>Each project links to the GitHub repository, with concise notes on the platform work, automation, and operational patterns behind it.</p>
          </SectionHeading>

          <div className="flex gap-2" aria-label="Project carousel controls">
            <button
              type="button"
              aria-label="Scroll projects left"
              onClick={() => scrollProjects(-1)}
              className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/8 text-[#f5efe4] transition hover:border-cyan-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Scroll projects right"
              onClick={() => scrollProjects(1)}
              className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/8 text-[#f5efe4] transition hover:border-cyan-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={projectsTrack}
          data-testid="project-carousel"
          className="mx-auto mt-10 flex max-w-4xl cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...projectDragProps}
        >
          {projects.map((project, index) => (
            <article
              key={project.title}
              data-carousel-card
              className="group w-full shrink-0 snap-start overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-amber-300/40 focus-within:border-amber-300/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0f1211]">
                {project.image ? (
                  <img src={project.image} alt={`${project.title} architecture`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
                ) : (
                  <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(24,199,187,0.14),rgba(242,184,75,0.10)),#101413]">
                    <div className="grid place-items-center gap-3 text-center">
                      <span className="grid size-14 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                        <Network size={26} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-black uppercase text-amber-300">Repository project</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-3 top-3 max-h-0 overflow-hidden rounded-lg border border-white/10 bg-[#0f1211]/92 opacity-0 shadow-xl shadow-black/30 backdrop-blur transition-all duration-300 group-hover:max-h-36 group-hover:opacity-100 group-focus-within:max-h-36 group-focus-within:opacity-100">
                  <ul className="flex flex-wrap gap-2 p-3" aria-label={`${project.title} tools`}>
                    {project.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold text-[#d7dfd8]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex min-h-[260px] flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-full border border-cyan-300/35 text-sm font-black text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-[#f5efe4] transition hover:border-cyan-300/60">
                    <GitBranch size={15} aria-hidden="true" /> GitHub
                  </a>
                </div>
                <h3 className="mt-8 max-w-xl text-2xl font-black leading-tight text-[#f5efe4]">{project.title}</h3>
                <p className="mt-4 line-clamp-4 max-w-2xl leading-8 text-[#b6c1ba]">{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationBadge({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = item.image && !imageFailed;
  const content = (
    <>
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-300" data-certification-icon="certified">
        {hasImage ? (
          <img src={item.image} alt="" className="h-full w-full object-contain p-1" onError={() => setImageFailed(true)} aria-hidden="true" />
        ) : (
          <BadgeCheck size={26} aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black leading-6 text-[#f5efe4]">{item.title}</span>
        {item.href ? <span className="mt-1 block text-xs font-bold uppercase text-cyan-300">View credential</span> : null}
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3 transition hover:border-amber-300/45 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-amber-200"
      >
        {content}
      </a>
    );
  }

  return <div className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3">{content}</div>;
}

function Skills() {
  return (
    <section id="skills" className="border-t border-white/10 bg-[#101413] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Skills" title="Hands-on tools across cloud, delivery, and observability.">
          <p>A focused DevOps toolkit for building, shipping, monitoring, and operating production systems.</p>
        </SectionHeading>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {skillGroups.map(({ title, icon: Icon, items }) => (
            <article key={title} className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-[#f5efe4]">{title}</h3>
                <Icon size={22} className="shrink-0 text-amber-300" aria-hidden="true" />
              </div>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${title} skills`}>
                {items.map(({ label, icon: SkillIcon }) => (
                  <li key={label} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-bold text-[#d7dfd8]">
                    <SkillIcon size={15} className="shrink-0 text-cyan-300" data-skill-icon={label} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-5 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-amber-300/35 bg-amber-300/10 text-amber-300">
                <Award size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-amber-300">Certifications</p>
                <h3 className="mt-1 text-xl font-black text-[#f5efe4]">Validated cloud and Kubernetes growth.</h3>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {certificationGroups.map((group) => {
              const isCertified = group.status === "Certified";
              return (
              <article key={group.status} className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
                <h3 className="text-sm font-black uppercase text-cyan-300">{group.status}</h3>
                <ul className="mt-4 grid gap-3" aria-label={`${group.status} certifications`}>
                  {group.items.map((item) => (
                    <li key={item.title}>
                      {isCertified ? (
                        <CertificationBadge item={item} />
                      ) : (
                        <div className="rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3 text-sm font-bold leading-6 text-[#f5efe4]">
                          <span className="mb-1 block text-xs font-black uppercase text-[#b6c1ba]">Preparing</span>
                          {item.title}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  const { ref: blogTrack, dragProps: blogDragProps } = useDragScroll();
  const scrollBlogs = (direction) => {
    const track = blogTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="blog" className="border-t border-white/10 bg-[linear-gradient(135deg,rgba(242,184,75,0.10),transparent_34%),#151917] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading eyebrow="Blog" title="Writing in public about DevOps practice.">
            <p>Short versions live here, with each post linking out to Medium for the full technical walkthrough.</p>
          </SectionHeading>

          <div>
            <div className="mb-4 flex justify-end gap-2" aria-label="Blog carousel controls">
              <button
                type="button"
                aria-label="Scroll blogs left"
                onClick={() => scrollBlogs(-1)}
                className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/8 text-[#f5efe4] transition hover:border-amber-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Scroll blogs right"
                onClick={() => scrollBlogs(1)}
                className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/8 text-[#f5efe4] transition hover:border-amber-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            <div
              ref={blogTrack}
              data-testid="blog-carousel"
              className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              {...blogDragProps}
            >
            {blogPosts.map((post) => (
              <article
                key={post.title}
                data-carousel-card
                className="w-full shrink-0 snap-start overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/40"
              >
                {post.image ? (
                  <div className="border-b border-white/10 bg-[#0f1211]">
                    <img src={post.image} alt={`${post.title} architecture guide`} className="h-auto w-full object-cover" />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="text-xs font-black uppercase text-cyan-300">Medium article</p>
                      <h3 className="mt-3 text-2xl font-black leading-tight text-[#f5efe4]">{post.title}</h3>
                    </div>
                    <a href={post.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-[#f5efe4] transition hover:border-amber-300/60">
                      Read on Medium <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-4 max-w-3xl leading-8 text-[#b6c1ba]">{post.summary}</p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="border-t border-white/10 bg-[#0f1211] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Process" title="How I Work" />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map(([step, title, body]) => (
            <article key={step} className="relative min-h-80 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20">
              <span className="text-xs font-black uppercase text-cyan-300">{step}</span>
              <h3 className="mt-8 text-xl font-black leading-tight text-[#f5efe4]">{title}</h3>
              <p className="mt-4 leading-7 text-[#b6c1ba]">{body}</p>
              <span className="absolute bottom-2 right-4 text-7xl font-black leading-none text-white/[0.055]" aria-hidden="true">
                {step}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const { email } = profile;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" className="border-t border-white/10 bg-[linear-gradient(135deg,rgba(242,184,75,0.12),transparent_32%),linear-gradient(315deg,rgba(239,113,94,0.10),transparent_34%),#121614] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading eyebrow="Contact" title="Need a DevOps engineer who can make delivery calmer?">
          <p>Send a note about your platform, cloud, automation, or reliability work. I will reply with the next useful step.</p>
        </SectionHeading>

        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25">
          <a href={`mailto:${email}`} className="block border-b border-white/10 pb-6 text-3xl font-black leading-tight text-[#f5efe4] transition hover:text-cyan-200 md:text-5xl">
            {email}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <Copy size={18} aria-hidden="true" /> {copied ? "Copied" : "Copy Email"}
            </button>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-amber-300/60">
              <GitBranch size={18} aria-hidden="true" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-amber-300/60">
              <ExternalLink size={18} aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#0f1211] text-[#f5efe4] selection:bg-cyan-300/30">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-cyan-300 focus:bg-[#0f1211] focus:px-4 focus:py-3">
        Skip to content
      </a>
      <Header />
      <main id="content">
        <Hero />
        <Work />
        <Skills />
        <Blog />
        <Process />
        <Contact />
      </main>
      <footer className="border-t border-white/10 bg-[#0b0e0d] px-4 py-8 text-[#b6c1ba] md:px-8">
        <div className="mx-auto max-w-7xl">
          <p>&copy; {new Date().getFullYear()} {profile.name}.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

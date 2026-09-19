import { skillGroups } from "../content/skills.js";
import { MOTION } from "../lib/motion.js";
import { Reveal } from "./Reveal.jsx";
import { SectionHeading } from "./SectionHeading.jsx";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import certificationGroups from "../content/certifications.json";
import { Award, BadgeCheck } from "lucide-react";

export function CertificationBadge({ item }) {
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
        className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3 transition hover:border-lime-300/45 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-lime-200"
      >
        {content}
      </a>
    );
  }

  return <div className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3">{content}</div>;
}

export function Skills() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="skills" className="portfolio-section-surface relative isolate overflow-hidden border-t border-white/10 px-4 py-20 md:px-8 md:py-28">
      <div className="skills-grid-background" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Skills" />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {skillGroups.map(({ title, icon: Icon, items }, groupIndex) => (
            <motion.article
              key={title}
              className="skill-group rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : groupIndex * MOTION.stagger, ease: MOTION.ease }}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-[#f5efe4]">{title}</h3>
                <Icon size={22} className="shrink-0 text-amber-300" aria-hidden="true" />
              </div>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${title} skills`}>
                {items.map(({ label, icon: SkillIcon, color }, itemIndex) => (
                  <motion.li key={label} className="skill-chip inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-bold text-[#d7dfd8]" initial={reducedMotion ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0.01 : 0.3, delay: reducedMotion ? 0 : groupIndex * MOTION.stagger + itemIndex * 0.025, ease: MOTION.ease }}>
                    <SkillIcon size={15} className="shrink-0" style={{ color }} data-skill-icon={label} aria-hidden="true" />
                    {label}
                  </motion.li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal className="h-full">
          <div className="skill-group h-full rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-5 shadow-2xl shadow-black/20">
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
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {certificationGroups.map((group) => {
              const isCertified = group.status === "Certified";
              return (
              <Reveal key={group.status} delay={isCertified ? MOTION.stagger : MOTION.stagger * 2} className="h-full">
              <article className="skill-group h-full rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
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
              </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

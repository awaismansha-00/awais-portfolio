export function SectionHeading({ eyebrow, title, children, className = "" }) {
  return (
    <div className={`section-heading ${className}`}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
      {children ? <div className="section-heading__body">{children}</div> : null}
    </div>
  );
}

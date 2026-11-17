import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS, SERVICES, COMPANY } from '../company';

const PROJECT_TYPES = [
  'Robotics & IoT prototyping',
  'Full-stack web or mobile application',
  'Academic engineering project',
  'Startup MVP or proof-of-concept',
  'Other engineering support',
];

export function AboutPage() {
  return (
    <main className="info-page about-page">
      <section className="info-hero">
        <div className="section-wrap info-hero-inner">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> ABOUT NEEVCRAFT</span>
          <h1>Hardware meets<br />software. <em>Ideas meet engineering.</em></h1>
          <p>NeevCraft brings electronics, embedded engineering, robotics and modern software delivery together to help people move from an early idea to a dependable, documented prototype.</p>
          <div className="info-hero-actions">
            <Link to="/projects" className="button button-white">Build my project <span>↗</span></Link>
            <Link to="/shop" className="hero-secondary-link">Explore components <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section-wrap company-facts">
        <div><strong>4</strong><span>Core engineering disciplines</span></div>
        <div><strong>360°</strong><span>Hardware-to-software support</span></div>
        <div><strong>24h*</strong><span>Target initial project review</span></div>
        <div><strong>Pan-India</strong><span>Component delivery coverage</span></div>
      </section>

      <section className="section-wrap company-story">
        <div className="story-heading">
          <span className="eyebrow">One connected engineering journey</span>
          <h2>Not just a part.<br /><em>A path to what’s next.</em></h2>
        </div>
        <div className="story-copy">
          <p>A sensor needs a suitable circuit, the circuit needs reliable firmware, and the firmware becomes useful when it connects to a clear interface. NeevCraft works across those layers so a build can be planned as one system instead of disconnected pieces.</p>
          <p>Support spans component selection, electronics and embedded code, robotics, application development, testing and practical project documentation. Each engagement depends on its agreed scope, component availability and timeline.</p>
          <Link to="/projects" className="text-link">Talk through a project <span>↗</span></Link>
        </div>
      </section>

      <section className="capabilities-section">
        <div className="section-wrap">
          <div className="section-heading">
            <div><span className="eyebrow">Four connected disciplines</span><h2>What NeevCraft <em>does.</em></h2></div>
          </div>
          <div className="service-grid">
            {SERVICES.map((service) => (
              <article className="service-card" key={service.title}>
                <span>{service.mark}</span><h3>{service.title}</h3><p>{service.copy}</p>
              </article>
            ))}
          </div>
          <div className="capability-tags">
            <span>Full-stack software</span><span>Embedded systems & IoT</span><span>Robotics & automation</span><span>Computer vision & AI</span>
          </div>
        </div>
      </section>

      <section className="section-wrap founder-section">
        <div className="founder-mark" aria-hidden="true">NK</div>
        <div>
          <span className="eyebrow">Founder & Lead Engineer</span>
          <h2>Kunal Kumar</h2>
          <p>NeevCraft was founded to bridge the gap between a technical idea and a working outcome. The company combines software development with embedded hardware expertise across IoT solutions, robotics prototypes and practical applications.</p>
          <a className="text-link" href={`mailto:${COMPANY.email}`}>Contact NeevCraft <span>↗</span></a>
        </div>
      </section>

      <section className="company-cta">
        <span className="eyebrow">FROM CONCEPT TO PROTOTYPE</span>
        <h2>Have something<br /><em>in mind?</em></h2>
        <p>Share the goal, the constraints and what a successful result should do. The team will review the brief and confirm a practical next step.</p>
        <Link to="/projects" className="button button-white">Share your project brief <span>↗</span></Link>
        <small>*Initial review within 24 hours is a target stated by the company, not a guaranteed response time.</small>
      </section>
    </main>
  );
}

export function ProjectPage() {
  const [form, setForm] = useState({
    projectType: PROJECT_TYPES[0],
    brief: '',
    deadline: '',
    organization: '',
    name: '',
    phone: '',
    email: '',
  });
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [formError, setFormError] = useState('');

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setWhatsappUrl('');
    setFormError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const brief = form.brief.trim();
    if (brief.length < 20) {
      setFormError('Please describe the project in at least 20 non-space characters.');
      setWhatsappUrl('');
      return;
    }
    setFormError('');
    const message = [
      'Hello NeevCraft, I would like to discuss a project.',
      '',
      `Project type: ${form.projectType}`,
      `Project brief: ${brief}`,
      `Target date: ${form.deadline || 'Not decided'}`,
      `Institution / company: ${form.organization.trim() || 'Not provided'}`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim()}`,
    ].join('\n');
    setWhatsappUrl(`${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`);
  };

  return (
    <main className="info-page project-page">
      <section className="info-hero project-hero">
        <div className="section-wrap info-hero-inner">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> PROJECT SUPPORT</span>
          <h1>Bring your idea<br /><em>to the workbench.</em></h1>
          <p>Robotics, IoT, embedded systems, academic builds and software prototypes. Start with a brief; NeevCraft will help clarify what it takes to build.</p>
        </div>
      </section>
      <section className="section-wrap project-layout">
        <div className="project-form-column">
          <span className="eyebrow">Tell us what you’re making</span>
          <h2>Build my <em>project.</em></h2>
          <p className="project-intro">The form prepares a message for NeevCraft on WhatsApp. Your details are not sent until you review the message and press Send there.</p>
          <form className="project-form" onSubmit={handleSubmit}>
            <label>Project type
              <select required value={form.projectType} onChange={(event) => update('projectType', event.target.value)}>
                {PROJECT_TYPES.map((type) => <option value={type} key={type}>{type}</option>)}
              </select>
            </label>
            <label>Project brief
              <textarea required minLength="20" maxLength="3000" rows="6" value={form.brief} onChange={(event) => update('brief', event.target.value)} placeholder="What should the project do? Include key features, components or constraints you already know." />
            </label>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="project-form-row">
              <label>Target deadline <span className="optional-label">Optional</span>
                <input type="date" value={form.deadline} onChange={(event) => update('deadline', event.target.value)} />
              </label>
              <label>Institution or company <span className="optional-label">Optional</span>
                <input maxLength="120" value={form.organization} onChange={(event) => update('organization', event.target.value)} placeholder="Organization name" />
              </label>
            </div>
            <div className="project-form-row">
              <label>Your name
                <input required autoComplete="name" minLength="2" maxLength="80" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Full name" />
              </label>
              <label>Phone / WhatsApp
                <input required type="tel" autoComplete="tel" minLength="8" maxLength="24" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+91 ..." />
              </label>
            </div>
            <label>Email address
              <input required type="email" autoComplete="email" maxLength="254" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" />
            </label>
            <p className="project-privacy-note">NeevCraft describes its project handling as confidential. This form opens WhatsApp, a third-party service; share only what you are comfortable sending there. To discuss document sharing, email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
            <button className="button button-dark project-submit" type="submit">Prepare WhatsApp message <span>↗</span></button>
            {whatsappUrl && (
              <div className="project-send-panel" role="status">
                <strong>Your brief is ready.</strong>
                <p>WhatsApp will open with the project details filled in. Check the message, then press Send.</p>
                <a className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">Continue to WhatsApp <span>↗</span></a>
              </div>
            )}
          </form>
        </div>
        <aside className="project-sidebar">
          <div className="project-sidebar-card">
            <span className="eyebrow">What happens next</span>
            <h3>A clear, practical review.</h3>
            <ol>
              <li><span>01</span> NeevCraft reviews the goal and constraints.</li>
              <li><span>02</span> The team confirms feasibility, scope and an estimate.</li>
              <li><span>03</span> If it’s a fit, agree on timeline and deliverables.</li>
            </ol>
            <p>Initial project review is targeted within 24 hours of receiving a complete brief; actual timing can vary.</p>
          </div>
          <div className="project-contact-card">
            <span className="eyebrow">Prefer another channel?</span>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            <a href={`tel:${COMPANY.phoneLink}`}>{COMPANY.phone}</a>
            <a href="https://www.neevcraft.com/project.php" target="_blank" rel="noreferrer">Use the official project form to attach a PDF or image (up to 10 MB) ↗</a>
            <span>{COMPANY.address}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export function FaqPage() {
  return (
    <main className="section-wrap faq-page">
      <header className="simple-page-heading">
        <span className="eyebrow">NEEVCRAFT SUPPORT</span>
        <h1>Frequently asked <em>questions.</em></h1>
        <p>Project support, component delivery and this capstone storefront.</p>
      </header>
      <div className="faq-layout">
        <div className="faq-list">
          {FAQS.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}<b aria-hidden="true">+</b></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <aside className="faq-contact">
          <span className="eyebrow">Still need a hand?</span>
          <h2>Talk to the <em>team.</em></h2>
          <p>Ask about product availability, delivery or whether NeevCraft can support your project.</p>
          <a className="button button-dark" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">WhatsApp NeevCraft <span>↗</span></a>
          <a className="faq-email" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </aside>
      </div>
    </main>
  );
}

export function PoliciesPage() {
  return (
    <main className="section-wrap policies-page">
      <header className="simple-page-heading">
        <span className="eyebrow">CLEAR EXPECTATIONS</span>
        <h1>Shipping & <em>policies.</em></h1>
        <p>Company details summarized for this capstone storefront. Confirm current terms directly with NeevCraft before placing an order.</p>
      </header>
      <div className="policy-grid">
        <article className="policy-card">
          <span>01 / DELIVERY</span><h2>Shipping</h2>
          <p>NeevCraft lists Pan-India component delivery. In-stock products typically arrive in 3–5 business days; actual dispatch and courier timing depend on availability and destination.</p>
          <p>Ask the team to confirm stock, shipping cost and delivery estimate before placing an order. This capstone checkout does not calculate live courier charges.</p>
        </article>
        <article className="policy-card">
          <span>02 / PRODUCT ISSUE</span><h2>Damaged or defective items</h2>
          <p>Report a damaged or defective hardware item within 48 hours of delivery. Include your order details, clear photos and a short test video so the team can review the issue.</p>
          <p>Replacement eligibility is reviewed by NeevCraft. Contact support before sending anything back.</p>
        </article>
        <article className="policy-card">
          <span>03 / PROJECTS</span><h2>Project information</h2>
          <p>NeevCraft describes project handling as confidential. Share only information needed to review the request; ask the team about the appropriate way to send sensitive files or diagrams.</p>
          <p>The Build My Project form opens WhatsApp and does not send anything until you press Send in that service.</p>
        </article>
        <article className="policy-card">
          <span>04 / CHECKOUT</span><h2>Payments in this demo</h2>
          <p>This capstone storefront currently creates demonstration cash-on-delivery orders. It does not process online payments, charge cards or connect to a live payment gateway.</p>
          <p>Confirm current payment methods and final order totals directly with NeevCraft.</p>
        </article>
      </div>
      <div className="policy-contact">
        <div><span className="eyebrow">Company contact</span><p>{COMPANY.address}</p></div>
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        <a href={`tel:${COMPANY.phoneLink}`}>{COMPANY.phone}</a>
        <Link to="/projects">Project inquiry ↗</Link>
      </div>
    </main>
  );
}

import { useState } from 'react';
import Reveal from './Reveal';
import './contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact__grid">
        <Reveal className="contact__left">
          <span className="eyebrow">Get started</span>
          <h2>Bring your codebase. We'll index it.</h2>
          <p className="contact__copy">
            Tell us what you're building and we'll set you up with early access.
            Usually a same-day reply.
          </p>

          <div className="contact__points">
            <div>
              <span className="mono">Support</span>
              <p>support@codeutil.dev</p>
            </div>
            <div>
              <span className="mono">Partnerships</span>
              <p>partners@codeutil.dev</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="contact__right card">
          {sent ? (
            <div className="contact__success">
              <p className="mono">Message received.</p>
              <p>We'll get back to you shortly — check the inbox you gave us.</p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input type="text" required placeholder="Ada Lovelace" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" required placeholder="you@university.edu" />
              </label>
              <label>
                <span>What are you preparing for?</span>
                <textarea rows={4} placeholder="Final-year capstone viva, mid-March" />
              </label>
              <button type="submit" className="btn btn-primary">Send message</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

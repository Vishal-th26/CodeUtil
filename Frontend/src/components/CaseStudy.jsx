import Reveal from './Reveal';
import './case-study.css';

export default function CaseStudy() {
  return (
    <section className="section case-study">
      <div className="container case-study__inner">
        <Reveal className="section-head">
          <span className="eyebrow">A night before the viva</span>
          <h2>From "I hope they don't ask" to "ask me anything"</h2>
        </Reveal>

        <div className="case-study__grid">
          <Reveal delay={0.05} className="case-study__col">
            <span className="case-study__label mono">Before</span>
            <ul>
              <li>Re-reading 2,000 lines the night before, hoping something sticks</li>
              <li>No memory of why a helper function was written months ago</li>
              <li>Guessing at answers under pressure, hoping they sound right</li>
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="case-study__col case-study__col--after">
            <span className="case-study__label mono">After</span>
            <ul>
              <li>Every function indexed and searchable in under a minute</li>
              <li>A drafted set of viva questions, answered with the exact lines</li>
              <li>Walking in already having answered the hard questions once</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="case-study__metrics">
          <div>
            <span className="mono">&lt; 60s</span>
            <p>From upload to first indexed answer</p>
          </div>
          <div>
            <span className="mono">10</span>
            <p>Viva questions drafted per session, graded by difficulty</p>
          </div>
          <div>
            <span className="mono">100%</span>
            <p>Of answers traced back to a real file and line range</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

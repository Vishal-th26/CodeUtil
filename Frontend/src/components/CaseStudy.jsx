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
              <li>Re-reading your whole project the night before, hoping something sticks</li>
              <li>Forgetting why you wrote a piece of code months ago</li>
              <li>Guessing answers under pressure and hoping they sound right</li>
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="case-study__col case-study__col--after">
            <span className="case-study__label mono">After</span>
            <ul>
              <li>Your whole project explained back to you in plain English</li>
              <li>Straight answers to the questions you're actually scared of</li>
              <li>Walking in already knowing what you'll be asked</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="case-study__metrics">
          <div>
            <span className="mono">&lt; 60s</span>
            <p>From upload to your first answer</p>
          </div>
          <div>
            <span className="mono">10</span>
            <p>Practice questions ready before your viva</p>
          </div>
          <div>
            <span className="mono">100%</span>
            <p>Every answer points back to your own code</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from './Reveal';
import './intro.css';

export default function Intro() {
  return (
    <section className="section intro">
      <div className="container intro__inner">
        <Reveal as="p" className="intro__quote">
          “Every student can write the code. Not every student can explain it
          under pressure. <span>CodeUtil closes that gap</span>  it makes sure
          you understand your project as well as the person grading it.”
        </Reveal>

        <Reveal delay={0.15} className="intro__attribution">
          <div className="intro__mark mono">CU</div>
          <div>
            <p className="intro__name">CodeUtil</p>
            <p className="intro__role mono">For GenZ , By Genz</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

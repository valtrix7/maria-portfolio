import ScrollStack, { ScrollStackItem } from './ui/ScrollStack';
import './Services.css';

const services = [
  {
    num: '01',
    title: 'Motion Design',
    desc: 'Brand films, explainers, and title sequences animated with cinematic timing and rhythm.',
    tags: ['After Effects', 'Cinema 4D', 'Storyboarding'],
  },
  {
    num: '02',
    title: 'Brand in Motion',
    desc: 'Logo reveals, motion systems, and living guidelines that keep a brand alive in every frame.',
    tags: ['Identity', 'Motion Systems', 'Guidelines'],
  },
  {
    num: '03',
    title: '3D & Visual FX',
    desc: 'Dimensional storytelling through shading, lighting, and simulation that feels tactile and real.',
    tags: ['Cinema 4D', 'Octane', 'Houdini'],
  },
  {
    num: '04',
    title: 'Art Direction',
    desc: 'Concept, mood, and visual language shaped from the first frame to the final cut.',
    tags: ['Concept', 'Look Dev', 'Direction'],
  },
  {
    num: '05',
    title: 'Interaction Motion',
    desc: 'Microinteractions and interface choreography that make products feel inevitable.',
    tags: ['Prototyping', 'GSAP', 'Lottie'],
  },
];

const Services: React.FC = () => {
  return (
    <section className="services" id="services" data-section="services">
      <div className="container">
        <div className="services-header">
          <div className="label">What I Offer</div>
          <h2 className="display-lg">Services<br />in motion</h2>
          <p className="body-lg">
            A focused set of disciplines, each crafted to make brands move with intent.
          </p>
        </div>
      </div>

      <div className="services-stack-shell">
        <svg className="services-deco-ring" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="198" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="4 10" opacity="0.25" />
          <circle cx="200" cy="200" r="150" stroke="var(--accent)" strokeWidth="0.5" opacity="0.12" />
        </svg>

        <div className="container">
          <ScrollStack
            className="services-stack"
            itemDistance={76}
            itemScale={0.035}
            itemStackDistance={36}
            stackPosition="16%"
            scaleEndPosition="8%"
            baseScale={0.82}
            rotationAmount={0.2}
            blurAmount={0.35}
            useWindowScroll
          >
            {services.map((service) => (
              <ScrollStackItem key={service.num} itemClassName="services-stack-card">
                <div className="services-stack-card-grid">
                  <div className="services-stack-meta">
                    <span className="services-stack-num">{service.num}</span>
                    <span className="services-stack-rule" />
                  </div>

                  <div className="services-stack-content">
                    <h3 className="services-stack-title">{service.title}</h3>
                    <p className="services-stack-desc">{service.desc}</p>
                    <ul className="services-tags">
                      {service.tags.map((tag) => (
                        <li key={tag} className="services-tag">{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollStackItem>
            ))}

            <ScrollStackItem itemClassName="services-stack-card services-stack-card--cta">
              <div className="services-stack-cta">
                <p className="services-cta-text">Have a project in mind?</p>
                <a href="#contact" className="btn btn-primary hover-target">
                  Start a project
                </a>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>
    </section>
  );
};

export default Services;

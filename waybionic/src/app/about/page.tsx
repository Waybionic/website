'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Cpu, Monitor, Shield } from 'lucide-react';
import './styles/about-page.css';

const CADViewer = dynamic(() => import('../components/CADViewer'), {
  ssr: false,
  loading: () => <div className="about-model-loading" role="status">Loading arm...</div>,
});

const assemblies = [
  {
    name: 'Base & shoulder',
    description: 'Stepper motors, gearbox assemblies and bearing supports form the foundation of the arm and its first moving joints.',
  },
  {
    name: 'Elbow & links',
    description: 'Joint housings and tubular links connect the structure, carrying movement from the shoulder toward the end of the arm.',
  },
  {
    name: 'Wrist & tool interface',
    description: 'The upper assembly combines a differential, bevel gears and pulleys with a biomedical locking mechanism at the tool interface.',
  },
];

const engineeringTracks = [
  {
    icon: Monitor,
    title: 'Describe & visualize',
    label: 'ROS 2 / Robot models',
    description: 'A digital robot description records the links and joints. The ground-station workspace brings that model into RViz, giving the team a common starting point for visualizing movement and connecting software to the mechanical design.',
  },
  {
    icon: Cpu,
    title: 'Turn input into motion',
    label: 'Embedded / Motor control',
    description: 'Early Arduino sketches explore joystick input, stepper movement and speed changes. These experiments are part of the work toward connecting commands from a remote surgeon with the physical joints of the surgical robotic arm.',
  },
  {
    icon: Shield,
    title: 'Keep the surgeon in control',
    label: 'Teleoperation / Research',
    description: 'The intended system would keep a surgeon in control of the arm during remote surgery in space. Motion limits and resilient communication are research priorities to develop and test alongside the mechanics and the medical requirements.',
  },
];

const projects = [
  {
    name: 'Ground station',
    status: 'Foundation in development',
    description: 'Robot descriptions, launch files and visualization setup. The public workspace currently uses placeholder geometry while mechanical exports are integrated.',
    technologies: ['ROS 2', 'URDF / Xacro', 'RViz'],
    href: 'https://github.com/Waybionic/waybionic_ground_station',
  },
  {
    name: 'Stepper motor experiments',
    status: 'Early control sketches',
    description: 'Exploratory Arduino code for joystick-driven stepper motion and speed adjustment. These sketches are development work, not a validated arm-control system.',
    technologies: ['Arduino', 'C++', 'Stepper motors'],
    href: 'https://github.com/Waybionic/StepperMotors',
  },
];

export default function About() {
  return (
    <div className="about-page">
      <header className="about-intro">
        <div className="about-inner">
          <p className="about-eyebrow">Calgary-based / Student-led / Established 2024</p>
          <h1>About WayBionic</h1>
          <div className="about-intro-row">
            <p className="about-lead">
              Developing a surgical robotic arm for surgery in space,
              controlled remotely by a surgeon.
            </p>
            <div className="about-intro-detail">
              <p>
                Our goal is for a surgeon at a remote location to operate on a
                patient in space using the robotic arm. This is a surgical robot,
                not a prosthetic or a replacement for a human limb. We bring
                mechanical design, electronics, software and biomedical thinking
                together to work toward that goal.
              </p>
              <a className="about-text-link" href="#about-arm">Inside the arm <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </header>

      <section className="about-arm-band" id="about-arm" aria-labelledby="about-arm-title">
        <div className="about-inner">
          <div className="about-section-heading">
            <div>
              <p className="about-eyebrow">01 / The hardware</p>
              <h2 id="about-arm-title">One arm. Connected systems.</h2>
            </div>
            <p>From the first bearing to the tool interface, each assembly is part of the same engineering problem.</p>
          </div>
          <div className="about-arm-grid">
            <div className="about-model">
              <CADViewer modelPath="/models/mechanical_arm-09-21-26.glb" />
            </div>
            <div className="about-arm-detail">
              <dl className="about-facts">
                <div><dt>Intended use</dt><dd>Surgeon-controlled surgery in space</dd></div>
                <div><dt>Assembly</dt><dd>Full arm / smaller revision</dd></div>
                <div><dt>CAD snapshot</dt><dd>September 21, 2026</dd></div>
                <div><dt>Stage</dt><dd>Research & development</dd></div>
              </dl>
              <ol className="about-assemblies">
                {assemblies.map((assembly, index) => (
                  <li key={assembly.name}>
                    <span className="about-index" aria-hidden="true">0{index + 1}</span>
                    <div><h3>{assembly.name}</h3><p>{assembly.description}</p></div>
                  </li>
                ))}
              </ol>
              <p className="about-prototype-note">A research prototype, with further validation required before clinical use. Motion ranges shown are illustrative.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-engineering" id="about-engineering" aria-labelledby="about-engineering-title">
        <div className="about-inner">
          <div className="about-section-heading">
            <div>
              <p className="about-eyebrow">02 / The engineering</p>
              <h2 id="about-engineering-title">From design to motion.</h2>
            </div>
            <p>The arm is only one part of the project. Robot models, embedded code and remote surgeon control all have to work together.</p>
          </div>
          <div className="about-tracks">
            {engineeringTracks.map(track => (
              <article className="about-track" key={track.title}>
                <track.icon size={26} strokeWidth={1.6} aria-hidden="true" />
                <p className="about-eyebrow">{track.label}</p>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-projects" id="about-projects" aria-labelledby="about-projects-title">
        <div className="about-inner">
          <div className="about-section-heading">
            <div>
              <p className="about-eyebrow">03 / In progress</p>
              <h2 id="about-projects-title">Follow the build.</h2>
            </div>
            <p>Our public repositories offer a closer look at the work, from development experiments to the software foundation.</p>
          </div>
          <div className="about-repositories">
            {projects.map(project => (
              <article className="about-repository" key={project.name}>
                <div className="about-repository-name">
                  <Code2 size={21} aria-hidden="true" />
                  <div><h3>{project.name}</h3><p className="about-repository-status">{project.status}</p></div>
                </div>
                <div className="about-repository-description">
                  <p>{project.description}</p>
                  <ul className="about-technologies" aria-label={`${project.name} technologies`}>
                    {project.technologies.map(technology => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
                <a className="about-text-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub (opens in a new tab)`}>
                  View on GitHub <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          <div className="about-projects-footer">
            <p>Public project snapshots / September 2026</p>
            <a className="about-text-link" href="https://github.com/Waybionic" target="_blank" rel="noopener noreferrer" aria-label="WayBionic on GitHub (opens in a new tab)">
              WayBionic on GitHub <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="about-participate" aria-labelledby="about-participate-title">
        <div className="about-inner about-participate-row">
          <div>
            <p className="about-eyebrow">Build with us</p>
            <h2 id="about-participate-title">A place for different disciplines.</h2>
            <p>Interested in the engineering, the medical questions, or supporting the project? Get to know the team.</p>
          </div>
          <div className="about-actions">
            <Link className="about-action-primary" href="/team">Meet the team <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="about-text-link" href="/contact">Get in touch <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link className="about-text-link" href="/sponsors">Support the project <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}


import { memo } from 'react';
import Hero from '../components/sections/Hero';
import NeuralPathways from '../components/sections/NeuralPathways';
import SkillsMatrix from '../components/sections/SkillsMatrix';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

const sections = [
  { id: 'hero', Component: Hero },
  { id: 'pathways', Component: NeuralPathways },
  { id: 'skills', Component: SkillsMatrix },
  { id: 'projects', Component: Projects },
  { id: 'contact', Component: Contact },
];

function Home() {
  return (
    <>
      {sections.map(({ id, Component }) => (
        <div key={id} id={`section-${id}`}>
          <Component />
        </div>
      ))}
    </>
  );
}

export default memo(Home);

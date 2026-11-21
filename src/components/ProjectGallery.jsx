import FlexCarousel from './FlexCarousel';
import './ProjectGallery.css';

const galleryItems = {
  data: [
    ['1.png', '平台原型 · 01'],
    ['2.png', '平台原型 · 02'],
    ['3.png', '平台原型 · 03'],
    ['4.png', '平台原型 · 04'],
    ['5.png', '平台原型 · 05'],
    ['6.jpg', '整体业务流程'],
  ],
  traffic: [
    ['1.png', '交通系统原型 · 01'],
    ['2.png', '交通系统原型 · 02'],
    ['3.jpeg', '交通系统原型 · 03'],
    ['4.png', '交通系统原型 · 04'],
    ['5.png', '整体架构'],
  ],
  agri: [
    ['1.png', '种植应用原型 · 01'],
    ['2.png', '种植应用原型 · 02'],
    ['3.png', '种植应用原型 · 03'],
    ['4.png', '种植应用原型 · 04'],
    ['5.png', '种植应用原型 · 05'],
    ['6.png', '采摘决策流程'],
    ['7.png', '用户使用流程'],
  ],
  kitchen: [
    ['1.png', '后台原型 · 01'],
    ['2.png', '后台原型 · 02'],
    ['3.png', '移动端原型 · 01'],
    ['4.png', '移动端原型 · 02'],
  ],
};

export default function ProjectGallery({ project }) {
  const items = galleryItems[project.id].map(([file, title]) => ({
    src: `/assets/gallery/${project.id}/${file}`,
    title,
    alt: `${project.title} · ${title}`,
  }));

  return (
    <div className="project-gallery">
      <FlexCarousel
        key={project.id}
        items={items}
        preset="liquid"
        intro="rise"
        cardHeight={0.5}
        gap={12}
        squeeze={0.2}
        captureWheel={false}
        focusOnClick
        captions
      />
    </div>
  );
}

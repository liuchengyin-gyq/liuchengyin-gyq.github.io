import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, ArrowUp, X, Menu, Mail, Copy, Check, Download, ScanLine, Workflow, Layers3, Sparkles, Play, Pause } from 'lucide-react';
import './styles.css';
import ProjectGallery from './components/ProjectGallery';
import usePortfolioMotion from './usePortfolioMotion';

function MotionHeading({ words }) {
  return <div className="motion-heading" aria-hidden="true"><div className="motion-heading-words">{words.map(word => <span className="motion-word-mask" key={word}><span className="motion-word">{word}</span></span>)}</div><span className="motion-heading-rule" /></div>;
}

const email = 'gaoyingqiao2022@163.com';
const projects = [
  {
    id: 'data', number: '01', name: '让公共数据，流动成价值。', title: '公共数据授权运营平台',
    category: 'GOVERNMENT · DATA PLATFORM', tags: ['政务数据', '平台型产品', '0 → 1'],
    image: '/assets/data.png', second: '/assets/data-flow.jpg', tone: 'mint',
    intro: '连接数据资源与应用场景，构建从数据登记到授权运营的完整业务闭环。',
    role: '产品实习生 · 吉林省观之数据科技有限公司', period: '2026.01 — 2026.09',
    challenge: '政务数据涉及多方主体，接入、治理、安全评审与授权用数环节复杂，需要在统一平台中明确职责和流转规则。',
    work: '负责数据登记、数据归集、数字存证、授权运营四大系统的产品设计，交付 120+ 页面原型及需求说明，设计四方主体协同运营流程，参与数据资产盘点与需求评审。',
    result: '完成全套产品原型与需求说明，产出 PRD 核心内容，支撑项目顺利中标长春市政数局项目。',
    metric: '120+', metricLabel: '页面原型交付',
  },
  {
    id: 'traffic', number: '02', name: '把城市脉搏，变成决策依据。', title: 'TOCC 交通运行监测与指挥',
    category: 'SMART CITY · MOBILITY', tags: ['智慧交通', '数据可视化', '跨部门协同'],
    image: '/assets/traffic.png', second: '/assets/traffic-structure.png', tone: 'blue',
    intro: '打通多源交通数据，让监测、研判与应急调度在同一条链路上协作。',
    role: '产品经理助理 · 吉林省卡思特科技有限公司', period: '2024.10 — 2025.06',
    challenge: '交通业务数据分散于交管、公交、出租和轨道等部门，人工收集成本高，应急调度需要跨部门协作。',
    work: '参与一线调研与流程梳理，完成 12 个子模块、80+ 页面高保真原型与交互说明，撰写核心模块 PRD，跟进需求评审与版本交付。',
    result: '平台早晚高峰使用率达 78%，日均输出交通调度建议 60 余条；一期全量需求交付并通过初验。',
    metric: '78%', metricLabel: '早晚高峰使用率',
  },
  {
    id: 'agri', number: '03', name: '让每一季耕耘，都有据可依。', title: '智护集安 · 冰酒葡萄种植',
    category: 'AGRI TECH · MOBILE APP', tags: ['用户调研', '智慧农业', '移动端产品'],
    image: '/assets/agri.png', second: '/assets/agri-flow.png', tone: 'olive',
    intro: '走进田间，把真实的农事需求转化为易用的数字化工具。',
    role: '产品方案、信息架构与研发协同', period: '项目实践',
    challenge: '冰葡萄种植覆盖育苗、田间管护、采摘与溯源等场景，农户需要低门槛的操作方式与关键节点提醒。',
    work: '面向农户和种植管理员开展实地调研，完成整体规划、信息架构、核心原型与需求文档；协同研发推进测试、灰度上线及反馈迭代。',
    result: '覆盖 200+ 种植农户，种植关键节点漏管率下降 35%，支持种植过程可追溯与农事安排规范化。',
    metric: '35%', metricLabel: '关键节点漏管率下降',
  },
  {
    id: 'kitchen', number: '04', name: '让后厨安全，成为日常。', title: '智安厨 AaaS 系统',
    category: 'B2B PRODUCT · FOOD SAFETY', tags: ['SaaS', '前中后台全覆盖', '业务流程设计'],
    image: '/assets/kitchen.png', second: '/assets/kitchen-app.png', tone: 'rose',
    intro: '连接监管与商户，构建后厨风险发现、告警和处置的线上闭环。让AI在业务中发挥无限潜能。',
    role: '产品方案、原型与 PRD 设计', period: '项目实践',
    challenge: '餐饮后厨监管与商户经营需求并存，风险监控、稽核台账和告警处理需要统一管理。',
    work: '调研监管与商户双向业务痛点，主导产品方案、原型与 PRD 设计，梳理业务流程，搭建后厨安全管控产品框架。',
    result: '搭建可复用的后厨安全 SaaS 服务底座，整合风险监控、稽核台账、告警提醒和数据看板。',
    metric: 'AaaS', metricLabel: '后厨数字化服务',
  },
];

const strengths = [
  { icon: ScanLine, en: 'DISCOVER', title: '从真实问题出发', text: '走进业务现场，倾听用户声音。用调研、用户故事与需求拆解，找到值得解决的问题。', tags: '用户调研 / 需求分析 / 场景洞察' },
  { icon: Workflow, en: 'STRUCTURE', title: '理清复杂业务', text: '梳理多角色、多系统的业务关系，把复杂流程转化为清晰的信息架构与产品规则。', tags: '业务建模 / 信息架构 / 流程设计' },
  { icon: Layers3, en: 'DELIVER', title: '让方案真正落地', text: '从原型、PRD 到评审与交付，主动对齐业务与研发，用完整的设计表达推动团队协作。', tags: 'Axure / 墨刀 / PRD / 项目协同' },
  { icon: Sparkles, en: 'EVOLVE', title: '用 AI 拓展可能', text: '结合软件工程背景，将 AI 工具融入研究、设计和验证，在实践中持续改进工作方式。', tags: 'ChatGPT / Coze / Codex / Figma' },
];

function App() {
  usePortfolioMotion();
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navPinned, setNavPinned] = useState(false);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(true);
  const video = useRef(null);
  const closeButton = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    const hero = document.getElementById('home');
    const header = document.querySelector('.header');
    const updateNav = () => {
      setNavPinned(window.scrollY >= hero.offsetHeight - header.offsetHeight);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    return () => {
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-25% 0px -50% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKey = event => {
      if (event.key === 'Escape' && !event.defaultPrevented) setSelected(null);
      if (event.key === 'Tab') {
        const dialog = closeButton.current?.closest('[role="dialog"]');
        const focusable = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
      trigger.current?.focus();
    };
  }, [selected]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { window.location.href = `mailto:${email}`; }
  }

  function toggleVideo() {
    if (!video.current) return;
    if (playing) video.current.pause();
    else video.current.play().catch(() => {});
    setPlaying(!playing);
  }

  const nav = [['about', '关于我'], ['projects', '精选项目'], ['strengths', '我的优势']];

  return (
    <>
      <div className="opening" aria-hidden="true"><div className="opening-lockup"><div className="opening-brand-mask"><span className="opening-brand">g<span>y</span>q.</span></div><div className="opening-rule"><span /></div><span className="opening-label">GAO YINGQIAO / PRODUCT MANAGER</span></div></div>
      <a className="skip-link" href="#about">跳至正文</a>
      <header className={navPinned ? 'header header-pinned' : 'header'}>
        <a className="brand" href="#home" aria-label="高滢乔，返回首页"><span className="brand-symbol">g<span>y</span>q.</span><span className="brand-name">高滢乔<span>PRODUCT MANAGER</span></span></a>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主导航">
          {nav.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="nav-contact" href="#contact">聊聊机会 <ArrowUpRight size={16} /></a>
        <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-media" aria-hidden="true"><video ref={video} autoPlay loop muted playsInline poster="/assets/hero-poster.jpg" onError={() => setPlaying(false)}><source src="/assets/hero.webm" type="video/webm" /></video></div>
          <div className="hero-shade" />
          <div className="hero-content container">
            <div className="eyebrow"><span className="status-dot" /> 在复杂业务中，探索精确而高效的答案。</div>
            <h1><span className="hero-title-mask"><span className="hero-title-line">理解复杂。</span></span><span className="hero-title-mask"><span className="hero-title-line">创造<span className="serif-word">有用</span>的产品<span className="green">。</span></span></span></h1>
            <div className="hero-description"><span className="small-line" /><p>我是高滢乔，一名以用户与业务价值为起点的产品经理。<br className="desktop-break" />连接需求、设计与技术，让想法走进真实场景。</p></div>
            <a className="button primary" href="#projects">探索我的作品 <ArrowUpRight size={19} /></a>
          </div>
          <div className="hero-bottom container"><a href="#about" className="scroll-link"><ArrowDown size={16} /> 向下探索 <span>SCROLL TO EXPLORE</span></a><div className="hero-coordinate"><span>长春 / 全国可达</span></div><button onClick={toggleVideo} className="video-control" aria-label={playing ? '暂停背景视频' : '播放背景视频'} title={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></div>
        </section>

        <section id="about" className="about section container">
          <div className="section-top"><span className="section-index">01 / ABOUT ME</span><span className="section-note">用户 · 价值 · 逻辑 · 迭代</span></div>
          <MotionHeading words={['BEHIND', 'THE THINKING.']} />
          <div className="about-grid">
            <div className="portrait-wrap"><img className="portrait" src="/assets/portrait-color.png" alt="高滢乔的个人照片" /><div className="portrait-caption"><span>高滢乔 <small>GAO YINGQIAO</small></span><ArrowUpRight size={24} /></div><div className="photo-note">PRODUCT THINKER. PROBLEM SOLVER.</div></div>
            <div className="about-copy"><div className="eyebrow muted">你好，很高兴认识你</div><h2>在业务里深潜，<br />在产品里<span className="green">找到解法。</span></h2><p>我就读于长春理工大学软件工程专业。技术背景让我理解实现的边界，产品实践让我始终关注：我们在为谁，解决什么问题。</p><p>从城市交通指挥到公共数据授权，从田间农事到后厨安全，我习惯走进现场、理清业务，把复杂需求变成清晰、可交付的产品方案。</p><div className="about-links"><a href={`mailto:${email}`}><Mail size={16} /> {email}</a><a href="/assets/resume.pdf" download="高滢乔-个人简历.pdf">下载简历 <Download size={16} /></a></div>
              <div className="experience-list">
                <div><span>2026.01 — 2026.09</span><strong>吉林省观之数据科技有限公司</strong><small>产品实习生</small></div>
                <div><span>2025.08 — 2025.09</span><strong>锦书在线培训学校</strong><small>课程产品助理</small></div>
                <div><span>2024.10 — 2025.06</span><strong>吉林省卡思特科技有限公司</strong><small>产品经理助理</small></div>
              </div>
            </div>
          </div>
          <div className="stats"><div><strong>120<span>+</span></strong><p>公共数据平台原型页面</p></div><div><strong>12</strong><p>独立完成交通系统模块设计</p></div><div><strong>200<span>+</span></strong><p>农业项目覆盖种植农户</p></div><div><strong>78<span>%</span></strong><p>TOCC 早晚高峰使用率</p></div></div>
        </section>

        <section id="projects" className="projects section container">
          <div className="section-top"><span className="section-index">02 / SELECTED WORK</span><span className="section-note">从问题出发，以价值作答</span></div>
          <MotionHeading words={['SELECTED', 'WORK.']} />
          <div className="section-heading"><h2>做过的事，<span className="muted">与背后的思考。</span></h2><span className="project-count">精选项目 / 04</span></div>
          <div className="project-grid">{projects.map(project => <button className={`project-card ${project.tone}`} key={project.id} onClick={event => { trigger.current = event.currentTarget; setSelected(project); }} aria-label={`查看${project.title}项目详情`}>
            <div className="project-visual"><div className="project-visual-top"><span>{project.category}</span><span>{project.number} / 04</span></div><h3>{project.name}</h3><div className={project.id === 'agri' ? 'project-image mobile-image' : 'project-image'}><img src={project.image} alt={`${project.title}产品原型`} loading="lazy" /></div><div className="project-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div></div>
            <div className="project-info"><div><h4>{project.title}</h4><p>{project.intro}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="project-arrow"><ArrowUpRight size={24} /></span></div>
          </button>)}</div>
        </section>

        <section id="strengths" className="strengths section container"><div className="section-top"><span className="section-index">03 / MY APPROACH</span><span className="section-note">思考有深度，执行有章法</span></div><MotionHeading words={['HOW', 'I THINK.']} /><div className="section-heading"><h2>好的产品，<br />源于<span className="muted">扎实的每一步。</span></h2><p>保持好奇，拆解问题，推动落地。<br />这是我做产品的方式。</p></div><div className="strength-grid">{strengths.map(({ icon: Icon, en, title, text, tags }, index) => <article className="strength-card" key={en}><div className="strength-top"><Icon size={26} strokeWidth={1.3} /><span>0{index + 1}</span></div><span className="strength-en">{en}</span><h3>{title}</h3><p>{text}</p><div className="strength-tags">{tags}</div></article>)}</div></section>

        <section id="contact" className="contact"><div className="container contact-inner"><div className="section-top"><span className="section-index">04 / WHAT'S NEXT</span><span className="contact-status"><span className="status-dot" /> 期待新的产品机会</span></div><MotionHeading words={['WHAT’S', 'NEXT?']} /><div className="contact-main"><p className="eyebrow muted">下一个有价值的产品，或许从一次交流开始。</p><h2><span className="hero-title-mask"><span className="contact-title-line">一起，把想法</span></span><span className="hero-title-mask"><span className="contact-title-line">变成<span className="green">下一步。</span></span></span><ArrowUpRight className="contact-big-arrow" strokeWidth={1} /></h2><div className="contact-actions"><a href={`mailto:${email}`} className="email-link">{email}<ArrowUpRight size={27} /></a><button className="copy-button icon-button" onClick={copyEmail} title={copied ? '邮箱已复制' : '复制邮箱'} aria-label={copied ? '邮箱已复制' : '复制邮箱'}>{copied ? <Check size={19} /> : <Copy size={19} />}</button></div><span className="copy-feedback" role="status">{copied ? '邮箱已复制，期待你的消息。' : '\u00A0'}</span><div className="contact-secondary"><a href="tel:15834460306">158 3446 0306</a><span>全国可达</span><a href="/assets/resume.pdf" download="高滢乔-个人简历.pdf">下载完整简历 <Download size={15} /></a></div></div><footer><a className="footer-brand" href="#home">gyq.</a><span>© {new Date().getFullYear()} 高滢乔 · 保持好奇，持续创造。</span><a href="#home">回到顶部 <ArrowUp size={15} /></a></footer></div></section>
      </main>
      {selected && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button ref={closeButton} className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="关闭项目详情" title="关闭项目详情"><X size={23} /></button><span className="section-index">{selected.category}</span><h2 id="modal-title">{selected.title}</h2><p className="modal-meta">{selected.role}<br />{selected.period}</p><img className="modal-cover" src={selected.image} alt={`${selected.title}核心产品页面`} /><div className="modal-story"><div><h3>业务挑战</h3><p>{selected.challenge}</p></div><div><h3>我的工作</h3><p>{selected.work}</p></div><div><h3>项目成果</h3><p>{selected.result}</p></div></div><ProjectGallery project={selected} /><p className="source-note">项目描述与成果数据整理自个人简历，页面图片为项目原型。</p></div></div>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

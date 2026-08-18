import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type WheelEvent as ReactWheelEvent } from "react";
import { homeMockContent } from "../../data/home/mock";
import HomeMediaSlot from "./HomeMediaSlot";
import DeepSeekHarnessBackground, { spatialVerseFluidParams } from "./DeepSeekHarnessBackground";

function LocaleText({ zh }: { zh: string; en: string }) {
  return <>{zh}</>;
}

const englishText = (value: string) => value;
const solutionEnglishLabels: Record<string, string> = {};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

const legacySectionsEnabled = false;

export default function HomeExperience({ content = homeMockContent }: { content?: typeof homeMockContent }) {
  const homeContent = content;
  const [activeSolution, setActiveSolution] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [activeSupport, setActiveSupport] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [capabilityExitRotation, setCapabilityExitRotation] = useState(0);
    const capabilityWheelLock = useRef(false);
    const capabilityWheelAccumulator = useRef(0);
    const capabilityExitTriggered = useRef(false);
  const selectedSolution = homeContent.solutions[activeSolution];
  const selectedCapability = homeContent.capabilities[activeCapability];
  const selectedMissionStage = homeContent.mission.stages.find((stage) => stage.targetSolution === activeSolution) ?? homeContent.mission.stages[0];

  useEffect(() => {
    document.documentElement.classList.add("has-reveal");
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("has-reveal");
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    revealNodes.forEach((node, index) => {
      node.style.setProperty("--reveal-index", String(index % 6));
      observer.observe(node);
    });

    const brandTransitionNode = document.querySelector<HTMLElement>("[data-brand-transition]");
    let brandHasLeft = false;
    const brandTransitionObserver = brandTransitionNode ? new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (!entry.isIntersecting) {
        brandHasLeft = true;
        brandTransitionNode.classList.remove("is-returning");
        return;
      }
      if (brandHasLeft) {
        brandTransitionNode.classList.remove("is-returning");
        void brandTransitionNode.offsetWidth;
        brandTransitionNode.classList.add("is-returning");
      }
    }, { threshold: 0.35 }) : null;
    if (brandTransitionNode && brandTransitionObserver) brandTransitionObserver.observe(brandTransitionNode);

    return () => {
      observer.disconnect();
      brandTransitionObserver?.disconnect();
      document.documentElement.classList.remove("has-reveal");
    };
  }, []);

  const handleCapabilityWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 8) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    if (direction < 0) {
      capabilityExitTriggered.current = false;
      setCapabilityExitRotation(0);
    }
    const nextCapability = Math.max(0, Math.min(homeContent.capabilities.length - 1, activeCapability + direction));
    const lastCapabilityIndex = homeContent.capabilities.length - 1;
    if (nextCapability === activeCapability) {
      if (activeCapability === lastCapabilityIndex && direction > 0) {
        if (capabilityWheelLock.current) {
          event.preventDefault();
          capabilityWheelAccumulator.current = 0;
        } else if (!capabilityExitTriggered.current) {
          event.preventDefault();
          capabilityExitTriggered.current = true;
          capabilityWheelLock.current = true;
          capabilityWheelAccumulator.current = 0;
          setCapabilityExitRotation(26);
          window.setTimeout(() => { capabilityWheelLock.current = false; }, 1000);
        }
      }
      return;
    }

    event.preventDefault();
    if (Math.sign(capabilityWheelAccumulator.current) !== direction) capabilityWheelAccumulator.current = 0;
    capabilityWheelAccumulator.current += event.deltaY;
    if (Math.abs(capabilityWheelAccumulator.current) < 560 || capabilityWheelLock.current) return;

    capabilityWheelLock.current = true;
    capabilityWheelAccumulator.current = 0;
    capabilityExitTriggered.current = false;
    setCapabilityExitRotation(0);
    setActiveCapability(nextCapability);
    const lockDuration = nextCapability === lastCapabilityIndex ? 1350 : 620;
    window.setTimeout(() => { capabilityWheelLock.current = false; }, lockDuration);
  };

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="site-shell">
      <section id="top" className="brand-start-section" data-brand-start data-brand-transition aria-labelledby="brand-start-title">
        <div className="brand-start-panel" data-brand-panel>
          <DeepSeekHarnessBackground
            fluidParams={spatialVerseFluidParams}
            lineColor="rgba(215, 255, 243,"
            dotColor="rgba(215, 255, 243,"
            lineOpacity={0}
            dotOpacity={0.5}
            showLines={false}
            shapeSrc="/spatialverse-logo.png"
            shapeSize={347}
            style={{ zIndex: 0 }}
          />
          <div className="brand-start-grid" aria-hidden="true" />
          <div className="brand-start-orbit brand-start-orbit-one" aria-hidden="true" />
          <div className="brand-start-orbit brand-start-orbit-two" aria-hidden="true" />
          <div className="brand-start-crosshair" aria-hidden="true"><span /><span /></div>
          <div className="brand-start-topline content-width">
            <span>00 / BRAND SYSTEM</span>
            <span>SPATIALVERSE / OFFICIAL PLATFORM</span>
          </div>
          <div className="brand-start-content content-width">
            <div className="brand-start-index"><span>01</span><i /></div>
            <div className="brand-start-copy">
              <p className="brand-start-kicker">{homeContent.brand.kicker}</p>
              <h1 id="brand-start-title">{homeContent.brand.name}</h1>
              <p className="brand-start-descriptor">{homeContent.brand.descriptor}</p>
              <a className="brand-start-enter" href="#hero">ENTER THE PLATFORM <Arrow /></a>
            </div>
            <div className="brand-start-visual" aria-hidden="true">
              <span className="brand-art-caption caption-top">DIGITAL SPATIAL FIELD / 01</span>
              <span className="brand-art-caption caption-right">DATA IN MOTION</span>
              <div className="brand-art-architecture">
                <span className="brand-art-plane-wrap plane-wrap-one"><i className="brand-art-plane plane-one" /></span>
                <span className="brand-art-plane-wrap plane-wrap-two"><i className="brand-art-plane plane-two" /></span>
                <span className="brand-art-plane-wrap plane-wrap-three"><i className="brand-art-plane plane-three" /></span>
                <i className="brand-art-beam beam-one" /><i className="brand-art-beam beam-two" /><i className="brand-art-beam beam-three" />
              </div>
              <div className="brand-art-particles">
                <i className="brand-art-particle particle-one" /><i className="brand-art-particle particle-two" /><i className="brand-art-particle particle-three" /><i className="brand-art-particle particle-four" />
                <i className="brand-art-particle particle-five" /><i className="brand-art-particle particle-six" /><i className="brand-art-particle particle-seven" /><i className="brand-art-particle particle-eight" />
                <i className="brand-art-particle particle-nine" /><i className="brand-art-particle particle-ten" /><i className="brand-art-particle particle-eleven" /><i className="brand-art-particle particle-twelve" />
                <i className="brand-art-particle core-particle core-particle-one" /><i className="brand-art-particle core-particle core-particle-two" /><i className="brand-art-particle core-particle core-particle-three" /><i className="brand-art-particle core-particle core-particle-four" />
                <i className="brand-art-particle core-particle core-particle-five" /><i className="brand-art-particle core-particle core-particle-six" /><i className="brand-art-particle core-particle core-particle-seven" /><i className="brand-art-particle core-particle core-particle-eight" />
                <i className="brand-art-particle core-particle core-particle-nine" /><i className="brand-art-particle core-particle core-particle-ten" /><i className="brand-art-particle core-particle core-particle-eleven" /><i className="brand-art-particle core-particle core-particle-twelve" />
              </div>
              <div className="brand-art-current-glow">
                <i className="current-streak current-streak-one" /><i className="current-streak current-streak-two" /><i className="current-streak current-streak-three" />
              </div>
              <span className="brand-art-beacon"><span className="spatialverse-mark beacon-logo" /></span>
            </div>
          </div>
          <div className="brand-start-bottom content-width"><span>SCROLL TO ENTER</span><i aria-hidden="true" /><span>01 / 07</span></div>
        </div>
      </section>
      <section id="hero" className="hero-section hero-text-page" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" />
          <span className="data-point point-one" /><span className="data-point point-two" /><span className="data-point point-three" /><span className="data-point point-four" />
        </div>
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-content content-width" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-copy" data-reveal="hero-copy">
            <p className="eyebrow"><span className="status-dot" />{homeContent.hero.eyebrow}</p>
            <h2 className="hero-title" id="hero-title">{homeContent.hero.title}</h2>
            <p className="hero-description">{homeContent.hero.description}</p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={() => goTo(homeContent.hero.primaryTarget)}>{homeContent.hero.primaryCta} <Arrow /></button>
              <a className="button button-ghost" href={homeContent.hero.secondaryHref}>{homeContent.hero.secondaryCta} <Arrow /></a>
            </div>
          </div>
        </div>

        <div className="hero-bottom content-width" data-reveal="hero-bottom" style={{ position: "relative", zIndex: 2 }}><span>SCROLL TO EXPLORE</span><span className="scroll-line" aria-hidden="true" /><span>群核空间智能平台</span></div>
      </section>

      <section id="solutions" className="section section-solutions solution-intro-page" aria-label="解决方案" aria-labelledby="solutions-title">
        <div className="content-width">
          <div className="section-intro" data-reveal="section-intro">
            <p className="section-index">{homeContent.solutionsIntro.eyebrow}</p>
            <div><h2 id="solutions-title">{homeContent.solutionsIntro.title}</h2><p>{homeContent.solutionsIntro.description}</p></div>
          </div>
        </div>
      </section>

      <section id="mission" className="hero-section mission-page-section" aria-label="空间智能数据中枢">
        <div className="hero-atmosphere" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" />
          <span className="data-point point-one" /><span className="data-point point-two" /><span className="data-point point-three" /><span className="data-point point-four" />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="mission-layout content-width">
          <div className="mission-visual-column">
            <div className="hero-console mission-console" data-reveal="hero-console" aria-label="群核空间智能平台 AI 数据任务链">
              <div className="console-head"><span>COOHOM CLOUD / DATA PLATFORM</span></div>
              <div className="console-stage mission-stage">
                <span className="mission-path mission-path-one" aria-hidden="true" /><span className="mission-path mission-path-two" aria-hidden="true" /><span className="mission-path mission-path-three" aria-hidden="true" />
                <span className="mission-scan-line" aria-hidden="true" />
                <div
                  className="mission-orbit-field"
                  aria-label="空间智能核心轨道"
                >
                  {homeContent.mission.stages.map((stage, index) => {
                    const solution = homeContent.solutions[stage.targetSolution];
                    const isActive = activeSolution === stage.targetSolution;
                    return <button key={stage.label} type="button" className={`mission-node mission-node-${index + 1} ${isActive ? "is-active" : ""}`} aria-pressed={isActive} title={solution.title} onMouseEnter={() => setActiveSolution(stage.targetSolution)} onFocus={() => setActiveSolution(stage.targetSolution)} onClick={() => setActiveSolution(stage.targetSolution)}><span>{String(index + 1).padStart(2, "0")}</span><strong><LocaleText zh={solution.title} en={solutionEnglishLabels[`/coohomcloud/solutions/${solution.slug}`] ?? solution.title} /></strong><small>{stage.label}</small></button>;
                  })}
                </div>
                <div className="console-core" aria-hidden="true"><span>{homeContent.mission.coreTop}</span><b>{homeContent.mission.coreBottom}</b></div>
              </div>
              <div className="console-foot"><span>ACTIVE DATA SIGNAL</span><strong>{selectedMissionStage.label}</strong><span className="console-coordinates"><LocaleText zh={selectedMissionStage.signal} en={englishText(selectedMissionStage.signal)} /></span></div>
            </div>
          </div>
          <aside className="mission-explanation" data-reveal="mission-explanation" aria-live="polite">
            <p className="mission-explanation-status">{selectedMissionStage.status}</p>
            <h2><LocaleText zh={selectedSolution.title} en={solutionEnglishLabels[`/coohomcloud/solutions/${selectedSolution.slug}`] ?? selectedSolution.title} /></h2>
            <p className="mission-explanation-insight"><LocaleText zh={selectedMissionStage.insight} en={englishText(selectedMissionStage.insight)} /></p>
            <p className="mission-explanation-detail"><LocaleText zh={selectedSolution.description} en={englishText(selectedSolution.description)} /></p>
            <div className="mission-video-frame">
              <HomeMediaSlot key={selectedMissionStage.media.id} slotId={selectedMissionStage.media.id} label={`${selectedSolution.title} 官方媒体`} kind={selectedMissionStage.media.kind as "video" | "image" | "image-or-video"} cmsField={selectedMissionStage.media.cmsField} src={selectedMissionStage.media.src} className="mission-video" />
              <span className="mission-video-source">CMS / MEDIA FIELD</span>
            </div>
          </aside>
        </div>
        <div className="hero-bottom content-width"><span>SCROLL TO SOLUTIONS</span><span className="scroll-line" aria-hidden="true" /><span>{homeContent.mission.title}</span></div>
      </section>

      <section id="capabilities" className="section section-capabilities-intro" aria-labelledby="capabilities-title">
        <div className="content-width">
        <div className="section-intro capabilities-intro" data-reveal="section-intro"><p className="section-index">{homeContent.capabilitiesIntro.eyebrow}</p><div><h2 id="capabilities-title">{homeContent.capabilitiesIntro.title}</h2><p>{homeContent.capabilitiesIntro.description}</p></div></div>
        </div>
      </section>

      <div className="capability-scroll-track">
      <section id="capability-dashboard" className="section section-capabilities capability-dashboard" aria-label="核心能力仪表盘" onWheel={handleCapabilityWheel}>
        <div className="capability-page-content content-width">
        <div className="capability-system" data-reveal="capability-grid">
          <div className={`capability-rail capability-active-${activeCapability + 1}`} style={{ "--capability-angle": `${51 + activeCapability * 26 + capabilityExitRotation}deg` } as CSSProperties} aria-label="核心能力导航">
            <div className="capability-rail-grid" aria-hidden="true" />
            <div className="capability-rail-arc capability-rail-arc-one" aria-hidden="true" />
            <div className="capability-rail-arc capability-rail-arc-two" aria-hidden="true" />
            <div className="capability-rail-ticks" aria-hidden="true" />
            <div className="capability-rail-pointer" aria-hidden="true" />
            <div className="capability-rail-heading"><span>CAPABILITY MATRIX</span><strong>CORE / 04</strong></div>
            <div className="capability-rail-hint">SCROLL / SWITCH CAPABILITY</div>
            <div className="capability-rail-center" aria-hidden="true"><span>ACTIVE</span><strong>{String(activeCapability + 1).padStart(2, "0")}</strong></div>
            <div className="capability-rail-readout"><span>ACTIVE CAPABILITY</span><strong>{selectedCapability.label}</strong></div>
          </div>
          <div className="capability-selector-list" role="tablist" aria-label="核心能力选择">
            {homeContent.capabilities.map((capability, index) => <button key={capability.number} type="button" role="tab" aria-selected={activeCapability === index} className={activeCapability === index ? "is-active" : ""} onFocus={() => { capabilityExitTriggered.current = false; setCapabilityExitRotation(0); setActiveCapability(index); }} onClick={() => { capabilityExitTriggered.current = false; setCapabilityExitRotation(0); setActiveCapability(index); }}><span>{capability.number}</span><strong><LocaleText zh={capability.title} en={englishText(capability.title)} /></strong><small>{capability.label}</small></button>)}
          </div>
          <article className="capability-detail" role="tabpanel" aria-live="polite">
            <div className="capability-detail-media">
              <HomeMediaSlot key={`${selectedCapability.media.id}-${activeCapability}`} slotId={selectedCapability.media.id} label={`${selectedCapability.title} 官方媒体`} kind={selectedCapability.media.kind as "video" | "image" | "image-or-video"} cmsField={selectedCapability.media.cmsField} src={selectedCapability.media.src} className="capability-detail-video" />
              <span className="capability-detail-corner capability-detail-corner-one" aria-hidden="true" /><span className="capability-detail-corner capability-detail-corner-two" aria-hidden="true" />
              <span className="capability-detail-source">CMS / MEDIA FIELD</span>
            </div>
            <div className="capability-detail-copy"><p className="capability-detail-status">{selectedCapability.number} / {selectedCapability.label}</p><h3><LocaleText zh={selectedCapability.title} en={englishText(selectedCapability.title)} /></h3><p><LocaleText zh={selectedCapability.text} en={englishText(selectedCapability.text)} /></p><div className="capability-detail-meta"><span>DATA CAPABILITY / {String(activeCapability + 1).padStart(2, "0")}</span><span>ONLINE</span></div></div>
          </article>
        </div>
        </div>
      </section>
      </div>

      <section id="why" className="why-section" aria-labelledby="why-title">
        <div className="content-width why-layout" data-reveal="why-layout">
          <div className="why-copy"><p className="section-index">{homeContent.why.eyebrow}</p><h2 id="why-title">{homeContent.why.title}</h2><p>{homeContent.why.text}</p><a className="button button-ghost" href={homeContent.why.href}>{homeContent.why.link} <Arrow /></a></div>
          <div className="metric-grid" aria-label="平台数据指标">{homeContent.metrics.map((metric) => <div className="metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
        </div>
      </section>

      <section id="support" className="support-combined-page" aria-labelledby="support-title">
        <div className="content-width">
          <div className="section-intro" data-reveal="section-intro"><p className="section-index">{homeContent.support.eyebrow}</p><div><h2 id="support-title">{homeContent.support.title}</h2><p>{homeContent.support.description}</p></div></div>
          <div className="support-layout" data-reveal="support-layout">
            <div className="support-list" role="tablist" aria-label="支持模式">
              {homeContent.support.modes.map((mode, index) => <button type="button" role="tab" aria-selected={activeSupport === index} className={activeSupport === index ? "is-active" : ""} key={mode} onMouseEnter={() => setActiveSupport(index)} onFocus={() => setActiveSupport(index)}><span>0{index + 1}</span><strong><LocaleText zh={mode} en={englishText(mode)} /></strong><Arrow /></button>)}
            </div>
            <div className="support-card" role="tabpanel" aria-live="polite"><span className="support-card-number">0{activeSupport + 1}</span><p>{homeContent.support.platformLabel}</p><h3><LocaleText zh={homeContent.support.modes[activeSupport]} en={englishText(homeContent.support.modes[activeSupport])} /></h3><p><LocaleText zh={homeContent.support.description} en={englishText(homeContent.support.description)} /></p><a className="text-link" href={homeContent.support.linkHref}>{homeContent.support.linkLabel} <Arrow /></a></div>
          </div>
        </div>
      </section>

      {legacySectionsEnabled && (
      <section id="support-dashboard" className="support-dashboard-page" aria-label="支持模式详情">
        <div className="content-width">
          <div className="support-layout" data-reveal="support-layout">
            <div className="support-list" role="tablist" aria-label="支持模式">
              {homeContent.support.modes.map((mode, index) => <button type="button" role="tab" aria-selected={activeSupport === index} className={activeSupport === index ? "is-active" : ""} key={mode} onMouseEnter={() => setActiveSupport(index)} onFocus={() => setActiveSupport(index)}><span>0{index + 1}</span><strong>{mode}</strong><Arrow /></button>)}
            </div>
            <div className="support-card" role="tabpanel" aria-live="polite"><span className="support-card-number">0{activeSupport + 1}</span><p>群核空间智能平台</p><h3>{homeContent.support.modes[activeSupport]}</h3><p>{homeContent.support.description}</p><a className="text-link" href="#contact-drawer">了解更多 <Arrow /></a></div>
          </div>
        </div>
      </section>

      )}
      {legacySectionsEnabled && (
      <section id="datasets" className="section section-datasets content-width" aria-labelledby="datasets-title">
        <div className="section-intro" data-reveal="section-intro"><p className="section-index">05 / Our Dataset Products</p><div><h2 id="datasets-title">Our Dataset Products</h2><p>提供包括图片、视频、模型和场景在内的多样化数据资源。</p></div></div>
        <div className="dataset-grid" data-reveal="dataset-grid">{homeContent.datasets.map((dataset, index) => <a className={`dataset-card dataset-${index + 1}`} href="#contact-drawer" key={`${dataset.title}-${index}`}><span className="dataset-label">{dataset.label}</span><div className="dataset-art" aria-hidden="true"><i /><i /><i /></div><div className="dataset-info"><div><span>DATASET / 0{index + 1}</span><Arrow /></div><h3>{dataset.title}</h3><p>{dataset.text}</p></div></a>)}</div>
      </section>

      )}

      {legacySectionsEnabled && (
      <section id="contact" className="contact-section content-width" aria-labelledby="contact-title">
        <div className="contact-scan" data-reveal="contact-scan" aria-hidden="true"><span /><span /><span /></div>
        <p className="section-index" data-reveal="contact-label">05 / 联系我们</p><h2 id="contact-title" data-reveal="contact-title">联系我们</h2>
        <p className="contact-lead" data-reveal="contact-lead">借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。</p>
        <div className="contact-layout contact-layout-single" data-reveal="contact-layout">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="contact-field-email"><span>电子邮件*</span><input name="email" type="email" placeholder="电子邮件*" required /></label>
            <label className="contact-field-message"><span>需求*</span><textarea name="message" placeholder="请描述您的需求" rows={5} required /></label>
            <label className="contact-consent"><input type="checkbox" name="consent" required /><span>{homeContent.contact.privacy} 请求。欲了解更多信息，请联系我们 {homeContent.contact.email}。</span></label>
            <button className="button button-primary" type="submit">提交 <Arrow /></button>
            {submitted && <p className="form-status" role="status">感谢提交，我们会尽快联系您。</p>}
          </form>
        </div>
      </section>
      )}

    </div>
  );
}

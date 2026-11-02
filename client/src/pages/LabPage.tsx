import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileCode,
  Fingerprint,
  HardDrive,
  KeyRound,
  LockKeyhole,
  Network,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { LAB_XP_REWARD, getLevelNumber, useLearningProgress } from "@/hooks/useLearningProgress";
import { getUnlockedLabCount, LAB_SIMULATION_IDS, labScenarios } from "@/data/labScenarios";
import NotFound from "@/pages/NotFound";

const iconByKey: Record<string, LucideIcon> = {
  Activity,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileCode,
  Fingerprint,
  HardDrive,
  KeyRound,
  Network,
  Search,
  Shield,
  Terminal,
};

function categoryLabel(label: string, index: number) {
  const category = label.replace(/^CASE\s*\d+\s*·\s*/i, "").trim();
  return `CASE ${String(index + 1).padStart(2, "0")} · ${category || "보안 실습"}`;
}

export default function LabPage() {
  const [, setLocation] = useLocation();
  const { progress, completeLab } = useLearningProgress();
  const level = getLevelNumber(progress.xp);
  const isUnlocked = level >= 3;
  const [activeId, setActiveId] = useState(labScenarios[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<"success" | "retry" | null>(null);
  const active = labScenarios.find((scenario) => scenario.id === activeId) ?? labScenarios[0];
  const activeIndex = labScenarios.findIndex((scenario) => scenario.id === active?.id);
  const Icon = iconByKey[active?.iconKey ?? ""] ?? ShieldCheck;
  const currentStep = active?.steps[stepIndex];
  const scenarioUnlocked = Boolean(active && level >= active.minLevel);
  const completedCount = progress.completedLabIds.filter((id) => LAB_SIMULATION_IDS.includes(id)).length;
  const unlockedCount = getUnlockedLabCount(level);

  if (!active || !currentStep) return <NotFound />;

  function chooseScenario(id: string) {
    setActiveId(id);
    setStepIndex(0);
    setSelectedOption(null);
    setResult(null);
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedOption === null || !currentStep || !scenarioUnlocked) return;
    if (selectedOption !== currentStep.correctIndex) {
      setResult("retry");
      return;
    }
    setResult("success");
    if (stepIndex === active.steps.length - 1) completeLab(active.id);
  }

  function continueScenario() {
    if (stepIndex < active.steps.length - 1) {
      setStepIndex((current) => current + 1);
      setSelectedOption(null);
      setResult(null);
      return;
    }
    setStepIndex(0);
    setSelectedOption(null);
    setResult(null);
  }

  return (
    <div className="lab-shell">
      <header className="lesson-topbar lab-topbar">
        <button className="back-button" onClick={() => setLocation("/")}><ArrowLeft size={18} /><span>피드</span></button>
        <BrandMark />
        <div className="lesson-top-stats"><span className="lab-level-pill"><Sparkles size={12} /> LEVEL {String(level).padStart(2, "0")}</span></div>
      </header>
      <main className="lab-container">
        <div className="lab-heading-row">
          <div className="lab-heading">
            <span className="eyebrow"><span className="live-dot" /> TEUM SECURITY RANGE</span>
            <h1>실습실<span>.</span></h1>
            <p>합성된 증거를 살펴보고, 안전한 다음 행동을 골라요.</p>
          </div>
          {isUnlocked && (
            <div className="lab-collection-card" aria-label={`전체 ${labScenarios.length}개 중 ${completedCount}개 완료`}>
              <div><span>시나리오 진행</span><strong>{String(completedCount).padStart(2, "0")}<small> / {labScenarios.length}</small></strong></div>
              <div className="lab-collection-track"><i style={{ width: `${(completedCount / labScenarios.length) * 100}%` }} /></div>
              <small>{unlockedCount}개 열림 · 레벨에 따라 추가 해제</small>
            </div>
          )}
        </div>

        {!isUnlocked ? (
          <section className="lab-locked-card">
            <div className="locked-medallion"><LockKeyhole size={29} /></div>
            <span className="completion-eyebrow">레벨 03에서 열려요</span>
            <h2>먼저 기본 단서를 모아봐요.</h2>
            <p>강좌에서 경험치를 쌓아 레벨 3이 되면 첫 모의 시나리오가 열려요. 현재 레벨은 <strong>{level}</strong>이에요.</p>
            <div className="locked-progress"><span><Zap size={14} fill="currentColor" /> {progress.xp} XP</span><i><b style={{ width: `${Math.min(progress.xp, 100)}%` }} /></i><small>100 XP 필요</small></div>
            <button className="button-primary completion-home" onClick={() => setLocation("/")}>강좌 이어 보기 <ArrowRight size={17} /></button>
            <div className="lab-safety-note"><ShieldCheck size={15} /> 실제 사이트나 시스템에는 연결되지 않아요.</div>
          </section>
        ) : (
          <div className="lab-layout">
            <aside className="lab-sidebar" aria-label="실습 시나리오 목록">
              <div className="lab-list-head"><span className="section-kicker">SIMULATION DECK · {labScenarios.length}</span><h2>모의 시나리오</h2><p>잠금은 학습 레벨에 맞춰 열려요.</p></div>
              <div className="lab-list-items">
                {labScenarios.map((scenario, index) => {
                  const ItemIcon = iconByKey[scenario.iconKey] ?? ShieldCheck;
                  const done = progress.completedLabIds.includes(scenario.id);
                  const locked = level < scenario.minLevel;
                  return (
                    <button
                      type="button"
                      key={scenario.id}
                      className={`lab-list-item${activeId === scenario.id ? " lab-list-item-active" : ""}${locked ? " lab-list-item-locked" : ""}${done ? " lab-list-item-done" : ""}`}
                      onClick={() => !locked && chooseScenario(scenario.id)}
                      disabled={locked}
                      aria-current={activeId === scenario.id ? "true" : undefined}
                      aria-label={locked ? `${scenario.title}, 레벨 ${scenario.minLevel}에서 잠금 해제` : `${scenario.title}${done ? ", 완료" : ""}`}
                    >
                      <span className="lab-list-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="lab-list-icon"><ItemIcon size={16} /></span>
                      <span className="lab-list-title"><small>{categoryLabel(scenario.label, index)}</small><strong>{scenario.title}</strong></span>
                      {done ? <CheckCircle2 size={16} className="lab-list-done-icon" /> : locked ? <span className="lab-list-lock">LV {String(scenario.minLevel).padStart(2, "0")}</span> : <ChevronRight size={16} className="lab-list-arrow" />}
                    </button>
                  );
                })}
              </div>
              <div className="lab-safety-note"><ShieldCheck size={15} /><span>합성된 가상 데이터만 사용해요. 외부 연결은 없어요.</span></div>
            </aside>

            <section className="lab-workspace" aria-labelledby="active-lab-title">
              <div className="lab-workspace-top">
                <span className="lab-case-label"><Icon size={14} /> {categoryLabel(active.label, activeIndex)}</span>
                <span className="lab-reward"><Zap size={13} fill="currentColor" /> 첫 완료 +{LAB_XP_REWARD} XP</span>
              </div>
              <div className="lab-intro"><h2 id="active-lab-title">{active.title}</h2><p>{active.summary}</p></div>
              <div className="lab-scenario-brief"><span className="lab-section-kicker"><Activity size={13} /> 상황 브리핑</span><p>{active.briefing}</p><div className="lab-mission-line"><Target size={14} /><span>{active.mission}</span><span className="lab-duration"><Timer size={12} /> {active.duration}</span></div></div>

              <div className="lab-evidence-card">
                <div className="lab-evidence-head"><span><ClipboardList size={14} /> 증거 자료</span><small>SYNTHETIC · DEMO</small></div>
                <strong>{active.artifactTitle}</strong>
                <pre>{active.artifactText}</pre>
              </div>

              <div className="lab-step-meter" aria-label={`${stepIndex + 1}단계 / ${active.steps.length}`}>
                <div className="lab-step-meter-head"><span>CASE PROGRESS</span><strong>단계 {String(stepIndex + 1).padStart(2, "0")} <small>/ {String(active.steps.length).padStart(2, "0")}</small></strong></div>
                <div className="lab-step-meter-track">{active.steps.map((step, index) => <i key={step.stepTitle} className={index < stepIndex || (index === stepIndex && result === "success") ? "lab-step-meter-filled" : index === stepIndex ? "lab-step-meter-current" : ""} />)}</div>
              </div>

              <form className="lab-step-card" onSubmit={submitAnswer}>
                <div className="lab-step-overline"><span>{String(stepIndex + 1).padStart(2, "0")}</span><strong>{currentStep.stepTitle}</strong></div>
                <div className="lab-step-evidence"><Search size={14} /><span>{currentStep.evidence}</span></div>
                <div className="lab-prompt"><Target size={16} /><strong>{currentStep.prompt}</strong></div>
                <div className="lab-options" role="group" aria-label="안전한 다음 행동 선택">
                  {currentStep.options.map((option, index) => {
                    const selected = selectedOption === index;
                    const isCorrect = result === "success" && index === currentStep.correctIndex;
                    const isWrong = result === "retry" && selected;
                    return (
                      <button
                        type="button"
                        aria-pressed={selected}
                        key={`${index}-${option}`}
                        className={`lab-option${selected ? " lab-option-selected" : ""}${isCorrect ? " lab-option-correct" : ""}${isWrong ? " lab-option-wrong" : ""}`}
                        onClick={() => { if (result === "success") return; setSelectedOption(index); setResult(null); }}
                        disabled={result === "success"}
                      >
                        <span className="lab-option-mark">{isCorrect ? <Check size={15} /> : String.fromCharCode(65 + index)}</span><span>{option}</span>
                      </button>
                    );
                  })}
                </div>
                {result === "retry" && <div className="lab-result lab-result-retry"><span><Target size={18} /></span><div><strong>단서를 다시 살펴볼까요?</strong><p>증거 자료를 다시 읽고, 권한이 있고 피해가 가장 적은 행동을 골라보세요.</p></div></div>}
                {result === "success" && <div className="lab-result lab-result-success"><span><CheckCircle2 size={19} /></span><div><strong>{stepIndex === active.steps.length - 1 ? "시나리오를 완료했어요." : "정확해요. 다음 단서로 이어져요."}</strong><p>{currentStep.explanation}{stepIndex === active.steps.length - 1 ? " XP 보상은 처음 완료할 때 한 번 지급돼요." : ""}</p></div></div>}
                <div className="lab-workspace-footer">
                  <span><ShieldCheck size={14} /> 실습은 이 화면 안에서만 진행돼요.</span>
                  {result === "success" ? (
                    <button type="button" className="button-primary" onClick={continueScenario}>{stepIndex === active.steps.length - 1 ? "처음부터 다시 보기" : "다음 단계"} <ArrowRight size={16} /></button>
                  ) : (
                    <button type="submit" className="button-primary" disabled={selectedOption === null}>{result === "retry" ? "다시 확인하기" : "선택 확인하기"}<ArrowRight size={16} /></button>
                  )}
                </div>
              </form>

              <div className="lab-reference-line"><span>학습 참고 기준</span>{active.references.map((reference, index) => <span key={reference.url}>{index > 0 && <i>·</i>}<a href={reference.url} target="_blank" rel="noreferrer">{reference.title}</a></span>)}</div>
            </section>
          </div>
        )}
        <div className="lab-back-link"><button onClick={() => setLocation("/")}><ArrowLeft size={14} /> 학습 피드로 돌아가기</button><span>TEUM SAFE PRACTICE · 합성 데이터 학습용</span></div>
      </main>
    </div>
  );
}

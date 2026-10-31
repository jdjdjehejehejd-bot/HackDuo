import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Code2, KeyRound, LockKeyhole, MailWarning, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { getLevelNumber, LAB_XP_REWARD, useLearningProgress } from "@/hooks/useLearningProgress";
import NotFound from "@/pages/NotFound";

type Simulation = {
  id: string;
  title: string;
  label: string;
  summary: string;
  icon: typeof MailWarning;
  prompt: string;
  options: string[];
  correctIndex?: number;
  flags?: number[];
  explanation: string;
  artifact?: { from: string; subject: string; body: string; button: string };
};

const simulations: Simulation[] = [
  {
    id: "mail-room",
    title: "메시지 속 빨간 깃발",
    label: "CASE 01 · 가상 받은 편지함",
    summary: "합성 메일에서 위험 신호 세 가지를 골라내요.",
    icon: MailWarning,
    prompt: "이 메시지에서 의심되는 단서를 모두 선택해 주세요.",
    options: ["발신 주소의 도메인이 회사 공식 주소와 다르다", "오늘 안에 계정이 닫힌다며 서두르게 한다", "버튼 주소가 낯선 사이트로 이어진다고 안내돼 있다", "메시지에 내 이름이 적혀 있다"],
    flags: [0, 1, 2],
    explanation: "발신 주소 불일치, 긴급 압박, 낯선 목적지는 함께 나타나면 특히 주의해야 할 신호예요. 메시지의 버튼 대신 공식 앱을 직접 열어 확인하는 것이 안전해요.",
    artifact: { from: "보안팀 안내 <notice@teum-secure.example.test>", subject: "오늘 18:00까지 계정 확인이 필요합니다", body: "확인하지 않으면 접근이 중단될 수 있습니다. 아래 버튼으로 바로 확인해 주세요.", button: "계정 확인 · 외부 주소 표시됨" },
  },
  {
    id: "web-check",
    title: "댓글 미리보기 안전하게",
    label: "CASE 02 · 모의 게시판",
    summary: "사용자가 쓴 글을 화면에 보여줄 안전한 방법을 골라요.",
    icon: Code2,
    prompt: "가상 게시판의 댓글을 표시할 때 더 안전한 기본은 무엇일까요?",
    options: ["입력값을 확인하고, 프레임워크의 텍스트 출력 기능으로 표시한다", "댓글 문자열을 HTML에 직접 이어 붙인다", "서버 검증을 빼고 브라우저 입력만 믿는다", "오류가 나면 내부 설정 내용을 그대로 화면에 보여준다"],
    correctIndex: 0,
    explanation: "입력의 형식과 길이를 확인하고, 화면 출력 때는 프레임워크의 안전한 텍스트 렌더링을 사용해요. 이 실습 화면은 예시만 보여주며 실제 코드를 실행하거나 네트워크에 전송하지 않아요.",
  },
  {
    id: "access-audit",
    title: "필요한 권한만 남기기",
    label: "CASE 03 · 권한 점검표",
    summary: "가상의 팀원을 위한 최소 권한을 선택해요.",
    icon: KeyRound,
    prompt: "외부 디자이너가 완성된 이미지만 내려받아야 해요. 어떤 권한을 주는 것이 적절할까요?",
    options: ["모든 프로젝트의 관리자 권한", "완성 이미지 폴더의 읽기 권한만, 계약 종료일까지", "팀 전체 계정과 암호를 공유", "업무 범위와 상관없는 고객 정보 수정 권한"],
    correctIndex: 1,
    explanation: "업무에 필요한 범위의 최소 권한만 주고, 필요가 끝나면 회수해요. 공용 계정이나 암호를 나눠 쓰지 않는 것도 중요해요.",
  },
];

export default function LabPage() {
  const [, setLocation] = useLocation();
  const { progress, completeLab } = useLearningProgress();
  const level = getLevelNumber(progress.xp);
  const isUnlocked = level >= 3;
  const [activeId, setActiveId] = useState(simulations[0].id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedFlags, setSelectedFlags] = useState<number[]>([]);
  const [result, setResult] = useState<"success" | "retry" | null>(null);
  const active = simulations.find((item) => item.id === activeId) ?? simulations[0];
  const Icon = active.icon;
  const isMultiSelect = Boolean(active.flags);
  const alreadyCompleted = progress.completedLabIds.includes(active.id);

  if (!active) return <NotFound />;

  function chooseSimulation(id: string) {
    setActiveId(id);
    setSelectedIndex(null);
    setSelectedFlags([]);
    setResult(null);
  }

  function submitAnswer() {
    const isCorrect = isMultiSelect
      ? JSON.stringify([...selectedFlags].sort()) === JSON.stringify([...(active.flags ?? [])].sort())
      : selectedIndex === active.correctIndex;
    if (!isCorrect) {
      setResult("retry");
      return;
    }
    setResult("success");
    completeLab(active.id);
  }

  return (
    <div className="lab-shell">
      <header className="lesson-topbar lab-topbar"><button className="back-button" onClick={() => setLocation("/")}><ArrowLeft size={18} /><span>피드</span></button><BrandMark /><div className="lesson-top-stats"><span className="lab-level-pill"><Sparkles size={12} /> LEVEL {String(level).padStart(2, "0")}</span></div></header>
      <main className="lab-container">
        <div className="lab-heading"><span className="eyebrow"><span className="live-dot" /> PRIVATE PRACTICE SPACE</span><h1>실습실<span>.</span></h1><p>가상의 사례에서 단서를 찾고, 더 안전한 선택을 골라봐요.</p></div>
        {!isUnlocked ? (
          <section className="lab-locked-card"><div className="locked-medallion"><LockKeyhole size={29} /></div><span className="completion-eyebrow">레벨 03에서 열려요</span><h2>먼저 기본 단서를 모아봐요.</h2><p>강좌에서 경험치를 쌓아 레벨 3이 되면 세 가지 가상 실습이 열려요. 현재 레벨은 <strong>{level}</strong>이에요.</p><div className="locked-progress"><span><Zap size={14} fill="currentColor" /> {progress.xp} XP</span><i><b style={{ width: `${Math.min(progress.xp, 100)}%` }} /></i><small>100 XP 필요</small></div><button className="button-primary completion-home" onClick={() => setLocation("/")}>강좌 이어 보기 <ArrowRight size={17} /></button><div className="lab-safety-note"><ShieldCheck size={15} /> 실제 사이트나 시스템에는 연결되지 않아요.</div></section>
        ) : (
          <div className="lab-layout">
            <aside className="lab-sidebar" aria-label="실습 시나리오 목록"><div className="lab-list-head"><span className="section-kicker">SIMULATION DECK</span><h2>모의 시나리오</h2></div>{simulations.map((simulation, index) => { const ItemIcon = simulation.icon; const done = progress.completedLabIds.includes(simulation.id); return <button key={simulation.id} className={`lab-list-item${activeId === simulation.id ? " lab-list-item-active" : ""}`} onClick={() => chooseSimulation(simulation.id)}><span className="lab-list-index">0{index + 1}</span><span className="lab-list-icon"><ItemIcon size={17} /></span><span className="lab-list-title"><small>{simulation.label.split(" · ")[0]}</small><strong>{simulation.title}</strong></span>{done ? <CheckCircle2 size={16} className="lab-list-done" /> : <ChevronRight size={16} />}</button>; })}<div className="lab-safety-note"><ShieldCheck size={15} /><span>합성된 가상 데이터만 사용해요. 외부 연결은 없어요.</span></div></aside>
            <section className="lab-workspace" aria-labelledby="active-lab-title">
              <div className="lab-workspace-top"><span className="lab-case-label"><Icon size={14} /> {active.label}</span><span className="lab-reward"><Zap size={13} fill="currentColor" /> 첫 완료 +{LAB_XP_REWARD} XP</span></div>
              <div className="lab-intro"><h2 id="active-lab-title">{active.title}</h2><p>{active.summary}</p></div>
              {active.artifact && <div className="mock-email"><div className="mock-email-caption"><span className="mock-window-dots"><i /><i /><i /></span><span>가상 편지함 · 예시</span><span className="mock-demo-tag">DEMO</span></div><div className="mock-email-content"><small>보낸 사람</small><strong>{active.artifact.from}</strong><small>제목</small><strong>{active.artifact.subject}</strong><p>{active.artifact.body}</p><span className="mock-email-button">{active.artifact.button}</span></div></div>}
              <div className="lab-prompt"><Target size={16} /><strong>{active.prompt}</strong></div>
              <div className={`lab-options${isMultiSelect ? " lab-options-multi" : ""}`} role="group" aria-label="실습 선택지">{active.options.map((option, index) => { const selected = isMultiSelect ? selectedFlags.includes(index) : selectedIndex === index; const isCorrect = result === "success" && (isMultiSelect ? active.flags?.includes(index) : index === active.correctIndex); const isWrong = result === "retry" && selected; return <button key={option} className={`lab-option${selected ? " lab-option-selected" : ""}${isCorrect ? " lab-option-correct" : ""}${isWrong ? " lab-option-wrong" : ""}`} onClick={() => { if (result === "success") return; setResult(null); if (isMultiSelect) setSelectedFlags((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]); else setSelectedIndex(index); }} aria-pressed={selected}><span className="lab-option-mark">{selected ? isMultiSelect ? <Check size={15} /> : String.fromCharCode(65 + index) : String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <CheckCircle2 size={17} className="lab-option-check" />}</button>; })}</div>
              {result === "retry" && <div className="lab-result lab-result-retry"><span><Target size={18} /></span><div><strong>단서를 다시 살펴볼까요?</strong><p>{isMultiSelect ? "맞는 항목을 모두 선택하고 다시 확인해 주세요." : "힌트를 참고해 더 안전한 선택을 골라보세요."}</p></div></div>}
              {result === "success" && <div className="lab-result lab-result-success"><span><CheckCircle2 size={19} /></span><div><strong>{alreadyCompleted ? "복습 완료. 선택이 정확해요." : "정확해요. 안전한 판단이에요."}</strong><p>{active.explanation}</p></div></div>}
              <div className="lab-workspace-footer"><span><ShieldCheck size={14} /> 실습은 이 화면 안에서만 진행돼요.</span><button className="button-primary" onClick={submitAnswer} disabled={(isMultiSelect ? selectedFlags.length === 0 : selectedIndex === null) || result === "success"}>{result === "success" ? "시나리오 완료" : "선택 확인하기"}{result === "success" ? <Check size={16} /> : <ArrowRight size={16} />}</button></div>
            </section>
          </div>
        )}
        <div className="lab-back-link"><button onClick={() => setLocation("/")}><ArrowLeft size={14} /> 학습 피드로 돌아가기</button><span>TEUM SAFE PRACTICE · 학습용 모의 환경</span></div>
      </main>
    </div>
  );
}

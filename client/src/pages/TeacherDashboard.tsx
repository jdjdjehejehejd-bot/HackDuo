import { ArrowLeft, BarChart3, BookOpen, Download, Flame, GraduationCap, ShieldCheck, Target, Trophy, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { badges } from "@/data/badges";
import { lessonStages, lessons } from "@/data/lessons";
import { getCurrentStreak, getLevelNumber, useLearningProgress } from "@/hooks/useLearningProgress";

export default function TeacherDashboard() {
  const [, setLocation] = useLocation();
  const { progress } = useLearningProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const completedCount = lessons.filter((lesson) => completedIds.has(lesson.id)).length;
  const completionRate = Math.round((completedCount / lessons.length) * 100);
  const performances = Object.values(progress.lessonPerformance);
  const answered = performances.reduce((sum, item) => sum + item.attempts * item.total, 0);
  const correct = performances.reduce((sum, item) => sum + item.correct, 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  const weakLessons = lessons
    .map((lesson) => ({ lesson, performance: progress.lessonPerformance[lesson.id] }))
    .filter((item) => item.performance && item.performance.attempts > 0)
    .sort((a, b) => {
      const aRate = a.performance!.correct / (a.performance!.attempts * a.performance!.total);
      const bRate = b.performance!.correct / (b.performance!.attempts * b.performance!.total);
      return aRate - bRate;
    })
    .slice(0, 3);
  const earnedBadges = badges.filter((badge) => badge.isEarned(progress, lessons.length, 3)).length;
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const level = getLevelNumber(progress.xp);

  function downloadReport() {
    const rows = lessons.map((lesson) => {
      const performance = progress.lessonPerformance[lesson.id];
      const rate = performance ? Math.round((performance.correct / (performance.attempts * performance.total)) * 100) : 0;
      return [lesson.title, lesson.category, completedIds.has(lesson.id) ? "완료" : "미완료", `${rate}%`, performance?.attempts ?? 0].join(",");
    });
    const csv = ["강좌,분류,진도,정답률,시도 횟수", ...rows].join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "teum-learning-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="teacher-shell">
      <header className="app-topbar"><div className="topbar-inner"><button className="brand-link teacher-back" onClick={() => setLocation("/")} aria-label="학습 피드로 돌아가기"><ArrowLeft size={16} /><BrandMark /></button><div className="teacher-top-label"><GraduationCap size={15} /> TEACHER VIEW</div><button className="teacher-export" onClick={downloadReport}><Download size={14} /> CSV 리포트</button></div></header>
      <main className="teacher-container">
        <div className="teacher-heading"><div><span className="eyebrow"><span className="live-dot" /> CLASSROOM INSIGHT · DEMO</span><h1>학습 리포트<span>.</span></h1><p>현재 기기에 저장된 학습 기록으로 수업 진행과 취약 단원을 한눈에 확인해요.</p></div><div className="teacher-student-chip"><Users size={15} /><span>현재 학습자</span><strong>{progress.displayName}</strong></div></div>
        <div className="teacher-demo-note"><ShieldCheck size={15} /><span>데모 리포트는 서버에 전송되지 않으며 이 브라우저의 학습 기록만 사용합니다. 실제 학급 대시보드는 계정·학교 데이터 연결 단계에서 확장할 수 있어요.</span></div>
        <section className="teacher-metrics" aria-label="학습 핵심 지표"><article><span><BookOpen size={16} /> 스토리 진도</span><strong>{completionRate}<small>%</small></strong><p>{completedCount} / {lessons.length}편 완료</p></article><article><span><Target size={16} /> 평균 정답률</span><strong>{accuracy}<small>%</small></strong><p>{answered ? `${answered}문항 기록` : "아직 퀴즈 기록이 없어요"}</p></article><article><span><Flame size={16} /> 학습 스트릭</span><strong>{currentStreak}<small>일</small></strong><p>현재 연속 학습</p></article><article><span><Trophy size={16} /> 배지</span><strong>{earnedBadges}<small>개</small></strong><p>획득 / {badges.length}개</p></article></section>
        <div className="teacher-grid"><section className="teacher-card"><div className="teacher-card-heading"><div><span className="section-kicker">CURRICULUM PROGRESS</span><h2>챕터별 진도</h2></div><BarChart3 size={18} /></div><div className="teacher-stage-list">{lessonStages.map((stage) => { const stageLessons = lessons.filter((lesson) => lesson.stageId === stage.id); const done = stageLessons.filter((lesson) => completedIds.has(lesson.id)).length; const percent = Math.round((done / stageLessons.length) * 100); return <div className="teacher-stage-row" key={stage.id}><div><strong>0{stage.number} · {stage.title}</strong><span>{stage.subtitle}</span></div><div className="teacher-stage-meter"><i style={{ width: `${percent}%` }} /></div><b>{done}/{stageLessons.length}</b></div>; })}</div></section><section className="teacher-card"><div className="teacher-card-heading"><div><span className="section-kicker">FOCUS NEXT</span><h2>집중이 필요한 단원</h2></div><Target size={18} /></div>{weakLessons.length === 0 ? <div className="teacher-empty"><Target size={24} /><p>퀴즈를 완료하면 정답률이 낮은 단원이 여기에 표시돼요.</p></div> : <div className="teacher-weak-list">{weakLessons.map(({ lesson, performance }) => { const rate = Math.round((performance!.correct / (performance!.attempts * performance!.total)) * 100); return <button key={lesson.id} onClick={() => setLocation(`/lesson/${lesson.id}`)}><span className="teacher-weak-index">{rate}%</span><span><strong>{lesson.shortTitle}</strong><small>{lesson.category} · {performance!.attempts}회 시도</small></span><ArrowLeft size={14} className="teacher-weak-arrow" /></button>; })}</div>}</section></div>
        <section className="teacher-card teacher-table-card"><div className="teacher-card-heading"><div><span className="section-kicker">LEARNING RECORD</span><h2>강좌별 기록</h2></div><span className="teacher-level-pill"><Zap size={12} /> LEVEL {level}</span></div><div className="teacher-table-wrap"><table><thead><tr><th>강좌</th><th>상태</th><th>정답률</th><th>시도</th></tr></thead><tbody>{lessons.map((lesson) => { const performance = progress.lessonPerformance[lesson.id]; const rate = performance ? Math.round((performance.correct / (performance.attempts * performance.total)) * 100) : 0; return <tr key={lesson.id}><td><strong>{lesson.shortTitle}</strong><small>{lesson.category}</small></td><td><span className={completedIds.has(lesson.id) ? "teacher-status-done" : "teacher-status-pending"}>{completedIds.has(lesson.id) ? "완료" : "진행 전"}</span></td><td>{performance ? `${rate}%` : "—"}</td><td>{performance?.attempts ?? 0}</td></tr>; })}</tbody></table></div></section>
      </main>
      <footer className="site-footer"><BrandMark compact /><span>TEUM · 교사용 학습 인사이트</span><button onClick={() => setLocation("/")}>학습 피드 <ArrowLeft size={12} /></button></footer>
    </div>
  );
}

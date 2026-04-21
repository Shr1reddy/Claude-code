/* ═══════════════════════════════════════════════
   THINKING PARTNER — APP
   State machine for guided reasoning sessions
═══════════════════════════════════════════════ */

// ── Framework definitions ──────────────────────

const FRAMEWORKS = {
  'first-principles': {
    name: 'First Principles',
    icon: '🔬',
    color: '#3b82f6',
    description: 'Strip away assumptions. Get to the irreducible truth.',
    questions: [
      {
        text: 'What do you know with absolute certainty about this situation?',
        hint: 'List facts you can verify — not beliefs, interpretations, or gut feelings.',
        tag: 'Ground Truth'
      },
      {
        text: 'What assumptions are you making that you haven\'t actually verified?',
        hint: 'Assumptions often masquerade as facts. Challenge each one.',
        tag: 'Assumptions'
      },
      {
        text: 'If you stripped away every layer of complexity, what is the actual core problem?',
        hint: 'Keep asking "but WHY is that a problem?" until you hit bedrock.',
        tag: 'Core Problem'
      },
      {
        text: 'What would need to be true for the ideal solution to exist?',
        hint: 'Define the ideal outcome, then work backward to its prerequisites.',
        tag: 'Ideal State'
      },
      {
        text: 'Which constraints are real vs. imagined? What resources do you actually have?',
        hint: '"We can\'t because..." — is that definitely true, or just how it\'s always been done?',
        tag: 'Constraints'
      },
      {
        text: 'How would you explain this problem — and your best solution — to a 10-year-old?',
        hint: 'If you can\'t explain it simply, you don\'t understand it well enough yet.',
        tag: 'Clarity Test'
      }
    ]
  },

  'devils-advocate': {
    name: "Devil's Advocate",
    icon: '😈',
    color: '#ec4899',
    description: 'Challenge your own beliefs. Stress-test before committing.',
    questions: [
      {
        text: 'What is your current best thinking or solution to this challenge?',
        hint: 'State it clearly — you need something solid to push against.',
        tag: 'Current Position'
      },
      {
        text: 'What is the strongest possible argument AGAINST your position?',
        hint: 'Steel-man the opposition — find the best version of the counterargument.',
        tag: 'Counter-Argument'
      },
      {
        text: 'What would someone who completely disagrees with you say, and why?',
        hint: 'Assume they\'re intelligent and well-intentioned. What\'s their logic?',
        tag: 'Opposing View'
      },
      {
        text: 'What evidence or data contradicts your current thinking?',
        hint: 'Confirmation bias is real. What are you avoiding looking at?',
        tag: 'Contradicting Evidence'
      },
      {
        text: 'Under what specific conditions would your solution fail?',
        hint: 'Every solution has a failure mode. Find yours before reality does.',
        tag: 'Failure Conditions'
      },
      {
        text: 'What would you regret most if you proceeded without questioning this further?',
        hint: 'Future you is watching. What would make them wince?',
        tag: 'Regret Minimization'
      }
    ]
  },

  'systems-thinking': {
    name: 'Systems Thinking',
    icon: '🌐',
    color: '#06b6d4',
    description: 'See feedback loops, leverage points, and second-order effects.',
    questions: [
      {
        text: 'Who or what are the main actors, components, and forces involved in this system?',
        hint: 'Map the players: people, processes, technologies, incentives, constraints.',
        tag: 'System Actors'
      },
      {
        text: 'What feedback loops exist? What causes what, and does it cycle back?',
        hint: 'Look for reinforcing loops (growth) and balancing loops (stability).',
        tag: 'Feedback Loops'
      },
      {
        text: 'What unintended consequences might occur if you change one part of the system?',
        hint: 'Everything is connected. Pulling one thread often unravels others.',
        tag: 'Second-Order Effects'
      },
      {
        text: 'Where are the leverage points — places where small changes produce big effects?',
        hint: 'Leverage is rarely where you first look. Constraints, incentives, and rules are common high-leverage points.',
        tag: 'Leverage Points'
      },
      {
        text: 'What time delays exist between actions and their outcomes?',
        hint: 'Systems are slow. What decisions made today will only show results in 6–18 months?',
        tag: 'Time Delays'
      },
      {
        text: 'How does the broader environment — market, culture, technology trends — influence this system?',
        hint: 'Systems don\'t exist in vacuums. What external forces are shaping the container?',
        tag: 'External Forces'
      }
    ]
  },

  'lateral-thinking': {
    name: 'Lateral Thinking',
    icon: '💡',
    color: '#f59e0b',
    description: 'Break conventional patterns. Find the unexpected angle.',
    questions: [
      {
        text: 'What are the obvious, conventional approaches everyone would reach for first?',
        hint: 'List them — not to use them, but to consciously move past them.',
        tag: 'Conventional Paths'
      },
      {
        text: 'What is the complete opposite of the conventional approach? Could it work?',
        hint: 'Inversion is powerful. "What if we charged less?" "What if we gave it away?" "What if customers did it themselves?"',
        tag: 'Inversion'
      },
      {
        text: 'How would a completely different industry solve this exact problem?',
        hint: 'Pick one at random: aviation, theme parks, surgery, military, theater. What would they do?',
        tag: 'Cross-Industry'
      },
      {
        text: 'If your biggest constraint disappeared tomorrow, how would you solve it?',
        hint: 'Remove the constraint mentally. What does the unconstrained solution look like? Can any part of it be achieved?',
        tag: 'Constraint Removal'
      },
      {
        text: 'What unexpected analogy from nature, art, or history applies to this situation?',
        hint: 'How does a forest recover from fire? How does jazz improvisation work? What does this remind you of?',
        tag: 'Analogical Thinking'
      },
      {
        text: 'What\'s the weirdest, most unconventional approach you can imagine — even if it sounds absurd?',
        hint: 'Absurd ideas often contain a hidden kernel of insight. Don\'t filter yet — generate freely.',
        tag: 'Wild Thinking'
      }
    ]
  },

  'pre-mortem': {
    name: 'Pre-Mortem',
    icon: '⚰️',
    color: '#8b5cf6',
    description: 'Imagine failure in advance. Identify and prevent likely pitfalls.',
    questions: [
      {
        text: 'It\'s 12 months from now and this has completely failed. Describe what happened.',
        hint: 'Don\'t hold back. Go full worst-case. The more vivid, the more useful.',
        tag: 'The Failure'
      },
      {
        text: 'What internal factors — decisions, team dynamics, execution — caused the failure?',
        hint: 'Look inward: communication breakdowns, wrong priorities, skill gaps, unclear ownership.',
        tag: 'Internal Causes'
      },
      {
        text: 'What external factors — market, competition, technology, luck — caused the failure?',
        hint: 'What could blindside you from outside your control?',
        tag: 'External Causes'
      },
      {
        text: 'Which failure scenario worries you most right now, and why?',
        hint: 'Your gut knows things your analysis doesn\'t. What\'s nagging at you?',
        tag: 'Biggest Fear'
      },
      {
        text: 'What early warning signs would tell you, 3 months in, that you\'re heading toward failure?',
        hint: 'Define the canaries in the coal mine — the metrics and signals that would alert you early.',
        tag: 'Early Warnings'
      },
      {
        text: 'What would you do RIGHT NOW to prevent the most likely failure modes?',
        hint: 'The pre-mortem is only valuable if it changes what you do today.',
        tag: 'Preventive Actions'
      }
    ]
  },

  'jtbd': {
    name: 'Jobs-to-be-Done',
    icon: '🎯',
    color: '#10b981',
    description: 'Uncover the real underlying need. Define what done actually means.',
    questions: [
      {
        text: 'What is the person (or you) actually trying to accomplish — the real goal beneath the surface?',
        hint: 'People don\'t buy drills, they buy holes. What\'s the hole here?',
        tag: 'Core Job'
      },
      {
        text: 'What situation or trigger creates the need for this solution in the first place?',
        hint: 'What had to happen in someone\'s life/day/workflow before they reached for this?',
        tag: 'Trigger Situation'
      },
      {
        text: 'What do people do TODAY — without your solution — to get this job done?',
        hint: 'Your real competition isn\'t what you think. It\'s the workaround.',
        tag: 'Current Solution'
      },
      {
        text: 'What are the functional, emotional, and social needs wrapped up in this job?',
        hint: 'Functional: what it does. Emotional: how it makes you feel. Social: how it makes others see you.',
        tag: 'Need Dimensions'
      },
      {
        text: 'How does the person know when the job is complete? What does "done" look like?',
        hint: 'Success criteria matter. If you can\'t define done, you can\'t design for it.',
        tag: 'Definition of Done'
      },
      {
        text: 'What tradeoffs are people willing to make — and unwilling to make — to get this job done?',
        hint: 'Every solution involves sacrifice. What will people tolerate? What\'s a dealbreaker?',
        tag: 'Tradeoffs'
      }
    ]
  }
};

// ── App State ──────────────────────────────────

const state = {
  screen: 'welcome',
  problem: '',
  framework: null,
  currentQ: 0,
  answers: [],      // Array of { text: string, isInsight: boolean }
  timer: 0,
  timerInterval: null,
  startTime: null
};

// ── Screen management ──────────────────────────

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  state.screen = name;
}

// ── Welcome ────────────────────────────────────

document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('setup');
});

// ── Setup ──────────────────────────────────────

const problemInput = document.getElementById('problem-input');
const charCount   = document.getElementById('char-count');
const btnBegin    = document.getElementById('btn-begin');

problemInput.addEventListener('input', () => {
  const len = problemInput.value.length;
  charCount.textContent = Math.min(len, 500);
  if (len > 500) problemInput.value = problemInput.value.slice(0, 500);
  updateBeginBtn();
});

// Framework cards
document.querySelectorAll('.fw-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.fw-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.framework = card.dataset.framework;
    updateBeginBtn();
  });
});

function updateBeginBtn() {
  btnBegin.disabled = !(problemInput.value.trim().length >= 10 && state.framework);
}

document.getElementById('btn-back-setup').addEventListener('click', () => {
  showScreen('welcome');
});

document.getElementById('btn-begin').addEventListener('click', () => {
  state.problem = problemInput.value.trim();
  state.currentQ = 0;
  state.answers = FRAMEWORKS[state.framework].questions.map(() => ({ text: '', isInsight: false }));
  state.timer = 0;
  state.startTime = Date.now();
  initSession();
  showScreen('session');
  startTimer();
});

// ── Session ────────────────────────────────────

function initSession() {
  const fw = FRAMEWORKS[state.framework];

  // Sidebar
  document.getElementById('sidebar-fw-icon').textContent = fw.icon;
  document.getElementById('sidebar-fw-name').textContent = fw.name;
  document.getElementById('sidebar-problem').textContent = state.problem;

  // Build dots
  const dotsEl = document.getElementById('sidebar-dots');
  dotsEl.innerHTML = '';
  fw.questions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.textContent = i + 1;
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      saveCurrentAnswer();
      state.currentQ = i;
      renderQuestion();
    });
    dotsEl.appendChild(dot);
  });

  renderQuestion();
}

function renderQuestion(direction = 'forward') {
  const fw = FRAMEWORKS[state.framework];
  const q  = fw.questions[state.currentQ];
  const a  = state.answers[state.currentQ];

  // Animate out
  const qCard = document.querySelector('.question-card');
  qCard.classList.remove('question-enter');
  qCard.classList.add('question-exit');

  setTimeout(() => {
    qCard.classList.remove('question-exit');

    // Update content
    document.getElementById('q-step').textContent  = `Question ${state.currentQ + 1} of ${fw.questions.length}`;
    document.getElementById('q-tag').textContent   = q.tag;
    document.getElementById('question-text').textContent = q.text;
    document.getElementById('thinking-hint').textContent = `💭 ${q.hint}`;

    const answerEl = document.getElementById('answer-input');
    answerEl.value = a.text;
    updateWordCount();

    // Insight button state
    const insightBtn = document.getElementById('btn-insight');
    insightBtn.classList.toggle('active', a.isInsight);
    insightBtn.textContent = a.isInsight ? '⚡ Insight Marked' : '⚡ Mark Insight';

    // Next/prev buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    btnPrev.disabled = state.currentQ === 0;

    const isLast = state.currentQ === fw.questions.length - 1;
    btnNext.textContent = isLast ? 'Finish Session' : 'Next Question';
    btnNext.innerHTML   = isLast
      ? 'Finish Session <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      : 'Next Question <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btnNext.classList.toggle('finish', isLast);

    // Progress
    const answered = state.answers.filter(a => a.text.trim().length > 0).length;
    document.getElementById('progress-fill').style.width = `${(answered / fw.questions.length) * 100}%`;
    document.getElementById('progress-text').textContent = `${answered} / ${fw.questions.length}`;

    // Dots
    updateDots();

    // Animate in
    qCard.classList.add('question-enter');
    answerEl.focus();
  }, 220);
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.remove('current', 'answered', 'has-insight');
    if (i === state.currentQ) {
      dot.classList.add('current');
    } else if (state.answers[i]?.isInsight) {
      dot.classList.add('has-insight');
    } else if (state.answers[i]?.text.trim().length > 0) {
      dot.classList.add('answered');
    }
  });
}

function saveCurrentAnswer() {
  state.answers[state.currentQ].text = document.getElementById('answer-input').value;
}

function updateWordCount() {
  const text = document.getElementById('answer-input').value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  document.getElementById('answer-words').textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

document.getElementById('answer-input').addEventListener('input', () => {
  state.answers[state.currentQ].text = document.getElementById('answer-input').value;
  updateWordCount();
  updateProgress();
});

function updateProgress() {
  const fw = FRAMEWORKS[state.framework];
  const answered = state.answers.filter(a => a.text.trim().length > 0).length;
  document.getElementById('progress-fill').style.width = `${(answered / fw.questions.length) * 100}%`;
  document.getElementById('progress-text').textContent = `${answered} / ${fw.questions.length}`;
  updateDots();
}

// Insight toggle
document.getElementById('btn-insight').addEventListener('click', () => {
  state.answers[state.currentQ].isInsight = !state.answers[state.currentQ].isInsight;
  const btn = document.getElementById('btn-insight');
  btn.classList.toggle('active', state.answers[state.currentQ].isInsight);
  btn.textContent = state.answers[state.currentQ].isInsight ? '⚡ Insight Marked' : '⚡ Mark Insight';
  updateDots();
  showToast(state.answers[state.currentQ].isInsight ? 'Marked as key insight ⚡' : 'Insight removed');
});

// Navigation
document.getElementById('btn-prev').addEventListener('click', () => {
  if (state.currentQ > 0) {
    saveCurrentAnswer();
    state.currentQ--;
    renderQuestion('backward');
  }
});

document.getElementById('btn-next').addEventListener('click', () => {
  saveCurrentAnswer();
  const fw = FRAMEWORKS[state.framework];
  if (state.currentQ < fw.questions.length - 1) {
    state.currentQ++;
    renderQuestion('forward');
  } else {
    finishSession();
  }
});

document.getElementById('btn-back-session').addEventListener('click', () => {
  saveCurrentAnswer();
  stopTimer();
  showScreen('setup');
});

// ── Timer ──────────────────────────────────────

function startTimer() {
  state.timerInterval = setInterval(() => {
    state.timer++;
    const m = Math.floor(state.timer / 60);
    const s = state.timer % 60;
    document.getElementById('timer-display').textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

// ── Summary ────────────────────────────────────

function finishSession() {
  stopTimer();
  buildSummary();
  showScreen('summary');
}

function buildSummary() {
  const fw = FRAMEWORKS[state.framework];
  const m  = Math.floor(state.timer / 60);
  const s  = state.timer % 60;
  const answered = state.answers.filter(a => a.text.trim().length > 0).length;

  document.getElementById('summary-meta').innerHTML =
    `<strong>${fw.icon} ${fw.name}</strong> · ${answered} of ${fw.questions.length} answered · ${m}m ${s}s`;

  // Insights block
  const insights = state.answers
    .map((a, i) => ({ ...a, i }))
    .filter(a => a.isInsight && a.text.trim());

  const insightsEl = document.getElementById('summary-insights');
  if (insights.length > 0) {
    insightsEl.innerHTML = `<h3>Key Insights</h3>`;
    insights.forEach(ins => {
      const div = document.createElement('div');
      div.className = 'insight-item';
      div.textContent = ins.text;
      insightsEl.appendChild(div);
    });
  } else {
    insightsEl.innerHTML = `<h3>Key Insights</h3><p class="no-insights">No insights marked — use ⚡ during a session to highlight key answers.</p>`;
  }

  // Q&A block
  const qaEl = document.getElementById('summary-qa');
  qaEl.innerHTML = '';
  fw.questions.forEach((q, i) => {
    const a = state.answers[i];
    const div = document.createElement('div');
    div.className = `qa-item${a.isInsight ? ' has-insight' : ''}`;

    div.innerHTML = `
      ${a.isInsight ? '<span class="qa-insight-tag">⚡ Key Insight</span>' : ''}
      <div class="qa-q">
        <span class="qa-q-num">${i + 1}</span>
        ${q.tag}
      </div>
      <div class="qa-question">${q.text}</div>
      ${a.text.trim()
        ? `<div class="qa-answer">${escapeHtml(a.text.trim())}</div>`
        : `<div class="qa-empty">No answer recorded.</div>`}
    `;
    qaEl.appendChild(div);
  });
}

document.getElementById('btn-new-session').addEventListener('click', () => {
  // Reset state
  state.framework = null;
  state.answers   = [];
  state.currentQ  = 0;
  state.timer     = 0;
  state.problem   = '';

  // Reset UI
  problemInput.value = '';
  charCount.textContent = '0';
  document.querySelectorAll('.fw-card').forEach(c => c.classList.remove('selected'));
  btnBegin.disabled = true;

  showScreen('setup');
});

// ── Export ─────────────────────────────────────

document.getElementById('btn-export').addEventListener('click', () => {
  const fw = FRAMEWORKS[state.framework];
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const m = Math.floor(state.timer / 60);
  const s = state.timer % 60;
  const answered = state.answers.filter(a => a.text.trim().length > 0).length;

  const insights = state.answers
    .map((a, i) => ({ ...a, i }))
    .filter(a => a.isInsight && a.text.trim());

  let md = `# Thinking Session — ${fw.name}\n\n`;
  md += `**Date:** ${date}  \n`;
  md += `**Framework:** ${fw.icon} ${fw.name}  \n`;
  md += `**Duration:** ${m}m ${s}s  \n`;
  md += `**Questions answered:** ${answered} / ${fw.questions.length}  \n\n`;
  md += `---\n\n`;
  md += `## Challenge\n\n${state.problem}\n\n`;
  md += `---\n\n`;

  if (insights.length > 0) {
    md += `## ⚡ Key Insights\n\n`;
    insights.forEach(ins => {
      md += `- ${ins.text}\n`;
    });
    md += `\n---\n\n`;
  }

  md += `## Questions & Answers\n\n`;
  fw.questions.forEach((q, i) => {
    const a = state.answers[i];
    md += `### ${i + 1}. ${q.text}\n`;
    md += `*${q.tag}*\n\n`;
    md += a.text.trim() ? `${a.text.trim()}\n\n` : `*No answer recorded.*\n\n`;
  });

  md += `---\n\n*Generated by Thinking Partner · Shravan Parlapally's UX Toolkit*\n`;

  const blob = new Blob([md], { type: 'text/markdown' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `thinking-session-${state.framework}-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Session exported as Markdown ✓');
});

// ── Utilities ──────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (state.screen !== 'session') return;
  if (e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    document.getElementById('btn-next').click();
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    document.getElementById('btn-prev').click();
  }
  if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    document.getElementById('btn-insight').click();
  }
});

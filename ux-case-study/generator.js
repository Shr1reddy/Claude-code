/* ── UX Case Study Generator — Claude-Powered Logic ── */
(function () {
  'use strict';

  const STORAGE_KEY = 'ux-case-study-draft';
  const API_KEY_STORAGE = 'ux-generator-api-key';
  const MODEL = 'claude-sonnet-4-6';

  let lastGeneratedData = null;

  // ── Restore saved API key ──
  const savedKey = localStorage.getItem(API_KEY_STORAGE);
  if (savedKey) document.getElementById('apiKey').value = savedKey;

  // ── Toggle optional section ──
  window.toggleOptional = function () {
    const toggle = document.getElementById('optionalToggle');
    const body = document.getElementById('optionalBody');
    toggle.classList.toggle('open');
    body.classList.toggle('open');
  };

  // ── Toggle API key visibility ──
  window.toggleApiKeyVisibility = function () {
    const input = document.getElementById('apiKey');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
      input.type = 'text';
      icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      input.type = 'password';
      icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  };

  // ── Pillar definitions ──
  const PILLARS = [
    { num: '01', label: 'Problem Statement',       icon: '⚡' },
    { num: '02', label: 'Research & Discovery',    icon: '🔍' },
    { num: '03', label: 'Key Insights',            icon: '💡' },
    { num: '04', label: 'Design Process',          icon: '🔄' },
    { num: '05', label: 'Solution & Final Design', icon: '✦' },
    { num: '06', label: 'AI Design Decisions',     icon: '🤖' },
    { num: '07', label: 'Accessibility',           icon: '♿' },
    { num: '08', label: 'Results & Impact',        icon: '📈' },
    { num: '09', label: 'Reflections & Learnings', icon: '🪞' },
    { num: '10', label: 'Cover & Metadata',        icon: '🎨' },
  ];

  // ── Build Claude prompt ──
  function buildPrompt(inputs) {
    return `You are an expert UX designer and technical writer. Generate a complete, professional UX case study based on the inputs below.

Return ONLY valid JSON — no markdown fences, no commentary, no extra keys. The JSON must use exactly these keys:

{
  "cover-type": "Product Design Case Study",
  "cover-year": "2026",
  "cover-title": "Compelling project title",
  "cover-subtitle": "One compelling sentence summarising the project and measurable impact",
  "cover-role": "${inputs.role || 'Lead Product Designer'}",
  "cover-timeline": "${inputs.timeline || 'Infer a realistic timeline'}",
  "cover-team": "${inputs.team || 'Infer a realistic team size'}",
  "cover-tools": "${inputs.tools || 'Figma, user research tools, analytics'}",

  "problem-title": "Problem Statement",
  "problem-body": "<p>First paragraph describing the problem context and who it affects.</p><p>Second paragraph describing business impact and urgency.</p>",
  "problem-kpi1-val": "XX%",
  "problem-kpi1-label": "Relevant before-state metric",
  "problem-kpi2-val": "X.X",
  "problem-kpi2-label": "Relevant before-state metric",
  "problem-kpi3-val": "XX%",
  "problem-kpi3-label": "Relevant before-state metric",

  "research-title": "Research & Discovery",
  "research-body": "<p>Overview of research approach and what you were trying to learn.</p>",
  "method1-title": "Method name",
  "method1-desc": "Specific description of method, sample size, what you learned",
  "method2-title": "Method name",
  "method2-desc": "Specific description",
  "method3-title": "Method name",
  "method3-desc": "Specific description",
  "method4-title": "Method name",
  "method4-desc": "Specific description",

  "insights-title": "Key Insights",
  "insights-body": "<p>Brief framing of the core themes that emerged.</p>",
  "insight1-title": "Short punchy insight title",
  "insight1-desc": "Two-sentence description of the insight and its implication for design.",
  "insight2-title": "Short punchy insight title",
  "insight2-desc": "Two-sentence description.",
  "insight3-title": "Short punchy insight title",
  "insight3-desc": "Two-sentence description.",

  "process-title": "Design Process",
  "process-body": "<p>Brief description of the overall design approach or framework used.</p>",
  "phase1-title": "Phase 1 title with timeframe",
  "phase1-desc": "Activities, deliverables, key decisions in this phase",
  "phase2-title": "Phase 2 title with timeframe",
  "phase2-desc": "Activities, deliverables, key decisions",
  "phase3-title": "Phase 3 title with timeframe",
  "phase3-desc": "Activities, deliverables, key decisions",
  "phase4-title": "Phase 4 title with timeframe",
  "phase4-desc": "Activities, deliverables, key decisions",

  "solution-title": "Solution — Final Design",
  "solution-body": "<p>Description of the final solution, what makes it work, and the design decisions that shaped it. Use <strong>bold</strong> for key concepts. Two to three paragraphs.</p>",

  "ai-title": "AI & Smart Design Decisions",
  "ai-body": "Brief overview of intelligent or data-driven design choices made.",
  "ai-dec1-title": "Decision title",
  "ai-dec1-desc": "Description of the decision, the tradeoff considered, and why this choice was made.",
  "ai-dec2-title": "Decision title",
  "ai-dec2-desc": "Description.",
  "ai-dec3-title": "Decision title",
  "ai-dec3-desc": "Description.",
  "ai-dec4-title": "Decision title",
  "ai-dec4-desc": "Description.",

  "a11y-title": "Accessibility & Inclusive Design",
  "a11y-body": "<p>Description of accessibility considerations, standards followed (WCAG), assistive tech tested, inclusive design decisions made, and any specific user groups accommodated.</p>",

  "results-title": "Results & Impact",
  "results-body": "<p>Context for the results — how they were measured, timeframe, and overall narrative of success.</p>",
  "result1-before": "before value",
  "result1-after": "after value",
  "result1-metric": "Metric name",
  "result2-before": "before value",
  "result2-after": "after value",
  "result2-metric": "Metric name",
  "result3-before": "before value",
  "result3-after": "after value",
  "result3-metric": "Metric name",
  "result4-before": "before value",
  "result4-after": "after value",
  "result4-metric": "Metric name",
  "results-quote": "A realistic user or stakeholder testimonial quote about the impact",
  "results-cite": "— First Name, Role",

  "reflections-title": "Reflections & Learnings",
  "reflections-body": "<p><strong>What worked well:</strong> Specific things that went right and why.</p><p><strong>What I'd do differently:</strong> Honest reflection on what could have been better.</p><p><strong>Next steps:</strong> Concrete follow-on work to build on this foundation.</p>"
}

Inputs:
PROBLEM: ${inputs.problem}

CONSTRAINTS: ${inputs.constraints}

KEY DESIGN DECISIONS: ${inputs.decisions}

${inputs.context ? `ADDITIONAL CONTEXT: ${inputs.context}` : ''}

Rules:
- Be specific, concrete, and professional. Use realistic numbers and plausible details.
- Mirror the domain and scale of the problem (e.g. consumer app vs enterprise tool).
- The metrics should be credible — improvements between 20–60% are typical for UX redesigns.
- The testimonial quote should sound like a real person said it.
- All HTML in body fields uses only <p>, <strong>, <em>, <ul>, <li> tags.
- Return ONLY the JSON object.`;
  }

  // ── Show error ──
  function showError(msg) {
    const banner = document.getElementById('errorBanner');
    banner.textContent = msg;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 8000);
  }

  // ── Build progress pillars UI ──
  function buildProgressUI() {
    const container = document.getElementById('progressPillars');
    container.innerHTML = PILLARS.map((p, i) => `
      <div class="pillar-progress" id="pp-${i}">
        <div class="pillar-progress-icon" id="pp-icon-${i}">${p.icon}</div>
        <span class="pillar-progress-label">${p.num} — ${p.label}</span>
        <svg class="pillar-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
    `).join('');
  }

  function activatePillar(index) {
    const el = document.getElementById(`pp-${index}`);
    if (el) el.classList.add('active');
  }

  function completePillar(index) {
    const el = document.getElementById(`pp-${index}`);
    if (el) {
      el.classList.remove('active');
      el.classList.add('done');
    }
  }

  // ── Streaming API call ──
  async function callClaude(apiKey, prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      let errMsg = `API error ${response.status}`;
      try {
        const err = await response.json();
        errMsg = err.error?.message || errMsg;
      } catch (_) {}
      throw new Error(errMsg);
    }

    return response;
  }

  // ── Stream reader — collects full text and streams display ──
  async function readStream(response, onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            const text = parsed.delta.text;
            fullText += text;
            onChunk(text, fullText);
          }
        } catch (_) {}
      }
    }

    return fullText;
  }

  // ── Animate thinking text ──
  let thinkingInterval = null;
  function startThinkingAnimation(fullTextRef) {
    const el = document.getElementById('thinkingText');
    let displayed = 0;
    thinkingInterval = setInterval(() => {
      if (displayed < fullTextRef.current.length) {
        // Show last 400 chars to keep it scrolling
        const text = fullTextRef.current;
        const show = text.slice(Math.max(0, text.length - 400));
        el.textContent = show;
        const box = document.getElementById('thinkingBox');
        box.scrollTop = box.scrollHeight;
        displayed = text.length;
      }
    }, 80);
  }

  // ── Simulate pillar progress during streaming ──
  function simulatePillarProgress(totalMs) {
    const perPillar = totalMs / PILLARS.length;
    PILLARS.forEach((_, i) => {
      setTimeout(() => activatePillar(i), i * perPillar);
      setTimeout(() => completePillar(i), (i + 0.85) * perPillar);
    });
  }

  // ── Parse and render results ──
  function renderResults(data) {
    lastGeneratedData = data;

    document.getElementById('resultsCaseTitle').textContent = data['cover-title'] || 'Your Case Study';
    document.getElementById('resultsSub').textContent =
      `${data['cover-role'] || 'Designer'} · ${data['cover-timeline'] || ''} · ${data['cover-tools'] || ''}`.replace(/ · $/,'').replace(/^ · /,'');

    const grid = document.getElementById('pillarsGrid');
    grid.innerHTML = '';

    const cards = [
      {
        num: '01', name: 'Problem Statement',
        html: `
          <div class="pillar-preview">${data['problem-body'] || ''}</div>
          <div class="pillar-chips">
            ${data['problem-kpi1-val'] ? `<span class="chip amber">${data['problem-kpi1-val']} ${data['problem-kpi1-label'] || ''}</span>` : ''}
            ${data['problem-kpi2-val'] ? `<span class="chip amber">${data['problem-kpi2-val']} ${data['problem-kpi2-label'] || ''}</span>` : ''}
            ${data['problem-kpi3-val'] ? `<span class="chip amber">${data['problem-kpi3-val']} ${data['problem-kpi3-label'] || ''}</span>` : ''}
          </div>`
      },
      {
        num: '02', name: 'Research & Discovery',
        html: `
          <div class="pillar-preview">${data['research-body'] || ''}</div>
          <div class="pillar-chips">
            ${[1,2,3,4].filter(n => data[`method${n}-title`]).map(n =>
              `<span class="chip">${data[`method${n}-title`]}</span>`
            ).join('')}
          </div>`
      },
      {
        num: '03', name: 'Key Insights',
        html: `
          <div class="pillar-preview">
            ${[1,2,3].filter(n => data[`insight${n}-title`]).map(n =>
              `<p><strong>${data[`insight${n}-title`]}</strong> — ${data[`insight${n}-desc`] || ''}</p>`
            ).join('')}
          </div>`
      },
      {
        num: '04', name: 'Design Process',
        html: `
          <div class="pillar-preview">
            ${[1,2,3,4].filter(n => data[`phase${n}-title`]).map(n =>
              `<p><strong>${data[`phase${n}-title`]}</strong> — ${data[`phase${n}-desc`] || ''}</p>`
            ).join('')}
          </div>`
      },
      {
        num: '05', name: 'Solution & Final Design',
        html: `<div class="pillar-preview">${data['solution-body'] || ''}</div>`
      },
      {
        num: '06', name: 'AI Design Decisions',
        html: `
          <div class="pillar-preview">
            ${[1,2,3,4].filter(n => data[`ai-dec${n}-title`]).map(n =>
              `<p><strong>${data[`ai-dec${n}-title`]}</strong> — ${data[`ai-dec${n}-desc`] || ''}</p>`
            ).join('')}
          </div>`
      },
      {
        num: '07', name: 'Accessibility',
        html: `<div class="pillar-preview">${data['a11y-body'] || ''}</div>`
      },
      {
        num: '08', name: 'Results & Impact',
        html: `
          <div class="pillar-preview">${data['results-body'] || ''}</div>
          <div class="metric-row">
            ${[1,2,3,4].filter(n => data[`result${n}-metric`]).map(n => `
              <div class="metric-chip">
                <span class="metric-before">${data[`result${n}-before`] || ''}</span>
                <span class="metric-arrow">→</span>
                <span class="metric-after">${data[`result${n}-after`] || ''}</span>
                <span class="metric-label">${data[`result${n}-metric`]}</span>
              </div>`
            ).join('')}
          </div>
          ${data['results-quote'] ? `<blockquote style="margin-top:12px;padding:10px 14px;border-left:3px solid var(--accent);font-style:italic;font-size:0.8rem;color:var(--text-2);background:var(--accent-light);border-radius:0 8px 8px 0;">"${data['results-quote']}" <cite style="font-style:normal;display:block;margin-top:4px;font-size:0.72rem;color:var(--text-3)">${data['results-cite'] || ''}</cite></blockquote>` : ''}`
      },
      {
        num: '09', name: 'Reflections & Learnings',
        html: `<div class="pillar-preview">${data['reflections-body'] || ''}</div>`
      },
      {
        num: '10', name: 'Cover & Metadata',
        html: `
          <div class="pillar-preview">
            <p><strong>${data['cover-title'] || ''}</strong></p>
            <p>${data['cover-subtitle'] || ''}</p>
          </div>
          <div class="pillar-chips">
            ${data['cover-role'] ? `<span class="chip">${data['cover-role']}</span>` : ''}
            ${data['cover-timeline'] ? `<span class="chip">${data['cover-timeline']}</span>` : ''}
            ${data['cover-tools'] ? `<span class="chip">${data['cover-tools']}</span>` : ''}
          </div>`
      },
    ];

    cards.forEach((card, i) => {
      const el = document.createElement('div');
      el.className = 'pillar-card';
      el.style.animationDelay = `${i * 60}ms`;
      el.innerHTML = `
        <div class="pillar-card-header">
          <div class="pillar-card-num">${card.num}</div>
          <span class="pillar-card-name">${card.name}</span>
        </div>
        <div class="pillar-card-body">${card.html}</div>
      `;
      grid.appendChild(el);
    });
  }

  // ── Main generate function ──
  window.generate = async function () {
    const apiKey = document.getElementById('apiKey').value.trim();
    const problem = document.getElementById('problem').value.trim();
    const constraints = document.getElementById('constraints').value.trim();
    const decisions = document.getElementById('decisions').value.trim();

    // Validation
    if (!apiKey) { showError('Please enter your Claude API key.'); return; }
    if (!apiKey.startsWith('sk-ant-')) { showError('That doesn\'t look like a valid Anthropic API key. It should start with sk-ant-.'); return; }
    if (!problem) { showError('Please describe the problem your project solved.'); return; }
    if (!constraints) { showError('Please describe the constraints you worked within.'); return; }
    if (!decisions) { showError('Please describe your key design decisions.'); return; }

    // Save API key
    localStorage.setItem(API_KEY_STORAGE, apiKey);

    const inputs = {
      problem, constraints, decisions,
      role: document.getElementById('role').value.trim(),
      timeline: document.getElementById('timeline').value.trim(),
      team: document.getElementById('team').value.trim(),
      tools: document.getElementById('tools').value.trim(),
      context: document.getElementById('context')?.value.trim() || '',
    };

    // UI: switch to generating state
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultsView').classList.remove('active');
    document.getElementById('generatingView').classList.add('active');
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('thinkingText').textContent = '';

    buildProgressUI();

    const statusEl = document.getElementById('genStatusText');
    statusEl.textContent = 'Calling Claude';

    try {
      const prompt = buildPrompt(inputs);
      const response = await callClaude(apiKey, prompt);

      statusEl.textContent = 'Writing';

      // Track accumulated text via ref object (mutable for closure)
      const textRef = { current: '' };
      startThinkingAnimation(textRef);

      // Estimate ~15s total — simulate pillar progress visually
      simulatePillarProgress(14000);

      const fullText = await readStream(response, (chunk, accumulated) => {
        textRef.current = accumulated;
      });

      // Stop animations
      clearInterval(thinkingInterval);
      PILLARS.forEach((_, i) => completePillar(i));
      statusEl.textContent = 'Done';

      // Parse JSON
      let data;
      try {
        // Extract JSON from response (handle any surrounding text)
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON object found in response.');
        data = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        throw new Error('Claude returned malformed JSON. Try regenerating. (' + parseErr.message + ')');
      }

      // Small delay then show results
      await new Promise(r => setTimeout(r, 600));

      document.getElementById('generatingView').classList.remove('active');
      document.getElementById('resultsView').classList.add('active');
      renderResults(data);

    } catch (err) {
      clearInterval(thinkingInterval);
      document.getElementById('generatingView').classList.remove('active');
      document.getElementById('emptyState').style.display = 'flex';
      showError('Generation failed: ' + err.message);
      console.error(err);
    } finally {
      document.getElementById('generateBtn').disabled = false;
    }
  };

  // ── Regenerate ──
  window.regenerate = function () {
    document.getElementById('resultsView').classList.remove('active');
    document.getElementById('emptyState').style.display = 'flex';
    lastGeneratedData = null;
    // Scroll to top of output panel
    document.getElementById('outputPanel').scrollTop = 0;
  };

  // ── Open in Builder ──
  window.openInBuilder = function () {
    if (!lastGeneratedData) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastGeneratedData));
    window.location.href = 'index.html';
  };

  // ── Allow Enter key on inputs to jump to next field ──
  document.querySelectorAll('.field-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const all = [...document.querySelectorAll('.field-input, .field-textarea, .btn-generate')];
        const idx = all.indexOf(input);
        if (idx !== -1 && all[idx + 1]) all[idx + 1].focus();
      }
    });
  });

})();

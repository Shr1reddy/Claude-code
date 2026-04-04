/* ── UX Case Study Builder — App Logic ── */
(function () {
  'use strict';

  const STORAGE_KEY = 'ux-case-study-draft';

  // ── Export dropdown toggle ──
  const exportBtn = document.getElementById('exportBtn');
  const exportMenu = document.getElementById('exportMenu');
  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => exportMenu.classList.remove('open'));

  // ── Preview mode toggle ──
  window.togglePreview = function () {
    document.body.classList.toggle('preview-mode');
    const btn = document.getElementById('previewToggle');
    const isPreview = document.body.classList.contains('preview-mode');
    btn.innerHTML = isPreview
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Edit'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Preview';
  };

  // ── Image upload handling ──
  const imageInput = document.getElementById('imageInput');
  let activeImageSlot = null;

  document.querySelectorAll('.image-upload-area').forEach(area => {
    area.addEventListener('click', () => {
      activeImageSlot = area;
      imageInput.click();
    });

    // Drag & drop
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = '#4f46e5'; });
    area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        insertImage(area, file);
      }
    });
  });

  imageInput.addEventListener('change', () => {
    if (imageInput.files[0] && activeImageSlot) {
      insertImage(activeImageSlot, imageInput.files[0]);
      imageInput.value = '';
    }
  });

  function insertImage(slot, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Remove old image if exists
      const existing = slot.querySelector('img');
      if (existing) existing.remove();

      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Case study image';
      slot.appendChild(img);
      slot.classList.add('has-image');
      triggerAutosave();
    };
    reader.readAsDataURL(file);
  }

  // ── Gather all editable data ──
  function gatherData() {
    const data = {};
    document.querySelectorAll('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (el.classList.contains('image-upload-area')) {
        const img = el.querySelector('img');
        data[field] = img ? img.src : null;
      } else if (el.classList.contains('richtext')) {
        data[field] = el.innerHTML;
      } else {
        data[field] = el.textContent;
      }
    });
    return data;
  }

  // ── Restore data ──
  function restoreData(data) {
    Object.entries(data).forEach(([field, value]) => {
      const el = document.querySelector(`[data-field="${field}"]`);
      if (!el || !value) return;

      if (el.classList.contains('image-upload-area')) {
        if (value.startsWith('data:image')) {
          const img = document.createElement('img');
          img.src = value;
          img.alt = 'Case study image';
          el.appendChild(img);
          el.classList.add('has-image');
        }
      } else if (el.classList.contains('richtext')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
  }

  // ── Save / Load ──
  window.saveProject = function () {
    const data = gatherData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showSaveBadge('Saved!');

    // Also download as backup JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ux-case-study-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  window.loadProject = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          restoreData(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          showSaveBadge('Loaded!');
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ── Autosave ──
  let autosaveTimer = null;
  function triggerAutosave() {
    const badge = document.getElementById('autosaveBadge');
    badge.textContent = 'Saving...';
    badge.classList.add('saving');

    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      const data = gatherData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showSaveBadge('Saved');
    }, 1500);
  }

  function showSaveBadge(text) {
    const badge = document.getElementById('autosaveBadge');
    badge.textContent = text;
    badge.classList.remove('saving');
    setTimeout(() => { badge.textContent = 'Saved'; }, 2000);
  }

  // Listen for editable changes
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('editable') || e.target.closest('.editable')) {
      triggerAutosave();
    }
  });

  // ── Load saved draft on page load ──
  const savedDraft = localStorage.getItem(STORAGE_KEY);
  if (savedDraft) {
    try { restoreData(JSON.parse(savedDraft)); } catch (e) {}
  }

  // ── Export as PDF ──
  window.exportPDF = function () {
    exportMenu.classList.remove('open');
    // Enter preview mode for clean export
    document.body.classList.add('preview-mode');

    setTimeout(() => {
      window.print();
      // User can cancel or complete — leave preview mode after a moment
      setTimeout(() => document.body.classList.remove('preview-mode'), 1000);
    }, 300);
  };

  // ── Export as Word (.docx) ──
  window.exportWord = function () {
    exportMenu.classList.remove('open');
    const data = gatherData();
    const title = data['cover-title'] || 'UX Case Study';

    // Build HTML that Word can import
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Calibri, Arial, sans-serif; color: #1a1a1a; max-width: 700px; margin: 0 auto; line-height: 1.7; }
          h1 { font-size: 28pt; color: #4f46e5; margin-bottom: 8pt; }
          h2 { font-size: 18pt; color: #4f46e5; margin-top: 24pt; margin-bottom: 8pt; border-bottom: 2px solid #e0e7ff; padding-bottom: 6pt; }
          h3 { font-size: 14pt; margin-top: 16pt; }
          p { font-size: 11pt; margin-bottom: 8pt; }
          .meta { font-size: 10pt; color: #666; margin-bottom: 4pt; }
          .kpi { display: inline-block; padding: 8pt 16pt; margin: 4pt 8pt 4pt 0; background: #f0f0f3; border-radius: 8pt; text-align: center; }
          .kpi-val { font-size: 20pt; font-weight: bold; color: #4f46e5; }
          .kpi-label { font-size: 9pt; color: #666; }
          .insight { padding: 12pt; margin: 8pt 0; border-left: 4pt solid #4f46e5; background: #fafafa; }
          .result { display: inline-block; padding: 12pt; margin: 4pt; background: #d1fae5; border-radius: 8pt; text-align: center; min-width: 140pt; }
          .result-val { font-size: 18pt; font-weight: bold; color: #059669; }
          blockquote { border-left: 4pt solid #4f46e5; padding: 12pt 16pt; background: #e0e7ff; font-style: italic; margin: 16pt 0; }
        </style>
      </head>
      <body>
        <p class="meta">${data['cover-type'] || 'Case Study'} — ${data['cover-year'] || '2026'}</p>
        <h1>${title}</h1>
        <p>${data['cover-subtitle'] || ''}</p>
        <p class="meta"><strong>Role:</strong> ${data['cover-role'] || ''} &nbsp; <strong>Timeline:</strong> ${data['cover-timeline'] || ''} &nbsp; <strong>Team:</strong> ${data['cover-team'] || ''} &nbsp; <strong>Tools:</strong> ${data['cover-tools'] || ''}</p>
        <hr>

        <h2>01 — Problem Statement</h2>
        ${data['problem-body'] || '<p></p>'}
        <div>
          <span class="kpi"><span class="kpi-val">${data['problem-kpi1-val'] || ''}</span><br><span class="kpi-label">${data['problem-kpi1-label'] || ''}</span></span>
          <span class="kpi"><span class="kpi-val">${data['problem-kpi2-val'] || ''}</span><br><span class="kpi-label">${data['problem-kpi2-label'] || ''}</span></span>
          <span class="kpi"><span class="kpi-val">${data['problem-kpi3-val'] || ''}</span><br><span class="kpi-label">${data['problem-kpi3-label'] || ''}</span></span>
        </div>

        <h2>02 — Research &amp; Discovery</h2>
        ${data['research-body'] || '<p></p>'}
        <p><strong>${data['method1-title'] || ''}:</strong> ${data['method1-desc'] || ''}</p>
        <p><strong>${data['method2-title'] || ''}:</strong> ${data['method2-desc'] || ''}</p>
        <p><strong>${data['method3-title'] || ''}:</strong> ${data['method3-desc'] || ''}</p>
        <p><strong>${data['method4-title'] || ''}:</strong> ${data['method4-desc'] || ''}</p>

        <h2>03 — Key Insights</h2>
        ${data['insights-body'] || '<p></p>'}
        <div class="insight"><strong>${data['insight1-title'] || ''}</strong><br>${data['insight1-desc'] || ''}</div>
        <div class="insight"><strong>${data['insight2-title'] || ''}</strong><br>${data['insight2-desc'] || ''}</div>
        <div class="insight"><strong>${data['insight3-title'] || ''}</strong><br>${data['insight3-desc'] || ''}</div>

        <h2>04 — Design Process</h2>
        ${data['process-body'] || '<p></p>'}
        <p><strong>${data['phase1-title'] || ''}:</strong> ${data['phase1-desc'] || ''}</p>
        <p><strong>${data['phase2-title'] || ''}:</strong> ${data['phase2-desc'] || ''}</p>
        <p><strong>${data['phase3-title'] || ''}:</strong> ${data['phase3-desc'] || ''}</p>
        <p><strong>${data['phase4-title'] || ''}:</strong> ${data['phase4-desc'] || ''}</p>

        <h2>05 — Solution</h2>
        ${data['solution-body'] || '<p></p>'}

        <h2>06 — AI Design Decisions</h2>
        <p>${data['ai-body'] || ''}</p>
        <div class="insight"><strong>${data['ai-dec1-title'] || ''}:</strong> ${data['ai-dec1-desc'] || ''}</div>
        <div class="insight"><strong>${data['ai-dec2-title'] || ''}:</strong> ${data['ai-dec2-desc'] || ''}</div>
        <div class="insight"><strong>${data['ai-dec3-title'] || ''}:</strong> ${data['ai-dec3-desc'] || ''}</div>
        <div class="insight"><strong>${data['ai-dec4-title'] || ''}:</strong> ${data['ai-dec4-desc'] || ''}</div>

        <h2>07 — Accessibility &amp; Inclusive Design</h2>
        ${data['a11y-body'] || '<p></p>'}

        <h2>08 — Results &amp; Impact</h2>
        ${data['results-body'] || '<p></p>'}
        <div>
          <span class="result"><span class="result-val">${data['result1-before'] || ''} → ${data['result1-after'] || ''}</span><br>${data['result1-metric'] || ''}</span>
          <span class="result"><span class="result-val">${data['result2-before'] || ''} → ${data['result2-after'] || ''}</span><br>${data['result2-metric'] || ''}</span>
          <span class="result"><span class="result-val">${data['result3-before'] || ''} → ${data['result3-after'] || ''}</span><br>${data['result3-metric'] || ''}</span>
          <span class="result"><span class="result-val">${data['result4-before'] || ''} → ${data['result4-after'] || ''}</span><br>${data['result4-metric'] || ''}</span>
        </div>
        <blockquote>${data['results-quote'] || ''}<br><cite>${data['results-cite'] || ''}</cite></blockquote>

        <h2>09 — Reflections</h2>
        ${data['reflections-body'] || '<p></p>'}

        <hr>
        <p><strong>${data['designer-name'] || ''}</strong> — ${data['designer-role'] || ''}</p>
        <p>${data['designer-bio'] || ''}</p>
        <p class="meta">${data['designer-email'] || ''} | ${data['designer-portfolio'] || ''} | ${data['designer-linkedin'] || ''}</p>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export as JSON ──
  window.exportJSON = function () {
    exportMenu.classList.remove('open');
    const data = gatherData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ux-case-study.json';
    a.click();
    URL.revokeObjectURL(url);
  };

})();

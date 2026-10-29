// Databricks Portfolio Application Controller - app.js

document.addEventListener('DOMContentLoaded', () => {
  // A quiet center-page dot field that ripples away from the pointer.
  const dotCanvas = document.getElementById('cursorDotField');
  if (dotCanvas) {
    const dotContext = dotCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dotSpacing = 22;
    let dots = [];
    let width = 0;
    let height = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let framePending = false;

    function resizeDotField() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      dotCanvas.width = Math.round(width * pixelRatio);
      dotCanvas.height = Math.round(height * pixelRatio);
      dotContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      dots = [];
      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
          dots.push({ x, y, offsetX: 0, offsetY: 0 });
        }
      }
      drawDotField();
    }

    function drawDotField() {
      framePending = false;
      dotContext.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const radiusX = width * 0.9;
      const radiusY = height * 0.9;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      let stillMoving = false;

      dots.forEach((dot) => {
        const normalizedX = (dot.x - centerX) / radiusX;
        const normalizedY = (dot.y - centerY) / radiusY;
        const fieldFade = Math.max(0, 1 - Math.hypot(normalizedX, normalizedY));
        const dx = dot.x - pointerX;
        const dy = dot.y - pointerY;
        const distance = Math.hypot(dx, dy);
        const influence = reducedMotion.matches ? 0 : Math.max(0, 1 - distance / 165);
        const push = influence * 28;
        const targetX = distance ? (dx / distance) * push : 0;
        const targetY = distance ? (dy / distance) * push : 0;

        dot.offsetX += (targetX - dot.offsetX) * 0.22;
        dot.offsetY += (targetY - dot.offsetY) * 0.22;
        if (Math.abs(targetX - dot.offsetX) > 0.15 || Math.abs(targetY - dot.offsetY) > 0.15) stillMoving = true;

        if (fieldFade > 0.025) {
          const activeGlow = influence * 0.42;
          dotContext.beginPath();
          dotContext.arc(dot.x + dot.offsetX, dot.y + dot.offsetY, 1.5 + activeGlow, 0, Math.PI * 2);
          dotContext.fillStyle = isDark
            ? `rgba(255, 112, 82, ${(0.3 + activeGlow) * fieldFade})`
            : `rgba(219, 54, 33, ${(0.34 + activeGlow) * fieldFade})`;
          dotContext.fill();
        }
      });

      if (stillMoving && !framePending) {
        framePending = true;
        window.requestAnimationFrame(drawDotField);
      }
    }

    function moveDotField(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(drawDotField);
      }
    }

    window.addEventListener('pointermove', moveDotField, { passive: true });
    window.addEventListener('pointerleave', () => {
      pointerX = -1000;
      pointerY = -1000;
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(drawDotField);
      }
    });
    window.addEventListener('resize', resizeDotField, { passive: true });
    reducedMotion.addEventListener?.('change', drawDotField);
    resizeDotField();
  }

  // Let the decorative technology marks hop to a nearby spot when activated.
  const watermarkIcons = [...document.querySelectorAll('.tech-watermarks img, .tech-watermarks svg')];
  const bubbleHopHandlers = new Map();
  watermarkIcons.forEach((icon) => {
    const iconName = [...icon.classList]
      .find((className) => className.startsWith('watermark-'))
      ?.replace('watermark-', '') || 'technology';
    icon.setAttribute('role', 'button');
    icon.setAttribute('aria-label', `Move ${iconName} background icon`);
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('title', `Click to move ${iconName}`);

    function bubbleHop() {
      if (icon._bubbleHop?.playState === 'running') return;

      const currentX = Number(icon.dataset.bubbleX || 0);
      const currentY = Number(icon.dataset.bubbleY || 0);
      const targetX = Math.round((Math.random() * 2 - 1) * 58);
      const targetY = Math.round((Math.random() * 2 - 1) * 52);
      const arcX = Math.round((Math.random() * 2 - 1) * 22);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof icon.animate !== 'function') {
        icon.dataset.bubbleX = String(targetX);
        icon.dataset.bubbleY = String(targetY);
        icon.style.translate = `${targetX}px ${targetY}px`;
        return;
      }

      icon._bubbleHop = icon.animate([
        { translate: `${currentX}px ${currentY}px`, scale: 1, offset: 0 },
        { translate: `${targetX + arcX}px ${targetY - 34}px`, scale: 1.24, offset: 0.38 },
        { translate: `${targetX}px ${targetY}px`, scale: 1, offset: 1 }
      ], {
        duration: 850,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      });

      icon._bubbleHop.onfinish = () => {
        icon.dataset.bubbleX = String(targetX);
        icon.dataset.bubbleY = String(targetY);
        icon.style.translate = `${targetX}px ${targetY}px`;
        icon._bubbleHop.cancel();
      };
    }

    bubbleHopHandlers.set(icon, bubbleHop);
    icon.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        bubbleHop();
      }
    });
  });

  // The page content is layered above the decorative background, so catch
  // clicks on the icons' visible positions before that content handles them.
  document.addEventListener('click', (event) => {
    if (event.target.closest('a, button, input, textarea, select, [role="button"]')) return;
    const icon = watermarkIcons.find((candidate) => {
      const bounds = candidate.getBoundingClientRect();
      return event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    });
    if (icon) bubbleHopHandlers.get(icon)?.();
  }, true);

  // Ensure PORTFOLIO_DATA is loaded
  if (typeof PORTFOLIO_DATA === 'undefined') {
    console.error('PORTFOLIO_DATA failed to load!');
    return;
  }

  const { profile, skills, projects, notebookPresets, pipelineNodes, experience } = PORTFOLIO_DATA;

  /* -------------------------------------------------------------
     0. Portfolio Mode Switcher (Dev / Recruiter)
  ------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  function arrangePortfolioMode(mode) {
    htmlEl.setAttribute('data-mode', mode);

    const sectionOrder = mode === 'recruiter'
      ? ['experience', 'projects', 'skills', 'notebook', 'architecture', 'terminal']
      : ['notebook', 'architecture', 'projects', 'skills', 'experience', 'terminal'];
    const footer = document.querySelector('.footer');
    sectionOrder.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section && footer) footer.before(section);
    });

    const navOrder = mode === 'recruiter'
      ? ['experience', 'projects', 'skills', 'notebook', 'architecture']
      : ['notebook', 'architecture', 'projects', 'skills', 'experience'];
    const navList = document.querySelector('.nav-links');
    navOrder.forEach((sectionId) => {
      const link = navList?.querySelector(`[data-section-link="${sectionId}"]`);
      if (link) navList.append(link.closest('li'));
    });
  }

  // Dev mode uses the dark theme; Recruiter mode uses the light theme.
  const savedTheme = localStorage.getItem('databricks_theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('databricks_theme', theme);
    arrangePortfolioMode(theme === 'dark' ? 'dev' : 'recruiter');

    if (theme === 'dark') {
      themeToggle.innerHTML = `<i data-lucide="code-2"></i> <span>Dev Mode</span>`;
      themeToggle.title = 'Switch to Recruiter Mode';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      themeToggle.innerHTML = `<i data-lucide="briefcase-business"></i> <span>Recruiter Mode</span>`;
      themeToggle.title = 'Switch to Dev Mode';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
    lucide.createIcons();
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  /* -------------------------------------------------------------
     1. Notebook Playground Controller
  ------------------------------------------------------------- */
  let currentPreset = 'pyspark';

  const tabPySpark = document.getElementById('tabPySpark');
  const tabSql = document.getElementById('tabSql');
  const editorCode = document.getElementById('editorCode');
  const btnRunNotebook = document.getElementById('btnRunNotebook');
  const notebookTimer = document.getElementById('notebookTimer');
  const resultTableWrapper = document.getElementById('resultTableWrapper');
  const outputRowCount = document.getElementById('outputRowCount');
  const executionLog = document.getElementById('executionLog');

  function renderNotebookPreset(presetKey) {
    currentPreset = presetKey;
    const preset = notebookPresets[presetKey];
    
    // Format simple syntax highlighting
    let highlighted = preset.code
      .replace(/(%py|%sql)/g, '<span class="cmd">$1</span>')
      .replace(/(from|import|SELECT|FROM|WHERE|GROUP BY|ORDER BY|DESC|AS|SUM|COUNT|AVG|ROUND|IN|MERGE|INTO|USING|ON|WHEN|MATCHED|UPDATE|SET|INSERT|VALUES|FILTER)/g, '<span class="kw">$1</span>')
      .replace(/(".*?"|'.*? me')/g, '<span class="str">$1</span>')
      .replace(/(#.*|--.*)/g, '<span class="cm">$1</span>');

    editorCode.innerHTML = highlighted;

    if (presetKey === 'pyspark') {
      tabPySpark.classList.add('active');
      tabSql.classList.remove('active');
    } else {
      tabSql.classList.add('active');
      tabPySpark.classList.remove('active');
    }
  }

  function executeNotebookCode() {
    btnRunNotebook.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Executing...`;
    lucide.createIcons();

    const startTime = performance.now();

    setTimeout(() => {
      const duration = ((performance.now() - startTime) / 1000 + 0.28).toFixed(2);
      notebookTimer.textContent = `Command executed in ${duration}s`;
      btnRunNotebook.innerHTML = `<i data-lucide="play"></i> Shift + Enter | Run Cell`;
      lucide.createIcons();

      if (currentPreset === 'pyspark') {
        renderPySparkOutputTable();
        executionLog.textContent = `[Databricks PySpark Kernel] OK. Spark Job ID #104 (5 tasks). Stages: 1/1 completed. Delta Table cached in DBFS.`;
      } else {
        renderSqlOutputTable();
        executionLog.textContent = `[Databricks SQL Engine] OK. Vectorized Photonic Engine executed query across 12 partitions in ${duration}s.`;
      }
    }, 400);
  }

  function renderPySparkOutputTable() {
    outputRowCount.textContent = '4 records returned';
    resultTableWrapper.innerHTML = `
      <table class="db-table">
        <thead>
          <tr>
            <th>job_id</th>
            <th>environment</th>
            <th>volume_scale</th>
            <th>governance_engine</th>
            <th>optimization</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>5001</td>
            <td><span class="text-cyan">Deloitte_Azure_DBX</span></td>
            <td>50M_Records</td>
            <td>Unity_Catalog</td>
            <td>SCD_Type_2</td>
            <td><span class="text-emerald">COMPLETED</span></td>
          </tr>
          <tr>
            <td>5002</td>
            <td><span class="text-lava">Genpact_AWS_DBX</span></td>
            <td>10M_Records</td>
            <td>Airflow_DAG</td>
            <td>S3_Optimized</td>
            <td><span class="text-emerald">COMPLETED</span></td>
          </tr>
          <tr>
            <td>5003</td>
            <td><span class="text-lava">Auto_Loader_Stream</span></td>
            <td>CSV_Files</td>
            <td>Medallion_Lakehouse</td>
            <td>Auto_Schema</td>
            <td><span class="text-emerald">COMPLETED</span></td>
          </tr>
          <tr>
            <td>5004</td>
            <td><span class="text-emerald">Spark_Tuning_Job</span></td>
            <td>30%_Faster</td>
            <td>PySpark_SQL</td>
            <td>200_Partitions</td>
            <td><span class="text-emerald">COMPLETED</span></td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function renderSqlOutputTable() {
    outputRowCount.textContent = '4 records returned';
    resultTableWrapper.innerHTML = `
      <table class="db-table">
        <thead>
          <tr>
            <th>environment</th>
            <th>volume_scale</th>
            <th>governance_engine</th>
            <th>optimization</th>
            <th>certification_status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="text-cyan">Deloitte_Azure_DBX</span></td>
            <td>50M_Records</td>
            <td>Unity_Catalog</td>
            <td>SCD_Type_1 & 2</td>
            <td><span class="text-emerald">DATABRICKS CERTIFIED ASSOCIATE</span></td>
          </tr>
          <tr>
            <td><span class="text-lava">Genpact_AWS_DBX</span></td>
            <td>10M_Records</td>
            <td>Airflow_DAG</td>
            <td>-40% Manual Delay</td>
            <td><span class="text-emerald">DATABRICKS CERTIFIED ASSOCIATE</span></td>
          </tr>
        </tbody>
      </table>
    `;
  }

  tabPySpark.addEventListener('click', () => renderNotebookPreset('pyspark'));
  tabSql.addEventListener('click', () => renderNotebookPreset('sql'));
  btnRunNotebook.addEventListener('click', executeNotebookCode);

  // Initial render
  renderNotebookPreset('pyspark');
  renderPySparkOutputTable();

  /* -------------------------------------------------------------
     2. Connected Architecture Visualizer DAG Controller
  ------------------------------------------------------------- */
  const dagNodesGrid = document.getElementById('dagNodesGrid');
  const dagDrawer = document.getElementById('dagDrawer');

  function renderDagNodes() {
    let htmlContent = `<div class="dag-flow-container">`;

    pipelineNodes.forEach((node, index) => {
      // Default active on Node 01 (Cloud Sources - Ingestion Landing Zone)
      const isActive = index === 0 ? 'active' : '';

      htmlContent += `
        <div class="dag-node-card ${isActive}" data-id="${node.id}">
          <div>
            <div class="dag-step-number">NODE ${node.stepNum}</div>
            <div class="dag-node-icon">
              <i data-lucide="${node.icon}"></i>
            </div>
            <div class="dag-node-title">${node.name}</div>
            <div class="dag-node-sub">${node.sub}</div>
          </div>
          <div>
            <span class="dag-stage-badge">${node.stageTag}</span>
          </div>
        </div>
      `;

      // Render directional flow arrow between nodes (except after last node)
      if (index < pipelineNodes.length - 1) {
        htmlContent += `
          <div class="dag-connector">
            <i data-lucide="chevron-right"></i>
          </div>
        `;
      }
    });

    htmlContent += `</div>`;
    dagNodesGrid.innerHTML = htmlContent;

    lucide.createIcons();
    showDagDrawer(pipelineNodes[0]); // Default selection Node 01 (Cloud Sources)
  }

  function showDagDrawer(node) {
    dagDrawer.classList.add('active');

    const techGridItems = Object.entries(node.techDetails).map(([key, val]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      return `
        <div class="tech-item">
          <div class="tech-item-key">${formattedKey}</div>
          <div class="tech-item-val">${val}</div>
        </div>
      `;
    }).join('');

    const highlightsItems = node.highlights.map(h => `<li>${h}</li>`).join('');

    dagDrawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <div class="drawer-title">
            <i data-lucide="${node.icon}" class="text-lava"></i> ${node.name}
            <span class="badge badge-lava" style="font-size: 0.75rem;">${node.stageTag}</span>
          </div>
          <div class="drawer-desc">${node.desc}</div>
        </div>
        <span class="badge badge-emerald"><i data-lucide="check-circle-2"></i> HEALTHY (99.95% SLA)</span>
      </div>

      <div class="drawer-tech-grid">
        ${techGridItems}
      </div>

      <div class="drawer-highlights">
        <div class="highlights-title"><i data-lucide="zap"></i> Key Engineering Implementation Details</div>
        <ul class="highlights-list">
          ${highlightsItems}
        </ul>
      </div>
    `;

    lucide.createIcons();
  }

  dagNodesGrid.addEventListener('click', (e) => {
    const nodeEl = e.target.closest('.dag-node-card');
    if (!nodeEl) return;

    document.querySelectorAll('.dag-node-card').forEach(n => n.classList.remove('active'));
    nodeEl.classList.add('active');

    const nodeId = nodeEl.getAttribute('data-id');
    const selectedNode = pipelineNodes.find(n => n.id === nodeId);
    if (selectedNode) showDagDrawer(selectedNode);
  });

  renderDagNodes();

  /* -------------------------------------------------------------
     3. Skills Matrix Controller
  ------------------------------------------------------------- */
  const skillsGrid = document.getElementById('skillsGrid');
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');

  function renderSkills(categoryFilter = 'all') {
    const filteredSkills = categoryFilter === 'all' 
      ? skills 
      : skills.filter(s => s.category === categoryFilter);

    skillsGrid.innerHTML = filteredSkills.map(skill => `
      <div class="skill-card">
        <div class="skill-header">
          <span class="skill-name">${skill.name}</span>
        </div>
        <div class="skill-divider" aria-hidden="true"></div>
        <div class="skill-desc">${skill.desc}</div>
      </div>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderSkills(cat);
    });
  });

  renderSkills('all');

  /* -------------------------------------------------------------
     4. Featured Projects Controller
  ------------------------------------------------------------- */
  const projectsGrid = document.getElementById('projectsGrid');
  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  function renderProjects() {
    projectsGrid.innerHTML = projects.map(proj => `
      <div class="project-card">
        <div>
          <div class="project-cat">${proj.category}</div>
          <div class="project-pattern-label">${proj.pattern}</div>
          <h3 class="project-title">${proj.title}</h3>
          <div class="project-impact">${proj.impact}</div>
          <p class="project-desc">${proj.subtitle}</p>
          <div class="project-evidence" aria-label="Project materials">
            <span class="evidence-badge">Architecture walkthrough</span>
            <span class="evidence-badge">Representative code sample</span>
          </div>
          <div class="project-tags">
            ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
        <button class="btn-secondary btn-view-project" data-id="${proj.id}" style="width: 100%; justify-content: center; margin-top: 16px;">
          <i data-lucide="eye"></i>
          <span data-mode-copy="recruiter">View Project Outcomes</span>
          <span data-mode-copy="dev">View Architecture & Code</span>
        </button>
      </div>
    `).join('');

    lucide.createIcons();
  }

  renderProjects();

  /* -------------------------------------------------------------
     5. Multi-Role Experience Timeline Controller
  ------------------------------------------------------------- */
  const experienceTimeline = document.getElementById('experienceTimeline');

  function renderTimeline() {
    experienceTimeline.innerHTML = experience.map(item => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-company-header">
            <h3 class="timeline-company-name">${item.company}</h3>
            <span class="timeline-company-period">${item.period}</span>
          </div>

          ${item.roles.map((role, idx) => `
            <div class="timeline-role-block" style="${idx > 0 ? 'margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--db-border);' : ''}">
              <div class="timeline-role-header">
                <h4 class="timeline-role-title">
                  ${role.title}
                  ${role.isPromoted ? '<span class="badge badge-lava" style="font-size: 0.72rem;">PROMOTED</span>' : ''}
                </h4>
                <span class="timeline-role-period">${role.period}</span>
              </div>
              <ul class="timeline-list">
                ${role.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderTimeline();

  /* -------------------------------------------------------------
     6. Interactive Terminal CLI Controller
  ------------------------------------------------------------- */
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  function appendTerminalLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalOutput.insertBefore(line, terminalInput.closest('.terminal-input-row'));
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim().toLowerCase();
      appendTerminalLine(`<span class="terminal-prompt">piyush@portfolio:~$</span> ${command}`);
      terminalInput.value = '';

      switch (command) {
        case 'help':
          appendTerminalLine(`
            Available Databricks CLI commands:<br>
            - <span class="text-lava">skills</span>: List key technologies & cloud services<br>
            - <span class="text-lava">projects</span>: Display production pipeline implementations<br>
            - <span class="text-lava">experience</span>: View Deloitte & Genpact career history<br>
            - <span class="text-lava">contact</span>: Show email, phone, LinkedIn, and GitHub links<br>
            - <span class="text-lava">cluster</span>: Show active Databricks certification status<br>
            - <span class="text-lava">clear</span>: Clear terminal window
          `, 'text-muted');
          break;

        case 'skills':
          appendTerminalLine(`
            <strong>Piyush Pandey Core Skills:</strong><br>
            • Databricks Lakehouse (Unity Catalog, Delta Lake, Auto Loader)<br>
            • PySpark & Advanced SQL (50M+ Records ETL, SCD Type 1 & 2)<br>
            • Apache Airflow & Azure Data Factory (ADF Pipeline Orchestration)<br>
            • AWS Ecosystem: S3, Glue, EMR, Lambda, Step Functions, CloudWatch<br>
            • Azure Ecosystem: ADF, ADLS Gen2, Azure SQL
          `, 'text-cyan');
          break;

        case 'projects':
          appendTerminalLine(`
            <strong>Featured Production Projects:</strong><br>
            1. Event-Driven Data Ingestion Pipeline on AWS & Databricks (Auto Loader)<br>
            2. Azure Databricks & ADF Enterprise ETL (50M+ Records & SCD Type 1/2)<br>
            3. AWS & Databricks Pipeline Performance & Storage Cost Optimizer (-15% S3 cost)
          `, 'text-emerald');
          break;

        case 'experience':
          appendTerminalLine(`
            Career Journey:<br>
            • Deloitte (July 2026 - Present): Consultant (AM) - Data Engineer<br>
            • Genpact (2023 - July 2026): Consultant (Promoted) & Senior Associate
          `, 'text-muted');
          break;

        case 'contact':
          appendTerminalLine(`
            <strong>Piyush Pandey Contact Info:</strong><br>
            • Phone: <span class="text-lava">${profile.phone}</span><br>
            • Email: <a href="mailto:${profile.email}" class="text-lava">${profile.email}</a><br>
            • LinkedIn: <a href="${profile.linkedin}" target="_blank" class="text-cyan">linkedin.com/in/piyush-pandey-91b2831b4</a><br>
            • GitHub: <a href="${profile.github}" target="_blank" class="text-emerald">github.com/piyush485</a>
          `, 'text-muted');
          break;

        case 'cluster':
          appendTerminalLine(`
            Certification Status: Databricks Certified Data Engineer Associate [ACTIVE]<br>
            Education: B.Tech CSE @ Graphic Era University (GPA: 9.29/10.00)<br>
            Active Pipeline Execution: Azure Databricks + ADF + ADLS Gen2 + AWS S3
          `, 'text-emerald');
          break;

        case 'clear':
          const lines = terminalOutput.querySelectorAll('.terminal-line');
          lines.forEach(l => l.remove());
          break;

        default:
          if (command !== '') {
            appendTerminalLine(`Command not recognized: '${command}'. Type <span class="text-lava">help</span> for options.`, 'text-lava');
          }
          break;
      }

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  /* -------------------------------------------------------------
     7. Modal Dialog Controller (Projects & Resume)
  ------------------------------------------------------------- */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const btnResume = document.getElementById('btnResume');

  function openModal(htmlContent) {
    modalContent.innerHTML = htmlContent;
    modalBackdrop.classList.add('active');
    lucide.createIcons();
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('click', (e) => {
    const projBtn = e.target.closest('.btn-view-project');
    if (projBtn) {
      const projId = projBtn.getAttribute('data-id');
      const proj = projects.find(p => p.id === projId);
      if (proj) {
        openModal(`
          <span class="badge badge-lava case-study-category">${proj.category}</span>
          <p class="case-study-pattern">${proj.pattern}</p>
          <h2 class="case-study-title">${proj.title}</h2>
          <div class="case-study-outcome"><span>Outcome</span><p>${proj.impact}</p></div>

          <div class="case-study-summary">
            <section class="case-study-block">
              <h3>The challenge</h3>
              <p>${proj.problem}</p>
            </section>
            <section class="case-study-block">
              <h3>Approach and contribution</h3>
              <p>${proj.contribution}</p>
            </section>
          </div>

          <div class="case-study-metrics" aria-label="Project details">
            ${proj.metrics.map(metric => `<div class="case-study-metric"><span>${metric.label}</span><strong>${metric.value}</strong></div>`).join('')}
          </div>

          <h3 class="case-study-section-title text-lava">Architecture walkthrough</h3>
          <ol class="case-study-architecture">${proj.architecture.map(step => `<li>${step}</li>`).join('')}</ol>

          <h3 class="case-study-section-title text-cyan">Representative code sample</h3>
          <pre class="case-study-code"><code>${escapeHtml(proj.codeSnippet)}</code></pre>

          <div class="case-study-evidence">
            <span class="evidence-badge">Architecture walkthrough</span>
            <span class="evidence-badge">Representative code sample</span>
            <p>The interactive notebook uses sample data and is not connected to production systems.</p>
          </div>
        `);
      }
    }
  });

  /* -------------------------------------------------------------
     Dynamic Resume PDF File Detection Helper
  ------------------------------------------------------------- */
  async function resolveActiveResumeUrl() {
    // 1. Try directory listing regex scan (works on local dev servers like python http.server)
    try {
      const dirRes = await fetch('./', { cache: 'no-cache' });
      if (dirRes.ok) {
        const text = await dirRes.text();
        const match = text.match(/href=["']?([^"'>]*Piyush_Pandey_Resume[^"'>]*\.pdf)["']?/i);
        if (match && match[1]) {
          const matchedFile = decodeURIComponent(match[1].split('/').pop());
          return matchedFile;
        }
      }
    } catch (e) {
      // Ignore and proceed to candidate check
    }

    // 2. Candidate pattern probing fallback for static hosts (GitHub Pages, Netlify, Vercel)
    const candidates = [
      profile.resumeUrl,
      'Piyush_Pandey_Resume.pdf',
      'Piyush_Pandey_Resume_Azure_data_engineer.pdf',
      'Piyush_Pandey_Resume_aws_data_engineer.pdf',
      'Piyush_Pandey_Resume_databricks_data_engineer.pdf',
      'Piyush_Pandey_Resume_databricks_datra_engineer.pdf',
      'Piyush_Pandey_Resume_Databricks_Data_Engineer.pdf',
      'Piyush_Pandey_Resume_Azure_Data_Engineer.pdf',
      'Piyush_Pandey_Resume_AWS_Data_Engineer.pdf',
      'Piyush_Pandey_Resume_Data_Engineer.pdf'
    ].filter(Boolean);

    for (const file of candidates) {
      try {
        const res = await fetch(file, { method: 'HEAD', cache: 'no-cache' });
        if (res.ok) {
          return file;
        }
      } catch (err) {
        // Continue probing next candidate
      }
    }

    return 'Piyush_Pandey_Resume.pdf';
  }

  btnResume.addEventListener('click', async () => {
    const activeResumeFile = await resolveActiveResumeUrl();
    
    openModal(`
      <div style="margin-bottom: 24px; border-bottom: 1px solid var(--db-border); padding-bottom: 18px; padding-right: 48px;">
        <span class="badge badge-lava" style="margin-bottom: 8px;">${profile.certification}</span>
        <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 2px;">Piyush Pandey</h2>
        <p style="color: var(--db-lava); font-weight: 600; font-size: 1.05rem;">${profile.title}</p>
        <p style="color: var(--db-text-muted); font-size: 0.88rem; margin-top: 4px; margin-bottom: 16px;">
          📞 ${profile.phone} | ✉️ ${profile.email} | 📍 ${profile.location}
        </p>

        <div>
          <a href="${activeResumeFile}" download="${activeResumeFile}" target="_blank" class="btn-primary" style="gap: 8px; text-decoration: none;">
            <i data-lucide="download"></i> Download Resume
          </a>
        </div>
      </div>

      <div style="background: var(--db-navy-700); padding: 20px; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--db-border);">
        <h3 style="font-size: 1.15rem; margin-bottom: 8px;" class="text-lava">Professional Summary</h3>
        <p style="color: var(--db-text-muted); font-size: 0.92rem; line-height: 1.6;">${profile.bio}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 14px;" class="text-cyan">Work Experience & Career Progression</h3>
        
        ${experience.map(item => `
          <div style="margin-bottom: 20px; background: var(--db-card-bg); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--db-border);">
            <div style="display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 12px; border-bottom: 1px solid var(--db-border); padding-bottom: 8px;">
              <span style="font-size: 1.2rem; color: var(--db-lava);">${item.company}</span>
              <span class="text-lava" style="font-family: var(--font-code); font-size: 0.85rem;">${item.period}</span>
            </div>
            
            ${item.roles.map((role, idx) => `
              <div style="${idx > 0 ? 'margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--db-border);' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="font-size: 0.98rem; color: var(--db-text-main);">
                    ${role.title}
                    ${role.isPromoted ? '<span class="badge badge-lava" style="font-size: 0.7rem; margin-left: 6px;">PROMOTED</span>' : ''}
                  </strong>
                  <span style="font-family: var(--font-code); font-size: 0.8rem; color: var(--db-text-dim);">${role.period}</span>
                </div>
                <ul style="padding-left: 18px; color: var(--db-text-muted); font-size: 0.88rem;">
                  ${role.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>

      <div style="background: var(--db-navy-700); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--db-border);">
        <h3 style="font-size: 1.1rem; margin-bottom: 8px;" class="text-emerald">Education & Certifications</h3>
        <p style="font-weight: 700; color: var(--db-text-main); font-size: 0.92rem;">${profile.education}</p>
        <p style="color: var(--db-lava); font-family: var(--font-code); font-size: 0.85rem; margin-top: 4px;">🏆 ${profile.certification}</p>
      </div>
    `);
  });
});

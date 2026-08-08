/* ============================================================
   Misaki · 个人主页 — 渲染与交互
   数据来自 assets/data.json（由 data/site.yaml 构建生成）
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 自绘图标（无 emoji） ---------------- */
  var ICONS = {
    server: '<rect x="3" y="4" width="18" height="6" rx="1.6"/><rect x="3" y="14" width="18" height="6" rx="1.6"/><circle cx="7" cy="7" r="1"/><circle cx="7" cy="17" r="1"/>',
    desktop: '<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 21h6M12 17v4"/>',
    link: '<path d="M10.5 13.5a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66L12 6.2"/><path d="M13.5 10.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66L12 17.8"/>',
    code: '<path d="m9 8.5-4 3.5 4 3.5M15 8.5l4 3.5-4 3.5"/>',
    tools: '<path d="M4 7h7M15 7h5M4 17h5M13 17h7"/><circle cx="13" cy="7" r="2.2"/><circle cx="11" cy="17" r="2.2"/>',
    repo: '<path d="M3.5 7a2 2 0 0 1 2-2h4.2l2 2H18.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/>',
    comment: '<path d="M21 15a2 2 0 0 1-2 2H8.5l-4.3 4V7a2 2 0 0 1 2-2H19a2 2 0 0 1 2 2Z"/>',
    camera: '<path d="M4 8.5h2.6L8.2 6.5h7.6l1.6 2H20a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.4"/>',
    music: '<path d="M9 18.5V5.5l9-2v13"/><circle cx="6.5" cy="18.5" r="2.6"/><circle cx="15.5" cy="16.5" r="2.6"/>',
    game: '<path d="M7.2 8h9.6a4 4 0 0 1 3.9 4.9l-.7 3a3 3 0 0 1-5.5 1.4L13.7 16h-3.4l-.8 1.3a3 3 0 0 1-5.5-1.4l-.7-3A4 4 0 0 1 7.2 8Z"/><path d="M7.5 11.5v3M6 13h3M15.5 12h.01M17.5 14h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9Z"/>',
    'arrow-down': '<path d="M12 4v15m-6-6 6 6 6-6"/>',
    'arrow-right': '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    github: '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>'
  };
  function svgIcon(name, size) {
    size = size || 16;
    if (name === 'github') {
      return '<svg viewBox="0 0 16 16" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true">' + (ICONS.github || '') + '</svg>';
    }
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function hexSoft(hex) {
    if (typeof hex !== 'string' || hex[0] !== '#') return null;
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',.16)';
  }

  /* 全局唯一颜色系统：命名 → CSS 变量 */
  var COLOR = {
    terra: 'var(--terra)', sage: 'var(--sage)', sky: 'var(--sky)',
    lilac: 'var(--lilac)', amber: 'var(--amber)', indigo: 'var(--indigo)'
  };

  var SECTIONS = [
    { id: 'hero',     name: '起点',   en: 'INTRO' },
    { id: 'projects', name: '项目',   en: 'PROJECTS' },
    { id: 'archive',  name: '过往',   en: 'ARCHIVE' },
    { id: 'hobbies',  name: '爱好',   en: 'HOBBIES' }
  ];
  var ACCENTS = ['#d97742', '#9a82c9', '#7a9d5f', '#5f8fc0'];
  var COVER_ACCENT = {
    green: 'var(--sage)', blue: 'var(--sky)', purple: 'var(--lilac)',
    gray: 'var(--ink-faint)', navy: 'var(--sky)', red: 'var(--terra)', indigo: 'var(--indigo)'
  };

  function secHead(idx, title, en, accent) {
    return '<div class="sec-head" style="--ac:' + accent + '"><span class="idx">0' + idx + '</span><h2>' + title + '</h2><span class="en">' + en + '</span></div>';
  }

  /* ---------------- Hero（名字 + 理念一句 + 技术标签 + 联系） ---------------- */
  function renderHero(data) {
    var p = data.profile;
    var quote = (data.about && data.about.quote) || '';
    var slogan = quote ? esc(quote).replace('简单、高效、好用', '<em>简单、高效、好用</em>') : '';
    var tl = (p.tagline || []).map(function (seg, i) {
      var sep = (i < p.tagline.length - 1) ? '<span class="tg-sep">·</span>' : '';
      return '<span class="tg" style="--tg:' + esc(seg.color || 'var(--ink-soft)') + '">' + esc(seg.text) + '</span>' + sep;
    }).join('');
    var cb = ['#3a322a', '#d97742', '#7a9d5f'];
    var links = ((data.contact && data.contact.links) || []).map(function (l, i) {
      var isMail = String(l.url || '').indexOf('mailto:') === 0;
      return '<a class="h-btn" href="' + esc(l.url) + '" style="--cb:' + cb[i % cb.length] + '"' +
        (isMail ? '' : ' target="_blank" rel="noopener"') + '>' + svgIcon(l.icon, 16) + '<span>' + esc(l.label) + '</span></a>';
    }).join('');
    document.getElementById('heroBox').innerHTML =
      '<div class="hero-wrap">' +
        '<h1 class="name" data-depth="1.6">' + esc(p.name) + '</h1>' +
        (slogan ? '<p class="slogan" data-depth="1.2">' + slogan + '</p>' : '') +
        '<p class="tagline" data-depth="1">' + tl + '</p>' +
        '<div class="hero-links" data-depth="0.6">' + links + '</div>' +
        '<div class="scroll-dot" data-depth="0.4">' + svgIcon('arrow-down', 18) + '</div>' +
      '</div>';
  }

  /* ---------------- 项目 ---------------- */
  function renderProjects(projects) {
    var html = (projects || []).map(function (p) {
      var accent = p.accent ? (COLOR[p.accent] || p.accent) : (COVER_ACCENT[p.cover] || 'var(--lilac)');
      var path = String(p.repo || '').replace('https://github.com/', '');
      return '<a class="p-card" href="' + esc(p.repo) + '" target="_blank" rel="noopener" style="--pc:' + accent + '">' +
        '<span class="p-ico">' + svgIcon(p.icon || 'repo', 24) + '</span>' +
        '<span class="p-body">' +
          '<span class="p-top"><h3>' + esc(p.name) + '</h3>' + (p.featured ? '<span class="p-feat">FEATURED</span>' : '') + '</span>' +
          '<p>' + esc(p.desc) + '</p>' +
          '<span class="p-tags">' + (p.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</span>' +
          '<span class="p-link">' + esc(path) + ' ' + svgIcon('arrow-right', 12) + '</span>' +
        '</span>' +
      '</a>';
    }).join('');
    document.getElementById('projectsBox').innerHTML = secHead(1, '项目', 'PROJECTS', 'var(--lilac)') + '<div class="p-grid">' + html + '</div>';
  }

  /* ---------------- 过往（旧项目清单） ---------------- */
  function renderArchive(list) {
    var html = (list || []).map(function (a) {
      return '<div class="a-item">' +
        '<span class="a-dot"></span>' +
        '<div><div class="a-name">' + esc(a.name) + '</div>' + (a.desc ? '<div class="a-desc">' + esc(a.desc) + '</div>' : '') + '</div>' +
        (a.url ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + svgIcon('arrow-right', 11) + '</a>' : '') +
      '</div>';
    }).join('');
    document.getElementById('archiveBox').innerHTML =
      secHead(2, '过往', 'ARCHIVE', 'var(--sage)') + '<div class="a-list">' + html + '</div>';
  }

  /* ---------------- 爱好（图章标签，推荐点击展开） ---------------- */
  function renderHobbies(hobbies) {
    var fallback = ['var(--sky)', 'var(--terra)', 'var(--lilac)', 'var(--sage)', 'var(--amber)'];
    var html = (hobbies || []).map(function (h, i) {
      var accent = h.accent ? (COLOR[h.accent] || h.accent) : fallback[i % fallback.length];
      var soft = hexSoft(h.accent) || 'rgba(95,143,192,.16)';
      var recs = h.recs || [];
      var hasRecs = recs.length > 0;
      var recsHtml = hasRecs ? (
        '<div class="h-recs"><div class="h-recs-t">' + svgIcon('star', 11) + '推荐</div><ul>' +
        recs.map(function (r) {
          var t = r.link
            ? '<a href="' + esc(r.link) + '" target="_blank" rel="noopener">' + esc(r.title) + ' ' + svgIcon('arrow-right', 11) + '</a>'
            : '<span>' + esc(r.title) + '</span>';
          return '<li>' + t + (r.note ? '<em>' + esc(r.note) + '</em>' : '') + '</li>';
        }).join('') + '</ul></div>'
      ) : '';
      return '<div class="h-tag-wrap" style="--ha:' + accent + ';--ha-soft:' + soft + '">' +
        '<button type="button" class="h-tag' + (hasRecs ? ' has-recs' : '') + '">' +
          '<span class="h-ico">' + svgIcon(h.icon, 18) + '</span><span>' + esc(h.name) + '</span>' +
          (hasRecs ? '<span class="h-arrow">' + svgIcon('arrow-down', 12) + '</span>' : '') +
        '</button>' +
        recsHtml +
      '</div>';
    }).join('');
    document.getElementById('hobbiesBox').innerHTML =
      secHead(3, '爱好', 'HOBBIES', 'var(--sky)') + '<div class="h-wall">' + html + '</div>';
  }

  /* ---------------- 左侧背景：git graph（优雅曲线 + 圆形节点） ---------------- */
  var NS = 'http://www.w3.org/2000/svg';
  var graphB1 = null, graphB2 = null;
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // 两端竖直切线、中部平滑横移的 S 曲线
  function curve(a, b) {
    return 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + b.y + ', ' + b.x + ' ' + a.y + ', ' + b.x + ' ' + b.y;
  }
  function buildGraph() {
    var wrap = document.getElementById('leftGraph');
    var old = wrap.querySelector('svg');
    if (old) old.remove();
    var vh = window.innerHeight;
    var H = SECTIONS.length * vh;
    var W = Math.max(200, wrap.clientWidth || Math.round(Math.min(window.innerWidth * 0.20, 280)));
    var svg = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H });
    svg.style.height = H + 'px';
    wrap.appendChild(svg);

    var lane0 = W * 0.18, laneB = W * 0.52, laneC = W * 0.86;
    var yInit = 0.125 * H, yProj = 0.375 * H, yArch = 0.625 * H, yHob = 0.875 * H;
    var yM1 = 0.50 * H, yFork2 = 0.55 * H, yM2 = 0.75 * H;

    // 主干
    el('line', { x1: lane0, y1: 0, x2: lane0, y2: H, 'class': 'g-trunk' }, svg);
    el('line', { x1: lane0, y1: 0, x2: lane0, y2: H, 'class': 'g-trunk-flow' }, svg);
    // 项目分支：起点 → 项目 → 合并回主干
    el('path', { d: curve({ x: lane0, y: yInit }, { x: laneB, y: yProj }), 'class': 'g-branch g-b1' }, svg);
    el('path', { d: curve({ x: laneB, y: yProj }, { x: lane0, y: yM1 }), 'class': 'g-branch g-b1' }, svg);
    // 过往分支：主干 → 过往 → 合并回主干
    el('path', { d: curve({ x: lane0, y: yFork2 }, { x: laneC, y: yArch }), 'class': 'g-branch g-b2' }, svg);
    el('path', { d: curve({ x: laneC, y: yArch }, { x: lane0, y: yM2 }), 'class': 'g-branch g-b2' }, svg);

    // 装饰 commits
    var deco = [
      { x: lane0, y: 0.045 * H }, { x: lane0, y: 0.09 * H }, { x: lane0, y: 0.20 * H },
      { x: laneB, y: 0.28 * H }, { x: laneB, y: 0.32 * H }, { x: laneB, y: 0.42 * H },
      { x: lane0, y: 0.55 * H }, { x: lane0, y: 0.80 * H }, { x: lane0, y: 0.84 * H },
      { x: laneC, y: 0.57 * H }, { x: laneC, y: 0.60 * H }, { x: laneC, y: 0.71 * H }
    ];
    deco.forEach(function (c, i) {
      el('circle', { cx: c.x, cy: c.y, r: 3, 'class': 'g-commit' + (i % 2 ? ' bright' : '') }, svg);
    });
    // merge 标记
    el('circle', { cx: lane0, cy: yM1, r: 4, 'class': 'g-merge' }, svg);
    el('circle', { cx: lane0, cy: yM2, r: 4, 'class': 'g-merge' }, svg);

    // 章节节点（圆形）
    [[0, lane0, yInit], [1, laneB, yProj], [2, laneC, yArch], [3, lane0, yHob]].forEach(function (n) {
      var g = el('g', { 'data-idx': n[0], 'class': 'g-sec' }, svg);
      g.style.setProperty('--ac', ACCENTS[n[0]]);
      el('circle', { cx: n[1], cy: n[2], r: 15, 'class': 'g-ring' }, g);
      el('circle', { cx: n[1], cy: n[2], r: 7, 'class': 'g-node' }, g);
      var left = n[1] > W * 0.7;
      var t = el('text', { x: left ? n[1] - 12 : n[1] + 12, y: n[2] + 3.5, 'class': 'g-label' }, g);
      t.setAttribute('text-anchor', left ? 'end' : 'start');
      t.textContent = SECTIONS[n[0]].name;
    });

    graphB1 = svg.querySelectorAll('.g-b1');
    graphB2 = svg.querySelectorAll('.g-b2');
    setTimeout(function () {
      svg.querySelectorAll('.g-sec').forEach(function (x) { x.classList.add('ready'); });
    }, 40);
  }

  /* ---------------- 右侧 minimap ---------------- */
  function buildMinimap() {
    var mm = document.getElementById('minimap');
    mm.innerHTML = '';
    SECTIONS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'mm-item';
      b.type = 'button';
      b.dataset.idx = i;
      b.setAttribute('aria-label', '跳转到 ' + s.name);
      b.style.setProperty('--ac', ACCENTS[i]);
      b.style.setProperty('--ac-soft', ACCENTS[i] + '26');
      b.innerHTML = '<span class="mm-dot"></span><span class="mm-label">' + s.name + '</span>';
      b.addEventListener('click', function () { smoothTo(i); });
      mm.appendChild(b);
    });
  }

  /* ---------------- 滚动状态与翻页 ---------------- */
  var cur = -1;
  function currentIdx() {
    return Math.max(0, Math.min(SECTIONS.length - 1, Math.round(window.scrollY / window.innerHeight)));
  }
  function apply(i) {
    if (i === cur) return;
    cur = i;
    var secs = document.querySelectorAll('section');
    for (var k = 0; k < secs.length; k++) secs[k].classList.toggle('active', +secs[k].getAttribute('data-idx') === i);
    document.querySelectorAll('.g-sec').forEach(function (g) { g.classList.toggle('on', +g.getAttribute('data-idx') === i); });
    document.querySelectorAll('.mm-item').forEach(function (m) { m.classList.toggle('on', +m.getAttribute('data-idx') === i); });
    if (graphB1) graphB1.forEach(function (p) { p.classList.toggle('on', i >= 1); });
    if (graphB2) graphB2.forEach(function (p) { p.classList.toggle('on', i >= 2); });
  }

  var busy = false;
  function smoothTo(i) {
    i = Math.max(0, Math.min(SECTIONS.length - 1, i));
    if (busy || i === cur) return;
    busy = true;
    var doc = document.documentElement;
    doc.style.scrollSnapType = 'none';
    document.getElementById('sec-' + SECTIONS[i].id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { doc.style.scrollSnapType = ''; busy = false; }, 900);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (busy) return;
    if (Math.abs(e.deltaY) < 8) return;
    var i = currentIdx(), t = i + (e.deltaY > 0 ? 1 : -1);
    if (t < 0 || t >= SECTIONS.length || t === i) return;
    smoothTo(t);
  }, { passive: false });

  window.addEventListener('scroll', function () { apply(currentIdx()); }, { passive: true });
  window.addEventListener('resize', function () { buildGraph(); apply(currentIdx()); });

  /* ---------------- 爱好推荐展开 ---------------- */
  document.addEventListener('click', function (e) {
    var tag = e.target.closest('.h-tag.has-recs');
    if (tag) {
      var wrap = tag.closest('.h-tag-wrap');
      var wasOpen = wrap.classList.contains('open');
      document.querySelectorAll('.h-tag-wrap.open').forEach(function (w) { w.classList.remove('open'); });
      if (!wasOpen) wrap.classList.add('open');
      return;
    }
    if (!e.target.closest('.h-tag-wrap')) {
      document.querySelectorAll('.h-tag-wrap.open').forEach(function (w) { w.classList.remove('open'); });
    }
  });

  /* ---------------- Hero 视差 ---------------- */
  (function () {
    var heroEl = document.getElementById('sec-hero');
    heroEl.addEventListener('mousemove', function (e) {
      var r = heroEl.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      heroEl.querySelectorAll('[data-depth]').forEach(function (n) {
        var d = parseFloat(n.getAttribute('data-depth')) || 1;
        n.style.transform = 'translate(' + (dx * -30 * d).toFixed(2) + 'px,' + (dy * -22 * d).toFixed(2) + 'px)';
      });
    });
    heroEl.addEventListener('mouseleave', function () {
      heroEl.querySelectorAll('[data-depth]').forEach(function (n) { n.style.transform = ''; });
    });
  })();

  /* ---------------- 启动（fetch 数据） ---------------- */
  function init(data) {
    renderHero(data);
    renderProjects(data.projects);
    renderArchive(data.archive);
    renderHobbies(data.hobbies);
    buildGraph();
    buildMinimap();
    apply(currentIdx());
    var boot = document.getElementById('boot');
    if (boot) setTimeout(function () { boot.classList.add('hide'); }, 150);
  }

  fetch('assets/data.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(init)
    .catch(function (err) {
      var boot = document.getElementById('boot');
      if (boot) {
        boot.classList.remove('hide');
        boot.innerHTML = '<div style="text-align:center;font-family:var(--mono);font-size:13px;color:var(--ink-soft);padding:20px;line-height:2">' +
          '数据加载失败：' + esc(String((err && err.message) || err)) +
          '<br><br>请通过本地服务器打开（如 python -m http.server），或部署到 GitHub Pages 后访问。</div>';
      }
    });
})();

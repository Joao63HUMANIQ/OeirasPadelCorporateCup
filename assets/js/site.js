/* Oeiras Valley Padel Corporate Cup 2027
   Peças partilhadas por todas as páginas (cabeçalho, navegação, parceiros, rodapé)
   e as listagens alimentadas por assets/data/dados.js. */
(function () {
  'use strict';
  var D = window.OVPCC || {};
  var page = document.body.getAttribute('data-page') || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* só aceita ligações http(s), mailto ou caminhos relativos */
  var url = function (u) { u = String(u || ''); return /^(https?:|mailto:)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u) ? esc(u) : '#'; };

  var PAGES = [
    ['home', 'index.html', 'Home'],
    ['regulamento', 'regulamento.html', 'Regulamento'],
    ['calendario', 'calendario.html', 'Calendário'],
    ['resultados', 'resultados.html', 'Resultados'],
    ['classificacao', 'classificacao.html', 'Classificação'],
    ['noticias', 'noticias.html', 'Notícias'],
    ['inscricoes', 'inscricoes.html', 'Inscrições'],
    ['galeria', 'galeria.html', 'Galeria']
  ];
  var ORGS = [
    ['opa', 'Oeiras Padel Academy', 'assets/img/logo-opa-branco.png', ''],
    ['padel-players', 'Padel Players', 'assets/img/logo-padel-players.svg', 'ov-mono'],
    ['humaniq', 'HUMAN.IQ Padel Experiences', 'assets/img/logo-humaniq.png', 'ov-mono']
  ];
  var SPONSOR_URL = 'index.html#parceiros';

  /* ===== cabeçalho e navegação ===== */
  var header = $('#ov-header');
  if (header) {
    header.outerHTML =
      '<a class="ov-skip" href="#conteudo">Saltar para o conteúdo</a>' +
      '<header class="ov-header"><div class="ov-wrap ov-brand">' +
        '<h1><a href="index.html">Oeiras Valley Padel <span>Corporate Cup</span></a></h1>' +
        '<ul class="ov-orgs" aria-label="Co-organização">' +
          ORGS.map(function (o) { return '<li><a href="contactos.html#' + o[0] + '" title="' + esc(o[1]) + '"><img class="' + o[3] + '" src="' + o[2] + '" alt="' + esc(o[1]) + '"></a></li>'; }).join('') +
        '</ul>' +
      '</div></header>' +
      '<nav class="ov-nav" aria-label="Principal"><div class="ov-wrap">' +
        '<button type="button" class="ov-toggle" aria-expanded="false" aria-controls="ov-menu">Menu</button>' +
        '<ul id="ov-menu">' +
          PAGES.map(function (p) { return '<li><a href="' + p[1] + '"' + (p[0] === page ? ' aria-current="page"' : '') + '>' + p[2] + '</a></li>'; }).join('') +
        '</ul>' +
        '<div class="ov-cta">' +
          '<a class="ov-btn ov-sm ov-ghost" href="' + SPONSOR_URL + '">Ser parceiro</a>' +
          '<a class="ov-btn ov-sm" href="inscricoes.html">Inscrever equipa</a>' +
        '</div>' +
      '</div></nav>';
    var nav = $('.ov-nav'), tg = $('.ov-toggle');
    tg.addEventListener('click', function () {
      var open = nav.classList.toggle('ov-open');
      tg.setAttribute('aria-expanded', String(open));
    });
  }

  /* ===== parceiros: última secção de cada página ===== */
  var sp = $('#ov-sponsors');
  if (sp) {
    var tiers = D.parceiros || [];
    sp.outerHTML =
      '<section class="ov-sponsors" aria-labelledby="ov-sp-h"><div class="ov-wrap">' +
        '<div class="ov-sponsors-head"><div>' +
          '<h2 id="ov-sp-h">Parceiros</h2>' +
          '<p>192 a 288 profissionais de Oeiras, 3 fins de semana, 7 meses de exposição. Os espaços abaixo estão por ocupar.</p>' +
        '</div><a class="ov-btn" href="' + SPONSOR_URL + '">Reservar um espaço</a></div>' +
        '<div class="ov-tiers">' +
          tiers.map(function (t, i) {
            var logos = t.logos || [], n = Math.max(t.espacos || 1, logos.length), slots = '';
            for (var k = 0; k < n; k++) {
              var l = logos[k];
              slots += l
                ? '<a class="ov-slot ov-filled" href="' + url(l.url || '#') + '"' + (l.url ? ' target="_blank" rel="noopener"' : '') + '><img src="' + url(l.src) + '" alt="' + esc(l.nome) + '"></a>'
                : '<a class="ov-slot" href="' + SPONSOR_URL + '">O seu logo</a>';
            }
            return '<div class="ov-tier' + (i === 0 ? ' ov-t1' : '') + '"><h3>' + esc(t.nivel) + ' <small>' + esc(t.vagas) + '</small></h3><div class="ov-slots">' + slots + '</div></div>';
          }).join('') +
        '</div>' +
      '</div></section>';
  }

  /* ===== rodapé ===== */
  var ft = $('#ov-footer');
  if (ft) {
    ft.outerHTML =
      '<footer class="ov-footer"><div class="ov-wrap">' +
        '<nav aria-label="Rodapé"><ul>' +
          PAGES.map(function (p) { return '<li><a href="' + p[1] + '">' + p[2] + '</a></li>'; }).join('') +
          '<li><a href="contactos.html">Contactos</a></li>' +
        '</ul></nav>' +
        '<p>Oeiras Valley Padel Corporate Cup 2027 · Co-organização: Oeiras Valley, Oeiras Padel Academy, Padel Players e HUMAN.IQ · <a href="mailto:' + esc(D.email || 'geral@human-iq.pt') + '">' + esc(D.email || 'geral@human-iq.pt') + '</a></p>' +
      '</div></footer>';
  }

  /* ligações "Ser parceiro" por email, com assunto preenchido */
  document.querySelectorAll('[data-ov-mail]').forEach(function (a) {
    a.href = 'mailto:' + (D.email || 'geral@human-iq.pt') + '?subject=' + encodeURIComponent(a.getAttribute('data-ov-mail'));
  });

  var exemploNote = function () {
    return D.exemplo ? '<p class="ov-note"><strong>Dados de exemplo.</strong> Servem para mostrar o formato da página. Os dados reais são publicados no fim de cada dia de jogos.</p>' : '';
  };
  var fill = function (sel, values) {
    var el = $(sel); if (!el) return null;
    el.innerHTML = values.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
    return el;
  };

  /* ===== resultados ===== */
  if (page === 'resultados') {
    var fEv = fill('#f-evento', ['Evento 1', 'Evento 2', 'Masters']);
    var fCat = fill('#f-categoria', ['Masculinos', 'Mistos', 'Femininos']);
    var fNiv = fill('#f-nivel', ['Iniciante', 'Intermédio', 'Avançado']);
    var fFase = fill('#f-fase', ['Grupos', 'Quadro A', 'Quadro B']);
    var out = $('#ov-resultados');
    var side = function (m, n) {
      return '<div class="ov-pair' + (n === 2 ? ' ov-side-b' : '') + (Number(m.vencedor) === n ? ' ov-win' : '') + '"><b>' + esc(m['dupla' + n]) + '</b><small>' + esc(m['empresa' + n]) + '</small></div>';
    };
    var renderR = function () {
      var rows = (D.resultados || []).filter(function (m) { return m.evento === fEv.value && m.categoria === fCat.value && m.nivel === fNiv.value && m.fase === fFase.value; });
      if (!rows.length) {
        out.innerHTML = '<div class="ov-empty"><b>Ainda sem jogos neste quadro</b>' + esc(fEv.value + ' · ' + fCat.value + ' ' + fNiv.value + ' · ' + fFase.value) + '. Os resultados aparecem aqui no dia do evento.</div>';
        return;
      }
      var groups = [], idx = {};
      rows.forEach(function (m) { var g = m.grupo || fFase.value; if (!(g in idx)) { idx[g] = groups.length; groups.push([g, []]); } groups[idx[g]][1].push(m); });
      out.innerHTML = exemploNote() + groups.map(function (g) {
        return '<div class="ov-group"><h3 class="ov-h4">' + esc(g[0]) + '</h3><div class="ov-tablewrap">' +
          g[1].map(function (m) { return '<div class="ov-match">' + side(m, 1) + '<span class="ov-score">' + esc(m.resultado) + '</span>' + side(m, 2) + '</div>'; }).join('') +
          '</div></div>';
      }).join('');
    };
    [fEv, fCat, fNiv, fFase].forEach(function (f) { f.addEventListener('change', renderR); });
    renderR();
  }

  /* ===== classificação por empresa ===== */
  if (page === 'classificacao') {
    var quadros = ['Geral'];
    ['Masculinos', 'Mistos'].forEach(function (c) { ['Iniciante', 'Intermédio', 'Avançado'].forEach(function (n) { quadros.push(c + ' ' + n); }); });
    (D.classificacao || []).forEach(function (r) { if (quadros.indexOf(r.quadro) < 0) quadros.push(r.quadro); });
    var chips = $('#ov-quadros'), outC = $('#ov-classificacao'), atual = 'Geral';
    var renderC = function () {
      chips.innerHTML = quadros.map(function (q) { return '<button type="button" class="ov-chip" aria-pressed="' + (q === atual) + '" data-q="' + esc(q) + '">' + esc(q === 'Geral' ? 'Geral · taça por empresas' : q) + '</button>'; }).join('');
      var rows = (D.classificacao || []).filter(function (r) { return r.quadro === atual; }).map(function (r) {
        var o = { empresa: r.empresa, e1: Number(r.e1) || 0, e2: Number(r.e2) || 0, masters: Number(r.masters) || 0 };
        o.total = o.e1 + o.e2 + o.masters; return o;
      }).sort(function (a, b) { return b.total - a.total || String(a.empresa).localeCompare(String(b.empresa), 'pt'); });
      if (!rows.length) {
        outC.innerHTML = '<div class="ov-empty"><b>Classificação por abrir</b>' + esc(atual) + ': os primeiros pontos são atribuídos no Evento 1, a 6 e 7 de março de 2027.</div>';
        return;
      }
      var pos = 0, last = null;
      outC.innerHTML = exemploNote() + '<div class="ov-tablewrap"><table class="ov-table"><thead><tr><th>#</th><th>Empresa</th><th class="ov-n">Evento 1</th><th class="ov-n">Evento 2</th><th class="ov-n">Masters</th><th class="ov-n">Total</th></tr></thead><tbody>' +
        rows.map(function (r, i) {
          if (r.total !== last) { pos = i + 1; last = r.total; }
          return '<tr><td class="ov-pos">' + pos + '</td><td><strong>' + esc(r.empresa) + '</strong></td><td class="ov-n">' + r.e1 + '</td><td class="ov-n">' + r.e2 + '</td><td class="ov-n">' + r.masters + '</td><td class="ov-n ov-total">' + r.total + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    };
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) { atual = b.getAttribute('data-q'); renderC(); } });
    renderC();
  }

  /* ===== notícias ===== */
  if (page === 'noticias') {
    var outN = $('#ov-noticias'), news = D.noticias || [];
    var fmt = function (d) { var t = new Date(d); return isNaN(t) ? esc(d) : t.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }); };
    if (news.length) {
      outN.innerHTML = news.map(function (n) {
        return '<article class="ov-card ov-news">' +
          (n.imagem ? '<img class="ov-thumb" src="' + url(n.imagem) + '" alt="" loading="lazy">' : '<div class="ov-ph">Sem imagem</div>') +
          '<div class="ov-body"><div class="ov-meta">' + esc(n.fonte) + (n.data ? ' · ' + fmt(n.data) : '') + '</div>' +
          '<h3 class="ov-h4">' + esc(n.titulo) + '</h3><p>' + esc(n.resumo) + '</p>' +
          '<a class="ov-more" href="' + url(n.url) + '" target="_blank" rel="noopener">Ler em ' + esc(n.fonte || 'fonte original') + '</a></div></article>';
      }).join('');
    } else {
      var ph = '';
      for (var i = 1; i <= 6; i++) {
        ph += '<article class="ov-card ov-news"><div class="ov-ph">Foto da notícia</div><div class="ov-body">' +
          '<div class="ov-meta">Fonte · data</div><h3 class="ov-h4">Título da notícia ' + i + '</h3>' +
          '<p>Resumo em 2 linhas do que a notícia conta. O texto completo fica na fonte original.</p>' +
          '<span class="ov-more ov-todo">Ligação para a fonte original</span></div></article>';
      }
      outN.innerHTML = ph;
    }
  }

  /* ===== galeria ===== */
  if (page === 'galeria') {
    var items = D.galeria || [], real = items.length > 0;
    if (!real) {
      ['Evento 1', 'Evento 2', 'Masters'].forEach(function (ev) {
        items.push({ tipo: 'foto', evento: ev, legenda: 'Fotografia por publicar' });
        items.push({ tipo: 'video', evento: ev, legenda: 'Vídeo por publicar' });
        items.push({ tipo: 'noticia', evento: ev, legenda: 'Notícia por publicar' });
      });
    }
    var LABEL = { foto: 'Foto', video: 'Vídeo', noticia: 'Notícia' };
    var state = { evento: 'Todos', tipo: 'Todos' };
    var cEv = $('#ov-g-evento'), cTp = $('#ov-g-tipo'), outG = $('#ov-galeria'), box = $('#ov-lightbox');
    var chipRow = function (el, key, opts) {
      el.innerHTML = opts.map(function (o) { return '<button type="button" class="ov-chip" aria-pressed="' + (state[key] === o[0]) + '" data-v="' + esc(o[0]) + '">' + esc(o[1]) + '</button>'; }).join('');
    };
    var renderG = function () {
      chipRow(cEv, 'evento', [['Todos', 'Todos os eventos'], ['Evento 1', 'Evento 1'], ['Evento 2', 'Evento 2'], ['Masters', 'Masters']]);
      chipRow(cTp, 'tipo', [['Todos', 'Tudo'], ['foto', 'Fotos'], ['video', 'Vídeos'], ['noticia', 'Notícias']]);
      var list = items.filter(function (g) { return (state.evento === 'Todos' || g.evento === state.evento) && (state.tipo === 'Todos' || g.tipo === state.tipo); });
      if (!list.length) { outG.innerHTML = '<div class="ov-empty" style="grid-column:1/-1"><b>Nada neste filtro</b>Escolha outro evento ou outro tipo de conteúdo.</div>'; return; }
      outG.innerHTML = list.map(function (g, i) {
        var media = g.src ? '<img class="ov-thumb" src="' + url(g.src) + '" alt="' + esc(g.legenda) + '" loading="lazy">' : '<div class="ov-ph">' + esc(LABEL[g.tipo] || '') + '<br>' + esc(g.evento) + '</div>';
        var inner = g.tipo === 'foto' && g.src ? '<button type="button" data-open="' + i + '" aria-label="Ampliar: ' + esc(g.legenda) + '">' + media + '</button>'
          : g.url ? '<a href="' + url(g.url) + '" target="_blank" rel="noopener">' + media + '</a>' : media;
        return '<figure class="ov-tile"><span class="ov-tag">' + esc(LABEL[g.tipo] || g.tipo) + '</span>' + inner + '<figcaption><span>' + esc(g.legenda) + '</span><span>' + esc(g.evento) + '</span></figcaption></figure>';
      }).join('');
      outG._list = list;
    };
    cEv.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { state.evento = b.getAttribute('data-v'); renderG(); } });
    cTp.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { state.tipo = b.getAttribute('data-v'); renderG(); } });
    outG.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]'); if (!b || !box || !box.showModal) return;
      var g = outG._list[Number(b.getAttribute('data-open'))];
      $('img', box).src = g.src; $('img', box).alt = g.legenda || ''; $('p', box).textContent = (g.legenda || '') + ' · ' + g.evento;
      box.showModal();
    });
    if (box) box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('button')) box.close(); });
    if (!real) $('#ov-g-note').hidden = false;
    renderG();
  }

  /* ===== calendário: ficheiro .ics para guardar a data na agenda ===== */
  document.querySelectorAll('[data-ics]').forEach(function (a) {
    var p = a.getAttribute('data-ics').split('|'); /* título|AAAAMMDD início|AAAAMMDD fim (exclusivo) */
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OVPCC 2027//PT', 'BEGIN:VEVENT',
      'UID:' + p[1] + '-ovpcc2027@human-iq.pt', 'DTSTAMP:20270101T000000Z',
      'DTSTART;VALUE=DATE:' + p[1], 'DTEND;VALUE=DATE:' + p[2],
      'SUMMARY:' + p[0], 'LOCATION:Oeiras Padel Academy\\, Rua Joaquim Paço de Arcos\\, n.º 1\\, 2740-286 Porto Salvo',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    a.setAttribute('download', p[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ics');
  });
})();

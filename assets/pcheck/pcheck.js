/* The Perfectionism Self-Check. Mounts into <div id="pcheck-root"></div>. */
(function () {
  'use strict';

  // Scoring cutoffs (judgment calls, tune freely).
  var PCHECK_STANDARDS_HIGH = 11; // Standards = sum of IDs 1-3 (range 3-15)
  var PCHECK_DISTRESS_HIGH = 36;  // Distress = sum of IDs 4-15 (range 12-60)

  var PCHECK_IMAGE_DIR = 'assets/pcheck/';

  var STATEMENTS = [
    { id: 1, text: 'My standards for my own work run higher than what my colleagues expect of themselves.' },
    { id: 2, text: 'I set demanding goals for myself and expect to reach them.' },
    { id: 3, text: 'Doing work at a high level matters to me, even on tasks nobody else will notice.' },
    { id: 4, text: 'When I hit a goal, I tend to move the target before I enjoy it.' },
    { id: 5, text: "When people tell me my work was great, I'm still stuck on what's wrong with it." },
    { id: 6, text: "The first thing I notice about finished work is what's wrong with it." },
    { id: 7, text: 'A mistake at work stays with me long after everyone else has moved on.' },
    { id: 8, text: 'If one piece of a project goes wrong, the whole thing feels ruined.' },
    { id: 9, text: 'When something goes wrong at work, part of me takes it as proof of what kind of person I am.' },
    { id: 10, text: 'I check and re-check my work well past the point where it helps.' },
    { id: 11, text: "I put off finishing things because they aren't quite right yet." },
    { id: 12, text: 'I replay small choices in my head, wondering if I got them right.' },
    { id: 13, text: "I get the sense that the people around me assume I don't make errors." },
    { id: 14, text: 'I assume my reputation takes a hit every time I get something wrong.' },
    { id: 15, text: 'Every time I perform well, the expectations around me go up a notch.' }
  ];
  var STANDARDS_IDS = [1, 2, 3];
  var DISTRESS_IDS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  var BOOK_GROUP = { label: 'Ask about the group', href: '/book.html?interest=group' };
  var BOOK_INDIVIDUAL = { label: 'Book an individual consultation', href: '/book.html?interest=individual' };
  var BOOK_FREE = { label: 'Book a free consultation', href: '/book.html?interest=individual' };

  var NOTE_988 = 'A note before you go: If the pressure or self-criticism has moved into hopelessness or thoughts of harming yourself, please reach out right away. The 988 Suicide & Crisis Lifeline is free and available 24/7. Call or text 988.';
  var DISCLAIMER = "This quiz is a self-reflection tool. It isn't a diagnosis or a clinical assessment.";

  var RESULTS = {
    healthy_striver: {
      name: 'The Healthy Striver',
      headline: 'You aim high and still get to enjoy the result.',
      body: [
        "Your answers show a high personal bar paired with a light grip on mistakes. You push for quality and care how the work turns out. A miss gets fixed and filed. That combination is less common than it sounds, and it's usually built on purpose, one rough project at a time.",
        'The one thing worth watching: this pattern holds up best when conditions are decent. A brutal quarter, a new boss, or a stretch of bad sleep can tip a high bar into a heavy one before you notice.'
      ],
      tags: [
        ['Driven.', 'You set demanding goals and expect to reach them.'],
        ['Satisfied.', 'Finishing something feels like finishing.'],
        ['Proportionate.', 'A mistake gets its actual size.'],
        ['Resilient.', 'Criticism stings for a moment and becomes information.'],
        ['Focused.', 'You put effort where it pays.'],
        ['Pressure-sensitive.', 'In a rough season, your usual balance gets tested.']
      ],
      nextStep: 'A group setting is a good place to compare notes with other high performers. An individual consult works well for pressure-testing your standards against a specific role or project. Both are optional ways to keep a good pattern in good repair.',
      buttons: [BOOK_GROUP, BOOK_INDIVIDUAL],
      show988: false
    },
    driven_depleted: {
      name: 'The Driven and Depleted',
      headline: "You hold a high bar, and it's costing you more than it returns.",
      body: [
        'Your answers show demanding personal standards with a lot of friction around them. Finishing rarely feels like finishing, mistakes stick, and a good share of your effort goes to checking, replaying, and bracing for the next evaluation. You probably produce excellent work. The price is that the satisfaction never arrives, so the next task starts in a hole.',
        'You likely also sense that other people expect you to stay flawless, which raises the stakes on every piece of work. The bar moves up each time you clear it.'
      ],
      tags: [
        ['Never satisfied.', 'Finishing something rarely feels like finishing.'],
        ['Replaying mistakes.', 'One error outweighs ten wins.'],
        ['Over-checking.', 'You review work past the point where it helps.'],
        ['Worn down.', 'The effort has outrun your recovery.'],
        ['Self-critical.', 'You hold yourself to a stricter standard than anyone else gets.'],
        ['Watched.', 'It feels like everyone expects you not to slip.']
      ],
      nextStep: "This pattern tends to respond well to individual therapy. I work on the self-criticism and the belief that worth is earned through flawless output. Group work adds something individual sessions can't: seeing other high performers carry the same pressure, which loosens the sense that you're the only one running this way.",
      buttons: [BOOK_INDIVIDUAL, BOOK_GROUP],
      show988: true
    },
    hidden_perfectionist: {
      name: 'The Hidden Perfectionist',
      headline: 'Your standards look moderate. Your inner review runs much harsher.',
      body: [
        "Your answers show a pattern that's easy to miss, including by you. You wouldn't call yourself a perfectionist, and your stated bar isn't unusually high. Yet mistakes stick, small decisions get replayed, and part of you assumes other people are watching for slips. The standard doing the damage may be one you believe other people hold for you.",
        "That makes this hard to spot from the inside. There's no lofty goal to point at as the source of the pressure, so it passes for ordinary stress or a personal flaw."
      ],
      tags: [
        ['Quietly exacting.', 'You scrutinize your own work more closely than you let on.'],
        ['Second-guessing.', 'Small choices get replayed after the fact.'],
        ['Mistake-sticky.', 'An error stays with you long after everyone else has moved on.'],
        ['Watched.', "You sense people assuming you won't slip."],
        ['Understated.', 'You downplay your standards, so the pressure goes unnoticed.'],
        ['Stalled.', 'Work waits for the moment it feels right.']
      ],
      nextStep: "Individual therapy is the strongest fit. The work is looking at the expectations you carry, where they came from, and how much of them anyone else actually holds. If you'd rather start with a conversation, a free consult is a good place to test whether this pattern fits.",
      buttons: [BOOK_FREE],
      show988: true
    },
    easygoing_realist: {
      name: 'The Easygoing Realist',
      headline: 'You keep your standards flexible and your mistakes in proportion.',
      body: [
        "Your answers show a moderate personal bar and a light grip on errors. You match effort to the stakes, a mistake gets handled and set down, and you don't feel every piece of work being graded. In a field that rewards intensity, that's a real asset, and it protects you from much of the burnout that comes with chasing flawless.",
        'One question is worth asking, since only you hold the answer: is the bar where you want it, or did it come down because you got tired? A standard you chose and a standard that dropped after a rough stretch look identical on this quiz.'
      ],
      tags: [
        ['Flexible.', 'You adjust the bar to the situation.'],
        ['Forgiving.', 'A mistake gets fixed and filed.'],
        ['Unpressured.', "You don't feel watched for every slip."],
        ['Steady.', "A setback doesn't shake your sense of who you are."],
        ['Selective.', 'You choose where extra effort pays off.'],
        ['Worth a look.', "Low standards can be a choice, and sometimes they're an adaptation after burnout."]
      ],
      nextStep: "Nothing in your answers points to a problem that needs fixing. If you're curious whether your relaxed standards are a choice or a retreat, or you want help rebuilding ambition at a sustainable pace, a free consult is a low-stakes place to talk it through. Group work is also a good way to meet other high performers who've found a pace they can hold.",
      buttons: [BOOK_FREE, BOOK_GROUP],
      show988: false
    }
  };

  var root = document.getElementById('pcheck-root');
  if (!root) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var order = [];
  var answers = {};
  var index = 0;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function sum(ids) {
    return ids.reduce(function (total, id) { return total + answers[id]; }, 0);
  }

  function classify(standards, distress) {
    var highStandards = standards >= PCHECK_STANDARDS_HIGH;
    var highDistress = distress >= PCHECK_DISTRESS_HIGH;
    if (highStandards && !highDistress) return 'healthy_striver';
    if (highStandards && highDistress) return 'driven_depleted';
    if (!highStandards && highDistress) return 'hidden_perfectionist';
    return 'easygoing_realist';
  }

  function scrollIntoViewIfAbove() {
    if (root.getBoundingClientRect().top < 0) {
      root.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  root.innerHTML =
    '<div class="pcheck-flow">' +
      '<h2 class="pcheck-title">The Perfectionism Self-Check</h2>' +
      '<p class="pcheck-sub">15 quick statements. Rate how true each one is for you, 1 to 5. No email required to see your result.</p>' +
      '<div class="pcheck-progress-row">' +
        '<span class="pcheck-progress-num" aria-hidden="true"></span>' +
        '<div class="pcheck-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="1" aria-valuemax="' + STATEMENTS.length + '"><div class="pcheck-progress-fill"></div></div>' +
      '</div>' +
      '<div class="pcheck-card">' +
        '<p class="pcheck-question" id="pcheck-question" tabindex="-1"></p>' +
        '<div class="pcheck-scale" role="group" aria-labelledby="pcheck-question">' +
          [1, 2, 3, 4, 5].map(function (v) {
            var hint = v === 1 ? ', Not me at all' : v === 5 ? ', Exactly me' : '';
            return '<button type="button" class="pcheck-scale-btn" data-val="' + v + '" aria-label="' + v + hint + '">' + v + '</button>';
          }).join('') +
        '</div>' +
        '<div class="pcheck-scale-labels" aria-hidden="true"><span>Not me at all</span><span>Exactly me</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="pcheck-result" hidden></div>';

  var flow = root.querySelector('.pcheck-flow');
  var resultEl = root.querySelector('.pcheck-result');
  var card = root.querySelector('.pcheck-card');
  var questionEl = root.querySelector('.pcheck-question');
  var progressNum = root.querySelector('.pcheck-progress-num');
  var progressTrack = root.querySelector('.pcheck-progress-track');
  var progressFill = root.querySelector('.pcheck-progress-fill');

  function showQuestion() {
    var total = order.length;
    questionEl.textContent = order[index].text;
    progressNum.textContent = pad(index + 1) + ' / ' + pad(total);
    progressFill.style.width = ((index + 1) / total) * 100 + '%';
    progressTrack.setAttribute('aria-valuenow', String(index + 1));
    progressTrack.setAttribute('aria-valuetext', 'Statement ' + (index + 1) + ' of ' + total);
    card.classList.remove('pcheck-animate');
    void card.offsetWidth;
    card.classList.add('pcheck-animate');
  }

  function start() {
    order = shuffle(STATEMENTS);
    answers = {};
    index = 0;
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    flow.hidden = false;
    showQuestion();
  }

  function renderResult() {
    var standards = sum(STANDARDS_IDS);
    var distress = sum(DISTRESS_IDS);
    var slug = classify(standards, distress);
    var r = RESULTS[slug];

    var html =
      '<div class="pcheck-result-img-wrap"><img class="pcheck-result-img" src="' + PCHECK_IMAGE_DIR + 'result-' + slug.replace(/_/g, '-') + '.png" alt="' + esc(r.name) + ' illustration" width="160" height="160"></div>' +
      '<span class="pcheck-result-label">Your result: ' + esc(r.name) + '</span>' +
      '<h3 class="pcheck-result-headline" tabindex="-1">' + esc(r.headline) + '</h3>' +
      r.body.map(function (p) { return '<p class="pcheck-result-body">' + esc(p) + '</p>'; }).join('') +
      '<h4 class="pcheck-section-title">What This Pattern Tends to Look Like</h4>' +
      '<ul class="pcheck-tags">' +
        r.tags.map(function (t) { return '<li><strong>' + esc(t[0]) + '</strong> ' + esc(t[1]) + '</li>'; }).join('') +
      '</ul>' +
      '<h4 class="pcheck-section-title">A Next Step</h4>' +
      '<p class="pcheck-result-body">' + esc(r.nextStep) + '</p>' +
      '<div class="pcheck-cta-row">' +
        r.buttons.map(function (b, i) {
          return '<a class="pcheck-btn' + (i > 0 ? ' pcheck-btn-secondary' : '') + '" href="' + b.href + '">' + esc(b.label) + '</a>';
        }).join('') +
      '</div>' +
      (r.show988 ? '<p class="pcheck-988">' + esc(NOTE_988) + '</p>' : '') +
      '<p class="pcheck-disclaimer">' + esc(DISCLAIMER) + '</p>' +
      '<button type="button" class="pcheck-restart">Take it again</button>' +
      /*
       * EMAIL CAPTURE PLACEHOLDER (MailerLite, not connected yet).
       * Hidden on purpose so visitors can't type an email that goes nowhere.
       * To connect, mirror quiz.html: one MailerLite form + group + automation per result,
       * POST to https://assets.mailerlite.com/jsonp/2088871/forms/<formId>/subscribe
       * with fields[email], ml-submit=1, anticsrf=true, then remove the `hidden` attribute.
       */
      '<div class="pcheck-email" hidden>' +
        '<p class="pcheck-email-title">Get your full ' + esc(r.name.replace(/^The /, '')) + ' report by email</p>' +
        '<form class="pcheck-email-form">' +
          '<input type="email" class="pcheck-email-input" placeholder="you@email.com" aria-label="Email address" autocomplete="email" required>' +
          '<button type="submit" class="pcheck-btn">Send my report</button>' +
        '</form>' +
      '</div>';

    resultEl.innerHTML = html;
    var img = resultEl.querySelector('.pcheck-result-img');
    var imgWrap = resultEl.querySelector('.pcheck-result-img-wrap');
    img.addEventListener('load', function () { imgWrap.classList.add('pcheck-loaded'); });
    img.addEventListener('error', function () { imgWrap.remove(); });

    flow.hidden = true;
    resultEl.hidden = false;
    scrollIntoViewIfAbove();
    resultEl.querySelector('.pcheck-result-headline').focus({ preventScroll: true });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'quiz_complete', {
        quiz_name: 'perfectionism_self_check',
        standards_score: standards,
        distress_score: distress,
        result: slug
      });
    }
  }

  root.querySelector('.pcheck-scale').addEventListener('click', function (e) {
    var btn = e.target.closest('.pcheck-scale-btn');
    if (!btn) return;
    var fromKeyboard = e.detail === 0;
    answers[order[index].id] = parseInt(btn.dataset.val, 10);
    btn.blur();
    if (index < order.length - 1) {
      index++;
      showQuestion();
      if (fromKeyboard) questionEl.focus({ preventScroll: true });
    } else {
      renderResult();
    }
  });

  resultEl.addEventListener('click', function (e) {
    if (!e.target.closest('.pcheck-restart')) return;
    start();
    scrollIntoViewIfAbove();
    questionEl.focus({ preventScroll: true });
  });

  start();
})();

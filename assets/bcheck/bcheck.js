/* The Burnout and Fatigue Self-Check. Mounts into <div id="bcheck-root"></div>. */
(function () {
  'use strict';

  // Scoring cutoffs (judgment calls, tune freely).
  var BCHECK_SATISFACTION_HIGH = 18; // Satisfaction = sum of IDs 1-5 (range 5-25)
  var BCHECK_STRAIN_HIGH = 30;       // Strain = sum of IDs 6-15 (range 10-50)

  var BCHECK_IMAGE_DIR = 'assets/bcheck/';

  // Each MailerLite form feeds a group whose automation sends that result's report email.
  var MAILERLITE_ACCOUNT_ID = '2088871';
  var REPORT_FORM_IDS = {
    sustained_professional: '200637609910731972',
    devoted_drained: '200637610571335436',
    quietly_disengaged: '200637611215160520',
    depleted_disconnected: '200637611918755586'
  };

  var STATEMENTS = [
    { id: 1, text: 'I can name specific ways my work makes a difference.' },
    { id: 2, text: 'When I look back on a good week, the effort feels worth it.' },
    { id: 3, text: "I'm proud of how I do my job." },
    { id: 4, text: "I'd choose this line of work again." },
    { id: 5, text: 'Some days I leave work with more energy than I came in with.' },
    { id: 6, text: 'By the end of the workweek, I have nothing left.' },
    { id: 7, text: 'My workload has no bottom, no matter how much I get done.' },
    { id: 8, text: 'I feel stuck in this job with no good way out.' },
    { id: 9, text: 'Red tape and process keep me from the work that matters.' },
    { id: 10, text: 'I dread the start of my workweek.' },
    { id: 11, text: "Thoughts about the people I work with show up when I'm off the clock." },
    { id: 12, text: 'Hard situations from work cost me sleep.' },
    { id: 13, text: 'My body reacts, with a racing heart or a tight chest, when I think about the hard parts of my job.' },
    { id: 14, text: "I've started steering clear of certain cases, clients, or conversations I used to take on." },
    { id: 15, text: 'After a heavy day, I feel flat, as if my emotions have been switched off.' }
  ];
  var SATISFACTION_IDS = [1, 2, 3, 4, 5];
  var BURNOUT_IDS = [6, 7, 8, 9, 10];
  var SECONDARY_STRESS_IDS = [11, 12, 13, 14, 15];

  var BOOK_GROUP = { label: 'Ask about the group', href: '/book.html?interest=group' };
  var BOOK_INDIVIDUAL = { label: 'Book an individual consultation', href: '/book.html?interest=individual' };
  var BOOK_FREE = { label: 'Book a free consultation', href: '/book.html?interest=individual' };

  var NOTE_988 = 'A note before you go: If the strain has moved into hopelessness or thoughts of harming yourself, please reach out right away. The 988 Suicide & Crisis Lifeline is free and available 24/7. Call or text 988.';
  var DISCLAIMER = "This quiz is a self-reflection tool. It isn't a diagnosis or a clinical assessment.";
  var RESEARCH_NOTE = 'Informed by research on compassion satisfaction, burnout, and secondary traumatic stress.';

  var RESULTS = {
    sustained_professional: {
      name: 'The Sustained Professional',
      headline: 'Your work gives back about as much as it takes.',
      body: [
        "Your answers show real meaning in the work and a load you can carry. You can point to how the job matters, a good week feels worth the effort, and the hard parts of the work mostly stay at work. In helping and high-pressure fields, that's the combination most people are trying to build.",
        "The thing to watch: strain builds slowly, and it tends to build while everything still looks fine. A staffing gap, a heavy caseload, or a run of hard cases can shift this pattern faster than you'd expect."
      ],
      nextStep: "Nothing in your answers needs fixing. A group setting is a good place to compare notes with other professionals who've found a sustainable pace, and an individual consult works for pressure-testing your load against a specific role. Both are optional ways to keep a good pattern in good repair.",
      buttons: [BOOK_FREE, BOOK_GROUP],
      show988: false
    },
    devoted_drained: {
      name: 'The Devoted and Drained',
      headline: "You believe in the work, and it's taking more than you can spare.",
      body: [
        "Your answers show strong meaning alongside real strain. You can say why the work matters, and you're running low anyway: a heavy load, hard days that cost you sleep, and the tough parts of the job following you home. People who care a lot land here often, and it's easy to miss because purpose keeps you going well past the point where the tank is empty.",
        'When meaning stays high, exhaustion is easy to explain away. The work is worth it, so the cost starts to feel like the price of doing it.'
      ],
      nextStep: "This pattern tends to respond well to individual therapy. The work is looking at load, boundaries, and the guilt that comes with easing off, plus processing the heavier parts of the job. Group work adds something individual sessions can't: other professionals carrying the same weight, which loosens the sense that you're the only one running this way.",
      buttons: [BOOK_INDIVIDUAL, BOOK_GROUP],
      show988: true
    },
    quietly_disengaged: {
      name: 'The Quietly Disengaged',
      headline: "You're not overloaded, and you're not fully there either.",
      body: [
        "Your answers show manageable strain and a thin sense of meaning. The load is workable, the hard parts of the job stay put, and the work isn't giving much back. You may feel flat about it more than miserable.",
        "Because nothing is on fire, this can run for years without anyone, including you, calling it a problem."
      ],
      nextStep: 'Nothing urgent here. A free consult is a low-stakes place to sort out which explanation fits, and whether anything needs to change. A group is also a way to meet other professionals working through the same questions.',
      buttons: [BOOK_FREE, BOOK_GROUP],
      show988: false
    },
    depleted_disconnected: {
      name: 'The Depleted and Disconnected',
      headline: 'The work is wearing you down and giving little back.',
      body: [
        "Your answers show high strain and thin meaning together, the classic burnout picture. You're running on empty, the load feels endless, the tough parts of the job follow you home, and the sense that your work matters has faded. That pairing is exhausting in a particular way: effort keeps going out and not much comes back.",
        "This is common among people who've carried a lot for a long time, and it deserves to be taken seriously, even if you've been pushing through it."
      ],
      nextStep: 'Individual therapy is the strongest fit. The work covers load, boundaries, the meaning that has thinned out, and what you\'ve been carrying. If sleep, appetite, or mood have changed, a check-in with your doctor is worth adding. Group work helps with the isolation that tends to come with burnout.',
      buttons: [BOOK_INDIVIDUAL, BOOK_GROUP],
      show988: true
    }
  };

  var root = document.getElementById('bcheck-root');
  if (!root) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var order = [];
  var answers = {};
  var index = 0;
  var currentSlug = null;

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

  function classify(satisfaction, strain) {
    var highSatisfaction = satisfaction >= BCHECK_SATISFACTION_HIGH;
    var highStrain = strain >= BCHECK_STRAIN_HIGH;
    if (highSatisfaction && !highStrain) return 'sustained_professional';
    if (highSatisfaction && highStrain) return 'devoted_drained';
    if (!highSatisfaction && !highStrain) return 'quietly_disengaged';
    return 'depleted_disconnected';
  }

  function scrollIntoViewIfAbove() {
    if (root.getBoundingClientRect().top < 0) {
      root.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  root.innerHTML =
    '<div class="bcheck-flow">' +
      '<h1 class="bcheck-title">The Burnout and Fatigue Self-Check</h1>' +
      '<p class="bcheck-sub">15 quick statements about the past month. Rate how true each one is for you, 1 to 5. No email required to see your result.</p>' +
      '<div class="bcheck-progress-row">' +
        '<span class="bcheck-progress-num" aria-hidden="true"></span>' +
        '<div class="bcheck-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="1" aria-valuemax="' + STATEMENTS.length + '"><div class="bcheck-progress-fill"></div></div>' +
      '</div>' +
      '<div class="bcheck-card">' +
        '<p class="bcheck-question" id="bcheck-question" tabindex="-1"></p>' +
        '<div class="bcheck-scale" role="group" aria-labelledby="bcheck-question">' +
          [1, 2, 3, 4, 5].map(function (v) {
            var hint = v === 1 ? ', Not me at all' : v === 5 ? ', Exactly me' : '';
            return '<button type="button" class="bcheck-scale-btn" data-val="' + v + '" aria-label="' + v + hint + '">' + v + '</button>';
          }).join('') +
        '</div>' +
        '<div class="bcheck-scale-labels" aria-hidden="true"><span>Not me at all</span><span>Exactly me</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="bcheck-result" hidden></div>';

  var flow = root.querySelector('.bcheck-flow');
  var resultEl = root.querySelector('.bcheck-result');
  var card = root.querySelector('.bcheck-card');
  var questionEl = root.querySelector('.bcheck-question');
  var progressNum = root.querySelector('.bcheck-progress-num');
  var progressTrack = root.querySelector('.bcheck-progress-track');
  var progressFill = root.querySelector('.bcheck-progress-fill');

  function showQuestion() {
    var total = order.length;
    questionEl.textContent = order[index].text;
    progressNum.textContent = pad(index + 1) + ' / ' + pad(total);
    progressFill.style.width = ((index + 1) / total) * 100 + '%';
    progressTrack.setAttribute('aria-valuenow', String(index + 1));
    progressTrack.setAttribute('aria-valuetext', 'Statement ' + (index + 1) + ' of ' + total);
    card.classList.remove('bcheck-animate');
    void card.offsetWidth;
    card.classList.add('bcheck-animate');
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
    var satisfaction = sum(SATISFACTION_IDS);
    var burnout = sum(BURNOUT_IDS);
    var secondaryStress = sum(SECONDARY_STRESS_IDS);
    var strain = burnout + secondaryStress;
    var slug = classify(satisfaction, strain);
    var r = RESULTS[slug];
    currentSlug = slug;

    var html =
      '<div class="bcheck-result-img-wrap"><img class="bcheck-result-img" src="' + BCHECK_IMAGE_DIR + 'result-' + slug.replace(/_/g, '-') + '.png" alt="' + esc(r.name) + ' illustration" width="160" height="160"></div>' +
      '<span class="bcheck-result-label">Your result: ' + esc(r.name) + '</span>' +
      '<h2 class="bcheck-result-headline" tabindex="-1">' + esc(r.headline) + '</h2>' +
      r.body.map(function (p) { return '<p class="bcheck-result-body">' + esc(p) + '</p>'; }).join('') +
      '<h3 class="bcheck-section-title">A Next Step</h3>' +
      '<p class="bcheck-result-body">' + esc(r.nextStep) + '</p>' +
      '<div class="bcheck-cta-row">' +
        r.buttons.map(function (b, i) {
          return '<a class="bcheck-btn' + (i > 0 ? ' bcheck-btn-secondary' : '') + '" href="' + b.href + '">' + esc(b.label) + '</a>';
        }).join('') +
      '</div>' +
      (r.show988 ? '<p class="bcheck-988">' + esc(NOTE_988) + '</p>' : '') +
      '<p class="bcheck-disclaimer">' + esc(DISCLAIMER) + '</p>' +
      '<p class="bcheck-research">' + esc(RESEARCH_NOTE) + '</p>' +
      '<button type="button" class="bcheck-restart">Take it again</button>' +
      '<div class="bcheck-email">' +
        '<p class="bcheck-email-title">Get your full ' + esc(r.name.replace(/^The /, '')) + ' report by email</p>' +
        '<p class="bcheck-email-desc">Your full result, plus what this pattern tends to look like day to day.</p>' +
        '<form class="bcheck-email-form">' +
          '<input type="email" class="bcheck-email-input" placeholder="you@email.com" aria-label="Email address" autocomplete="email" required>' +
          '<button type="submit" class="bcheck-btn bcheck-email-submit">Send my report</button>' +
        '</form>' +
        '<p class="bcheck-email-fine">You\'ll also get occasional emails from me on men\'s mental health. Unsubscribe anytime.</p>' +
        '<p class="bcheck-email-status" role="status" aria-live="polite"></p>' +
      '</div>';

    resultEl.innerHTML = html;
    var img = resultEl.querySelector('.bcheck-result-img');
    var imgWrap = resultEl.querySelector('.bcheck-result-img-wrap');
    img.addEventListener('load', function () { imgWrap.classList.add('bcheck-loaded'); });
    img.addEventListener('error', function () { imgWrap.remove(); });

    flow.hidden = true;
    resultEl.hidden = false;
    scrollIntoViewIfAbove();
    resultEl.querySelector('.bcheck-result-headline').focus({ preventScroll: true });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'quiz_complete', {
        quiz_name: 'burnout_fatigue_self_check',
        satisfaction_score: satisfaction,
        strain_score: strain,
        burnout_score: burnout,
        secondary_stress_score: secondaryStress,
        result: slug
      });
    }
  }

  root.querySelector('.bcheck-scale').addEventListener('click', function (e) {
    var btn = e.target.closest('.bcheck-scale-btn');
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
    if (!e.target.closest('.bcheck-restart')) return;
    start();
    scrollIntoViewIfAbove();
    questionEl.focus({ preventScroll: true });
  });

  resultEl.addEventListener('submit', function (e) {
    var form = e.target.closest('.bcheck-email-form');
    if (!form) return;
    e.preventDefault();
    var formId = REPORT_FORM_IDS[currentSlug];
    if (!formId) return;
    var block = form.closest('.bcheck-email');
    var submit = form.querySelector('.bcheck-email-submit');
    var fine = block.querySelector('.bcheck-email-fine');
    var status = block.querySelector('.bcheck-email-status');
    var slug = currentSlug;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.textContent = '';
    var body = new URLSearchParams({ 'fields[email]': form.querySelector('.bcheck-email-input').value.trim(), 'ml-submit': '1', 'anticsrf': 'true' });
    fetch('https://assets.mailerlite.com/jsonp/' + MAILERLITE_ACCOUNT_ID + '/forms/' + formId + '/subscribe', { method: 'POST', body: body })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok || !data.success) throw new Error('MailerLite rejected the signup');
        });
      })
      .then(function () {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { source: 'burnout_fatigue_self_check', quiz_result: slug });
        }
        form.hidden = true;
        fine.hidden = true;
        status.textContent = "Check your inbox, your report is on its way. If it's not there in a few minutes, check your spam or Promotions folder.";
      })
      .catch(function () {
        submit.disabled = false;
        submit.textContent = 'Send my report';
        status.textContent = 'Something went wrong sending your report. Please try again, or email brian@adaptationsdenver.com.';
      });
  });

  start();
})();

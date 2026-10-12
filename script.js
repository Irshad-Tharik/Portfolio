
(function () {

  // Accessible mobile navigation: open/close, close after selection, Escape support.
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-navigation');
  if (navToggle && primaryNav) {
    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      primaryNav.classList.remove('is-open');
    }
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      primaryNav.classList.toggle('is-open', open);
    });
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 700) closeNav();
    });
  }

  var loader = document.getElementById('loader');
  var count = document.getElementById('count');
  var bar = document.getElementById('bar');

  var start = null;
  var dur = 2000;

  function tick(t) {
    if (!start) start = t;

    var p = Math.min((t - start) / dur, 1);
    var e = 1 - Math.pow(1 - p, 3);
    var n = Math.round(e * 100);

    if (count) count.textContent = n;
    if (bar) bar.style.width = n + '%';

    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      finish();
    }
  }

  function finish() {
    if (loader) loader.classList.add('done');

    document.body.classList.remove('loading');

    setTimeout(function () {
      document.body.classList.add('ready');

      document.querySelectorAll('.hero .rv').forEach(function (el) {
        el.classList.add('in');
      });
    }, 350);

    setTimeout(function () {
      if (loader) loader.style.display = 'none';
    }, 1400);
  }

  requestAnimationFrame(tick);

  // Casual, conversational introduction
  var lines = [
    "Hey! I'm Mohamed Tharik. I'm a Computer Science undergraduate, and I love building mobile apps.",
    "I mainly work with Flutter and Dart. I also enjoy designing clean interfaces and working with Firebase and REST APIs.",
    "I like turning ideas into useful apps, creating smooth user experiences, and connecting apps to their backends.",
    "Got an idea? Let's bring it to life together!"
  ];

  // Optional recorded voice or introduction video
  var INTRO_VIDEO = '';
  var INTRO_AUDIO = 'assets/intro-voice.mp3';

  var say = document.getElementById('say');
  var playBtn = document.getElementById('play');
  var ph = document.getElementById('face');

  if (!say || !playBtn || !ph) return;

  var frame = ph.parentNode;
  var busy = false;
  var mt, nt, lastB = 0;
  var charDelay = 35;
  var audio = null;

  var synth = window.speechSynthesis;
  var voice = null;
  var maleVoice = false;

  var calmMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Choose the best available English voice
  function pickVoice() {
    if (!synth) return;

    var all = synth.getVoices();

    var english = all.filter(function (v) {
      return /^en/i.test(v.lang);
    });

    if (!english.length) english = all;

    // Prefer natural-sounding voices when available
    var preferred = [
      /aria.*natural/i,
      /guy.*natural/i,
      /jenny.*natural/i,
      /ryan.*natural/i,
      /microsoft aria/i,
      /microsoft guy/i,
      /natural|neural/i
    ];

    voice = null;
    maleVoice = false;

    for (var i = 0; i < preferred.length && !voice; i++) {
      voice = english.find(function (v) {
        return preferred[i].test(v.name);
      }) || null;
    }

    // Fall back to an English voice
    if (!voice) {
      voice = english.find(function (v) {
        return /male|daniel|david|guy|ryan/i.test(v.name);
      }) || english[0] || null;
    }

    if (voice) {
      maleVoice = /male|daniel|david|guy|ryan/i.test(voice.name);
    }

    // Keep the selected system voice internal; do not display its name in the hero.
    var vn = document.getElementById('vn');
    if (vn) vn.textContent = '';
  }

  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }


  // ===== Voice-synced subtitles (word by word) and mouth movement =====
  var ENV = '003FSYZXWWXXWSOKHC400000000000003DPXZYWSOOQUUQLKQVXUPORSOE40007NWWVTPKHIJIC4004DE50000000000005GMGAFKKLLIHKLLNRSQRTUTSVYZYWUUUTTTSQNPVYTLKOPONNPRQI606IRTTUUTQGAGMLKLORRND400004CILNOPRVXVTQPRTTSQOOQSSRMGFJLFAITXWURI503DMQQPNKIKOOMIGHHJMQSTRJBGPRSRONQUWWWVUL76KWZZYN74DIKKE8DLQSRJ65KVZYVPLKJIHB3008PYYXVOD300000000000000000000006KUWUTUWWUTQOOPRRQONOQTVVUL6006KRKCHKGA34EKLNSVVUSRSTTTTRNIHLPQQPH66JRTTTSRRRQNE4000006JPNKKLOQRROGBIQSQONPTUUTQG403BHID45GOQPMKIC4005HOQPMJD47MTSPLE4003CKOPPPPOMLLNOPQSUUSRQQPNNQSSSSRQNFAHMLKKMQRQQPMKMONMMLF9EJJKJC7DLOPQQQQPPPPOONOOLIGFHHFFGHKNPPPQSUUSSSOIB407MUTQONNOPPOGBJRSUXZYVTTTSRRRQOMJJOWYO705HOI66JRRPH600003CMTWXWVSPG57NXZZZWL605FNQSTTRNKHB9IPRQNEBLXZYVOLLKID4004HTYZYWPE4000000000000000000000004FQVYYYXWVUVXXWVUTTSQQRTVUQG5006KRJ64DD404GSWXXWVUTSPHBHPQQPONNQVYZXNBELMMKJIMRUTPMQWYVNMOPNLE45FKJJMPSUVVVVUUTSQOMJJQXZYSMPRME9FLKIJLOSUURI65HNNNRUUL706HNGBIOLJMPPONOPQPOMMLKJKLKD404DE8BB4004FLMKGFHKPTVXXWUTSRJ64ENRSRJ605GPTUTRPH56HOPPMIB9KVZZXRMLLKD404EPVYZWL600007NXZZWM7000000000000000000000006JTVUROMMMNOQUXYXVUQKGB7ERVRNORSRRQPPQTUVURI64EKMNOPRRRPOQTURG8BFEHRTND4005GOQPNKKQTSQOPQPOPQOHCNXZWL64FNQRRRQPOONLIFIRXWQLJKJJMPOE46IOMF500003BIOTTQH50003CLSVWVUTRQOLE40000005GPSSSTSROKHHC8DMPQOH56KVYZWMBDJKIC40000003AFGC4000000000000000000000000000005HSXZYWUUUTTVXXXULCGPSTUVWVTK6007LUVVVTQMIGKRVXXXVRG506IQSTTSQONNQTVULCKWZZXVVVUUTRI60000000000000000000006IRUSOOVYPCFRWXVSJDNYZYWSOG54GRUSRQLC34EKNRVWWUSPH53FSXTPMJJNRSQNE8CFEDA30000000000';
  // [start, end, text, startsNewSubtitle] in seconds of intro-voice.mp3
  var SUB = [
    [0.06, 0.41, "Hey,", 1],
    [0.66, 1.67, "I'm Mohamed Tharik,", 0],
    [1.87, 3.42, "a Computer Science undergraduate", 1],
    [3.43, 4.61, "passionate about building", 1],
    [4.62, 6.06, "mobile apps and websites.", 1],
    [6.51, 8.18, "I mainly work with Flutter and Dart", 1],
    [8.19, 9.53, "for mobile app development,", 1],
    [9.54, 11.33, "and I enjoy creating clean,", 1],
    [11.34, 12.46, "user-friendly designs", 1],
    [12.47, 14.14, "for both apps and websites.", 1],
    [14.64, 15.99, "I also work with Firebase", 1],
    [16.00, 18.20, "and REST APIs to connect applications", 1],
    [18.21, 20.12, "with reliable backend services.", 1],
    [20.55, 21.77, "I love turning ideas", 1],
    [21.78, 23.17, "into digital experiences", 1],
    [23.18, 25.14, "that look great and work smoothly.", 1],
    [25.60, 27.44, "Got an idea for an app or website?", 1],
    [27.70, 29.20, "Let's build something great together.", 1]
  ];

  var WORDS = [];
  (function buildWords() {
    var chunk = -1;
    function syl(w) {
      var m = w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g);
      return Math.max(1, m ? m.length : 1) + 0.35;
    }
    SUB.forEach(function (s) {
      if (s[3]) chunk++;
      var ws = s[2].split(' ');
      var wt = ws.map(syl);
      var sum = wt.reduce(function (a, b) { return a + b; }, 0);
      var t = s[0];
      ws.forEach(function (w, i) {
        WORDS.push({ t: t - 0.04, w: w, c: chunk });
        t += (s[1] - s[0]) * wt[i] / sum;
      });
    });
  })();

  var DEFAULT_SAY = say.textContent;
  var raf = 0, lastIdx = -2, openCur = 0;

  function renderSubtitle(idx) {
    if (idx === lastIdx) return;
    lastIdx = idx;
    if (idx < 0) { say.textContent = ''; return; }
    var c = WORDS[idx].c, out = [];
    for (var i = idx; i >= 0 && WORDS[i].c === c; i--) out.unshift(WORDS[i].w);
    say.textContent = out.join(' ');
  }

  // Mouth: the jaw region is gently stretched downward with a dark mouth interior
  var mouthCv = document.getElementById('mouthcv');
  var photo = ph.querySelector('.avatar-photo');
  var mctx = null, jaw = null, jawS = 1;
  var M = { W: 1087, H: 1447, lipY: 639, cx: 550, half: 50, maxDy: 17,
            sx0: 440, sx1: 660, jh: 112, lip: 33 };

  function initMouth() {
    if (!mouthCv || !photo || !photo.naturalWidth) return;
    try {
      mctx = mouthCv.getContext('2d');
      jawS = photo.naturalWidth / M.W;
      var w = (M.sx1 - M.sx0), jc = document.createElement('canvas');
      jc.width = Math.round(w * jawS);
      jc.height = Math.round(M.jh * jawS);
      var jx = jc.getContext('2d');
      jx.drawImage(photo, M.sx0 * jawS, M.lipY * jawS, jc.width, jc.height, 0, 0, jc.width, jc.height);
      var g = jx.createLinearGradient(0, 0, jc.width, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.25, 'rgba(0,0,0,1)');
      g.addColorStop(0.75, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      jx.globalCompositeOperation = 'destination-in';
      jx.fillStyle = g;
      jx.fillRect(0, 0, jc.width, jc.height);
      jaw = jc;
      drawMouth(0);
      photo.style.opacity = '0';
    } catch (e) {
      mctx = null; jaw = null;
      photo.style.opacity = '1';
    }
  }

  function drawMouth(open) {
    if (!mctx || !jaw) return;
    var dy = open * M.maxDy;
    mctx.clearRect(0, 0, M.W, M.H);
    mctx.drawImage(photo, 0, 0, M.W, M.H);
    if (dy < 0.5) return;

    var x0 = M.cx - M.half, x1 = M.cx + M.half, y = M.lipY;
    mctx.save();
    mctx.beginPath();
    mctx.moveTo(x0, y);
    mctx.lineTo(x1, y);
    mctx.quadraticCurveTo(M.cx, y + dy * 2.05, x0, y);
    mctx.closePath();
    mctx.clip();
    var g = mctx.createLinearGradient(0, y, 0, y + dy);
    g.addColorStop(0, '#8f817a');
    g.addColorStop(0.22, '#4a2323');
    g.addColorStop(1, '#170808');
    mctx.fillStyle = g;
    mctx.fillRect(x0, y, x1 - x0, dy + 3);
    mctx.restore();

    var sw = M.sx1 - M.sx0;
    for (var j = 0; j < M.jh; j += 2) {
      var wgt = 1;
      if (j > M.lip) {
        var u = (j - M.lip) / (M.jh - M.lip);
        wgt = 1 - u * u * (3 - 2 * u);
      }
      mctx.drawImage(jaw, 0, j * jawS, jaw.width, 2 * jawS,
                     M.sx0, y + j + dy * wgt, sw, 2.6);
    }
  }

  function startSynced() {
    frame.classList.add('talking');
    cancelAnimationFrame(raf);
    lastIdx = -2;
    renderSubtitle(-1);

    var p = audio.play();
    if (p && p.catch) {
      p.catch(function () {
        stopSynced(false);
        playBtn.textContent = '▶ Watch my intro';
      });
    }

    (function loop() {
      var t = audio.currentTime, idx = -1;
      for (var i = 0; i < WORDS.length; i++) {
        if (WORDS[i].t <= t) idx = i; else break;
      }
      renderSubtitle(idx);

      var k = Math.min(ENV.length - 1, Math.floor(t * 50));
      var target = k >= 0 ? parseInt(ENV.charAt(k), 36) / 35 : 0;
      if (calmMotion) target *= 0.5;
      openCur += (target - openCur) * (target > openCur ? 0.55 : 0.3);
      drawMouth(openCur);

      raf = requestAnimationFrame(loop);
    })();
  }

  function stopSynced(finished) {
    cancelAnimationFrame(raf);
    openCur = 0;
    drawMouth(0);
    frame.classList.remove('talking');
    busy = false;
    if (finished !== false) {
      playBtn.textContent = '▶ Watch again';
      setTimeout(function () {
        if (!busy) say.textContent = DEFAULT_SAY;
      }, 1500);
    }
  }

  if (photo) {
    if (photo.complete) initMouth(); else photo.addEventListener('load', initMouth);
  }

  // Avatar mouth and head movement
  function setO(v) {
    ph.style.setProperty('--o', v);
  }

  function pulse() {
    setO((0.5 + Math.random() * 0.5).toFixed(2));

    setTimeout(function () {
      setO(0.12);
    }, 120);
  }

  function startMotion() {
    frame.classList.add('talking');

    if (calmMotion) return;

    mt = setInterval(function () {
      if (Date.now() - lastB > 520) pulse();
    }, 210);

    nt = setInterval(function () {
      ph.style.setProperty(
        '--n',
        (Math.random() * 2 - 1).toFixed(2)
      );
    }, 520);
  }

  function stopMotion() {
    clearInterval(mt);
    clearInterval(nt);

    setO(0);
    ph.style.setProperty('--n', 0);

    frame.classList.remove('talking');
  }

  // Display the words progressively
  function type(txt, done) {
    var i = 0;
    say.textContent = '';

    function step() {
      if (i < txt.length) {
        say.textContent += txt[i++];
        setTimeout(step, charDelay);
      } else {
        done();
      }
    }

    step();
  }

  // Speak naturally using the best available browser voice
  function speak(txt, done) {
    if (INTRO_AUDIO || !synth) {
      done();
      return;
    }

    var finished = false;

    function end() {
      if (!finished) {
        finished = true;
        done();
      }
    }

    var u = new SpeechSynthesisUtterance(txt);

    pickVoice();

    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = 'en-US';
    }

    // Relaxed conversational delivery
    u.rate = 0.91;
    u.pitch = 1.0;
    u.volume = 1;

    u.onboundary = function () {
      lastB = Date.now();

      if (!calmMotion) pulse();
    };

    u.onend = end;
    u.onerror = end;

    synth.speak(u);

    setTimeout(end, txt.length * 150 + 2500);
  }

  function endTalk() {
    stopMotion();
    playBtn.textContent = '▶ Watch again';
    busy = false;
  }

  // Play an optional introduction video
  function playVideo() {
    var v = ph.querySelector('video');

    if (!v) {
      v = document.createElement('video');
      v.className = 'vid';
      v.src = INTRO_VIDEO;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      ph.appendChild(v);
    }

    ph.classList.add('hasvid');
    frame.classList.add('talking');
    say.textContent = lines.join(' ');

    v.currentTime = 0;

    v.onended = function () {
      ph.classList.remove('hasvid');
      frame.classList.remove('talking');
      playBtn.textContent = '▶ Watch again';
      busy = false;
    };

    v.onerror = function () {
      ph.classList.remove('hasvid');
      INTRO_VIDEO = '';
      frame.classList.remove('talking');
      busy = false;
      playBtn.click();
    };

    var result = v.play();

    if (result && result.catch) {
      result.catch(function () {
        ph.classList.remove('hasvid');
        frame.classList.remove('talking');
        busy = false;
        playBtn.textContent = '▶ Watch my intro';
      });
    }
  }

  // Speak each sentence in sequence
  function playLines() {
    startMotion();

    var n = 0;

    function next() {
      if (n >= lines.length) {
        endTalk();
        return;
      }

      var txt = lines[n++];
      var completed = 0;

      function both() {
        completed++;

        if (completed === 2) {
          setTimeout(next, 550);
        }
      }

      type(txt, both);
      speak(txt, both);
    }

    next();
  }

  playBtn.addEventListener('click', function () {
    if (busy) return;

    busy = true;
    playBtn.textContent = 'Playing...';

    if (synth) synth.cancel();

    if (INTRO_VIDEO) {
      playVideo();
      return;
    }

    if (INTRO_AUDIO) {
      audio = audio || new Audio(INTRO_AUDIO);
      audio.currentTime = 0;

      function go() {
        var total = lines.join('').length;

        charDelay = Math.max(
          20,
          Math.min(
            90,
            (audio.duration * 1000 - lines.length * 550) / total
          )
        );

        audio.onended = function () { stopSynced(true); };
        startSynced();
      }

      if (audio.readyState > 0) {
        go();
      } else {
        audio.onloadedmetadata = go;
      }

      audio.onerror = function () {
        INTRO_AUDIO = '';
        busy = false;
        playBtn.click();
      };

      return;
    }

    playLines();
  });

  // Moving spotlight background
  var bg = document.getElementById('bg');
  var spotEl = document.getElementById('spot');
  var glowEl = document.getElementById('glow');

  if (bg && spotEl && glowEl) {
    var P = {
      x: innerWidth / 2,
      y: innerHeight / 2,
      tx: innerWidth / 2,
      ty: innerHeight / 2,
      on: false
    };

    var idle;

    addEventListener('pointermove', function (e) {
      P.tx = e.clientX;
      P.ty = e.clientY;
      P.on = true;

      clearTimeout(idle);

      idle = setTimeout(function () {
        P.on = false;
      }, 2500);
    });

    function spot(t) {
      if (!P.on) {
        P.tx = innerWidth * (0.5 + 0.3 * Math.sin(t / 1800));
        P.ty = innerHeight * (0.45 + 0.25 * Math.cos(t / 1400));
      }

      P.x += (P.tx - P.x) * 0.08;
      P.y += (P.ty - P.y) * 0.08;

      spotEl.style.transform =
        'translate3d(' + (P.x - 220) + 'px,' +
        (P.y - 220) + 'px,0)';

      spotEl.style.backgroundPosition =
        (-((P.x - 220) % 40)) + 'px ' +
        (-((P.y - 220) % 40)) + 'px';

      glowEl.style.transform =
        'translate3d(' + (P.x - 350) + 'px,' +
        (P.y - 350) + 'px,0)';

      requestAnimationFrame(spot);
    }

    requestAnimationFrame(spot);
  }

  // Scroll reveal animations
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section:not(.hero) .rv').forEach(function (el) {
    io.observe(el);
  });

})();

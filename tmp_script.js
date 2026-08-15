(function(){
    var btn = document.getElementById('menuBtn');
    var nav = document.getElementById('siteNav');
    var isMenuOpen = false;

    function closeMenu(){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      isMenuOpen = false;
      document.body.style.overflow = '';
    }

    function openMenu(){
      nav.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      isMenuOpen = true;
      document.body.style.overflow = 'hidden';
    }

    function toggleMenu(){
      if(isMenuOpen){
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Menu button click handler
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when a navigation link is clicked
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        closeMenu();
      });
    });

    // Close menu when Esc key is pressed
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && isMenuOpen){
        closeMenu();
        btn.focus();
      }
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function(e){
      if(isMenuOpen && !nav.contains(e.target) && !btn.contains(e.target)){
        closeMenu();
      }
    });

    // Prevent menu from closing when clicking inside it
    nav.addEventListener('click', function(e){
      e.stopPropagation();
    });

    function initLanguageSwitcher(){
      var langButtons = document.querySelectorAll('.lang-btn[data-lang]');
      if(!langButtons.length) return;

      function applyLanguage(lang){
        // Update active state on buttons
        langButtons.forEach(function(button){
          var active = button.dataset.lang === lang;
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        // Trigger Google Translate dropdown
        var select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event('change'));
        }
      }

      langButtons.forEach(function(button){
        button.addEventListener('click', function(){ applyLanguage(this.dataset.lang); });
      });
    }
    initLanguageSwitcher();

    function setupAccordion(containerId, itemSel, headSel, bodySel, allowMultiple){
      var container = document.getElementById(containerId);
      if(!container) return;
      var items = container.querySelectorAll(itemSel);
      items.forEach(function(item){
        var head = item.querySelector(headSel);
        var body = item.querySelector(bodySel);
        if(item.classList.contains('open')){ body.style.maxHeight = body.scrollHeight + 'px'; }
        head.addEventListener('click', function(){
          var isOpen = item.classList.contains('open');
          if(!allowMultiple){
            items.forEach(function(other){
              if(other !== item){ other.classList.remove('open'); other.querySelector(bodySel).style.maxHeight = null; }
            });
          }
          item.classList.toggle('open', !isOpen);
          body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
        });
      });
      window.addEventListener('resize', function(){
        items.forEach(function(item){
          if(item.classList.contains('open')){
            var body = item.querySelector(bodySel);
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        });
      });
    }

    setupAccordion('timeline', '.tl-item', '.tl-head', '.tl-body', true);
    setupAccordion('discList', '.disc-item', '.disc-head', '.disc-body', false);

    var hookCta = document.querySelector('[data-open-discovery="miti-riyana"]');
    if(hookCta){
      hookCta.addEventListener('click', function(e){
        e.preventDefault();
        var target = document.getElementById('disc-miti-riyana');
        if(!target) return;
        document.querySelectorAll('#discList .disc-item').forEach(function(other){
          if(other !== target){ other.classList.remove('open'); other.querySelector('.disc-body').style.maxHeight = null; }
        });
        var body = target.querySelector('.disc-body');
        target.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        target.scrollIntoView({behavior:'smooth', block:'center'});
      });
    }

    (function(){
      var slider = document.getElementById('yoj');
      if(!slider) return;
      var out = document.getElementById('yoj-out');
      var milesEl = document.getElementById('conv-miles');
      var verdictEl = document.getElementById('conv-verdict');
      var bar = document.getElementById('scale-bar');
      var noteEl = document.getElementById('conv-note');
      var btns = document.querySelectorAll('.ct-btn');
      var perYojana = 4.5;
      var ISLAND = 270;

      function render(){
        var yoj = parseInt(slider.value, 10);
        var miles = Math.round(yoj * perYojana);
        out.textContent = yoj + ' yojana';
        milesEl.textContent = miles.toLocaleString();
        var frac = Math.min(miles / ISLAND, 1);
        bar.style.width = (frac * 100) + '%';
        var over = miles > ISLAND;
        milesEl.classList.toggle('over', over);
        bar.classList.toggle('over', over);
        if(over){
          verdictEl.textContent = 'Longer than the island itself.';
          noteEl.textContent = 'At ' + perYojana + ' miles per yojana, ' + yoj + ' yojana = ' + miles.toLocaleString() + ' miles \u2014 more than the whole length of Sri Lanka. A journey this size only fits if you stretch it across the Indian subcontinent.';
        } else {
          verdictEl.textContent = 'Fits comfortably within the island.';
          noteEl.textContent = 'At ' + perYojana + ' miles per yojana, ' + yoj + ' yojana = ' + miles.toLocaleString() + ' miles \u2014 a distance that sits neatly inside Sri Lanka, matching the routes the texts describe.';
        }
      }
      slider.addEventListener('input', render);
      btns.forEach(function(b){
        b.addEventListener('click', function(){
          perYojana = parseFloat(b.dataset.miles);
          btns.forEach(function(x){ x.classList.toggle('active', x === b); });
          render();
        });
      });
      render();
    })();

    (function(){
      var toggle = document.querySelectorAll('.ry-btn');
      if(!toggle.length) return;
      var unitEl = document.getElementById('ry-unit');
      var cases = document.querySelectorAll('.ry-case');
      var data = {
        wadu: {
          label: '18 inches',
          cases: [
            { num:'27 ft', over:true, width:'100%', verdict:'A person nearly three storeys tall.' },
            { num:'13.5 ft', over:true, width:'100%', verdict:'A vessel too vast to carry a Bodhi branch.' },
            { num:'31.5 ft', over:true, width:'100%', verdict:'Taller than a ten-storey structure.' }
          ]
        },
        miti: {
          label: '4 inches',
          cases: [
            { num:'6 ft', over:false, width:'22%', verdict:'A plausible human height.' },
            { num:'3 ft', over:false, width:'22%', verdict:'Sized for ritual use, carried by hand.' },
            { num:'7 ft', over:false, width:'23%', verdict:'A realistic funerary pyre.' }
          ]
        }
      };
      function apply(unit){
        var set = data[unit];
        unitEl.textContent = set.label;
        cases.forEach(function(card, i){
          var c = set.cases[i];
          var num = card.querySelector('.ry-num');
          var fill = card.querySelector('.ry-fill');
          num.textContent = c.num;
          fill.style.width = c.width;
          num.classList.toggle('over', c.over);
          fill.classList.toggle('over', c.over);
          card.querySelector('.ry-verdict').textContent = c.verdict;
        });
        toggle.forEach(function(b){ b.classList.toggle('active', b.dataset.unit === unit); });
      }
      toggle.forEach(function(b){ b.addEventListener('click', function(){ apply(b.dataset.unit); }); });
    })();

    (function(){
      var tabs = document.querySelectorAll('.hz-tab');
      if(!tabs.length) return;
      var grid = document.getElementById('hz-grid');
      var intro = document.getElementById('hz-intro');
      var data = {
        buddha: {
          intro: 'At Mihintale and nearby sites, inscriptions preserve names matching some of the most eminent figures of the earliest Buddhist tradition &mdash; senior <strong>bhikkhun&#299;s</strong> and lay disciples known from the canon and commentaries.',
          people: [
            { n:'Dhammadinn\u0101', m:['IC 21'], r:'Eminent bhikkhun\u012b' },
            { n:'Suman\u0101 Ther\u012b', m:['IC 64','1.2.4'], r:'Ther\u012b' },
            { n:'Chitt\u0101 Ther\u012b', m:['IC 79','2.1.5'], r:'Ther\u012b' },
            { n:'Upas\u012bka Thiss\u0101', m:['IC 6','1.1.4'], r:'Lay disciple' },
            { n:'Bhadd\u0101 K\u0101pil\u0101n\u012b', m:['IC 32','4.1'], r:'Eminent bhikkhun\u012b' },
            { n:'Uppalava\u1e47\u1e47\u0101', m:['IC 40','12.1'], r:'Foremost bhikkhun\u012b' },
            { n:'\u0100nanda Thera', m:['IC 155,845','DPPN 249'], r:'The Buddha\u2019s attendant' },
            { n:'Chitta Gahapati', m:['IC 98','DPPN 865'], r:'Foremost lay teacher' },
            { n:'Kosiya Bamana', m:['IC 98, IC 205','DPPN 699'], r:'Br\u0101hma\u1e47a lineage' },
            { n:'S\u0113l\u0101 Theraniya', m:['IC 23','3.1.7'], r:'Ther\u012b' },
            { n:'Daniya Thera', m:['IC 217','3.1.4'], r:'Thera' },
            { n:'N\u0101landa', m:['S.L. Map','DPPN 56'], r:'Place-name' }
          ]
        },
        asokan: {
          intro: 'A second cluster &mdash; several from the Pichchandiyawa area on the Galgamuwa one-inch map &mdash; corresponds closely to figures of the <strong>Asokan</strong> Buddhist mission. The recurrence of the name <em>Giribajja</em> (the old name for Magadha\u2019s capital) at two locations is treated as a line of inquiry into where that janapada sat.',
          people: [
            { n:'Nigrodha Thera', m:['IC 1062,63','DPPN 46'], r:'Asokan mission' },
            { n:'Sumana Thera', m:['IC 1062','DPPN 1245'], r:'Asokan mission' },
            { n:'Mahawaruna Thera', m:['IC 81,82,78','DPPN 555,1248'], r:'Asokan mission' },
            { n:'Prince Mahasena', m:['IC 1064','DPPN 580'], r:'Royal figure' },
            { n:'Bamana Moggali', m:['IC 1045','DPPN 664'], r:'Br\u0101hma\u1e47a' },
            { n:'Giribajja / Girivaya', m:['IC 91, IC 1233','DPPN 721'], r:'Magadha capital name (x2)' },
            { n:'Sa\u1e45gharakkhita', m:['IC 270','DPPN 991'], r:'Thera' },
            { n:'Nagasena Thera', m:['IC 451, 602,609','DPPN 46'], r:'Thera' },
            { n:'Sonutta', m:['IC 83','DPPN 1299'], r:'Asokan mission' },
            { n:'Assagutta', m:['IC 3','DPPN 224'], r:'Asokan mission' },
            { n:'Dhamarakitha Thera', m:['IC 76','DPPN 1147'], r:'Asokan mission' },
            { n:'Rohana', m:['IC 1037','DPPN 760'], r:'Region / thera' }
          ]
        },
        mahathupa: {
          intro: 'A third cluster records monks named as <strong>arriving from Jambud\u012bpa</strong> for the Mah\u0101th\u016bpa foundation ceremony under Dutugemunu &mdash; each tied in the chronicles to a monastic residence, several of which recur as inscriptional place-names.',
          people: [
            { n:'Indagutta', m:['\u2014'], r:'from Rajagaha' },
            { n:'Dhammasena', m:['IC 542'], r:'from Isipatana' },
            { n:'Piyadassi', m:['IC 862'], r:'from Jetavana' },
            { n:'Buddharakkita', m:['IC 372'], r:'from Vesali' },
            { n:'Dhammarakkita', m:['\u2014'], r:'from Kosambi' },
            { n:'Sangharakkita', m:['IC 509'], r:'from Dakkinagiri' },
            { n:'Mittanna', m:['IC 522'], r:'from Asokarama' },
            { n:'Mahadeva', m:['\u2014'], r:'from Pallavabhogga' },
            { n:'Dhammarakkhita', m:['\u2014'], r:'from Alasanda' },
            { n:'Uttara', m:['\u2014'], r:'from Vindhya Forest' },
            { n:'Cittagutta', m:['IC 121'], r:'from Bodhimandala' },
            { n:'Syuyagutta', m:['\u2014'], r:'from Kel\u0101sa Viharaya' }
          ]
        }
      };
      function render(hz){
        var set = data[hz];
        intro.innerHTML = set.intro;
        grid.innerHTML = set.people.map(function(p){
          var meta = p.m.map(function(x){ return '<span>' + x + '</span>'; }).join('');
          return '<div class="hz-card"><div class="hz-name">' + p.n + '</div><div class="hz-meta">' + meta + '</div><div class="hz-role">' + p.r + '</div></div>';
        }).join('');
        tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.hz === hz); });
      }
      tabs.forEach(function(t){ t.addEventListener('click', function(){ render(t.dataset.hz); }); });
      render('buddha');
    })();

    (function(){
      var list = document.getElementById('pl-list');
      if(!list) return;
      var detail = document.getElementById('pl-detail');
      var places = [
        {
          anc:'R\u0101jagaha', mod:'Dambulla', tag:'Core identification',
          lead:'The old capital of Magadha, more properly called <em>Giribbaja</em> &mdash; a hill fortress the commentaries say was ringed by five hills. Dambulla\u2019s rock complex sits at the corresponding point on the survey map, roughly one league (the DPPN figure for R\u0101jagaha\u2013N\u0101land\u0101) from a place still bearing the name N\u0101landa.',
          ev:[
            ['Five hills','DPPN records Giribbaja \u201csurrounded by five hills\u201d \u2014 Pa\u1e47\u1e0dava, Gijjhak\u016b\u1e6da, Vebh\u0101ra, Isigili, Vepulla; physically present at the Dambulla complex.'],
            ['Second name','Also called Magadhapura \u2014 confirmed in the Sutta Nip\u0101ta A\u1e6d\u1e6dhakath\u0101 (SNA ii.584, g\u0101th\u0101s 1012\u201313).'],
            ['Dakkhi\u1e47\u0101giri','The country north of the hills; identified with Kaludiya Pokuna near Kandalama, with pre-Christian architecture (EZ Vol. III, No. 27, p. 253).'],
            ['Distance','R\u0101jagaha\u2013N\u0101land\u0101 given as one league in DPPN; the N\u0101landa name survives near Dambulla.']
          ]
        },
        {
          anc:'Ves\u0101l\u012b', mod:'Horowpothana zone', tag:'Federated region',
          lead:'Canonical sources describe Ves\u0101l\u012b not as one city but as a federated territory of the Licchavi, Videha, and N\u0101\u1e6dika domains. Read against survey maps, this corresponds to a broad zone across Medawachchiya, Horowpothana, Vavuniya, Padaviya, and Mullaitivu.',
          ev:[
            ['\u0100nanda\u2019s dwelling','Brahmanayagama (Horowpothana) corresponds to V\u0101lik\u0101r\u0101ma, the monastery textual tradition names as \u0100nanda Thera\u2019s dwelling.'],
            ['Inscriptions','19 pre-Christian Br\u0101hm\u012b inscriptions at Brahmanayagama, including \u201canadatheraha lene\u201d \u2014 the cave of \u0100nanda Thera.'],
            ['K\u016b\u1e6d\u0101g\u0101ra S\u0101l\u0101','The Mah\u0101vana\u2013K\u016b\u1e6d\u0101g\u0101ra S\u0101l\u0101 (Gi\u00f1jak\u0101vasatha) of the texts maps onto this monastic landscape.'],
            ['Vajji cluster','The wider zone aligns with the Vajji federation names recorded across the Vavuniya\u2013Medawachchiya\u2013Horowpothana inscriptions.']
          ]
        },
        {
          anc:'Kunda\u2011g\u0101ma', mod:'Kurund\u012b V\u012bh\u0101ra area', tag:'Exegetical centre',
          lead:'Within the Vajji country, identifiable with Kundag\u0101ma (Kurundapura) \u2014 traditionally recognised as the place of composition of the <em>Kurund\u012b A\u1e6d\u1e6dhakath\u0101</em>, marking it as an early centre of doctrinal and exegetical activity.',
          ev:[
            ['Location','Falls within the reconstructed Ves\u0101l\u012b territorial zone, where Kurund\u012b Vih\u0101ra is located.'],
            ['Textual role','Named in the tradition as where the Kurund\u012b commentary was composed.']
          ]
        },
        {
          anc:'Ve\u1e37uvana', mod:'Dambulla rock complex', tag:'Working hypothesis',
          lead:'The bamboo-grove monastery Bimbis\u0101ra gave to the Order, where the Buddha spent several <em>vassas</em>. The Dambulla rock complex is proposed as its site &mdash; an identification still to be tested.',
          ev:[
            ['Inscription','\u201cAnadatherasa sadivihariyana lene\u201d records \u0100nanda Thera living with a companion in this cave \u2014 a saddhivih\u0101riya (lineage) relationship.'],
            ['Density','Dambulla preserves 25 pre-Christian inscriptions, indicating sustained, organised monastic occupation.'],
            ['Source','Ve\u1e37uvana described at DPPN ii.936\u2013939.']
          ]
        },
        {
          anc:'The Ganges', mod:'El\u0101hera Yodha Ela', tag:'Distance confirmed, identity proposed',
          lead:'DPPN 723 (fn. 25) records, from the Dvy\u0101vad\u0101na, that the Ganges was crossed by boat between R\u0101jagaha and S\u0101vatthi \u2014 some boats belonging to Magadha, others to the Licchavis of Ves\u0101li. The proposal reads this \u201cGanges\u201d as the navigable El\u0101hera canal system.',
          ev:[
            ['Distance \u2014 confirmed','Ga\u1e45g\u0101\u2013Ves\u0101l\u012b is given as 3 yojana (Buddha Charitaya); 3 \u00d7 4.5 = 13.5 miles, and the survey map measures \u2248 13.5 miles from the Brahmanayagama area \u2014 the two converge (see the Distance test).'],
            ['R\u0101jagaha bearing','The same source places R\u0101jagaha 8 yojana south of Ves\u0101l\u012b, consistent with the Dambulla position.'],
            ['Boat travel','The DPPN passage places boats and a river-crossing on the R\u0101jagaha\u2013Ves\u0101li route \u2014 consistent with canal navigation.'],
            ['Ferry official','IC 860 (Kandalama) records a Thota Bojaka (ferry/crossing official) named Uttara; the same name recurs at Sigiriya (IC 871\u2013872) in the same corridor.'],
            ['Identity \u2014 proposed','That the waterway is specifically the El\u0101hera Yodha Ela (the only southern canal from Brahmanayagama, running to Trincomalee) is still being tested.']
          ]
        }
      ];
      function render(i){
        var pl = places[i];
        detail.innerHTML =
          '<div class="pl-eq"><span class="anc">' + pl.anc + '</span><span class="arrow">&rarr;</span><span class="mod">' + pl.mod + '</span></div>' +
          '<span class="pl-tag">' + pl.tag + '</span>' +
          '<p class="pl-lead">' + pl.lead + '</p>' +
          '<ul class="pl-ev">' + pl.ev.map(function(e){ return '<li><span class="k">' + e[0] + '</span><span>' + e[1] + '</span></li>'; }).join('') + '</ul>';
        list.querySelectorAll('.pl-item').forEach(function(b, j){ b.classList.toggle('active', j === i); });
      }
      places.forEach(function(pl, i){
        var b = document.createElement('button');
        b.className = 'pl-item' + (i===0?' active':'');
        b.setAttribute('role','tab');
        b.innerHTML = '<span class="pl-anc">' + pl.anc + '</span><span class="pl-mod">' + pl.mod + '</span>';
        b.addEventListener('click', function(){ render(i); });
        list.appendChild(b);
      });
      render(0);
    })();

    // Scroll to Top functionality
    var scrollTopBtn = document.getElementById("scrollTopBtn");
    if(scrollTopBtn) {
      window.addEventListener("scroll", function() {
        if(window.scrollY > 300) { scrollTopBtn.classList.add("show"); }
        else { scrollTopBtn.classList.remove("show"); }
      });
      scrollTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  })();
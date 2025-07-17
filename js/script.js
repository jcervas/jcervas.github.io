import './script2.js';

const automodal = (target, options) => {
  const reflow = () => {
    document.documentElement.scrollTop;
  };

  const animations = (element) => {
    return Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
  };

  const getType = (target) => {
    const href = target.getAttribute('href');
    const type = target.getAttribute('data-automodal-type');

    if (type) {
      return type;
    }

    if (href.startsWith('#')) {
      return 'id';
    }

    if (href.includes('youtube.com/shorts/')) {
      return 'short';
    }

    if (href.includes('youtube.com') || href.includes('youtu.be')) {
      return 'youtube';
    }

    if (href.includes('tiktok.com')) {
      return 'tiktok';
    }

    if (href.includes('instagram.com/p/')) {
      return 'instagram';
    }

    if (href.includes('instagram.com/reel/')) {
      return 'reel';
    }

    if (href.includes('vimeo.com')) {
      return 'vimeo';
    }

    if (href.includes('google.com/maps/')) {
      return 'map';
    }

    return 'image';
  };

  const iframe = (src, title) => {
    return `<iframe src="${src}" ${title && `title="${title}"`} allow="autoplay; fullscreen;"></iframe>`;
  };

  const load = async (target) => {
    const href = target.getAttribute('href');
    const type = getType(target);
    const alt = target.getAttribute('data-automodal-alt') ?? '';
    const title = target.getAttribute('data-automodal-title') ?? '';

    if (type === 'fetch') {
      return (await (await fetch(href)).text()).trim();
    }

    if (type === 'iframe') {
      return iframe(href, title);
    }

    if (type === 'id') {
      return document.querySelector(href).outerHTML.trim();
    }

    if (type === 'short') {
      const id = href.split('/shorts/')[1];
      const src = `https://www.youtube.com/embed/${id}`;

      return iframe(src, title);
    }

    if (type === 'youtube') {
      let src = `https://www.youtube.com/embed/`;

      if (href.includes('youtube.com')) {
        src += href.split('v=')[1].replace('&', '?');
      }

      if (href.includes('youtu.be')) {
        src += href.split('youtu.be/')[1];
      }

      return iframe(src, title);
    }

    if (type === 'tiktok') {
      const id = href.split('/video/')[1];
      const src = `https://www.tiktok.com/embed/v2/${id}`;

      return iframe(src, title);
    }

    if (type === 'instagram') {
      const id = href.split('/p/')[1].split('/')[0];
      const src = `https://www.instagram.com/p/${id}/embed/captioned/`;

      return iframe(src, title);
    }

    if (type === 'reel') {
      const id = href.split('/reel/')[1].split('/')[0];
      const src = `https://www.instagram.com/reel/${id}/embed/captioned/`;

      return iframe(src, title);
    }

    if (type === 'vimeo') {
      const id = href.split('vimeo.com/')[1];
      const src = `https://player.vimeo.com/video/${id}`;

      return iframe(src, title);
    }

    if (type === 'map') {
      let src = 'https://www.google.com/maps/embed/v1/';

      if (href.includes('/maps/place/')) {
        const place = href.match('(?:/maps/place/)([^/]+)')[1];

        src += `place?key=${options.googleMapsAPIKey}&q=${place}`;
      }

      if (href.includes('/maps/@')) {
        const data = href.match('(?:/maps/@)([^z]+)')[1].split(',');

        src += `view?key=${options.googleMapsAPIKey}&center=${data[0]},${data[1]}&zoom=${data[2]}z`;
      }

      return iframe(src, title);
    }

    return `<img src="${href}" ${alt && `alt="${alt}"`}>`;
  };

  const item = async (target) => {
    const type = getType(target);
    const name = target.getAttribute('data-automodal') ?? '';
    const content = await load(target);
    const caption = target.getAttribute('data-automodal-caption') ?? '';

    return `
      <div class="Automodal__item Automodal__item--${type} ${name && `Automodal__item--${name}`}">
        <figure class="Automodal__content">
          ${content}
          ${caption && `<figcaption class="Automodal__caption">${caption}</figcaption>`}
        </figure>
      </div>
    `;
  };

  target.addEventListener('click', (e) => {
    e.preventDefault();

    let updating = false;

    let index;
    let group = target.getAttribute('data-automodal-group') ?? '';

    if (group) {
      group = document.querySelectorAll(`[data-automodal-group="${group}"]`);
      index = [...group].indexOf(target);
    }

    const dialog = document.createElement('dialog');
    dialog.classList.add('Automodal');
    dialog.innerHTML = `
      <button class="Automodal__close" aria-label="Close"></button>
      <div class="Automodal__viewport"></div>
      ${group && `
        <button class="Automodal__nav Automodal__nav--prev" aria-label="Previous"></button>
        <button class="Automodal__nav Automodal__nav--next" aria-label="Next"></button>
      `}
    `;

    const close = dialog.querySelector('.Automodal__close');
    const viewport = dialog.querySelector('.Automodal__viewport');
    const prev = dialog.querySelector('.Automodal__nav--prev');
    const next = dialog.querySelector('.Automodal__nav--next');

    const insert = async (target) => {
      viewport.insertAdjacentHTML('beforeend', await item(target));
      target.dispatchEvent(new CustomEvent('load'));
    };

    const nav = async (dir) => {
      if (group && !updating) {
        const remove = viewport.firstElementChild;

        if (dir === 'prev') {
          index = index - 1 >= 0 ? index - 1 : group.length - 1;
        }

        if (dir === 'next') {
          index = index + 1 < group.length ? index + 1 : 0;
        }

        updating = true;
        dialog.classList.add(`Automodal--${dir}`);

        await insert(group[index]);
        const add = viewport.lastElementChild;
        add.classList.add('Automodal__item--add');

        reflow();
        add.classList.remove('Automodal__item--add');
        remove.classList.add('Automodal__item--remove');

        await animations(add);
        await animations(remove);
        remove.remove();

        dialog.classList.remove(`Automodal--${dir}`);
        updating = false;
      }
    };

    const remove = async () => {
      dialog.classList.remove('Automodal--active');
      await animations(dialog);
      dialog.close();
      dialog.remove();
    };

    const keydown = (e) => {
      if (e.key === 'ArrowLeft') {
        nav('prev');
      }

      if (e.key === 'ArrowRight') {
        nav('next');
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        remove();
      }
    };

    const build = async () => {
      document.body.append(dialog);
      dialog.showModal();
      await insert(target);
      reflow();
      dialog.classList.add('Automodal--active');
    };

    const outside = (e) => {
      if (e.target === dialog) {
        remove();
      }
    };

    const listen = () => {
      dialog.addEventListener('keydown', keydown);
      dialog.addEventListener('click', outside);
      prev?.addEventListener('click', () => { nav('prev'); });
      next?.addEventListener('click', () => { nav('next'); });
      close.addEventListener('click', remove);
    };

    const init = () => {
      build();
      listen();
    };

    init();
  });
};

const targets$2 = document.querySelectorAll("[data-automodal]");
for (const target of targets$2) {
  automodal(target);
}

var t=function(){return t=Object.assign||function(t){for(var i,n=1,s=arguments.length;n<s;n++)for(var a in i=arguments[n])Object.prototype.hasOwnProperty.call(i,a)&&(t[a]=i[a]);return t},t.apply(this,arguments)},i=function(){function i(i,n,s){var a=this;this.endVal=n,this.options=s,this.version="2.8.0",this.defaults={startVal:0,decimalPlaces:0,duration:2,useEasing:!0,useGrouping:!0,useIndianSeparators:!1,smartEasingThreshold:999,smartEasingAmount:333,separator:",",decimal:".",prefix:"",suffix:"",enableScrollSpy:!1,scrollSpyDelay:200,scrollSpyOnce:!1},this.finalEndVal=null,this.useEasing=!0,this.countDown=!1,this.error="",this.startVal=0,this.paused=!0,this.once=!1,this.count=function(t){a.startTime||(a.startTime=t);var i=t-a.startTime;a.remaining=a.duration-i,a.useEasing?a.countDown?a.frameVal=a.startVal-a.easingFn(i,0,a.startVal-a.endVal,a.duration):a.frameVal=a.easingFn(i,a.startVal,a.endVal-a.startVal,a.duration):a.frameVal=a.startVal+(a.endVal-a.startVal)*(i/a.duration);var n=a.countDown?a.frameVal<a.endVal:a.frameVal>a.endVal;a.frameVal=n?a.endVal:a.frameVal,a.frameVal=Number(a.frameVal.toFixed(a.options.decimalPlaces)),a.printValue(a.frameVal),i<a.duration?a.rAF=requestAnimationFrame(a.count):null!==a.finalEndVal?a.update(a.finalEndVal):a.options.onCompleteCallback&&a.options.onCompleteCallback();},this.formatNumber=function(t){var i,n,s,e,o=t<0?"-":"";i=Math.abs(t).toFixed(a.options.decimalPlaces);var r=(i+="").split(".");if(n=r[0],s=r.length>1?a.options.decimal+r[1]:"",a.options.useGrouping){e="";for(var l=3,h=0,u=0,p=n.length;u<p;++u)a.options.useIndianSeparators&&4===u&&(l=2,h=1),0!==u&&h%l==0&&(e=a.options.separator+e),h++,e=n[p-u-1]+e;n=e;}return a.options.numerals&&a.options.numerals.length&&(n=n.replace(/[0-9]/g,(function(t){return a.options.numerals[+t]})),s=s.replace(/[0-9]/g,(function(t){return a.options.numerals[+t]}))),o+a.options.prefix+n+s+a.options.suffix},this.easeOutExpo=function(t,i,n,s){return n*(1-Math.pow(2,-10*t/s))*1024/1023+i},this.options=t(t({},this.defaults),s),this.formattingFn=this.options.formattingFn?this.options.formattingFn:this.formatNumber,this.easingFn=this.options.easingFn?this.options.easingFn:this.easeOutExpo,this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.endVal=this.validateValue(n),this.options.decimalPlaces=Math.max(this.options.decimalPlaces),this.resetDuration(),this.options.separator=String(this.options.separator),this.useEasing=this.options.useEasing,""===this.options.separator&&(this.options.useGrouping=!1),this.el="string"==typeof i?document.getElementById(i):i,this.el?this.printValue(this.startVal):this.error="[CountUp] target is null or undefined","undefined"!=typeof window&&this.options.enableScrollSpy&&(this.error?console.error(this.error,i):(window.onScrollFns=window.onScrollFns||[],window.onScrollFns.push((function(){return a.handleScroll(a)})),window.onscroll=function(){window.onScrollFns.forEach((function(t){return t()}));},this.handleScroll(this)));}return i.prototype.handleScroll=function(t){if(t&&window&&!t.once){var i=window.innerHeight+window.scrollY,n=t.el.getBoundingClientRect(),s=n.top+window.pageYOffset,a=n.top+n.height+window.pageYOffset;a<i&&a>window.scrollY&&t.paused?(t.paused=!1,setTimeout((function(){return t.start()}),t.options.scrollSpyDelay),t.options.scrollSpyOnce&&(t.once=!0)):(window.scrollY>a||s>i)&&!t.paused&&t.reset();}},i.prototype.determineDirectionAndSmartEasing=function(){var t=this.finalEndVal?this.finalEndVal:this.endVal;this.countDown=this.startVal>t;var i=t-this.startVal;if(Math.abs(i)>this.options.smartEasingThreshold&&this.options.useEasing){this.finalEndVal=t;var n=this.countDown?1:-1;this.endVal=t+n*this.options.smartEasingAmount,this.duration=this.duration/2;}else this.endVal=t,this.finalEndVal=null;null!==this.finalEndVal?this.useEasing=!1:this.useEasing=this.options.useEasing;},i.prototype.start=function(t){this.error||(this.options.onStartCallback&&this.options.onStartCallback(),t&&(this.options.onCompleteCallback=t),this.duration>0?(this.determineDirectionAndSmartEasing(),this.paused=!1,this.rAF=requestAnimationFrame(this.count)):this.printValue(this.endVal));},i.prototype.pauseResume=function(){this.paused?(this.startTime=null,this.duration=this.remaining,this.startVal=this.frameVal,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count)):cancelAnimationFrame(this.rAF),this.paused=!this.paused;},i.prototype.reset=function(){cancelAnimationFrame(this.rAF),this.paused=!0,this.resetDuration(),this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.printValue(this.startVal);},i.prototype.update=function(t){cancelAnimationFrame(this.rAF),this.startTime=null,this.endVal=this.validateValue(t),this.endVal!==this.frameVal&&(this.startVal=this.frameVal,null==this.finalEndVal&&this.resetDuration(),this.finalEndVal=null,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count));},i.prototype.printValue=function(t){var i;if(this.el){var n=this.formattingFn(t);if(null===(i=this.options.plugin)||void 0===i?void 0:i.render)this.options.plugin.render(this.el,n);else if("INPUT"===this.el.tagName)this.el.value=n;else "text"===this.el.tagName||"tspan"===this.el.tagName?this.el.textContent=n:this.el.innerHTML=n;}},i.prototype.ensureNumber=function(t){return "number"==typeof t&&!isNaN(t)},i.prototype.validateValue=function(t){var i=Number(t);return this.ensureNumber(i)?i:(this.error="[CountUp] invalid start or end value: ".concat(t),null)},i.prototype.resetDuration=function(){this.startTime=null,this.duration=1e3*Number(this.options.duration),this.remaining=this.duration;},i}();

const targets$1 = document.querySelectorAll("[data-count]");
for (const target of targets$1) {
  let end = target.getAttribute("data-count");
  let start = target.getAttribute("data-count-start") || 0;
  let options = {
    startVal: Number(start),
    enableScrollSpy: true,
    scrollSpyOnce: true,
    scrollSpyDelay: 300
  };
  if (end && end.includes(",")) {
    end = end.replace(/,/g, "");
  } else {
    options = { ...options, useGrouping: false };
  }
  const count = new i(target, Number(end), options);
  count.start();
}

setTimeout(() => {
  const links = document.querySelectorAll('[href*="framework/base_safe.css"], [href*="register/embed.css"]');
  for (const link of links) {
    link.remove();
  }
}, 500);

const closes$1 = document.querySelectorAll(".Alert__close");
for (const close of closes$1) {
  const root = close.closest(".Alert");
  close.addEventListener("click", () => {
    root?.remove();
  });
}

const toggles = document.querySelectorAll(".CheckList__toggle");
for (const toggle of toggles) {
  toggle.addEventListener("click", () => {
    for (const toggle2 of toggles) {
      toggle2.setAttribute("aria-expanded", "false");
    }
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", (!expanded).toString());
  });
}
const areas = document.querySelectorAll(".CheckList__wrapper");
function checkSidebarHeight(area) {
  const contentWindow = area.querySelector(".CheckList__interior");
  const contentHeight = contentWindow.scrollHeight;
  const areaHeight = area.clientHeight;
  if (contentHeight > areaHeight) {
    area.classList.add("with-scroll");
  } else {
    area.classList.remove("with-scroll");
  }
}
for (const area of areas) {
  area.addEventListener("scroll", function() {
    area.classList.add("scrolled");
  });
  window.addEventListener("resize", () => checkSidebarHeight(area));
  checkSidebarHeight(area);
}

const finders = document.querySelectorAll(".finder");
function escapeHTML(value) {
  const escapeMap = {
    "'": "'",
    '"': '"'
  };
  return value.replace(/['"]/g, (char) => escapeMap[char]);
}
function decodeHTML(input) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}
finders.forEach((finder) => {
  const container = finder.querySelector(".Finder__program-list");
  if (container !== null) {
    const jsonUrl = finder.getAttribute("data-finder-json");
    fetch(jsonUrl).then((response) => response.json()).then((data) => {
      var programs = data.programs;
      programs.forEach((program, index) => {
        var programDiv = document.createElement("div");
        programDiv.classList.add("Program__card", "flush");
        programDiv.setAttribute("data-finder-item", "");
        programDiv.setAttribute("data-finder-search", escapeHTML(program.keyword.join(",")));
        programDiv.setAttribute("data-finder-department", escapeHTML(program.department.join(",")));
        programDiv.setAttribute("data-finder-level", escapeHTML(program.level.join(",")));
        programDiv.setAttribute("data-finder-inter", escapeHTML(program.inter.join(",")));
        var h2 = document.createElement("h2");
        h2.classList.add("Program__title");
        h2.classList.add("h4");
        var link = document.createElement("a");
        link.setAttribute("href", program.url);
        link.classList.add("link-underline");
        link.classList.add("link-cover");
        link.textContent = program.name;
        h2.appendChild(link);
        var keys = document.createElement("ul");
        keys.classList.add("Program__keys");
        if (program.inter.includes("Interdisciplinary")) {
          var inter = document.createElement("li");
          inter.innerHTML = " Interdisciplinary";
          keys.appendChild(inter);
        }
        var description = document.createElement("p");
        description.textContent = program.description;
        programDiv.appendChild(h2);
        programDiv.appendChild(keys);
        programDiv.appendChild(description);
        container.appendChild(programDiv);
        if (index === programs.length - 1) {
          filterSearch();
        }
      });
    }).catch((error) => {
      console.error("Error:", error);
    });
  }
  function sanitizeString(input) {
    if (typeof input !== "string") return "";
    const decodedInput = decodeURIComponent(input);
    return decodedInput.replace(/[<>&"'`]/g, (char) => {
      const escapeMap = {
        "<": "<",
        ">": ">",
        "&": "&",
        '"': '"',
        "'": "'",
        "`": "`"
      };
      return escapeMap[char];
    });
  }
  function isValidParam(value) {
    const unsafePattern = /[<>]/;
    return !unsafePattern.test(value);
  }
  function cleanUrlParams() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    for (const [key, value] of params.entries()) {
      if (!isValidParam(value)) {
        console.warn(`Removing invalid parameter: ${key}=${value}`);
        params.delete(key);
      }
    }
    window.history.replaceState(null, "", url.toString());
  }
  function filterSearch() {
    const getParams = () => {
      const params = new URLSearchParams(window.location.search);
      return {
        search: params.getAll("search").map(sanitizeString),
        level: params.getAll("level").map(sanitizeString),
        department: params.getAll("department").map(sanitizeString),
        inter: params.getAll("inter").map(sanitizeString)
      };
    };
    const matches = (filter, data, item) => {
      const values = item.getAttribute(`data-finder-${filter}`)?.split(",") || [];
      const selectedValues = data[filter];
      const searchTerms = selectedValues;
      if (searchTerms.length) {
        const keywordMatch = values.some(
          (value) => searchTerms.some((term) => value.toLowerCase().includes(term.toLowerCase()))
        );
        if (!keywordMatch && !searchTerms.some((term) => item.textContent?.toLowerCase().includes(term.toLowerCase()))) {
          return false;
        }
      }
      return true;
    };
    const initial = parseInt(finder.getAttribute("data-finder-initial"), 10);
    let max = initial;
    const form = finder.querySelector("[data-finder-form]");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    const current = form?.querySelector("[data-finder-current]");
    const updateButtons = (data) => {
      let html = "";
      for (const [filter, values] of Object.entries(data)) {
        for (const value of values) {
          if (value) {
            html += `<button class="Finder__remove" data-finder-remove="${filter}">${value}</button>`;
          }
        }
      }
      if (current) {
        current.innerHTML = html;
      }
    };
    current?.addEventListener("click", (e) => {
      const { target } = e;
      if (target instanceof HTMLButtonElement) {
        const filter = target.getAttribute("data-finder-remove");
        const value = target.innerHTML.trim();
        if (["department", "level", "inter"].includes(filter)) {
          const input = form?.querySelector(
            `[data-finder-filter="${filter}"][value="${decodeHTML(value)}"]`
          );
          if (input) input.checked = false;
        } else {
          const input = form?.querySelector(`[data-finder-filter="${filter}"]`);
          if (input) input.value = "";
        }
        target.remove();
        updateQuery();
      }
    });
    const items = finder.querySelectorAll("[data-finder-item]");
    const counts = finder.querySelectorAll("[data-finder-count]");
    const update = () => {
      cleanUrlParams();
      const data = getParams();
      for (const item of items) {
        let showItem = true;
        for (const filter in data) {
          if (!matches(filter, data, item)) {
            showItem = false;
            break;
          }
        }
        if (showItem) {
          item.setAttribute("data-finder-item", "show");
        } else {
          item.setAttribute("data-finder-item", "hide");
        }
      }
      updateButtons(data);
      updateLimit();
      window.dispatchEvent(new Event("resize"));
    };
    const updateQuery = () => {
      const data = new FormData(form);
      const query = new URLSearchParams(data).toString();
      window.history.replaceState(null, "", `?${query}`);
      max = initial;
      update();
    };
    const focusNextCard = () => {
      const limit = finder.querySelector("[data-finder-limit]");
      const nextCard = limit.nextElementSibling;
      if (nextCard) {
        const anchorInNextCard = nextCard.querySelector("h2 a");
        if (anchorInNextCard) {
          setTimeout(function() {
            anchorInNextCard.focus();
          }, 400);
        }
      }
    };
    const updateLimit = () => {
      const limit = finder.querySelector("[data-finder-limit]");
      const show = finder.querySelectorAll('[data-finder-item="show"]');
      let target = show[max - 1];
      if (!target || target === show[show.length - 1]) {
        target = show[show.length - 1];
        finder.setAttribute("data-finder-done", "");
      } else {
        finder.removeAttribute("data-finder-done");
      }
      limit?.removeAttribute("data-finder-limit");
      target?.setAttribute("data-finder-limit", "");
      for (const [i, count] of counts.entries()) {
        const visible = [...show].indexOf(target) + 1;
        const total = show.length;
        if (total === 0) {
          if (i === 0) {
            count.innerHTML = "No results";
          } else {
            count.innerHTML = "";
          }
        } else {
          count.innerHTML = `showing ${visible} of ${total} results`;
        }
      }
    };
    const searchInputs = finder.querySelectorAll('[data-finder-filter="search"]');
    searchInputs.forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    });
    const filters = form?.querySelectorAll("[data-finder-filter]") || [];
    for (const filter of filters) {
      filter.addEventListener("input", updateQuery);
    }
    const reset = form?.querySelector("[data-finder-reset]");
    reset?.addEventListener("click", () => {
      for (const filter of filters) {
        if (filter.getAttribute("type") === "checkbox") {
          filter.checked = false;
        } else {
          filter.value = "";
        }
      }
      updateQuery();
    });
    const moreAll = finder.querySelectorAll("[data-finder-more]");
    for (const more of moreAll) {
      const add = parseInt(more?.getAttribute("data-finder-more"), 10);
      more?.addEventListener("click", () => {
        max += add;
        focusNextCard();
        update();
      });
    }
    const all = finder.querySelector("[data-finder-all]");
    all?.addEventListener("click", () => {
      const show = finder.querySelectorAll('[data-finder-item="show"]');
      max = show.length;
      focusNextCard();
      update();
    });
    function waitForElement(selector, callback) {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else {
        setTimeout(() => waitForElement(selector, callback), 500);
      }
    }
    waitForElement("[data-finder-filter]", () => {
      const data = getParams();
      let actualFilters;
      for (const [filter, values] of Object.entries(data)) {
        if (values[0]) {
          actualFilters = ["department", "level", "inter"];
          if (actualFilters.includes(filter)) {
            for (const value of values) {
              const input = form?.querySelector(
                `[data-finder-filter="${filter}"][value="${decodeHTML(value)}"]`
              );
              if (input) {
                input.checked = true;
              }
            }
          } else {
            const input = form?.querySelector(`[data-finder-filter="${filter}"]`);
            if (input) {
              input.value = decodeHTML(values[0]);
            }
          }
        }
      }
      update();
    });
    update();
  }
  const finderFilters = document.querySelector("#finder-filters");
  const filterToggles = document.querySelectorAll(".Finder__filter-toggle");
  const closeAllFilters = () => {
    filterToggles.forEach((finderToggle) => {
      finderToggle.setAttribute("aria-expanded", "false");
    });
  };
  filterToggles.forEach((finderToggle) => {
    finderToggle.addEventListener("click", () => {
      const isExpanded = finderToggle.getAttribute("aria-expanded") === "true";
      closeAllFilters();
      if (!isExpanded) {
        finderToggle.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", (event) => {
    if (!finderFilters.contains(event.target)) {
      closeAllFilters();
    }
  });
  finderFilters.addEventListener("focusin", (event) => {
    if (finderFilters.contains(event.target)) {
      return;
    }
  });
});

const flexscroll = (root) => {
  const frame = root.querySelector('[data-flexscroll-frame]');
  const viewport = root.querySelector('[data-flexscroll-viewport]');
  const prev = root.querySelector('[data-flexscroll-prev]');
  const next = root.querySelector('[data-flexscroll-next]');

  let active = [];
  let items, gotos;

  const getIndex = (type) => {
    const min = 0;
    const max = items.length - 1;

    if (type === 'prev') {
      const target = active[0] - 1;
      return Number.isInteger(target) ? (target >= min ? target : min) : false;
    }

    if (type === 'next') {
      const target = active[active.length - 1] + 1;
      return Number.isInteger(target) ? (target <= max ? target : max) : false;
    }
  };

  const getDirection = () => {
    return getComputedStyle(viewport).getPropertyValue('flex-direction');
  };

  const getPositions = (index) => {
    const direction = getDirection();
    const item = items[index];
    const styles = getComputedStyle(viewport);
    const rtl = direction === 'row' && styles.getPropertyValue('direction') === 'rtl';

    let target, offset, start, end;

    if (direction === 'row') {
      target = item.offsetLeft;
      start = parseInt(styles.getPropertyValue('scroll-padding-inline-start'), 10) || 0;
      end = parseInt(styles.getPropertyValue('scroll-padding-inline-end'), 10) || 0;
      offset = viewport.offsetWidth - item.offsetWidth + (rtl ? end - start : start - end);
    }

    if (direction === 'column') {
      target = item.offsetTop;
      start = parseInt(styles.getPropertyValue('scroll-padding-block-start'), 10) || 0;
      end = parseInt(styles.getPropertyValue('scroll-padding-block-end'), 10) || 0;
      offset = viewport.offsetHeight - item.offsetHeight + start - end;
    }

    return {
      start: rtl ? target + end - offset : target - start,
      end: rtl ? target - start : target + end - offset,
      center: target - offset / 2,
    }
  };

  const getLoop = () => {
    return getComputedStyle(viewport).getPropertyValue('--flexscroll-loop');
  };

  const getMove = () => {
    return getComputedStyle(viewport).getPropertyValue('--flexscroll-move');
  };

  const getAlign = (index) => {
    return getComputedStyle(items[index]).getPropertyValue('scroll-snap-align');
  };

  const getProgress = () => {
    const direction = getDirection();

    let current, max;

    if (direction === 'row') {
      current = Math.abs(viewport.scrollLeft);
      max = viewport.scrollWidth - viewport.clientWidth;
    }

    if (direction === 'column') {
      current = viewport.scrollTop;
      max = viewport.scrollHeight - viewport.clientHeight;
    }

    return max === 0 ? -1 : Math.round(current / max * 100) / 100;
  };

  const setScroll = (index, type = null) => {
    const direction = getDirection();
    const positions = getPositions(index);
    const move = getMove();

    let align = getAlign(index);

    if (move && type === 'prev') {
      if (move === 'one') {
        align = 'start';
      }

      if (move === 'all') {
        align = 'end';
      }
    }

    if (move && type === 'next') {
      if (move === 'one') {
        align = 'end';
      }

      if (move === 'all') {
        align = 'start';
      }
    }

    const x = direction === 'row' ? positions[align] : 0;
    const y = direction === 'column' ? positions[align] : 0;

    viewport.scroll(x, y);
  };

  const setDisabled = () => {
    const progress = getProgress();
    const loop = getLoop();
    const start = progress === 0 || progress === -1;
    const end = progress === 1 || progress === -1;

    if (loop === 'true') {
      prev?.removeAttribute('disabled');
      next?.removeAttribute('disabled');
      prev?.setAttribute('data-flexscroll-prev', start ? 'loop' : '');
      next?.setAttribute('data-flexscroll-next', end ? 'loop' : '');
    } else {
      prev?.toggleAttribute('disabled', start);
      next?.toggleAttribute('disabled', end);
      prev?.setAttribute('data-flexscroll-prev', '');
      next?.setAttribute('data-flexscroll-next', '');
    }
  };

  const init = () => {
    items = root.querySelectorAll('[data-flexscroll-item]');
    gotos = root.querySelectorAll('[data-flexscroll-goto]');

    for (const item of items) {
      observer.observe(item);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const { target, isIntersecting } = entry;
      const index = [...items].indexOf(target);

      if (isIntersecting) {
        active.push(index);
        target.removeAttribute('inert');
        gotos[index]?.setAttribute('data-flexscroll-goto', '');
      } else {
        active = active.filter((i) => i !== index);
        target.setAttribute('inert', '');
        gotos[index]?.setAttribute('data-flexscroll-goto', 'inert');
      }

      active = [...new Set(active)].sort((a, b) => a - b);

      root.dispatchEvent(new CustomEvent('change', {
        detail: {
          items,
          active,
        },
      }));

      setDisabled();
    }
  }, {
    root: frame || viewport,
    rootMargin: '1px',
    threshold: 1,
  });

  if (prev) {
    prev.addEventListener('click', () => {
      const loop = prev.getAttribute('data-flexscroll-prev') === 'loop';

      if (loop) {
        setScroll(items.length - 1);
      } else {
        const index = getIndex('prev');
        Number.isInteger(index) && setScroll(index, 'prev');
      }
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      const loop = next.getAttribute('data-flexscroll-next') === 'loop';

      if (loop) {
        setScroll(0);
      } else {
        const index = getIndex('next');
        Number.isInteger(index) && setScroll(index, 'next');
      }
    });
  }

  if (prev || next) {
    viewport.addEventListener('scroll', setDisabled);
    setDisabled();
  }

  root.addEventListener('click', (e) => {
    const { target } = e;

    if (target.hasAttribute('data-flexscroll-goto')) {
      const index = [...gotos].indexOf(target);
      setScroll(index);
    }
  });

  root.addEventListener('update', init);
  init();
};

const zeroPad = (num) => String(num).padStart(1, "0");
const targets = document.querySelectorAll("[data-flexscroll]");
for (const target of targets) {
  const viewport = target.querySelector("[data-flexscroll-viewport]");
  const counter = target.querySelector("[data-flexscroll-counter]");
  if (counter) {
    let detail;
    let timeout;
    const update = () => {
      const { items, active } = detail;
      if (active.length) {
        const visible = active.length - 1;
        const current = active[visible] + 1 - visible;
        const total = items.length - visible;
        counter.innerHTML = `${zeroPad(current)} / ${zeroPad(total)}`;
      }
    };
    target.addEventListener("change", (e) => {
      detail = e.detail;
      clearTimeout(timeout);
      timeout = setTimeout(update, 300);
    });
    viewport?.addEventListener("scroll", () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 300);
    });
  }
  flexscroll(target);
  const targets2 = document.querySelectorAll("[data-flexscroll]");
  for (const target2 of targets2) {
    const viewport2 = target2.querySelector("[data-flexscroll-viewport]");
    const area = target2.querySelector(".flexscroll-area");
    const dots = target2.querySelector("[data-flexscroll-dots]");
    if (area !== null) {
      let checkSidebarHeight = function() {
        const windowHeight = viewport2.scrollHeight;
        const sidebarHeight = dots.scrollHeight;
        if (sidebarHeight > windowHeight) {
          area.classList.add("with-scroll");
        } else {
          area.classList.add("with-scroll");
        }
      };
      area.addEventListener("scroll", function() {
        area.classList.add("scrolled");
      });
      window.addEventListener("resize", checkSidebarHeight);
      checkSidebarHeight();
    }
  }
}

const header = document.querySelector(".Header");
function handleScroll() {
  const scrollPosition = window.scrollY || window.pageYOffset;
  if (scrollPosition >= 50) {
    header.setAttribute("data-sticky", "true");
  } else {
    header.removeAttribute("data-sticky");
  }
}
function initializeHeaders() {
  window.addEventListener("scroll", handleScroll);
}
initializeHeaders();
const searchToggle = document.querySelector(".Header__search-toggle");
const headerSearch = document.querySelector("#main-search-nav");
searchToggle?.addEventListener("click", () => {
  if (header && header.getBoundingClientRect().top > 0) {
    if (window.matchMedia("(max-width: 74.99em)").matches) {
      header.scrollIntoView({ behavior: "smooth" });
    }
  }
  const expanded = searchToggle.getAttribute("aria-expanded") === "true";
  searchToggle.nextElementSibling;
  if (!expanded) {
    document.body.classList.remove("menu-open");
    document.body.classList.add("search-open");
    searchToggle.setAttribute("aria-expanded", "true");
    megaToggles.forEach((megaToggle) => {
      megaToggle.setAttribute("aria-expanded", "false");
    });
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  } else {
    searchToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("search-open");
  }
});
header?.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) {
    searchToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("search-open");
  }
});
headerSearch?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchToggle.focus();
    searchToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("search-open");
  }
});
const menuToggle = document.querySelector(".Header__menu-toggle");
const megaToggles = Array.from(document.querySelectorAll(".Header__mega-toggle"));
const headerMenu = document.querySelector("#main-menu-nav");
menuToggle?.addEventListener("click", () => {
  const header2 = menuToggle.closest(".Header");
  if (header2 && header2.getBoundingClientRect().top > 0) {
    if (window.matchMedia("(max-width: 74.99em)").matches) {
      header2.scrollIntoView({ behavior: "smooth" });
    }
  }
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", (!expanded).toString());
  searchToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("search-open");
});
megaToggles.forEach((megaToggle) => {
  megaToggle.addEventListener("click", () => {
    const expanded = megaToggle.getAttribute("aria-expanded") === "true";
    megaToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
    if (!expanded) {
      megaToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      searchToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("search-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  });
});
headerMenu?.addEventListener("keydown", (event) => {
  const currentMegaToggle = megaToggles.find((toggle) => toggle.getAttribute("aria-expanded") === "true");
  if (currentMegaToggle) {
    const submenu = currentMegaToggle.nextElementSibling;
    const submenuItems = submenu?.querySelectorAll("a, button");
    if (submenuItems?.length) {
      const currentIndex = Array.from(submenuItems).indexOf(document.activeElement);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < submenuItems.length) {
          submenuItems[nextIndex]?.focus();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          submenuItems[prevIndex]?.focus();
        }
      }
    }
  }
  const focusedMegaToggleIndex = megaToggles.indexOf(document.activeElement);
  if (event.key === "ArrowLeft" && focusedMegaToggleIndex >= 0) {
    event.preventDefault();
    const prevIndex = (focusedMegaToggleIndex - 1 + megaToggles.length) % megaToggles.length;
    megaToggles[prevIndex]?.focus();
  } else if (event.key === "ArrowRight" && focusedMegaToggleIndex >= 0) {
    event.preventDefault();
    const nextIndex = (focusedMegaToggleIndex + 1) % megaToggles.length;
    megaToggles[nextIndex]?.focus();
  }
  if (event.key === "Escape") {
    const activeToggle = Array.from(megaToggles).find(
      (toggle) => toggle.getAttribute("aria-expanded") === "true"
    );
    if (activeToggle) {
      activeToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      activeToggle.focus();
    }
  }
});
header?.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) {
    megaToggles.forEach((megaToggle) => {
      megaToggle.setAttribute("aria-expanded", "false");
    });
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

const controls = document.querySelectorAll(".Hero__control");
const motionQuery = matchMedia("(prefers-reduced-motion)");
for (const control of controls) {
  const video = control.closest(".Hero")?.querySelector("video");
  if (video) {
    if (motionQuery.matches) {
      video.pause();
      control.classList.add("Hero__control--paused");
    }
    video.addEventListener("pause", () => {
      control.classList.add("Hero__control--paused");
    });
    video.addEventListener("play", () => {
      control.classList.remove("Hero__control--paused");
    });
    control.addEventListener("click", () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }
}
motionQuery.addEventListener("change", (event) => {
  for (const control of controls) {
    const video = control.closest(".Hero")?.querySelector("video");
    if (video) {
      if (event.matches) {
        video.pause();
        control.classList.add("Hero__control--paused");
      }
    }
  }
});

(function() {
  const timelineCarousels = document.querySelectorAll(".TimelineCarousel");
  for (const timelineCarousel of timelineCarousels) {
    let updateNavStyles2 = function() {
      if (slides.length > 0 && flexScrollContainer) {
        const firstSlide = slides[0];
        const image = firstSlide.querySelector("img");
        if (image) {
          const imageHeight = image.offsetHeight;
          flexScrollContainer.style.setProperty("--nav", `${imageHeight}px`);
        }
      }
    }, scrollToSlide2 = function(slideIndex) {
      if (flexScrollViewport && slides[slideIndex]) {
        const targetSlide = slides[slideIndex];
        const slideWidth = targetSlide.offsetWidth;
        const scrollLeft = slideIndex * slideWidth;
        flexScrollViewport.scrollTo({
          left: scrollLeft,
          behavior: "smooth"
        });
      }
    };
    const flexScrollContainer = timelineCarousel.querySelector("[data-flexscroll]");
    const flexScrollViewport = timelineCarousel.querySelector("[data-flexscroll-viewport]");
    const slides = timelineCarousel.querySelectorAll("div[data-flexscroll-item]");
    slides.forEach((slide, index) => {
      slide.setAttribute("data-index", index.toString());
    });
    const dotContainer = timelineCarousel.querySelector("div[data-flexscroll-dots]");
    if (dotContainer) {
      const buttons = dotContainer.querySelectorAll("button[data-flexscroll-goto]");
      const flexscrollArea = timelineCarousel.querySelector(".flexscroll-area.with-scroll");
      buttons.forEach((button, index) => {
        const matchingSlide = timelineCarousel.querySelector(`div[data-index="${index}"]`);
        if (matchingSlide) {
          const image = matchingSlide.querySelector("img");
          if (image) {
            const imgWrapper = document.createElement("span");
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.width = 100;
            imgElement.height = 56;
            imgWrapper.appendChild(imgElement);
            button.appendChild(imgWrapper);
          }
          const title = matchingSlide.getAttribute("data-flexscroll-title");
          const titleSpan = document.createElement("span");
          titleSpan.textContent = title;
          button.appendChild(titleSpan);
        }
        button.addEventListener("click", () => {
          scrollToSlide2(index);
        });
        button.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollToSlide2(index);
          }
        });
        button.addEventListener("focus", () => {
          if (index === 3 && flexscrollArea) {
            flexscrollArea.classList.add("scrolled");
          }
        });
      });
    }
    setTimeout(function() {
      updateNavStyles2();
    }, 500);
    window.addEventListener("resize", updateNavStyles2);
  }
})();

const closes = document.querySelectorAll(".Update__close");
for (const close of closes) {
  const root = close.closest(".Update");
  close.addEventListener("click", () => {
    root?.remove();
  });
}

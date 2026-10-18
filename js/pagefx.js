/* ==========================================================================
   Larisel — between pages, one film
   --------------------------------------------------------------------------
   · Leaving for another of the studio's pages (home, Projects, a project,
     About): the night falls over the page and the mark is drawn in light —
     the neon L of the studio, the same stroke — and the next page opens
     behind it. The next page paints already in that night (html.lx-in, set
     by the snippet in its head, before anything shows) and lets it go.
   · A project's picture (a row on Projects, a tile on the home page) opens
     into its page: the picture grows to fill the screen while it turns into
     the project's own moment, and the project page starts on that very
     picture (html.lx-morph) — its words come in around it.
   · Only for the studio's own pages: the demo sites, new tabs, other sites,
     a link within the page and a modified click are left to the browser.
     Reduced motion: none of it.
   · Coming back with the browser's Back (a page kept in memory) clears it.
   ========================================================================== */
(function () {
  "use strict";
  var html = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "lr-fx";
  var L = "M845 402 L846 393 L849 384 L855 378 L861 371 L868 365 L874 358 L880 352 L887 345 L893 338 L899 331 L904 324 L910 317 L916 310 L921 303 L927 296 L932 288 L937 281 L942 273 L947 266 L952 258 L957 250 L961 242 L966 235 L970 226 L974 218 L977 210 L981 202 L984 193 L987 185 L990 176 L993 167 L995 159 L997 150 L998 141 L999 132 L1000 123 L1000 114 L999 105 L998 95 L997 86 L995 78 L992 69 L988 61 L983 53 L977 47 L970 42 L962 37 L953 34 L944 33 L935 32 L926 31 L917 31 L908 32 L899 33 L890 35 L881 38 L873 41 L864 44 L856 48 L848 52 L840 56 L832 61 L825 66 L818 72 L811 77 L804 83 L797 89 L790 96 L784 102 L778 109 L772 115 L766 122 L760 129 L754 136 L749 144 L744 151 L739 159 L734 166 L729 174 L724 182 L720 190 L715 198 L711 206 L707 214 L703 222 L699 230 L695 238 L691 246 L687 254 L683 263 L679 271 L675 279 L672 287 L668 296 L664 304 L661 312 L657 321 L654 329 L650 337 L647 346 L644 354 L640 363 L637 371 L634 380 L630 388 L627 397 L624 405 L620 413 L617 422 L614 430 L610 439 L607 447 L604 456 L601 464 L597 473 L594 481 L591 489 L587 498 L584 506 L580 515 L577 523 L574 532 L570 540 L567 548 L563 557 L560 565 L556 573 L552 582 L549 590 L545 598 L542 607 L538 615 L534 623 L531 632 L527 640 L523 648 L519 656 L516 665 L512 673 L508 681 L504 689 L500 697 L496 705 L492 714 L488 722 L484 730 L479 738 L475 746 L471 754 L466 762 L462 770 L458 778 L453 785 L448 793 L444 801 L439 809 L434 816 L429 824 L424 832 L419 839 L414 846 L408 854 L403 861 L397 868 L392 875 L386 882 L380 889 L373 895 L366 901 L359 907 L352 913 L345 918 L338 924 L331 930 L324 936 L317 942 L310 947 L303 953 L296 958 L288 962 L279 966 L271 970 L263 973 L254 976 L245 979 L237 981 L228 983 L219 985 L210 986 L201 987 L192 988 L183 989 L174 990 L165 990 L156 991 L147 991 L137 991 L128 991 L119 990 L110 990 L101 989 L92 988 L83 986 L74 984 L66 981 L57 978 L50 973 L43 967 L38 960 L35 951 L34 942 L35 933 L38 924 L43 917 L50 910 L57 905 L65 901 L74 898 L83 896 L91 894 L100 893 L109 892 L118 891 L128 890 L137 890 L146 890 L155 890 L164 890 L173 891 L182 891 L191 892 L200 893 L209 895 L218 896 L227 898 L236 899 L245 901 L254 903 L262 905 L271 907 L280 909 L289 911 L298 914 L306 917 L315 919 L324 922 L332 924 L341 927 L350 929 L358 932 L367 935 L376 937 L385 940 L393 942 L402 945 L411 947 L419 950 L428 952 L437 954 L446 957 L455 959 L463 961 L472 964 L481 966 L490 968 L499 970 L507 972 L516 974 L525 975 L534 977 L543 979 L552 981 L561 982 L570 984 L579 985 L588 986 L597 987 L606 989 L615 990 L624 990 L633 991 L642 992 L651 992 L660 992 L669 991 L678 991 L687 990 L696 989 L705 988 L714 988 L723 986 L732 985 L741 983 L750 982 L759 980 L768 977 L777 975 L785 972 L794 969 L802 965 L811 962 L819 958 L827 954 L835 950 L843 945 L850 941 L858 936 L866 930 L873 925 L880 920 L887 914 L894 908 L901 902 L908 896 L914 889 L921 883 L927 877 L933 870 L939 863 L945 856 L951 849 L957 842 L962 835 L968 828 L973 821 L979 814 L984 806 L989 799 L994 791 L999 784 L1004 776 L1009 769 L1014 761 L1019 753 L1024 746 L1029 738 L1034 730 L1038 722 L1043 715 L1047 707 L1052 699 L1057 691 L1061 683 L1065 675 L1070 667 L1075 660 L1079 652 L1084 644 L1088 636 L1090 632";
  var OURS = /^\/(?:$|work\/|about\/)/;

  /* ---- arriving ---- */
  function arrive() {
    if (!html.classList.contains("lx-in") && !html.classList.contains("lx-morph")) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        html.classList.add("lx-out");
        setTimeout(function () { html.classList.remove("lx-in", "lx-morph", "lx-out"); }, 900);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrive); else arrive();

  if (reduced) return;

  /* ---- leaving ---- */
  var veil = null, morphBox = null, going = false;
  function mark() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "-40 -40 1200 1100");
    svg.innerHTML = '<defs><filter id="lx-g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>' +
      '<path class="lx__glow" d="' + L + '" pathLength="1" filter="url(#lx-g)"/><path class="lx__line" d="' + L + '" pathLength="1"/>';
    return svg;
  }
  function go(url, morph) {
    if (going) return;
    going = true;
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), m: morph || "" })); } catch (e) { /* the next page opens plain */ }
    if (morph) startMorph(morph);
    else {
      veil = document.createElement("div");
      veil.className = "lx"; veil.setAttribute("aria-hidden", "true");
      veil.appendChild(mark());
      document.body.appendChild(veil);
      void veil.offsetWidth;
      veil.classList.add("is-on", "is-drawing");
    }
    setTimeout(function () { location.href = url; }, morph ? 720 : 620);
  }

  /* the picture grows into the project's page: from where it sits to the whole screen, turning
     from what it showed into the project's moment (the poster the project page opens on) */
  var morphFrom = null;
  function poster(id) { return "/media/loop/" + id + "-" + (innerHeight > innerWidth ? "9x16" : "16x9") + ".jpg"; }
  function startMorph(id) {
    var src = morphFrom || null;
    var r = src ? src.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var box = morphBox = document.createElement("div");
    box.className = "lx-morph"; box.setAttribute("aria-hidden", "true");
    box.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;border-radius:" +
      (src ? getComputedStyle(src).borderRadius : "14px");
    var to = new Image(); to.className = "lx-morph__to"; to.alt = ""; to.src = poster(id);
    box.appendChild(to);
    if (src && src.tagName === "VIDEO" && src.readyState >= 2) {
      var cv = document.createElement("canvas");
      cv.width = src.videoWidth; cv.height = src.videoHeight;
      try { cv.getContext("2d").drawImage(src, 0, 0); cv.className = "lx-morph__from"; box.appendChild(cv); } catch (e) { /* no frame: the poster alone */ }
    } else if (src && src.tagName === "IMG") {
      var im = new Image(); im.src = src.currentSrc || src.src; im.className = "lx-morph__from"; box.appendChild(im);
    }
    var shade = document.createElement("div"); shade.className = "lx-shade"; document.body.appendChild(shade);
    document.body.appendChild(box);
    void box.offsetWidth;
    shade.classList.add("is-on");
    box.classList.add("is-open");
    box.style.left = "0px"; box.style.top = "0px"; box.style.width = innerWidth + "px"; box.style.height = innerHeight + "px"; box.style.borderRadius = "0px";
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-no-fx")) return;
    var url;
    try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    if (url.origin !== location.origin || !OURS.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;     /* a place on this page */
    e.preventDefault();
    var id = a.getAttribute("data-morph");
    morphFrom = id ? (a.getAttribute("data-morph-from") && document.querySelector(a.getAttribute("data-morph-from"))) || a.querySelector("video, img") : null;
    go(url.href, id);
  });

  /* the project's poster is fetched while the pointer is on its picture, so it is there when the picture opens */
  document.addEventListener("pointerover", function (e) {
    var a = e.target.closest && e.target.closest("a[data-morph]");
    if (a && !a.__lxp) { a.__lxp = 1; new Image().src = poster(a.getAttribute("data-morph")); }
  }, { passive: true });

  /* Back to a page the browser kept: as it was before the click */
  addEventListener("pageshow", function (ev) {
    if (!ev.persisted) return;
    going = false;
    [].forEach.call(document.querySelectorAll(".lx, .lx-morph, .lx-shade"), function (el) { el.remove(); });
    html.classList.remove("lx-in", "lx-morph", "lx-out");
  });
})();

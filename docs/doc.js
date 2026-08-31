(function () {
    var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    var kbdHint = document.getElementById('kbd-hint');
    if (kbdHint) kbdHint.textContent = isMac ? '⌘K' : 'Ctrl K';

    var searchBtn = document.getElementById('search-btn');
    document.addEventListener('keydown', function (e) {
        var mod = isMac ? e.metaKey : e.ctrlKey;
        if (mod && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchBtn) searchBtn.focus();
        }
    });
})();

(function () {
    var PRODUCTS = [
        { slug: 'moka', name: 'Moka', status: 'Stable', icon: '/assets/images/moka-logo.png' },
        { slug: 'avery', name: 'Avery', status: 'Beta', icon: '/assets/images/avery-logo.png' },
        { slug: 'forge', name: 'Forge', status: 'Stable', icon: '/assets/images/forge-logo.png' },
        { slug: 'lapis', name: 'Lapis', status: 'Alpha', icon: '/assets/images/lapis-logo.png' },
        { slug: 'juno', name: 'Juno', status: 'Beta', icon: '/assets/images/juno-logo.png' }
    ];

    var switcher = document.getElementById('product-switcher');
    var chip = document.getElementById('product-chip-btn');
    var dropdown = document.getElementById('product-dropdown');
    if (!switcher || !chip || !dropdown) return;

    var current = document.body.getAttribute('data-product');

    var itemsHtml = PRODUCTS.map(function (p) {
        var isCurrent = p.slug === current;
        return (
            '<a class="product-dropdown-item' + (isCurrent ? ' current' : '') + '" ' +
            'href="/docs/' + p.slug + '/"' + (isCurrent ? ' aria-current="page"' : '') + '>' +
                '<img src="' + p.icon + '" alt="">' +
                '<div><div class="item-name">' + p.name + '</div><div class="item-status">' + p.status + '</div></div>' +
            '</a>'
        );
    }).join('');

    dropdown.innerHTML =
        itemsHtml +
        '<div class="product-dropdown-divider"></div>' +
        '<a class="product-dropdown-item hub-link" href="https://docs.jrofficial.org/">All products →</a>';

    function closeDropdown() {
        switcher.classList.remove('open');
        chip.setAttribute('aria-expanded', 'false');
    }
    function toggleDropdown() {
        var isOpen = switcher.classList.toggle('open');
        chip.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    chip.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', function (e) {
        if (!switcher.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
    });
})();

(function () {
    var menuBtn = document.getElementById('menu-btn');
    var sidebar = document.getElementById('doc-sidebar');
    var backdrop = document.getElementById('sidebar-backdrop');
    if (!menuBtn || !sidebar || !backdrop) return;

    function openSidebar() {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
    }

    menuBtn.addEventListener('click', function () {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    backdrop.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeSidebar);
    });
})();

(function () {
    var article = document.querySelector('.doc-article');
    var tocNav = document.getElementById('toc-nav');
    if (!article || !tocNav) return;

    var headings = Array.prototype.slice.call(article.querySelectorAll('h2, h3'));
    if (!headings.length) return;

    headings.forEach(function (h, i) {
        if (!h.id) h.id = 'section-' + i;
        var link = document.createElement('a');
        link.href = '#' + h.id;
        link.textContent = h.textContent;
        link.className = 'toc-link' + (h.tagName === 'H3' ? ' toc-h3' : '');
        link.dataset.target = h.id;
        tocNav.appendChild(link);
    });

    var tocLinks = Array.prototype.slice.call(tocNav.querySelectorAll('.toc-link'));

    function setActive(id) {
        tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.target === id);
        });
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
        );
        headings.forEach(function (h) { observer.observe(h); });
    }

    if (tocLinks.length) setActive(headings[0].id);
})();
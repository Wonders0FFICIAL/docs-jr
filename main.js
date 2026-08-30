var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
document.getElementById('kbd-hint').textContent = isMac ? '⌘ K' : 'Ctrl K';

var searchInput = document.getElementById('doc-search');

document.addEventListener('keydown', function (e) {
    var mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
    }
});

(function () {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });
    hamburger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
})();

(function () {
    var canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var STAR_COUNT = 110;
    var CONNECTION_DIST = 140;
    var COLOR = { r: 86, g: 56, b: 229 };
    var stars = [];
    var W, H;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function buildStars() {
        stars = Array.from({ length: STAR_COUNT }, function () {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 1.7 + 0.4,
                a: Math.random() * 0.65 + 0.25
            };
        });
    }

    resizeCanvas();
    buildStars();
    window.addEventListener('resize', function () {
        resizeCanvas();
        buildStars();
    });

    function drawFrame() {
        ctx.clearRect(0, 0, W, H);

        for (var s = 0; s < stars.length; s++) {
            stars[s].x += stars[s].vx;
            stars[s].y += stars[s].vy;
            if (stars[s].x < 0) stars[s].x = W;
            if (stars[s].x > W) stars[s].x = 0;
            if (stars[s].y < 0) stars[s].y = H;
            if (stars[s].y > H) stars[s].y = 0;
        }

        for (var i = 0; i < stars.length; i++) {
            for (var j = i + 1; j < stars.length; j++) {
                var dx = stars[i].x - stars[j].x;
                var dy = stars[i].y - stars[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(' + COLOR.r + ',' + COLOR.g + ',' + COLOR.b + ',' + ((1 - dist / CONNECTION_DIST) * 0.2) + ')';
                    ctx.lineWidth = 0.7;
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }

        for (var k = 0; k < stars.length; k++) {
            var st = stars[k];
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + COLOR.r + ',' + COLOR.g + ',' + COLOR.b + ',' + (st.a * 0.55) + ')';
            ctx.fill();
        }

        requestAnimationFrame(drawFrame);
    }

    if (!reduceMotion) {
        drawFrame();
    }
})();
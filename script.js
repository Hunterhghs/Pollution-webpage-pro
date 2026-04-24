/* ============================================
   POLLUTION AWARENESS — INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initTypingEffect();
    initCountUp();
    initCards();
    initCharts();
    initImpactTabs();
    initQuiz();
    initCalculator();
    initPledge();
    initScrollAnimations();
    initMobileHotspots();
});

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x += dx / dist * 0.8;
                    this.y += dy / dist * 0.8;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVBAR
   ============================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navAnchors = links.querySelectorAll('a');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    function closeMenu() {
        toggle.classList.remove('open');
        links.classList.remove('open');
        overlay.classList.remove('open');
    }

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            toggle.classList.add('open');
            links.classList.add('open');
            overlay.classList.add('open');
        }
    });

    overlay.addEventListener('click', closeMenu);

    navAnchors.forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = links.querySelector(`a[href="#${id}"]`);

            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    }
}

/* ============================================
   TYPING EFFECT
   ============================================ */

function initTypingEffect() {
    const words = ['Suffocating', 'Drowning in Plastic', 'Heating Up', 'Losing Species', 'Running Out of Time'];
    const el = document.getElementById('typed-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */

function initCountUp() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    let animated = false;

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const suffix = stat.dataset.suffix || '';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.floor(eased * target);

                    if (target >= 1000000) {
                        stat.textContent = (value / 1000000).toFixed(1) + 'M' + suffix;
                    } else if (target >= 1000) {
                        stat.textContent = (value / 1000).toFixed(1) + 'K' + suffix;
                    } else {
                        stat.textContent = value + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        if (target >= 1000000) {
                            stat.textContent = (target / 1000000).toFixed(0) + 'M' + suffix;
                        } else {
                            stat.textContent = target + suffix;
                        }
                    }
                }
                requestAnimationFrame(update);
            });
        }
    }, { threshold: 0.5 });

    if (stats.length > 0) observer.observe(stats[0].closest('.hero-stats'));
}

/* ============================================
   EXPANDABLE CARDS
   ============================================ */

function initCards() {
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => {
            const wasExpanded = card.classList.contains('expanded');
            document.querySelectorAll('.type-card.expanded').forEach(c => c.classList.remove('expanded'));
            if (!wasExpanded) card.classList.add('expanded');
        });
    });
}

/* ============================================
   CHARTS
   ============================================ */

let mainChart = null;

const chartData = {
    emissions: {
        type: 'bar',
        data: {
            labels: ['China', 'USA', 'India', 'Russia', 'Japan', 'Germany', 'S. Korea', 'Iran', 'Canada', 'Indonesia'],
            datasets: [{
                label: 'CO₂ Emissions (Billion Tons)',
                data: [11.47, 5.01, 2.88, 1.76, 1.08, 0.67, 0.62, 0.59, 0.57, 0.54],
                backgroundColor: [
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(167, 139, 250, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(20, 184, 166, 0.8)'
                ],
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 11 } }
                }
            }
        },
        insight: 'CO₂ emissions have increased by <strong>60%</strong> since 1990. China and the US alone account for over <strong>43%</strong> of global emissions.'
    },
    deaths: {
        type: 'doughnut',
        data: {
            labels: ['Air Pollution (outdoor)', 'Air Pollution (indoor)', 'Water Pollution', 'Lead Exposure', 'Occupational Exposure', 'Soil Contamination'],
            datasets: [{
                data: [4200000, 2600000, 1400000, 900000, 870000, 430000],
                backgroundColor: [
                    'rgba(244, 63, 94, 0.85)',
                    'rgba(251, 113, 133, 0.85)',
                    'rgba(34, 211, 238, 0.85)',
                    'rgba(167, 139, 250, 0.85)',
                    'rgba(245, 158, 11, 0.85)',
                    'rgba(16, 185, 129, 0.85)'
                ],
                borderWidth: 0,
                spacing: 3,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        padding: 16,
                        font: { size: 12 },
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => {
                            const val = ctx.parsed;
                            return ` ${(val / 1000000).toFixed(1)}M deaths per year`;
                        }
                    }
                }
            }
        },
        insight: 'Air pollution (indoor + outdoor) is responsible for <strong>6.8 million</strong> premature deaths per year — making it the deadliest form of pollution.'
    },
    plastic: {
        type: 'line',
        data: {
            labels: ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020', '2025'],
            datasets: [{
                label: 'Global Plastic Production (Million Tons)',
                data: [2, 8, 35, 70, 120, 213, 313, 368, 400],
                borderColor: 'rgba(244, 63, 94, 0.9)',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(244, 63, 94, 1)',
                pointBorderColor: 'rgba(10, 14, 23, 1)',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
            }, {
                label: 'Plastic in Oceans (Million Tons)',
                data: [0, 0.1, 0.8, 3, 10, 30, 75, 150, 180],
                borderColor: 'rgba(34, 211, 238, 0.9)',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(34, 211, 238, 1)',
                pointBorderColor: 'rgba(10, 14, 23, 1)',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', padding: 20, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b', font: { size: 11 } }
                },
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#64748b', font: { size: 11 } }
                }
            }
        },
        insight: 'Plastic production has grown <strong>200x</strong> since 1950. Only <strong>9%</strong> of all plastic ever produced has been recycled. The rest sits in landfills or the environment.'
    },
    aqi: {
        type: 'bar',
        data: {
            labels: ['Delhi', 'Dhaka', 'N\'Djamena', 'Dushanbe', 'Muscat', 'Baghdad', 'Kigali', 'Accra', 'Jakarta', 'Beijing'],
            datasets: [{
                label: 'Annual Mean PM2.5 (μg/m³)',
                data: [110, 78, 75, 59, 53, 49, 46, 43, 40, 38],
                backgroundColor: ctx => {
                    const val = ctx.parsed?.y || 0;
                    if (val > 75) return 'rgba(244, 63, 94, 0.8)';
                    if (val > 50) return 'rgba(245, 158, 11, 0.8)';
                    return 'rgba(251, 191, 36, 0.8)';
                },
                borderRadius: 6,
                borderSkipped: false,
            }, {
                label: 'WHO Guideline (5 μg/m³)',
                data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                type: 'line',
                borderColor: 'rgba(16, 185, 129, 0.8)',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', padding: 20, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 45 }
                }
            }
        },
        insight: 'Delhi\'s air is <strong>22x</strong> above the WHO guideline of 5 μg/m³. No city in the top 10 most polluted cities meets the WHO standard.'
    }
};

function initCharts() {
    renderChart('emissions');

    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderChart(btn.dataset.chart);
        });
    });
}

function renderChart(key) {
    const config = chartData[key];
    const canvas = document.getElementById('main-chart');

    if (mainChart) mainChart.destroy();

    mainChart = new Chart(canvas, {
        type: config.type,
        data: config.data,
        options: config.options,
    });

    document.getElementById('data-insights').innerHTML = `
        <div class="insight-card">
            <div class="insight-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg></div>
            <p>${config.insight}</p>
        </div>
    `;
}

/* ============================================
   IMPACT TABS
   ============================================ */

let tempChart = null;

function initImpactTabs() {
    document.querySelectorAll('.impact-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.impact-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.impact-panel').forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.getElementById(`panel-${tab.dataset.impact}`);
            panel.classList.add('active');

            if (tab.dataset.impact === 'climate') {
                setTimeout(renderTempChart, 100);
            }
        });
    });
}

function renderTempChart() {
    const canvas = document.getElementById('temp-chart');
    if (!canvas) return;
    if (tempChart) tempChart.destroy();

    const years = [];
    const temps = [];
    const baseData = [
        -0.16, -0.09, -0.16, -0.28, -0.12, -0.07, -0.02, -0.10, -0.14, -0.07,
        -0.02, 0.04, 0.07, 0.14, -0.12, -0.07, -0.01, 0.05, 0.08, 0.04,
        0.25, 0.41, 0.22, 0.23, 0.28, 0.32, 0.33, 0.46, 0.42, 0.39,
        0.40, 0.54, 0.63, 0.62, 0.54, 0.68, 0.64, 0.66, 0.54, 0.64,
        0.72, 0.61, 0.65, 0.68, 0.75, 0.90, 0.95, 0.92, 0.85, 0.98,
        1.01, 0.92, 1.00, 1.18, 1.17, 1.13, 1.29, 1.48
    ];

    for (let i = 0; i < baseData.length; i++) {
        years.push(1967 + i);
        temps.push(baseData[i]);
    }

    tempChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                data: temps,
                backgroundColor: temps.map(t => {
                    if (t < 0) return 'rgba(59, 130, 246, 0.7)';
                    if (t < 0.5) return 'rgba(251, 191, 36, 0.7)';
                    if (t < 1.0) return 'rgba(245, 158, 11, 0.8)';
                    return 'rgba(244, 63, 94, 0.85)';
                }),
                borderRadius: 2,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    callbacks: {
                        label: ctx => `${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}°C`
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#64748b',
                        callback: v => `${v > 0 ? '+' : ''}${v}°C`
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#64748b',
                        maxTicksLimit: 10,
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

/* ============================================
   QUIZ
   ============================================ */

const quizQuestions = [
    {
        question: 'How many premature deaths does pollution cause worldwide each year?',
        options: ['3 million', '5 million', '9 million', '15 million'],
        correct: 2,
        explanation: 'According to The Lancet Commission on Pollution and Health, pollution is responsible for approximately 9 million premature deaths per year — 16% of all deaths globally.'
    },
    {
        question: 'What percentage of all plastic ever produced has been recycled?',
        options: ['9%', '22%', '35%', '50%'],
        correct: 0,
        explanation: 'Only about 9% of all plastic ever produced has been recycled. 12% has been incinerated, and the remaining 79% has accumulated in landfills or the natural environment.'
    },
    {
        question: 'Which pollutant is the single greatest environmental health risk according to WHO?',
        options: ['Water contamination', 'Air pollution', 'Lead exposure', 'Noise pollution'],
        correct: 1,
        explanation: 'The WHO identifies air pollution as the single greatest environmental risk to health, responsible for about 7 million premature deaths annually from combined indoor and outdoor exposure.'
    },
    {
        question: 'How long does a plastic bottle take to decompose?',
        options: ['50 years', '100 years', '250 years', '450 years'],
        correct: 3,
        explanation: 'A typical plastic bottle takes approximately 450 years to decompose. Some plastics can take up to 1,000 years. During decomposition, they break into harmful microplastics.'
    },
    {
        question: 'What percentage of the world\'s population breathes polluted air (above WHO guidelines)?',
        options: ['50%', '70%', '91%', '99%'],
        correct: 2,
        explanation: '91% of the world\'s population lives in places where air quality exceeds WHO guideline limits. This affects virtually every country, though low- and middle-income countries suffer most.'
    },
    {
        question: 'Approximately how many pieces of plastic are estimated to be in the ocean?',
        options: ['500 million', '50 billion', '5.25 trillion', '100 trillion'],
        correct: 2,
        explanation: 'An estimated 5.25 trillion pieces of plastic debris are in the ocean, weighing roughly 269,000 tons. This includes large debris, microplastics, and nano-plastics.'
    },
    {
        question: 'What is the WHO guideline for annual mean PM2.5 concentration?',
        options: ['5 μg/m³', '15 μg/m³', '25 μg/m³', '35 μg/m³'],
        correct: 0,
        explanation: 'In 2021, the WHO tightened its guidelines to recommend annual mean PM2.5 of 5 μg/m³ (down from 10). No capital city in the world currently meets this standard.'
    },
    {
        question: 'How many tons of plastic enter the oceans each year?',
        options: ['1 million', '8 million', '14 million', '25 million'],
        correct: 2,
        explanation: 'Approximately 14 million tons of plastic end up in the ocean every year. This is equivalent to dumping a garbage truck of plastic into the ocean every minute.'
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('quiz-progress-fill').style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    document.getElementById('quiz-progress-text').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    const optionsContainer = document.getElementById('quiz-options');
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" onclick="answerQuestion(${i})">
            <span class="option-letter">${letters[i]}</span>
            <span>${opt}</span>
        </button>
    `).join('');
}

window.answerQuestion = function(index) {
    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === index && i !== q.correct) opt.classList.add('wrong');
    });

    if (index === q.correct) score++;

    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.textContent = q.explanation;
    document.getElementById('quiz-options').appendChild(explanation);

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 2500);
};

function showResults() {
    document.querySelector('.quiz-question').classList.add('hidden');
    document.querySelector('.quiz-progress').classList.add('hidden');
    const result = document.getElementById('quiz-result');
    result.classList.remove('hidden');

    const pct = score / quizQuestions.length;
    document.getElementById('score-number').textContent = `${score}/${quizQuestions.length}`;

    const ring = document.getElementById('score-ring');
    const circumference = 339.29;
    ring.style.strokeDashoffset = circumference * (1 - pct);

    const titles = {
        low: 'Keep Learning!',
        mid: 'Good Awareness!',
        high: 'Pollution Expert!'
    };
    const messages = {
        low: 'There\'s a lot to learn about pollution and its effects. Explore the rest of this page to deepen your understanding of this critical issue.',
        mid: 'You have solid awareness of pollution issues! Dive deeper into specific topics on this page to become even more informed.',
        high: 'Impressive knowledge! You\'re well-informed about the pollution crisis. Now it\'s time to take action and share what you know.'
    };

    const level = pct < 0.4 ? 'low' : pct < 0.75 ? 'mid' : 'high';
    document.getElementById('result-title').textContent = titles[level];
    document.getElementById('result-message').textContent = messages[level];
}

window.resetQuiz = function() {
    currentQuestion = 0;
    score = 0;
    document.querySelector('.quiz-question').classList.remove('hidden');
    document.querySelector('.quiz-progress').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('score-ring').style.strokeDashoffset = '339.29';
    showQuestion();
};

/* ============================================
   CARBON CALCULATOR
   ============================================ */

function initCalculator() {
    const sliders = {
        driving: { el: document.getElementById('driving'), display: document.getElementById('driving-value'), suffix: ' miles' },
        flights: { el: document.getElementById('flights'), display: document.getElementById('flights-value'), suffix: ' flights' },
        electricity: { el: document.getElementById('electricity'), display: document.getElementById('electricity-value'), prefix: '$' },
        heating: { el: document.getElementById('heating'), display: document.getElementById('heating-value'), prefix: '$' },
        shopping: { el: document.getElementById('shopping'), display: document.getElementById('shopping-value'), suffix: ' items' },
    };

    Object.values(sliders).forEach(({ el, display, prefix, suffix }) => {
        el.addEventListener('input', () => {
            display.textContent = `${prefix || ''}${el.value}${suffix || ''}`;
        });
    });

    document.querySelectorAll('.calc-next').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
            document.querySelector(`.calc-step[data-step="${btn.dataset.next}"]`).classList.add('active');
        });
    });

    document.querySelectorAll('.calc-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
            document.querySelector(`.calc-step[data-step="${btn.dataset.prev}"]`).classList.add('active');
        });
    });

    document.getElementById('calc-submit').addEventListener('click', calculateFootprint);
}

function calculateFootprint() {
    const driving = parseInt(document.getElementById('driving').value);
    const flights = parseInt(document.getElementById('flights').value);
    const electricity = parseInt(document.getElementById('electricity').value);
    const heating = parseInt(document.getElementById('heating').value);
    const diet = document.querySelector('input[name="diet"]:checked').value;
    const shopping = parseInt(document.getElementById('shopping').value);

    const drivingCO2 = (driving * 52 * 0.000404);
    const flightsCO2 = (flights * 0.9);
    const electricityCO2 = (electricity * 12 * 0.000417 * 1000 / 1000);
    const heatingCO2 = (heating * 12 * 0.005);
    const dietMap = { 'heavy-meat': 3.3, 'moderate': 2.5, 'vegetarian': 1.7, 'vegan': 1.1 };
    const dietCO2 = dietMap[diet];
    const shoppingCO2 = (shopping * 12 * 0.04);

    const total = drivingCO2 + flightsCO2 + electricityCO2 + heatingCO2 + dietCO2 + shoppingCO2;

    document.getElementById('calc-form').classList.add('hidden');
    const result = document.getElementById('calc-result');
    result.classList.remove('hidden');

    const display = document.getElementById('footprint-value');
    animateValue(display, 0, total, 1500);

    const barPct = Math.min((total / 20) * 100, 100);
    document.getElementById('your-bar').style.width = `${barPct}%`;
    document.getElementById('your-value').textContent = `${total.toFixed(1)}t`;

    const svgCar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14V9l-3-5H8L5 9v8z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/><path d="M5 9h14"/></svg>';
    const svgPlane = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
    const svgBolt = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
    const svgLeaf = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M12 22c-4-4-8-8-8-14a8 8 0 0 1 16 0c0 6-4 10-8 14z"/><path d="M12 10v6m-3-3h6"/></svg>';
    const svgBag = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
    const svgCheck = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>';

    const tips = [];
    if (drivingCO2 > 3) tips.push({ icon: svgCar, text: `<strong>Reduce driving</strong> — your commute adds ${drivingCO2.toFixed(1)}t CO2/year. Consider carpooling, public transit, or an EV.` });
    if (flightsCO2 > 1.5) tips.push({ icon: svgPlane, text: `<strong>Fly less</strong> — your flights generate ${flightsCO2.toFixed(1)}t CO2/year. Take trains for shorter trips.` });
    if (electricityCO2 > 2) tips.push({ icon: svgBolt, text: `<strong>Switch to renewables</strong> — your electricity accounts for ${electricityCO2.toFixed(1)}t CO2/year.` });
    if (diet === 'heavy-meat') tips.push({ icon: svgLeaf, text: `<strong>Eat less meat</strong> — a plant-rich diet could save up to 2.2t CO2/year.` });
    if (shoppingCO2 > 1) tips.push({ icon: svgBag, text: `<strong>Buy less, choose better</strong> — consumer goods add ${shoppingCO2.toFixed(1)}t CO2/year. Choose secondhand or sustainable brands.` });
    if (tips.length === 0) tips.push({ icon: svgCheck, text: `<strong>Great job!</strong> Your footprint is below the global average. Keep it up and consider offsetting what remains.` });

    document.getElementById('reduction-tips').innerHTML = '<h4>Top Ways to Reduce Your Footprint</h4>' +
        tips.map(t => `<div class="tip-item"><div class="tip-icon">${t.icon}</div><div class="tip-text">${t.text}</div></div>`).join('');
}

function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;
        el.textContent = current.toFixed(1);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

window.resetCalculator = function() {
    document.getElementById('calc-form').classList.remove('hidden');
    document.getElementById('calc-result').classList.add('hidden');
    document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
    document.querySelector('.calc-step[data-step="1"]').classList.add('active');
};

/* ============================================
   PLEDGE
   ============================================ */

function initPledge() {
    const checkboxes = document.querySelectorAll('#pledge-options input');
    const btn = document.getElementById('pledge-btn');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = document.querySelectorAll('#pledge-options input:checked').length;
            btn.disabled = checked === 0;
        });
    });

    btn.addEventListener('click', () => {
        btn.classList.add('hidden');
        document.getElementById('pledge-options').style.pointerEvents = 'none';
        document.getElementById('pledge-options').style.opacity = '0.6';
        document.getElementById('pledge-confirmation').classList.remove('hidden');
        launchConfetti();
    });
}

function launchConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#22d3ee', '#f43f5e', '#f59e0b', '#a78bfa', '#10b981', '#6366f1'];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.animationDuration = `${2 + Math.random() * 2}s`;
        container.appendChild(piece);
    }

    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

window.sharePledge = function(platform) {
    const checked = [...document.querySelectorAll('#pledge-options input:checked')].map(c => c.value);
    const text = `I just pledged to fight pollution! My commitments: ${checked.join(', ')}. Join me!`;

    if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
        });
    }
};

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initMobileHotspots() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    document.querySelectorAll('.hotspot').forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasActive = hotspot.classList.contains('active');
            document.querySelectorAll('.hotspot.active').forEach(h => h.classList.remove('active'));
            if (!wasActive) hotspot.classList.add('active');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.hotspot.active').forEach(h => h.classList.remove('active'));
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item, .species-card, .type-card').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.type-card, .species-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const visObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.type-card, .species-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
        visObserver.observe(el);
    });
}

import os

css_path = 'assets/css/style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('.nav-tel{display:none}', '@media(max-width:800px){.nav-tel{display:none}}')

modern_css = """
/* Modern Web Additions */
@view-transition { navigation: auto; }
html {
    scroll-behavior: smooth;
    scrollbar-gutter: stable;
}

@supports (animation-timeline: view()) {
    .reveal {
        opacity: 0;
        animation: fade-in-up linear forwards;
        animation-timeline: view();
        animation-range: entry 10% cover 25%;
        transform: none;
    }
    .reveal.in { opacity: unset; transform: unset; }
    
    @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(4px); }
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
}

/* Modern Hero Video Background */
.hero-video {
    position: relative;
    min-height: 100svh;
    display: grid;
    align-items: center;
    isolation: isolate;
    padding: 2rem 0;
}
.hero-bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
    filter: brightness(0.8) contrast(1.1);
}
.hero-overlay {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(38,6,12,0.6) 0%, rgba(38,6,12,0.3) 40%, rgba(38,6,12,0.85) 100%);
}
.hero-content {
    z-index: 1;
    color: white;
    max-width: 800px;
}
.hero-video .display {
    font-size: clamp(3rem, 7vw, 6rem);
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    margin: 1.5rem 0 1.2rem;
    line-height: 1.05;
}
.hero-video .hero-sub {
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    color: #fdf9f2;
    text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    max-width: 60ch;
}
.hero-video .hero-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    flex-wrap: wrap;
}

/* Features Grid */
.features-grid-section {
    margin-bottom: 5rem;
}
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: -4rem; /* pull up over hero */
    z-index: 10;
    position: relative;
}
.feature-card {
    background: rgba(253,249,242,0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.4);
    padding: 2.5rem;
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-lg);
    color: var(--ink);
    transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1);
}
.feature-card:hover { transform: translateY(-8px); }
.feature-card h3 { color: var(--maroon-900); font-size: 1.6rem; margin-bottom: 0.8rem; }
.feature-card p { color: var(--muted); }
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css + modern_css)

print("style.css updated")

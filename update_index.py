import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Hero section
new_hero = """<!-- ============ MODERN HERO ============ -->
<section class="hero hero-video">
  <video class="hero-bg-video" autoplay loop muted playsinline poster="assets/images/food/desi-spread.jpg">
    <source src="https://assets.mixkit.co/videos/preview/mixkit-barbecue-with-meat-on-the-grill-at-night-32742-large.mp4" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="wrap hero-content">
    <span class="hero-badge" style="view-transition-name: hero-badge; border:1px solid rgba(233,207,138,.5);border-radius:100px;padding:.5rem 1.1rem;font-size:.74rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-2);background:rgba(38,6,12,.4);backdrop-filter:blur(8px)">✦ &nbsp;Since 1988 · Islamabad&nbsp; ✦</span>
    <h1 class="display" style="view-transition-name: hero-title;">Taste Defines <br><em>the Occasion.</em></h1>
    <p class="hero-sub">Desi & barbecue catering, marquees, décor and complete event handling — across Islamabad. <strong>We cater, you celebrate.</strong></p>
    <div class="hero-actions">
      <a class="btn btn-gold" href="contact.html#quote">Request a Quote →</a>
      <a class="btn btn-ghost" href="assets/docs/Oasis_Menu.pdf" target="_blank" rel="noopener">Download PDF Menu</a>
    </div>
  </div>
</section>

<section class="features-grid-section">
  <div class="wrap features-grid">
    <div class="feature-card">
      <h3>Catering Perfection</h3>
      <p>From slow-cooked Nihari and Biryani to live BBQ, our chefs prepare authentic Pakistani cuisine that leaves a lasting impression.</p>
    </div>
    <div class="feature-card">
      <h3>Exquisite Marquees</h3>
      <p>Bespoke tents and elegant floral arrangements designed to perfectly match your wedding or corporate theme.</p>
    </div>
    <div class="feature-card">
      <h3>Complete Event Management</h3>
      <p>Stress-free celebrations. We handle the food, the decor, the lights, and the flow so you can focus on your guests.</p>
    </div>
  </div>
</section>
"""

# We replace the original <section class="hero hero-ed"> ... </section>
# AND the <!-- ============ SERVICES ============ --> section
html = re.sub(r'<!-- ============ HERO ============ -->.*?</section>', new_hero, html, flags=re.DOTALL)

# Delete the old SERVICES section to not duplicate text
html = re.sub(r'<!-- ============ SERVICES ============ -->.*?</section>', '', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html rewritten")

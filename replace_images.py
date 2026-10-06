import glob
import re

images = {
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1': 'assets/images/food/seekh-kebab.jpg',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836': 'assets/images/food/chargha-roast.jpg',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0': 'assets/images/food/biryani-pakistani.jpg',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3': 'assets/images/food/desi-spread.jpg'
}

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in images.items():
        content = re.sub(old + r'[^\"\'\s]*', new, content)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Images replaced safely")

import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<source src="https://assets\.mixkit\.co[^"]+"[^>]*>', '', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

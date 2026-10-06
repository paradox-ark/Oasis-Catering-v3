import os

js_path = 'assets/js/main.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix FAQ bug
content = content.replace('$(".pm",o).textContent', 'if($(".pm",o)) $(".pm",o).textContent')
content = content.replace('$(".pm",it).textContent', 'if($(".pm",it)) $(".pm",it).textContent')

# Fix localStorage clearing before WhatsApp sending
content = content.replace('try{localStorage.removeItem(KEY);}catch{}', '')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("main.js fixed")

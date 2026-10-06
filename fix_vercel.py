import json
with open('vercel.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
data['cleanUrls'] = False
with open('vercel.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
print("vercel.json fixed")

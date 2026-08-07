import os

file_path = 'brutos-coin-landing (1).html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

if len(lines) >= 2209:
    line = lines[2208]
    if line.strip().startswith('alt="Caminhão Brutos passando no pedágio automaticamente">'):
        print("Found line!")
        lines[2208] = '          alt="Caminhão Brutos passando no pedágio automaticamente">\n'
    else:
        print("Did not find matching string on line 2209. The line starts with:")
        print(repr(line.strip()[:100]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

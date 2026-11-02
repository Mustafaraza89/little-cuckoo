import os
import pypdf

os.makedirs('public/logo', exist_ok=True)

reader = pypdf.PdfReader('Documents/New Little cuckoo LOGO.pdf')
stream = reader.pages[0].get_contents().get_data().decode('latin1', errors='ignore')
H = 2000.0

tokens = stream.split()
i = 0
current_cmyk = None
paths = []
current_d = []
current_coords = []

while i < len(tokens):
    tok = tokens[i]
    if tok == 'scn' and i >= 4:
        try:
            c = float(tokens[i-4])
            m = float(tokens[i-3])
            y = float(tokens[i-2])
            k = float(tokens[i-1])
            current_cmyk = (c, m, y, k)
        except:
            pass
        i += 1
    elif tok == 'm' and i >= 2:
        try:
            x = float(tokens[i-2])
            y = H - float(tokens[i-1])
            current_d.append(f'M {x:.2f} {y:.2f}')
            current_coords.append((x, y))
        except:
            pass
        i += 1
    elif tok == 'l' and i >= 2:
        try:
            x = float(tokens[i-2])
            y = H - float(tokens[i-1])
            current_d.append(f'L {x:.2f} {y:.2f}')
            current_coords.append((x, y))
        except:
            pass
        i += 1
    elif tok == 'c' and i >= 6:
        try:
            x1 = float(tokens[i-6])
            y1 = H - float(tokens[i-5])
            x2 = float(tokens[i-4])
            y2 = H - float(tokens[i-3])
            x3 = float(tokens[i-2])
            y3 = H - float(tokens[i-1])
            current_d.append(f'C {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f} {x3:.2f} {y3:.2f}')
            current_coords.extend([(x1, y1), (x2, y2), (x3, y3)])
        except:
            pass
        i += 1
    elif tok == 'h':
        current_d.append('Z')
        i += 1
    elif tok in ('f', 'f*'):
        if current_d:
            paths.append((current_cmyk, ' '.join(current_d), tok, current_coords))
            current_d = []
            current_coords = []
        i += 1
    else:
        i += 1

# Paths 7 to 39 are the logo elements
logo_paths = paths[7:40]

# 1. Primary Full Logo
min_x = min(x for p in logo_paths for x, y in p[3])
max_x = max(x for p in logo_paths for x, y in p[3])
min_y = min(y for p in logo_paths for x, y in p[3])
max_y = max(y for p in logo_paths for x, y in p[3])
w, h = max_x - min_x, max_y - min_y
pad = 16

primary_svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x - pad:.2f} {min_y - pad:.2f} {w + 2*pad:.2f} {h + 2*pad:.2f}" width="100%" height="100%">']
for cmyk, d, fill_rule, _ in logo_paths:
    rule_attr = ' fill-rule="evenodd"' if fill_rule == 'f*' else ''
    if cmyk[1] > 0.5:
        color = '#F3848F' # Strawberry pink
    elif cmyk[0] > 0.5:
        color = '#3689BA' # Baby blue
    else:
        color = '#BAB5B4' # Soft grey
    primary_svg.append(f'  <path d="{d}" fill="{color}"{rule_attr} />')
primary_svg.append('</svg>')

with open('public/logo/little_cuckoo_primary.svg', 'w') as f:
    f.write('\n'.join(primary_svg))

# 2. Icon Only (Path 9 is the dual heart)
heart_path = paths[9]
hx_min = min(x for x, y in heart_path[3])
hx_max = max(x for x, y in heart_path[3])
hy_min = min(y for x, y in heart_path[3])
hy_max = max(y for x, y in heart_path[3])
hw, hh = hx_max - hx_min, hy_max - hy_min
hpad = 8

icon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{hx_min - hpad:.2f} {hy_min - hpad:.2f} {hw + 2*hpad:.2f} {hh + 2*hpad:.2f}" width="100%" height="100%">
  <path d="{heart_path[1]}" fill="#F3848F" fill-rule="evenodd" />
</svg>'''

with open('public/logo/little_cuckoo_icon.svg', 'w') as f:
    f.write(icon_svg)

# 3. Favicon (dual heart in rounded squircle)
favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="28" fill="#FFF8ED" />
  <g transform="translate(15, 12) scale(0.3)">
    <path d="{heart_path[1]}" fill="#F3848F" fill-rule="evenodd" transform="translate({-hx_min}, {-hy_min})" />
  </g>
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(favicon_svg)

# 4. Horizontal Mark ("Little" + "cuckoo" without tagline for compact headers)
header_paths = paths[7:20]
hm_min_x = min(x for p in header_paths for x, y in p[3])
hm_max_x = max(x for p in header_paths for x, y in p[3])
hm_min_y = min(y for p in header_paths for x, y in p[3])
hm_max_y = max(y for p in header_paths for x, y in p[3])
hm_w, hm_h = hm_max_x - hm_min_x, hm_max_y - hm_min_y

header_svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{hm_min_x - pad:.2f} {hm_min_y - pad:.2f} {hm_w + 2*pad:.2f} {hm_h + 2*pad:.2f}" width="100%" height="100%">']
for cmyk, d, fill_rule, _ in header_paths:
    rule_attr = ' fill-rule="evenodd"' if fill_rule == 'f*' else ''
    color = '#F3848F' if cmyk[1] > 0.5 else '#3689BA'
    header_svg.append(f'  <path d="{d}" fill="{color}"{rule_attr} />')
header_svg.append('</svg>')

with open('public/logo/little_cuckoo_horizontal.svg', 'w') as f:
    f.write('\n'.join(header_svg))

# 5. Light Mark for Dark Backgrounds
dark_svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x - pad:.2f} {min_y - pad:.2f} {w + 2*pad:.2f} {h + 2*pad:.2f}" width="100%" height="100%">']
for cmyk, d, fill_rule, _ in logo_paths:
    rule_attr = ' fill-rule="evenodd"' if fill_rule == 'f*' else ''
    if cmyk[1] > 0.5:
        color = '#F3848F' # Heart & Little stays pink
    elif cmyk[0] > 0.5:
        color = '#B9DDF2' # Baby blue light for dark bg
    else:
        color = '#FFF8ED' # Vanilla cream for tagline
    dark_svg.append(f'  <path d="{d}" fill="{color}"{rule_attr} />')
dark_svg.append('</svg>')

with open('public/logo/little_cuckoo_light.svg', 'w') as f:
    f.write('\n'.join(dark_svg))

print('All 5 vector logo variants created successfully in public/logo and public/favicon.svg!')

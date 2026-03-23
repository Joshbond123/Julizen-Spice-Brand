const svgToDataUri = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\n\s*/g, "").trim())}`;

const packBase = (body: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520" role="img" aria-label="Julizen product pack">
    ${body}
  </svg>
`);

export const chickenPackArt = packBase(`
  <defs>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.45" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="34" y="18" width="352" height="484" rx="10" fill="#f2c400"/>
  <path d="M34 18h352v86H34z" fill="#cf1014"/>
  <path d="M34 430h352v72H34z" fill="#b91115"/>
  <circle cx="84" cy="64" r="34" fill="none" stroke="#d41116" stroke-width="4"/>
  <text x="84" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">HALAL</text>
  <text x="84" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">JUL</text>
  <text x="74" y="208" font-size="36" font-weight="700" fill="#9b2013" font-family="Georgia, serif">Chicken</text>
  <text x="74" y="248" font-size="36" font-weight="700" fill="#9b2013" font-family="Georgia, serif">Flavour</text>
  <text x="74" y="288" font-size="36" font-weight="700" fill="#9b2013" font-family="Georgia, serif">Poulet</text>
  <ellipse cx="288" cy="210" rx="84" ry="96" fill="#e6f2ff"/>
  <g fill="#3294e6" opacity="0.95">
    <circle cx="258" cy="140" r="10"/><circle cx="286" cy="136" r="10"/><circle cx="316" cy="146" r="10"/>
    <circle cx="246" cy="170" r="10"/><circle cx="276" cy="170" r="10"/><circle cx="306" cy="174" r="10"/><circle cx="336" cy="180" r="10"/>
    <circle cx="236" cy="202" r="10"/><circle cx="266" cy="202" r="10"/><circle cx="296" cy="206" r="10"/><circle cx="326" cy="212" r="10"/>
    <circle cx="242" cy="234" r="10"/><circle cx="272" cy="236" r="10"/><circle cx="302" cy="240" r="10"/><circle cx="332" cy="246" r="10"/>
    <circle cx="254" cy="266" r="10"/><circle cx="284" cy="268" r="10"/><circle cx="314" cy="272" r="10"/>
  </g>
  <g>
    <circle cx="254" cy="180" r="58" fill="#fff9db" stroke="#a10f12" stroke-width="3"/>
    <path d="M219 129c22-40 78-40 97 0-15 5-22 13-28 25-6-14-19-23-39-28-8 1-19 2-30 3z" fill="#d51518"/>
    <path d="M269 178c17-9 42-4 52 11-21 8-39 11-57 11l5-22z" fill="#f6c02b" stroke="#a10f12" stroke-width="3"/>
    <circle cx="268" cy="177" r="15" fill="#ffda3d" stroke="#a10f12" stroke-width="3"/>
    <circle cx="268" cy="177" r="6" fill="#1c1c1c"/>
    <path d="M218 184c16 13 24 28 25 48-23-3-41-12-54-28 8-7 18-13 29-20z" fill="#c91115" stroke="#8a0e11" stroke-width="3"/>
    <path d="M196 204c18 0 34 4 49 12-25 24-48 30-70 19 3-14 10-24 21-31z" fill="#f0c33d" stroke="#a10f12" stroke-width="3"/>
    <path d="M246 194c-17-12-40-19-64-16 7-12 17-18 31-20 18 2 29 13 33 36z" fill="#ffffff" stroke="#a10f12" stroke-width="3"/>
  </g>
  <text x="210" y="392" text-anchor="middle" font-size="86" font-weight="800" fill="#d51518" font-family="Arial, sans-serif">Julizen</text>
  <line x1="124" y1="405" x2="298" y2="405" stroke="#d51518" stroke-width="4"/>
  <text x="210" y="440" text-anchor="middle" font-size="32" font-weight="700" fill="#111" font-family="Arial, sans-serif">NET WT: 100G</text>
  <text x="210" y="482" text-anchor="middle" font-size="32" font-weight="800" fill="#ffd84d" font-family="Arial, sans-serif">SEASONING POWDER</text>
  <path d="M52 28h316c10 0 18 8 18 18v20c-110 16-228 16-352 0V46c0-10 8-18 18-18z" fill="url(#shine)"/>
`);

export const crayfishPackArt = packBase(`
  <defs>
    <linearGradient id="crayShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="34" y="18" width="352" height="484" rx="10" fill="#f4cd1b"/>
  <path d="M34 18h352v86H34z" fill="#cf1014"/>
  <path d="M34 430h352v72H34z" fill="#bd1215"/>
  <path d="M34 98c98-10 216-8 352 8v-8c-96-18-214-20-352-6z" fill="#cf1014"/>
  <circle cx="84" cy="64" r="34" fill="none" stroke="#d41116" stroke-width="4"/>
  <text x="84" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">HALAL</text>
  <text x="84" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">JUL</text>
  <text x="72" y="210" font-size="34" font-weight="800" fill="#bf1918" font-family="Arial, sans-serif">CRAYFISH FLAVOUR</text>
  <text x="104" y="248" font-size="34" font-weight="800" fill="#bf1918" font-family="Arial, sans-serif">CREVETTE</text>
  <g transform="translate(208 104)">
    <path d="M70 8c44 34 66 72 66 118 0 58-35 95-95 116-41 14-83 14-116 0 34-6 64-18 90-37-18-1-33-6-45-15 18-11 36-20 56-27-20-4-36-12-50-26 18-14 39-22 65-24-15-7-27-18-35-33 26-7 47-1 64 18 9-28 24-57 45-90 5 0 10 0 15 0z" fill="none" stroke="#bf1918" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="102" cy="126" r="7" fill="#bf1918"/>
    <path d="M136 65c18-27 34-48 48-64" fill="none" stroke="#bf1918" stroke-width="6" stroke-linecap="round"/>
    <path d="M142 80c26-20 46-31 60-35" fill="none" stroke="#bf1918" stroke-width="5" stroke-linecap="round"/>
    <path d="M144 94c24-8 44-11 60-9" fill="none" stroke="#bf1918" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="210" y="396" text-anchor="middle" font-size="86" font-weight="800" fill="#d51518" font-family="Arial, sans-serif">Julizen</text>
  <line x1="124" y1="408" x2="298" y2="408" stroke="#d51518" stroke-width="4"/>
  <text x="210" y="444" text-anchor="middle" font-size="32" font-weight="700" fill="#111" font-family="Arial, sans-serif">NET WT: 100G</text>
  <text x="210" y="482" text-anchor="middle" font-size="32" font-weight="800" fill="#ffd84d" font-family="Arial, sans-serif">SEASONING POWDER</text>
  <path d="M52 28h316c10 0 18 8 18 18v20c-110 16-228 16-352 0V46c0-10 8-18 18-18z" fill="url(#crayShine)"/>
`);

export const friedRicePackArt = packBase(`
  <defs>
    <linearGradient id="riceShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="34" y="18" width="352" height="484" rx="10" fill="#f4d51d"/>
  <path d="M34 18h352v76H34z" fill="#f4d51d"/>
  <path d="M34 118c56-42 180-58 352-10v326H34z" fill="#0b7b24"/>
  <path d="M34 430h352v72H34z" fill="#b91115"/>
  <circle cx="84" cy="64" r="34" fill="none" stroke="#d41116" stroke-width="4"/>
  <text x="84" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">HALAL</text>
  <text x="84" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="#d41116" font-family="Arial, sans-serif">JUL</text>
  <text x="210" y="116" text-anchor="middle" font-size="44" font-weight="800" fill="#da1517" stroke="#f4d51d" stroke-width="5" font-family="Arial, sans-serif">Fried Rice</text>
  <ellipse cx="210" cy="240" rx="144" ry="84" fill="#f7f7f7"/>
  <ellipse cx="210" cy="252" rx="116" ry="56" fill="#cc941f"/>
  <g fill="#efb92c">
    <circle cx="154" cy="248" r="13"/><circle cx="180" cy="227" r="14"/><circle cx="198" cy="260" r="13"/><circle cx="230" cy="236" r="14"/><circle cx="254" cy="261" r="13"/><circle cx="274" cy="236" r="12"/>
    <circle cx="128" cy="274" r="12"/><circle cx="162" cy="285" r="13"/><circle cx="200" cy="288" r="12"/><circle cx="236" cy="292" r="13"/><circle cx="274" cy="284" r="12"/>
  </g>
  <g fill="#d94d2b"><circle cx="184" cy="222" r="8"/><circle cx="244" cy="278" r="8"/><circle cx="142" cy="286" r="8"/><circle cx="264" cy="222" r="8"/></g>
  <g fill="#5a9628"><circle cx="164" cy="234" r="7"/><circle cx="218" cy="274" r="7"/><circle cx="286" cy="272" r="7"/><circle cx="126" cy="258" r="7"/></g>
  <path d="M276 162c34 0 57 18 65 58-8 30-24 47-49 53-25-30-34-62-16-111z" fill="#8f2c1d"/>
  <path d="M307 188c26 10 42 28 48 58-6 24-20 41-42 49-23-21-31-47-27-79z" fill="#b74326"/>
  <text x="210" y="408" text-anchor="middle" font-size="86" font-weight="800" fill="#d51518" font-family="Arial, sans-serif">Julizen</text>
  <line x1="124" y1="420" x2="298" y2="420" stroke="#d51518" stroke-width="4"/>
  <text x="210" y="482" text-anchor="middle" font-size="32" font-weight="800" fill="#ffd84d" font-family="Arial, sans-serif">SEASONING POWDER</text>
  <path d="M52 28h316c10 0 18 8 18 18v20c-110 16-228 16-352 0V46c0-10 8-18 18-18z" fill="url(#riceShine)"/>
`);

export const stewJollofPackArt = packBase(`
  <defs>
    <linearGradient id="stewShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="jollofBowl" cx="45%" cy="40%" r="60%">
      <stop offset="0" stop-color="#ffb347"/>
      <stop offset="0.65" stop-color="#a73d15"/>
      <stop offset="1" stop-color="#6e220a"/>
    </radialGradient>
    <radialGradient id="stewBowl" cx="45%" cy="40%" r="60%">
      <stop offset="0" stop-color="#d68048"/>
      <stop offset="0.62" stop-color="#8f2816"/>
      <stop offset="1" stop-color="#65180e"/>
    </radialGradient>
  </defs>
  <rect x="34" y="18" width="352" height="484" rx="10" fill="#b31218"/>
  <path d="M34 18h352v90H34z" fill="#cb171c"/>
  <circle cx="84" cy="64" r="34" fill="none" stroke="#f3c225" stroke-width="4"/>
  <text x="84" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="#f3c225" font-family="Arial, sans-serif">HALAL</text>
  <text x="84" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="#f3c225" font-family="Arial, sans-serif">JUL</text>
  <rect x="90" y="84" width="240" height="100" rx="4" fill="none" stroke="#ffffff" stroke-width="6"/>
  <text x="210" y="145" text-anchor="middle" font-size="58" font-weight="800" fill="#ffffff" font-family="Arial, sans-serif">Julizen</text>
  <text x="210" y="196" text-anchor="middle" font-size="28" font-weight="800" fill="#ffffff" font-family="Arial, sans-serif">STEW &amp; JOLLOF</text>
  <path d="M140 214h140l-18 20H158z" fill="#3ea032"/>
  <text x="210" y="228" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff" font-family="Arial, sans-serif">BETTER FOOD FOR BETTER LIFE</text>
  <circle cx="156" cy="310" r="66" fill="url(#jollofBowl)" stroke="#efbd2e" stroke-width="3"/>
  <circle cx="266" cy="310" r="66" fill="url(#stewBowl)" stroke="#efbd2e" stroke-width="3"/>
  <g fill="#f0a323"><circle cx="126" cy="280" r="7"/><circle cx="154" cy="300" r="8"/><circle cx="176" cy="326" r="7"/><circle cx="148" cy="334" r="7"/><circle cx="182" cy="286" r="7"/></g>
  <g fill="#5cb23c"><circle cx="136" cy="302" r="6"/><circle cx="170" cy="312" r="6"/><circle cx="156" cy="352" r="6"/></g>
  <g fill="#c97a4d"><rect x="238" y="276" width="32" height="24" rx="6"/><rect x="276" y="292" width="34" height="26" rx="6"/><rect x="240" y="318" width="38" height="28" rx="6"/><rect x="280" y="330" width="30" height="24" rx="6"/></g>
  <text x="104" y="448" font-size="28" font-weight="700" fill="#ffffff" font-family="Arial, sans-serif">NET WT: 100G</text>
  <text x="278" y="448" text-anchor="middle" font-size="28" font-weight="800" fill="#ffffff" font-family="Arial, sans-serif">SEASONING POWDER</text>
  <path d="M52 28h316c10 0 18 8 18 18v20c-110 16-228 16-352 0V46c0-10 8-18 18-18z" fill="url(#stewShine)"/>
`);

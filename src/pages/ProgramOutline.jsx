import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const defaultProgram = {
  showFullProgram: false,
  details: {
    thankYou: 'Thank you',
    thankYouSub: 'FOR BEING A PART OF OUR SPECIAL DAY',
    quote: '“And now these three remain: faith, hope and love. But the greatest of these is love.”',
    quoteRef: '1 CORINTHIANS 13:13'
  },
  officiating: [
    'Rev Dr. Robert Ampiah Kwofi',
    'Rev. Mrs Abrefi Ampiah Kwofi',
    'Rev. William Orhin',
    'Rev Edem Emil Dusu',
    'Rev Rexford Lamptey'
  ],
  supporting: [
    'Prophet Daniel Agu',
    'Rev. Dr. P D Quartey',
    'Rev. Andy Denteh',
    'Ps. Stanley Asante Mireku',
    'Rev. William Amoafo',
    'Ps. John Bosco Brempong',
    'Ps. Grace Bentil'
  ],
  items: [
    { id: '1', item: 'Musical Prelude/Arrival of Guests/Groom', assignee: 'Song Ministration: Levite Shebach', time: '' },
    { id: '2', item: 'Opening Prayer', assignee: '', time: '' },
    { id: '3', item: 'Bridal March', assignee: '', time: '' },
    { id: '4', item: 'Praise and Worship', assignee: 'Min Steve Bright Makafui.', time: '' },
    { id: '5', item: 'Declaration of purpose', assignee: '', time: '' },
    { id: '6', item: 'Special Song Ministration by Min. Sitso', assignee: '', time: '' },
    { id: '7', item: 'Solemnization of Matrimony', assignee: '', time: '' },
    { id: '8', item: '1st Offertory', assignee: 'Min. Samuel Anie - Amoah', time: '' },
    { id: '9', item: '1st Scripture Reading – 1 Corinthians 13:1-13', assignee: '', time: '' },
    { id: '10', item: '2nd Scripture Reading – 1 John 4:7-21', assignee: '', time: '' },
    { id: '11', item: 'Sermon', assignee: 'Rev. Robert Ampiah Kwofi', time: '' },
    { id: '12', item: 'Signing of Registrar', assignee: '', time: '' },
    { id: '13', item: '2nd Offertory', assignee: 'Songs by Global Harmonic Clarions', time: '' },
    { id: '14', item: 'Welcoming of couple', assignee: 'Min. Asmah / Min. Richie', time: '' },
    { id: '15', item: 'Presentation of Certificate & Offertory', assignee: '', time: '' },
    { id: '16', item: 'Announcement', assignee: '', time: '' },
    { id: '17', item: 'Closing Hymn', assignee: 'The Lord Bless you and Keep You – Min. Mary-Ann', time: '' },
    { id: '18', item: 'Closing prayer', assignee: '', time: '' },
    { id: '19', item: 'Exit march', assignee: '', time: '' }
  ],
  photoItems: []
}

// Number of Part 1 items shown in the middle panel; the rest continue on the third panel
const SPLIT_AT = 10

/* =====================================================
   SHARED COLOURS & FONTS
   ===================================================== */
const DARK = '#14452F'
const GOLD = '#B8923A'
const CREAM = '#fbf9f3'
const GREEN_LEFT = '#1B5239'
const GREEN_RIGHT = '#0F3A28'

const FONT_BODY = "'EB Garamond', 'Cormorant Garamond', 'Times New Roman', serif"
const FONT_HEAD = "'Cormorant Garamond', 'Times New Roman', serif"
const FONT_CAPS = "'Cinzel', 'Times New Roman', serif"
const FONT_SCRIPT = "'Great Vibes', cursive"

const LEAF = 'M0 0 C 8 -12, 26 -12, 44 0 C 26 12, 8 12, 0 0 Z'
const LEAF_THIN = 'M0 0 C 6 -3.5, 22 -3.5, 52 0 C 22 3.5, 6 3.5, 0 0 Z'

/* =====================================================
   SMALL ORNAMENTS
   ===================================================== */
const FleurMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 1.5 C 14.6 5.5, 14.6 9.5, 12 13 C 9.4 9.5, 9.4 5.5, 12 1.5 Z" fill={GOLD} />
    <path d="M12 13.5 C 8.5 13.5, 5.5 11.5, 4.5 8 C 8 8.5, 10.8 10.5, 12 13.5 Z" fill={GOLD} />
    <path d="M12 13.5 C 15.5 13.5, 18.5 11.5, 19.5 8 C 16 8.5, 13.2 10.5, 12 13.5 Z" fill={GOLD} />
    <path d="M12 14 L12 21" stroke={GOLD} strokeWidth="1.2" fill="none" />
    <circle cx="12" cy="22" r="1.3" fill={GOLD} />
  </svg>
)

const SproutMark = ({ className = '' }) => (
  <svg viewBox="0 0 28 24" className={className} aria-hidden="true">
    <path d="M14 22 L14 10" stroke={GOLD} strokeWidth="1.2" fill="none" />
    <path d="M14 12 C 8 12, 3 8, 2 2 C 8 2, 13 6, 14 12 Z" fill={GOLD} />
    <path d="M14 12 C 20 12, 25 8, 26 2 C 20 2, 15 6, 14 12 Z" fill={GOLD} opacity="0.85" />
    <path d="M14 10 C 12 6, 12 3, 14 0.5 C 16 3, 16 6, 14 10 Z" fill={GOLD} />
  </svg>
)

const Divider = ({ mark = 'fleur', width = 'w-[80%]', className = '' }) => (
  <div className={`flex items-center gap-2 ${width} ${className}`}>
    <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.7 }} />
    {mark === 'sprout' ? (
      <SproutMark className="w-6 h-5 shrink-0" />
    ) : (
      <FleurMark className="w-4 h-4 shrink-0" />
    )}
    <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.7 }} />
  </div>
)

const LeafPair = ({ className = '' }) => (
  <svg viewBox="0 0 40 24" className={className} aria-hidden="true">
    <path d="M20 22 C 10 22, 3 15, 2 5 C 12 5, 19 11, 20 22 Z" fill="#2F6142" />
    <path d="M20 22 C 30 22, 37 15, 38 5 C 28 5, 21 11, 20 22 Z" fill="#3D7050" />
    <path d="M20 22 L 8 9" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" fill="none" />
    <path d="M20 22 L 32 9" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" fill="none" />
  </svg>
)

const FooterSprig = ({ className = '' }) => (
  <svg viewBox="0 0 100 40" className={className} aria-hidden="true">
    <g transform="translate(50 36)">
      <path d={LEAF_THIN} transform="rotate(-172) scale(1.0)" fill="#EADFB4" stroke="#C9A94E" strokeWidth="0.5" />
      <path d={LEAF_THIN} transform="rotate(-8) scale(1.0)" fill="#EADFB4" stroke="#C9A94E" strokeWidth="0.5" />
      <path d={LEAF} transform="rotate(-140) scale(0.8)" fill="#3D7050" />
      <path d={LEAF} transform="rotate(-40) scale(0.8)" fill="#2C5E3F" />
      <path d={LEAF} transform="rotate(-90) scale(0.85)" fill="#4A7B55" />
    </g>
  </svg>
)

const CameraIcon = ({ className = '' }) => (
  <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
    <path d="M13 7 L15 2.5 H25 L27 7 Z" fill={DARK} />
    <rect x="2" y="7" width="36" height="23" rx="4" fill={DARK} />
    <circle cx="20" cy="19" r="8" fill={CREAM} />
    <circle cx="20" cy="19" r="5.8" fill={DARK} />
    <circle cx="18" cy="17" r="1.5" fill={CREAM} />
    <rect x="31" y="10.5" width="4" height="2.5" rx="1" fill={CREAM} />
  </svg>
)

const PartPill = ({ children, className = '' }) => (
  <span
    className={`inline-block px-10 py-1.5 rounded-full text-[13px] tracking-[0.3em] ${className}`}
    style={{
      background: DARK,
      color: CREAM,
      fontFamily: FONT_CAPS,
      boxShadow: `0 0 0 2px ${CREAM}, 0 0 0 3px ${GOLD}`
    }}
  >
    {children}
  </span>
)

/* =====================================================
   GREENERY (bottom-right of the third panel)
   Leafy branch with green leaves, thin golden leaves and buds
   ===================================================== */
const Greenery = ({ className = '' }) => {
  const gold = [
    [96, 196, -172, 1.5], [94, 176, -158, 1.25], [88, 120, -22, 0.8],
    [82, 96, -24, 0.75], [78, 62, -78, 1.15], [75, 40, -100, 0.95]
  ]
  const green = [
    [95, 186, -38, 1.4, '#2C5E3F'], [94, 182, -142, 1.4, '#3D7050'],
    [91, 158, -55, 1.3, '#2F6142'], [90, 150, -125, 1.3, '#4A7B55'],
    [87, 132, -60, 1.15, '#3D7050'], [86, 122, -120, 1.1, '#2C5E3F'],
    [83, 104, -62, 1.0, '#4A7B55'], [82, 94, -116, 1.0, '#2F6142'],
    [79, 76, -66, 0.88, '#2C5E3F'], [78, 66, -112, 0.85, '#3D7050'],
    [76, 50, -72, 0.72, '#3D7050'], [75, 40, -106, 0.7, '#2C5E3F'],
    [74, 30, -90, 0.7, '#4A7B55']
  ]
  return (
    <svg
      viewBox="0 0 140 200"
      preserveAspectRatio="xMaxYMax meet"
      className={className}
      aria-hidden="true"
    >
      {/* stems */}
      <path d="M96 200 C 92 150, 84 100, 74 28" stroke="#D2B35E" strokeWidth="0.9" fill="none" />
      <path d="M92 150 C 70 138, 50 120, 38 96" stroke="#D2B35E" strokeWidth="0.8" fill="none" />

      {/* thin golden leaves */}
      {gold.map(([x, y, r, s], i) => (
        <path
          key={`g${i}`}
          d={LEAF_THIN}
          transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
          fill="#EADFB4"
          stroke="#C9A94E"
          strokeWidth="0.5"
        />
      ))}

      {/* green leaves */}
      {green.map(([x, y, r, s, c], i) => (
        <path
          key={`l${i}`}
          d={LEAF}
          transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
          fill={c}
        />
      ))}

      {/* buds */}
      {[[40, 100], [35, 94], [44, 107], [33, 103], [40, 91], [47, 98]].map(([cx, cy], i) => (
        <circle key={`b${i}`} cx={cx} cy={cy} r="2" fill="#F1E7C2" stroke="#D2B35E" strokeWidth="0.5" />
      ))}
    </svg>
  )
}

/* =====================================================
   LISTS
   ===================================================== */
const NumberedList = ({ rows, startAt = 1 }) => (
  <ol className="w-full text-left space-y-[5px]">
    {rows.map((row, i) => {
      // Assignees written like "Label: Name" appear on their own line, without a dash
      const stacked = row.assignee && row.assignee.includes(':')
      return (
        <li
          key={row.id || i}
          className="flex gap-1 leading-snug"
          style={{ fontFamily: FONT_BODY, color: DARK }}
        >
          <span className="w-9 shrink-0 text-[15px] font-medium" style={{ color: GOLD }}>
            {startAt + i}.
          </span>
          <span className="flex-1 text-[15px]">
            {row.item}
            {row.assignee && !stacked && <em> – {row.assignee}</em>}
            {row.time && (
              <span
                className="ml-2 text-[10px] font-semibold whitespace-nowrap"
                style={{ color: GOLD, fontFamily: FONT_CAPS }}
              >
                ({row.time})
              </span>
            )}
            {row.assignee && stacked && (
              <em className="block text-[13px] leading-tight">{row.assignee}</em>
            )}
          </span>
        </li>
      )
    })}
  </ol>
)

const MinisterBlock = ({ heading, names }) =>
  names.length === 0 ? null : (
    <div className="w-full">
      <h3
        className="uppercase text-[16px] tracking-[0.16em] font-semibold mb-2"
        style={{ fontFamily: FONT_HEAD, color: DARK }}
      >
        {heading}
      </h3>
      <div>
        {names.map((n, i) => (
          <p
            key={i}
            className="text-[15px] leading-[1.45]"
            style={{ fontFamily: FONT_BODY, color: DARK }}
          >
            {n}
          </p>
        ))}
      </div>
    </div>
  )

/* =====================================================
   COVER ARTWORK (fixed design – not editable by admin)
   ===================================================== */
const SvgLeaf = ({ x, y, r, s = 1, fill, thin = false }) => (
  <use
    href={thin ? '#coverLeafThin' : '#coverLeaf'}
    transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
    fill={fill}
  />
)

const SvgFlower = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse
        key={i}
        cx="0"
        cy="-11"
        rx="8"
        ry="14"
        transform={`rotate(${i * 72})`}
        fill="#FDFBF4"
        stroke="#CFC49A"
        strokeWidth="0.6"
      />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={`v${i}`}
        d="M0 -4 L0 -20"
        transform={`rotate(${i * 72})`}
        stroke="#E3DAB8"
        strokeWidth="0.5"
      />
    ))}
    <circle r="4" fill="#D9B24C" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <circle
        key={`s${i}`}
        cx={Math.cos((i * 2 * Math.PI) / 7) * 7}
        cy={Math.sin((i * 2 * Math.PI) / 7) * 7}
        r="1.1"
        fill="#C79B34"
      />
    ))}
  </g>
)

const Spray = ({ flowers }) => (
  <g>
    {/* golden stems */}
    <path d="M0 22 C 40 44, 90 20, 170 16" stroke="#D2B35E" strokeWidth="0.9" fill="none" />
    <path d="M6 30 C 16 80, 22 130, 34 172" stroke="#D2B35E" strokeWidth="0.9" fill="none" />
    <path d="M10 60 C 40 70, 60 90, 70 120" stroke="#D2B35E" strokeWidth="0.7" fill="none" />

    {/* thin golden leaves */}
    <SvgLeaf thin x={28} y={52} r={48} s={1.9} fill="#EADFB4" />
    <SvgLeaf thin x={48} y={34} r={28} s={2.2} fill="#EADFB4" />
    <SvgLeaf thin x={78} y={22} r={10} s={2.4} fill="#EEE4BE" />
    <SvgLeaf thin x={118} y={18} r={4} s={1.6} fill="#EEE4BE" />
    <SvgLeaf thin x={14} y={96} r={84} s={1.7} fill="#EADFB4" />
    <SvgLeaf thin x={24} y={132} r={80} s={1.2} fill="#EEE4BE" />
    <SvgLeaf thin x={34} y={78} r={66} s={1.5} fill="#EADFB4" />

    {/* green leaves */}
    <SvgLeaf x={2} y={30} r={78} s={1.15} fill="#2C5E3F" />
    <SvgLeaf x={4} y={56} r={88} s={1.0} fill="#3D7050" />
    <SvgLeaf x={16} y={30} r={52} s={1.25} fill="#2F6142" />
    <SvgLeaf x={20} y={44} r={64} s={1.1} fill="#4A7B55" />
    <SvgLeaf x={38} y={22} r={26} s={1.15} fill="#2A5A3D" />
    <SvgLeaf x={56} y={16} r={14} s={1.2} fill="#3D7050" />
    <SvgLeaf x={74} y={10} r={8} s={1.0} fill="#2F6142" />
    <SvgLeaf x={2} y={96} r={92} s={0.85} fill="#2C5E3F" />
    <SvgLeaf x={8} y={116} r={84} s={0.8} fill="#3D7050" />
    <SvgLeaf x={14} y={70} r={74} s={0.9} fill="#4A7B55" />

    {/* buds */}
    {[
      [30, 150], [34, 160], [26, 164], [38, 172], [30, 180]
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="2" fill="#F1E7C2" stroke="#D2B35E" strokeWidth="0.5" />
    ))}

    {flowers.map(([fx, fy, fs, fr], i) => (
      <SvgFlower key={i} x={fx} y={fy} s={fs} rot={fr} />
    ))}
  </g>
)

// Monogram circle geometry
const CIRCLE_X = 205
const CIRCLE_Y = 170
const CIRCLE_R = 78

// Leaf sprigs hugging the circle (left rises from lower-left, right rises from lower-right)
const laurelLeft = [112, 124, 136, 148, 160, 172, 184]
const laurelRight = [68, 56, 44, 32, 20, 8, -4]

const CoverPanel = () => {
  const pt = (deg, rad = CIRCLE_R) => [
    CIRCLE_X + rad * Math.cos((deg * Math.PI) / 180),
    CIRCLE_Y + rad * Math.sin((deg * Math.PI) / 180)
  ]

  const [lsx, lsy] = pt(108)
  const [lex, ley] = pt(190)
  const [rsx, rsy] = pt(72)
  const [rex, rey] = pt(-10)

  return (
    <div className="relative flex flex-col bg-[#fbf9f3] w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 402 822"
        className="block w-full h-auto shrink-0"
        role="img"
        aria-label="The Wedding Program – Jeffrey Quansah and Eliana Amoafo, 31st October 2026, 11:00 AM, Global Revival Ministries REVIVAL City"
      >
        <defs>
          <g id="coverLeaf">
            <path d="M0 0 C 12 -14, 40 -14, 60 0 C 40 14, 12 14, 0 0 Z" />
            <path d="M2 0 L54 0" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
          </g>
          <g id="coverLeafThin">
            <path
              d="M0 0 C 10 -6, 32 -6, 56 0 C 32 6, 10 6, 0 0 Z"
              stroke="#C9A94E"
              strokeWidth="0.5"
            />
            <path d="M2 0 L52 0" stroke="#D2B35E" strokeWidth="0.4" fill="none" />
          </g>
          <linearGradient id="coverGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E9CB70" />
            <stop offset="55%" stopColor="#B8892B" />
            <stop offset="100%" stopColor="#D9B550" />
          </linearGradient>
          <linearGradient id="coverGoldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9A445" />
            <stop offset="50%" stopColor="#E6C868" />
            <stop offset="100%" stopColor="#B8923A" />
          </linearGradient>
          {/* horizontal gradient so the extension below the SVG matches exactly */}
          <linearGradient id="coverGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GREEN_LEFT} />
            <stop offset="100%" stopColor={GREEN_RIGHT} />
          </linearGradient>
        </defs>

        {/* background */}
        <rect width="402" height="822" fill="#FBF9F3" />

        {/* left golden vertical line */}
        <line x1="10" y1="150" x2="10" y2="712" stroke="url(#coverGoldLine)" strokeWidth="2" />

        {/* top-left floral spray (scaled down so it never touches the circle) */}
        <g transform="scale(0.85)">
          <Spray flowers={[[46, 24, 1.55, -10], [108, 8, 0.7, 20]]} />
        </g>

        {/* monogram circle */}
        <circle
          cx={CIRCLE_X}
          cy={CIRCLE_Y}
          r={CIRCLE_R}
          fill="none"
          stroke="url(#coverGoldLine)"
          strokeWidth="1.4"
        />

        {/* leaf sprig – left side */}
        <path
          d={`M ${lsx} ${lsy} A ${CIRCLE_R} ${CIRCLE_R} 0 0 1 ${lex} ${ley}`}
          fill="none"
          stroke="#3D7050"
          strokeWidth="0.9"
        />
        {laurelLeft.map((deg) => {
          const [px, py] = pt(deg)
          return (
            <g key={`l${deg}`}>
              <SvgLeaf x={px} y={py} r={deg + 90 - 38} s={0.4} fill="#3D7050" />
              <SvgLeaf x={px} y={py} r={deg + 90 + 38} s={0.38} fill="#2C5E3F" />
            </g>
          )
        })}
        {/* tip leaf + bud, left */}
        <SvgLeaf x={lex} y={ley} r={190 + 90} s={0.4} fill="#2C5E3F" />
        <circle cx={pt(196)[0] - 1} cy={pt(196)[1] - 2} r="2" fill="#E8D58E" />

        {/* leaf sprig – right side */}
        <path
          d={`M ${rsx} ${rsy} A ${CIRCLE_R} ${CIRCLE_R} 0 0 0 ${rex} ${rey}`}
          fill="none"
          stroke="#3D7050"
          strokeWidth="0.9"
        />
        {laurelRight.map((deg) => {
          const [px, py] = pt(deg)
          return (
            <g key={`r${deg}`}>
              <SvgLeaf x={px} y={py} r={deg - 90 + 38} s={0.4} fill="#3D7050" />
              <SvgLeaf x={px} y={py} r={deg - 90 - 38} s={0.38} fill="#2C5E3F" />
            </g>
          )
        })}
        {/* tip leaf + bud, right */}
        <SvgLeaf x={rex} y={rey} r={-10 - 90} s={0.4} fill="#2C5E3F" />
        <circle cx={pt(-16)[0] + 1} cy={pt(-16)[1] - 2} r="2" fill="#E8D58E" />

        {/* monogram J & E (sized to sit neatly inside the circle) */}
        <text
          x="178"
          y="190"
          textAnchor="middle"
          fontSize="80"
          fontWeight="700"
          fill={DARK}
          style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
        >
          J
        </text>
        <text
          x="205"
          y="198"
          textAnchor="middle"
          fontSize="58"
          fontWeight="600"
          fill="url(#coverGold)"
          style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
        >
          &amp;
        </text>
        <text
          x="237"
          y="206"
          textAnchor="middle"
          fontSize="80"
          fontWeight="700"
          fill={DARK}
          style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
        >
          E
        </text>

        {/* title */}
        <text
          x="205"
          y="285"
          textAnchor="middle"
          fontSize="17"
          letterSpacing="7"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          THE WEDDING
        </text>
        <text
          x="205"
          y="328"
          textAnchor="middle"
          fontSize="42"
          fontWeight="600"
          letterSpacing="5"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          PROGRAM
        </text>

        {/* divider with diamond */}
        <line x1="114" y1="352" x2="196" y2="352" stroke={GOLD} strokeWidth="1" />
        <line x1="214" y1="352" x2="296" y2="352" stroke={GOLD} strokeWidth="1" />
        <rect x="201.5" y="348.5" width="7" height="7" transform="rotate(45 205 352)" fill={GOLD} />

        {/* names */}
        <text
          x="205"
          y="391"
          textAnchor="middle"
          fontSize="19"
          fontWeight="600"
          letterSpacing="4"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          JEFFREY QUANSAH
        </text>
        <line x1="108" y1="415" x2="180" y2="415" stroke={GOLD} strokeWidth="1" />
        <line x1="230" y1="415" x2="298" y2="415" stroke={GOLD} strokeWidth="1" />
        <text
          x="205"
          y="420"
          textAnchor="middle"
          fontSize="14"
          letterSpacing="3"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          AND
        </text>
        <text
          x="205"
          y="456"
          textAnchor="middle"
          fontSize="19"
          fontWeight="600"
          letterSpacing="4"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          ELIANA AMOAFO
        </text>

        {/* hashtag */}
        <text
          x="205"
          y="516"
          textAnchor="middle"
          fontSize="34"
          fill={DARK}
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          #TheJeffEl Chapter
        </text>

        {/* info row dividers */}
        <line x1="155" y1="555" x2="155" y2="645" stroke={GOLD} strokeWidth="1" />
        <line x1="262" y1="555" x2="262" y2="645" stroke={GOLD} strokeWidth="1" />

        {/* calendar icon */}
        <g transform="translate(92 572)" stroke={GOLD} fill="none" strokeWidth="1.6">
          <rect x="-12" y="-11" width="24" height="23" rx="2.5" />
          <path d="M-12 -4 H12 M-6 -14 V-8 M6 -14 V-8" />
          {[[-6, 2], [0, 2], [6, 2], [-6, 7], [0, 7], [6, 7]].map(([dx, dy], i) => (
            <circle key={i} cx={dx} cy={dy} r="1.1" fill={GOLD} stroke="none" />
          ))}
        </g>
        <g
          fill={DARK}
          textAnchor="middle"
          fontSize="14"
          letterSpacing="1.5"
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          <text x="92" y="603">31st</text>
          <text x="92" y="620">OCTOBER</text>
          <text x="92" y="637">2026</text>
        </g>

        {/* clock icon */}
        <g transform="translate(207 573)" stroke={GOLD} fill="none" strokeWidth="1.6">
          <circle r="13" />
          <circle r="9.5" strokeWidth="0.6" />
          <path d="M0 -7 V0 L6 4" strokeLinecap="round" />
        </g>
        <text
          x="207"
          y="606"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="1.5"
          fill={DARK}
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          11:00 AM
        </text>

        {/* location icon */}
        <g transform="translate(323 573)" stroke={GOLD} fill="none" strokeWidth="1.6">
          <path d="M0 15 C -9 3 -12 -1 -12 -6 A12 12 0 0 1 12 -6 C 12 -1 9 3 0 15 Z" />
          <circle cx="0" cy="-6" r="4.5" />
        </g>
        <g
          fill={DARK}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
        >
          <text x="323" y="604">Global Revival</text>
          <text x="323" y="620">Ministries</text>
          <text x="323" y="636">REVIVAL City</text>
        </g>

        {/* lower divider */}
        <line x1="118" y1="676" x2="196" y2="676" stroke={GOLD} strokeWidth="1" />
        <line x1="218" y1="676" x2="296" y2="676" stroke={GOLD} strokeWidth="1" />
        <rect x="203.5" y="672.5" width="7" height="7" transform="rotate(45 207 676)" fill={GOLD} />

        {/* tagline */}
        <g
          fill={DARK}
          textAnchor="middle"
          fontSize="11.5"
          letterSpacing="3"
          style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
        >
          <text x="205" y="702">TWO HEARTS  •  ONE JOURNEY</text>
          <text x="205" y="720">AN ETERNAL PURPOSE</text>
        </g>

        {/* green wave footer */}
        <path
          d="M0 708 C 60 742, 150 762, 250 750 C 320 742, 370 722, 402 706 L402 822 L0 822 Z"
          fill="url(#coverGreen)"
        />
        <path
          d="M0 708 C 60 742, 150 762, 250 750 C 320 742, 370 722, 402 706"
          fill="none"
          stroke="url(#coverGoldLine)"
          strokeWidth="2.4"
        />
      </svg>

      {/* Green filler: continues the green all the way to the bottom of the panel */}
      <div
        className="flex-1"
        style={{
          marginTop: '-1px',
          background: `linear-gradient(to right, ${GREEN_LEFT}, ${GREEN_RIGHT})`
        }}
      />

      {/* bottom-right floral spray, pinned to the very bottom corner */}
      <svg
        viewBox="0 0 160 160"
        className="absolute bottom-0 right-0 w-[40%] h-auto pointer-events-none"
        aria-hidden="true"
      >
        <g transform="translate(162 164) rotate(180) scale(0.62)">
          <Spray flowers={[[46, 24, 1.55, -10], [108, 8, 0.7, 20]]} />
        </g>
      </svg>
    </div>
  )
}

export default function ProgramOutline() {
  const [program, setProgram] = useState(defaultProgram)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const programRef = doc(db, 'program', 'outline')
    const unsubscribe = onSnapshot(programRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setProgram({
          showFullProgram: data.showFullProgram === true,
          details: { ...defaultProgram.details, ...(data.details || {}) },
          officiating: data.officiating || defaultProgram.officiating,
          supporting: data.supporting || defaultProgram.supporting,
          items: data.items || defaultProgram.items,
          photoItems: data.photoItems || []
        })
      } else {
        setProgram(defaultProgram)
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching program outline: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const d = program.details
  const firstHalf = program.items.slice(0, SPLIT_AT)
  const secondHalf = program.items.slice(SPLIT_AT)

  // Break the scripture quote into lines after ":" and "." (like the printed program)
  const quoteLines = (d.quote || '').replace(/([:.])\s+/g, '$1\n').split('\n')

  return (
    <div className="min-h-screen bg-off-white py-8 px-3 md:px-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes&display=swap');`}</style>
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-emerald-green font-sans font-bold text-xs md:text-sm mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 text-curry-gold" />
          Back to Home
        </Link>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="w-8 h-8 text-curry-gold animate-spin mb-3" />
            <p className="text-emerald-green/70 font-sans text-xs">Loading program outline...</p>
          </div>
        ) : !program.showFullProgram ? (
          /* ============ ONLY THE FIRST FACE (admin toggle is OFF) ============ */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-sm mx-auto"
          >
            <div className="border-2 border-curry-gold/50 rounded-lg shadow-2xl overflow-hidden bg-[#fbf9f3]">
              <CoverPanel />
            </div>
            <p
              className="text-center font-bold text-base md:text-lg mt-6 px-2"
              style={{ fontFamily: FONT_BODY, color: DARK }}
            >
              Program outline will be available soon, check back later.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 bg-[#fbf9f3] border-2 border-curry-gold/50 rounded-lg shadow-2xl overflow-hidden md:divide-x divide-curry-gold/50"
          >
            {/* ============ PANEL 1 : COVER (fixed design) ============ */}
            <CoverPanel />

            {/* ============ PANEL 2 : MINISTERS + ORDER OF SERVICE ============ */}
            <div className="flex flex-col items-center text-center px-6 pt-6 pb-5">
              <Divider mark="sprout" width="w-[78%]" className="mb-3" />

              <MinisterBlock heading="Officiating Ministers" names={program.officiating} />

              <Divider width="w-[78%]" className="my-3" />

              <MinisterBlock heading="Supporting Ministers" names={program.supporting} />

              <Divider width="w-[78%]" className="my-3" />

              <LeafPair className="w-8 h-5" />
              <h2
                className="uppercase text-[21px] tracking-[0.12em] font-semibold mt-1 mb-3"
                style={{ fontFamily: FONT_HEAD, color: DARK }}
              >
                Order of Service
              </h2>
              <PartPill className="mb-4">PART 1</PartPill>

              <NumberedList rows={firstHalf} startAt={1} />

              <div className="mt-auto pt-6 w-full flex flex-col items-center gap-1">
                <Divider width="w-[70%]" />
                <FooterSprig className="w-24 h-10" />
              </div>
            </div>

            {/* ============ PANEL 3 : CONTINUATION + PHOTOGRAPHY + THANK YOU ============ */}
            <div className="relative flex flex-col items-center text-center px-6 pt-10 pb-6 overflow-hidden">
              {secondHalf.length > 0 && <NumberedList rows={secondHalf} startAt={SPLIT_AT + 1} />}

              <Divider width="w-[84%]" className="my-5" />

              <CameraIcon className="w-9 h-7" />
              <PartPill className="mt-2 mb-3">PART 2</PartPill>
              <h2
                className="uppercase text-[19px] tracking-[0.1em] font-semibold"
                style={{ fontFamily: FONT_HEAD, color: DARK }}
              >
                Order of Photography
              </h2>

              {program.photoItems.length > 0 && (
                <div className="mt-4 w-full">
                  <NumberedList rows={program.photoItems} startAt={1} />
                </div>
              )}

              <Divider width="w-[84%]" className="my-5" />

              <p
                className="text-[56px] leading-none"
                style={{ fontFamily: FONT_SCRIPT, color: DARK }}
              >
                {d.thankYou}
              </p>
              <p
                className="uppercase text-[11px] tracking-[0.3em] leading-relaxed mt-3 max-w-[250px]"
                style={{ fontFamily: FONT_CAPS, color: DARK }}
              >
                {d.thankYouSub}
              </p>

              <Divider width="w-[50%]" className="my-5" />

              {/* Scripture quote (left aligned, sits clear of the branch) */}
              <div className="mt-auto w-[58%] self-start ml-2 text-left pt-2 pb-2">
                <p
                  className="italic text-[14px] leading-snug"
                  style={{ fontFamily: FONT_BODY, color: DARK }}
                >
                  {quoteLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </p>
                <p
                  className="uppercase text-[10px] tracking-[0.2em] mt-2"
                  style={{ fontFamily: FONT_CAPS, color: DARK }}
                >
                  {d.quoteRef}
                </p>
              </div>

              <Greenery className="absolute bottom-0 right-0 w-[40%] max-w-[170px] h-auto pointer-events-none" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
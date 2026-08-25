'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type View = 'dashboard' | 'students' | 'attendance' | 'requests' | 'inventory' | 'reports';
type Student = { id: number; studentCode: string; fullName: string; className: string; parentName: string; phone: string; status: string };
type RequestRow = { id: number; ticketNo: string; requester: string; category: string; subject: string; status: string; priority: string; dueDate: string };
type InventoryRow = { id: number; inventoryCode: string; itemName: string; room: string; condition: string; priority: string; assignee: string };

const attendance = [
  { day: 'Du', value: 96 }, { day: 'Se', value: 94 }, { day: 'Ch', value: 97 },
  { day: 'Pa', value: 91 }, { day: 'Ju', value: 93 },
];

const classes = [
  { name: '5-A', teacher: 'D. Karimova', students: 31, attendance: 96, status: 'Yuqori' },
  { name: '6-B', teacher: 'M. Rashidov', students: 29, attendance: 93, status: 'Barqaror' },
  { name: '7-A', teacher: 'N. Ergasheva', students: 30, attendance: 89, status: 'E’tibor' },
  { name: '8-B', teacher: 'A. Usmonov', students: 28, attendance: 94, status: 'Barqaror' },
  { name: '9-A', teacher: 'S. Tursunova', students: 32, attendance: 95, status: 'Yuqori' },
];

const initialStudents: Student[] = [
  { id: 1, studentCode: 'RM-00128', fullName: 'Muhammadali Rahimov', className: '7-A', parentName: 'Dilshod Rahimov', phone: '+998 90 123 45 67', status: 'Faol' },
  { id: 2, studentCode: 'RM-00129', fullName: 'Madina Qodirova', className: '6-B', parentName: 'Malika Qodirova', phone: '+998 93 455 21 10', status: 'Faol' },
  { id: 3, studentCode: 'RM-00130', fullName: 'Azizbek Sodiqov', className: '8-B', parentName: 'Jasur Sodiqov', phone: '+998 97 700 18 20', status: 'Faol' },
  { id: 4, studentCode: 'RM-00131', fullName: 'Ziyoda Ergasheva', className: '5-A', parentName: 'Nodira Ergasheva', phone: '+998 99 310 08 40', status: 'Nazoratda' },
  { id: 5, studentCode: 'RM-00132', fullName: 'Sardor Xolmatov', className: '9-A', parentName: 'Ulug‘bek Xolmatov', phone: '+998 91 800 44 55', status: 'Faol' },
];

const initialRequests: RequestRow[] = [
  { id: 1, ticketNo: 'MR-0241', requester: 'Ota-ona', category: 'Ta’lim', subject: 'To‘garak jadvalini aniqlashtirish', status: 'Yangi', priority: 'O‘rta', dueDate: '26-avg' },
  { id: 2, ticketNo: 'MR-0240', requester: 'O‘qituvchi', category: 'Texnik', subject: '7-xonada proyektor ishlamayapti', status: 'Jarayonda', priority: 'Yuqori', dueDate: '25-avg' },
  { id: 3, ticketNo: 'MR-0239', requester: 'O‘quvchi', category: 'Xizmat', subject: 'Kutubxona kartasini yangilash', status: 'Jarayonda', priority: 'Past', dueDate: '28-avg' },
  { id: 4, ticketNo: 'MR-0238', requester: 'Ota-ona', category: 'Davomat', subject: 'Sababli dars qoldirish hujjati', status: 'Yopilgan', priority: 'O‘rta', dueDate: '24-avg' },
];

const initialInventory: InventoryRow[] = [
  { id: 1, inventoryCode: 'INV-2048', itemName: 'Epson EB-X06 proyektor', room: '7-xona', condition: 'Ta’mirda', priority: 'Yuqori', assignee: 'A. Sobirov' },
  { id: 2, inventoryCode: 'INV-1982', itemName: 'Lenovo ThinkCentre M70', room: 'IT-1', condition: 'Soz', priority: 'Past', assignee: 'B. Xudoyorov' },
  { id: 3, inventoryCode: 'INV-1851', itemName: 'Interaktiv doska', room: '12-xona', condition: 'Tekshiruvda', priority: 'O‘rta', assignee: 'A. Sobirov' },
  { id: 4, inventoryCode: 'INV-1744', itemName: 'Canon MF3010 printer', room: 'Direktor xona', condition: 'Soz', priority: 'Past', assignee: 'M. Zokirova' },
];

const nav: { id: View; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'BS', label: 'Bosh sahifa' }, { id: 'students', icon: 'O‘', label: 'O‘quvchilar' },
  { id: 'attendance', icon: 'Da', label: 'Davomat' }, { id: 'requests', icon: 'Mu', label: 'Murojaatlar' },
  { id: 'inventory', icon: 'In', label: 'Inventar' }, { id: 'reports', icon: 'Hi', label: 'Hisobotlar' },
];

const viewMeta: Record<View, { kicker: string; title: string; description: string }> = {
  dashboard: { kicker: 'BUGUNGI HOLAT', title: 'Maktab boshqaruvi bir ekranda', description: 'Asosiy ko‘rsatkichlar, xavf signallari va keyingi harakatlar.' },
  students: { kicker: 'YAGONA REYESTR', title: 'O‘quvchilar ma’lumotlar bazasi', description: 'Shaxsiy ma’lumotlar, sinf va ota-ona aloqalarini boshqaring.' },
  attendance: { kicker: 'NAZORAT VA TAHLIL', title: 'Davomat monitoringi', description: 'Sinf kesimidagi holat va erta ogohlantirish signallari.' },
  requests: { kicker: 'SERVICE DESK', title: 'Murojaatlar markazi', description: 'So‘rovlarni mas’ul, muddat va ustuvorlik bo‘yicha kuzating.' },
  inventory: { kicker: 'MODDIY RESURSLAR', title: 'Inventar nazorati', description: 'Jihozlar holati va ta’mirlash jarayonini boshqaring.' },
  reports: { kicker: 'DATA-DRIVEN MANAGEMENT', title: 'Tahliliy hisobotlar', description: 'Qarorlar uchun tayyor ko‘rsatkichlar va eksportlar.' },
};

function readSaved<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
}

export default function Home() {
  const [view, setView] = useState<View>('dashboard');
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState(initialStudents);
  const [requests, setRequests] = useState(initialRequests);
  const [inventory, setInventory] = useState(initialInventory);
  const [modal, setModal] = useState<'student' | 'request' | 'inventory' | null>(null);
  const [toast, setToast] = useState('');
  const [syncState, setSyncState] = useState<'loading' | 'online' | 'local'>('loading');

  useEffect(() => {
    setStudents(readSaved('rm-students', initialStudents));
    setRequests(readSaved('rm-requests', initialRequests));
    setInventory(readSaved('rm-inventory', initialInventory));
    fetch('/api/data').then((response) => response.ok ? response.json() as Promise<{ students?: Student[]; requests?: RequestRow[]; inventory?: InventoryRow[] }> : Promise.reject()).then((data) => {
      if (data.students?.length) setStudents(data.students);
      if (data.requests?.length) setRequests(data.requests);
      if (data.inventory?.length) setInventory(data.inventory);
      setSyncState('online');
    }).catch(() => setSyncState('local'));
  }, []);

  useEffect(() => { localStorage.setItem('rm-students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('rm-requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('rm-inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);

  const visibleStudents = useMemo(() => students.filter((item) => `${item.fullName} ${item.className} ${item.studentCode}`.toLowerCase().includes(query.toLowerCase())), [students, query]);
  const visibleRequests = useMemo(() => requests.filter((item) => `${item.ticketNo} ${item.subject} ${item.requester}`.toLowerCase().includes(query.toLowerCase())), [requests, query]);
  const visibleInventory = useMemo(() => inventory.filter((item) => `${item.inventoryCode} ${item.itemName} ${item.room}`.toLowerCase().includes(query.toLowerCase())), [inventory, query]);

  const persist = async (type: string, payload: object) => {
    try { await fetch('/api/data', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, ...payload }) }); } catch { /* local-first fallback */ }
  };

  const addRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    if (modal === 'student') {
      const row: Student = { id: Date.now(), studentCode: `RM-${String(students.length + 133).padStart(5, '0')}`, fullName: String(form.get('fullName')), className: String(form.get('className')), parentName: String(form.get('parentName')), phone: String(form.get('phone')), status: 'Faol' };
      setStudents((current) => [row, ...current]); persist('student', row); setView('students');
    } else if (modal === 'request') {
      const row: RequestRow = { id: Date.now(), ticketNo: `MR-${242 + requests.length}`, requester: String(form.get('requester')), category: String(form.get('category')), subject: String(form.get('subject')), status: 'Yangi', priority: String(form.get('priority')), dueDate: '29-avg' };
      setRequests((current) => [row, ...current]); persist('request', row); setView('requests');
    } else if (modal === 'inventory') {
      const row: InventoryRow = { id: Date.now(), inventoryCode: `INV-${2100 + inventory.length}`, itemName: String(form.get('itemName')), room: String(form.get('room')), condition: 'Soz', priority: String(form.get('priority')), assignee: String(form.get('assignee')) };
      setInventory((current) => [row, ...current]); persist('inventory', row); setView('inventory');
    }
    setModal(null); setToast('Yangi yozuv muvaffaqiyatli saqlandi');
  };

  const exportCsv = () => {
    const rows = view === 'students' ? students.map(({ studentCode, fullName, className, parentName, phone, status }) => [studentCode, fullName, className, parentName, phone, status]) : classes.map(({ name, teacher, students: total, attendance: value, status }) => [name, teacher, total, `${value}%`, status]);
    const csv = '\ufeff' + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `raqamli-maktab-${view}.csv`; link.click(); URL.revokeObjectURL(link.href); setToast('Hisobot CSV formatida yuklandi');
  };

  const cycleRequest = (id: number) => {
    const order = ['Yangi', 'Jarayonda', 'Yopilgan'];
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status: order[(order.indexOf(item.status) + 1) % order.length] } : item)); setToast('Murojaat holati yangilandi');
  };
  const openCreate = () => setModal(view === 'requests' ? 'request' : view === 'inventory' ? 'inventory' : 'student');

  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">RM</span><span><strong>Raqamli maktab</strong><small>Boshqaruv platformasi</small></span></div><nav aria-label="Asosiy navigatsiya"><p className="nav-label">BOSHQARUV</p>{nav.map((item) => <button className={view === item.id ? 'nav-item active' : 'nav-item'} onClick={() => { setView(item.id); setQuery(''); }} key={item.id}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></button>)}</nav><div className="sidebar-note"><span className={syncState === 'loading' ? 'live-dot pending' : 'live-dot'} /><div><strong>{syncState === 'online' ? 'D1 bazasi ulangan' : syncState === 'local' ? 'Mahalliy rejim' : 'Sinxronizatsiya...'}</strong><small>{syncState === 'online' ? 'Ma’lumotlar himoyalangan' : 'Brauzer xotirasida saqlanadi'}</small></div></div></aside>
    <section className="workspace"><header className="topbar"><div><p className="eyebrow">25-AVGUST, 2026 • SESHANBA</p><h1>{nav.find((item) => item.id === view)?.label}</h1></div><div className="top-actions"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Qidirish" placeholder="O‘quvchi, sinf yoki murojaat..." /></label><button className="icon-button" aria-label="Bildirishnomalar">●<span className="notification-dot" /></button><button className="profile"><span>AM</span><span><strong>Azizbek Mirzayev</strong><small>Direktor</small></span></button></div></header>
      <div className="content"><section className="welcome-row"><div><p className="section-kicker">{viewMeta[view].kicker}</p><h2>{viewMeta[view].title}</h2><p>{viewMeta[view].description}</p></div><div className="welcome-actions">{view !== 'dashboard' && <button className="quiet-button tall" onClick={exportCsv}>↓ Eksport</button>}<button className="primary-button" onClick={openCreate}>＋ Yangi yozuv</button></div></section>
        {view === 'dashboard' && <Dashboard onNavigate={setView} openCreate={openCreate} />}{view === 'students' && <Students rows={visibleStudents} />}{view === 'attendance' && <Attendance />}{view === 'requests' && <Requests rows={visibleRequests} onCycle={cycleRequest} />}{view === 'inventory' && <Inventory rows={visibleInventory} />}{view === 'reports' && <Reports onExport={exportCsv} />}
      </div>
    </section>
    {modal && <RecordModal type={modal} onClose={() => setModal(null)} onSubmit={addRecord} />}{toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
  </main>;
}

function Dashboard({ onNavigate, openCreate }: { onNavigate: (view: View) => void; openCreate: () => void }) {
  return <><section className="metrics" aria-label="Asosiy ko‘rsatkichlar"><article className="metric-card blue"><div className="metric-icon">O‘</div><div><span>Jami o‘quvchi</span><strong>1 284</strong><small>↗ 18 yangi qabul</small></div></article><article className="metric-card green"><div className="metric-icon">%</div><div><span>Bugungi davomat</span><strong>92.8%</strong><small>↗ 1.6% o‘tgan haftaga</small></div></article><article className="metric-card amber"><div className="metric-icon">M</div><div><span>Ochiq murojaatlar</span><strong>18</strong><small>4 tasi muddati yaqin</small></div></article><article className="metric-card red"><div className="metric-icon">!</div><div><span>Ta’mirdagi jihoz</span><strong>7</strong><small>2 ta yuqori ustuvor</small></div></article></section>
    <section className="dashboard-grid"><article className="panel attendance-panel"><div className="panel-head"><div><span className="panel-kicker">DAVOMAT DINAMIKASI</span><h3>Haftalik ko‘rsatkich</h3></div><button className="quiet-button">Ushbu hafta⌄</button></div><div className="chart-wrap"><div className="chart-scale"><span>100%</span><span>95%</span><span>90%</span><span>85%</span></div><div className="bars">{attendance.map((item) => <div className="bar-column" key={item.day}><span className="bar-value">{item.value}%</span><div className={item.value < 92 ? 'bar warning' : 'bar'} style={{ height: `${(item.value - 80) * 12}px` }} /><small>{item.day}</small></div>)}</div></div><div className="chart-note"><span className="legend-dot" />Maqsad: 92% <strong>Hafta o‘rtachasi: 94.2%</strong></div></article><article className="panel alerts-panel"><div className="panel-head"><div><span className="panel-kicker">E’TIBOR TALAB QILADI</span><h3>Faol signallar</h3></div><span className="count-badge">5 ta</span></div><div className="alert-list"><button className="alert-item danger" onClick={() => onNavigate('attendance')}><span>!</span><div><strong>7-A sinf davomatida pasayish</strong><small>89% • Chegaradan 3% past</small></div><b>Ko‘rish</b></button><button className="alert-item warning" onClick={() => onNavigate('requests')}><span>⌛</span><div><strong>4 murojaat muddati yaqin</strong><small>Bugun yakunlanishi kerak</small></div><b>Ko‘rish</b></button><button className="alert-item info" onClick={() => onNavigate('inventory')}><span>i</span><div><strong>Inventar tekshiruvi</strong><small>Kompyuter xonasi • 28-avgust</small></div><b>Ko‘rish</b></button></div><button className="text-button" onClick={openCreate}>Tezkor yozuv qo‘shish →</button></article></section><ClassTable /></>;
}

function ClassTable() { return <section className="panel table-panel"><div className="panel-head"><div><span className="panel-kicker">SINF KESIMIDA</span><h3>Bugungi davomat</h3></div><span className="count-badge neutral">5 sinf</span></div><div className="table-scroll"><table><thead><tr><th>Sinf</th><th>Sinf rahbari</th><th>O‘quvchilar</th><th>Davomat</th><th>Holat</th></tr></thead><tbody>{classes.map((row) => <tr key={row.name}><td><strong>{row.name}</strong></td><td>{row.teacher}</td><td>{row.students} nafar</td><td><div className="progress"><span style={{ width: `${row.attendance}%` }} /></div><strong>{row.attendance}%</strong></td><td><Badge value={row.status} /></td></tr>)}</tbody></table></div></section>; }

function Students({ rows }: { rows: Student[] }) { return <section className="panel table-panel flush"><div className="table-toolbar"><div><strong>{rows.length} ta yozuv</strong><small>O‘quvchi profillari va aloqa ma’lumotlari</small></div><select aria-label="Sinf bo‘yicha filtr"><option>Barcha sinflar</option><option>5-A</option><option>6-B</option><option>7-A</option></select></div><div className="table-scroll"><table><thead><tr><th>ID raqam</th><th>F.I.Sh.</th><th>Sinf</th><th>Ota-ona / vakil</th><th>Telefon</th><th>Holat</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><span className="code">{row.studentCode}</span></td><td><div className="person-cell"><span>{row.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><strong>{row.fullName}</strong></div></td><td><strong>{row.className}</strong></td><td>{row.parentName}</td><td>{row.phone}</td><td><Badge value={row.status} /></td></tr>)}</tbody></table></div>{!rows.length && <EmptyState />}</section>; }

function Attendance() { return <><section className="summary-strip"><div><span>Bugun</span><strong>92.8%</strong><small>1 192 nafar qatnashdi</small></div><div><span>Sababli</span><strong>61</strong><small>4.7% o‘quvchi</small></div><div><span>Sababsiz</span><strong>31</strong><small>2.5% o‘quvchi</small></div><div className="attention"><span>Xavf guruhi</span><strong>12</strong><small>3+ kun qoldirgan</small></div></section><section className="dashboard-grid"><article className="panel attendance-panel"><div className="panel-head"><div><span className="panel-kicker">5 KUNLIK TREND</span><h3>Davomat o‘zgarishi</h3></div><span className="status success">Maqsad bajarildi</span></div><div className="line-chart"><div className="target-line"><span>92% maqsad</span></div>{attendance.map((item) => <div className="line-column" key={item.day}><span style={{ bottom: `${(item.value - 84) * 13}px` }}>{item.value}%</span><i style={{ height: `${(item.value - 82) * 12}px` }} /><small>{item.day}</small></div>)}</div></article><article className="panel"><div className="panel-head"><div><span className="panel-kicker">SABABLAR</span><h3>Qoldirish tarkibi</h3></div></div><div className="donut-layout"><div className="donut"><span><strong>92</strong><small>jami</small></span></div><ul className="legend-list"><li><i className="green" />Kasallik <b>41</b></li><li><i className="amber" />Oilaviy sabab <b>20</b></li><li><i className="red" />Sababsiz <b>31</b></li></ul></div></article></section><ClassTable /></>; }

function Requests({ rows, onCycle }: { rows: RequestRow[]; onCycle: (id: number) => void }) { return <><section className="kanban-summary"><div><i className="blue" /><span>Yangi</span><strong>{rows.filter((r) => r.status === 'Yangi').length}</strong></div><div><i className="amber" /><span>Jarayonda</span><strong>{rows.filter((r) => r.status === 'Jarayonda').length}</strong></div><div><i className="green" /><span>Yopilgan</span><strong>{rows.filter((r) => r.status === 'Yopilgan').length}</strong></div><div><i className="red" /><span>Muddati yaqin</span><strong>4</strong></div></section><section className="panel table-panel flush"><div className="table-scroll"><table><thead><tr><th>Raqam</th><th>Murojaatchi</th><th>Mavzu</th><th>Ustuvorlik</th><th>Muddat</th><th>Holat</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><span className="code">{row.ticketNo}</span></td><td>{row.requester}<small className="subcell">{row.category}</small></td><td><strong>{row.subject}</strong></td><td><Badge value={row.priority} /></td><td>{row.dueDate}</td><td><button className="badge-button" onClick={() => onCycle(row.id)}><Badge value={row.status} /></button></td></tr>)}</tbody></table></div>{!rows.length && <EmptyState />}</section></>; }

function Inventory({ rows }: { rows: InventoryRow[] }) { return <><section className="metrics compact"><article className="metric-card blue"><div className="metric-icon">Σ</div><div><span>Jami jihoz</span><strong>842</strong><small>24 toifa</small></div></article><article className="metric-card green"><div className="metric-icon">✓</div><div><span>Soz holatda</span><strong>818</strong><small>97.1%</small></div></article><article className="metric-card amber"><div className="metric-icon">T</div><div><span>Tekshiruvda</span><strong>17</strong><small>Reja asosida</small></div></article><article className="metric-card red"><div className="metric-icon">!</div><div><span>Ta’mirda</span><strong>7</strong><small>2 ta ustuvor</small></div></article></section><section className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Inventar kodi</th><th>Jihoz</th><th>Joylashuv</th><th>Mas’ul</th><th>Ustuvorlik</th><th>Holat</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><span className="code">{row.inventoryCode}</span></td><td><strong>{row.itemName}</strong></td><td>{row.room}</td><td>{row.assignee}</td><td><Badge value={row.priority} /></td><td><Badge value={row.condition} /></td></tr>)}</tbody></table></div>{!rows.length && <EmptyState />}</section></>; }

function Reports({ onExport }: { onExport: () => void }) { const reports = [{ icon: 'DA', title: 'Davomat hisoboti', text: 'Sinf va davr kesimida to‘liq tahlil', color: 'blue' }, { icon: 'O‘', title: 'O‘quvchilar reyestri', text: 'Faol o‘quvchilar va aloqa bazasi', color: 'green' }, { icon: 'MR', title: 'Murojaatlar SLA', text: 'Muddat va bajarilish samaradorligi', color: 'amber' }, { icon: 'IN', title: 'Inventar holati', text: 'Jihozlar, ta’mir va mas’ullar', color: 'red' }]; return <><section className="report-grid">{reports.map((report) => <article className="report-card" key={report.title}><span className={`report-icon ${report.color}`}>{report.icon}</span><div><h3>{report.title}</h3><p>{report.text}</p></div><button onClick={onExport}>Yuklab olish ↓</button></article>)}</section><section className="panel roadmap"><div className="panel-head"><div><span className="panel-kicker">30–60–90 KUNLIK YO‘L XARITASI</span><h3>Raqamli transformatsiya holati</h3></div><span className="status success">64% bajarildi</span></div><div className="roadmap-grid"><div><span>30 KUN</span><strong>Jarayonlarni xaritalash</strong><progress max="100" value="100" /><small>6 / 6 vazifa</small></div><div><span>60 KUN</span><strong>Pilot avtomatlashtirish</strong><progress max="100" value="72" /><small>8 / 11 vazifa</small></div><div><span>90 KUN</span><strong>Masshtablash va KPI</strong><progress max="100" value="28" /><small>3 / 10 vazifa</small></div></div></section></>; }

function Badge({ value }: { value: string }) { const danger = ['E’tibor', 'Yuqori', 'Ta’mirda'].includes(value); const success = ['Faol', 'Yopilgan', 'Soz'].includes(value); const warning = ['Jarayonda', 'Tekshiruvda', 'O‘rta', 'Nazoratda'].includes(value); return <span className={`status ${danger ? 'danger' : success ? 'success' : warning ? 'warning' : ''}`}>{value}</span>; }
function EmptyState() { return <div className="empty-state"><span>⌕</span><strong>Natija topilmadi</strong><small>Qidiruv so‘zini o‘zgartirib ko‘ring.</small></div>; }

function RecordModal({ type, onClose, onSubmit }: { type: 'student' | 'request' | 'inventory'; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) { const titles = { student: 'Yangi o‘quvchi', request: 'Yangi murojaat', inventory: 'Yangi inventar' }; return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><span>MA’LUMOTLAR BAZASI</span><h2 id="modal-title">{titles[type]}</h2></div><button onClick={onClose} aria-label="Yopish">×</button></div><form onSubmit={onSubmit}>{type === 'student' && <><label>O‘quvchi F.I.Sh.<input name="fullName" required placeholder="Masalan: Ali Valiyev" /></label><div className="form-grid"><label>Sinf<select name="className"><option>5-A</option><option>6-B</option><option>7-A</option><option>8-B</option><option>9-A</option></select></label><label>Telefon<input name="phone" required placeholder="+998 90 000 00 00" /></label></div><label>Ota-ona / vakil<input name="parentName" required placeholder="F.I.Sh." /></label></>}{type === 'request' && <><label>Murojaat mavzusi<input name="subject" required placeholder="Muammoni qisqacha yozing" /></label><div className="form-grid"><label>Murojaatchi<select name="requester"><option>Ota-ona</option><option>O‘qituvchi</option><option>O‘quvchi</option></select></label><label>Toifa<select name="category"><option>Ta’lim</option><option>Texnik</option><option>Davomat</option><option>Xizmat</option></select></label></div><label>Ustuvorlik<select name="priority"><option>O‘rta</option><option>Yuqori</option><option>Past</option></select></label></>}{type === 'inventory' && <><label>Jihoz nomi<input name="itemName" required placeholder="Masalan: Interaktiv doska" /></label><div className="form-grid"><label>Xona<input name="room" required placeholder="12-xona" /></label><label>Ustuvorlik<select name="priority"><option>Past</option><option>O‘rta</option><option>Yuqori</option></select></label></div><label>Mas’ul shaxs<input name="assignee" required placeholder="F.I.Sh." /></label></>}<div className="modal-actions"><button type="button" className="quiet-button tall" onClick={onClose}>Bekor qilish</button><button className="primary-button">Saqlash</button></div></form></section></div>; }

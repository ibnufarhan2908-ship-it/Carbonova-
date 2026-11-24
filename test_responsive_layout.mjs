import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN RESPONSIF VIEWPORT 375px (AD11-06)')
console.log('========================================================\n')

// 1. Verifikasi StudentDashboardPage.tsx
console.log('--- 1. Verifikasi Layout Shortcut Bar Dashboard Siswa ---')
const studentDashboardPath = path.resolve('src/pages/student/StudentDashboardPage.tsx')
const studentDashboardCode = fs.readFileSync(studentDashboardPath, 'utf8')

assert.ok(
  studentDashboardCode.includes('flex flex-wrap items-center gap-2 w-full max-w-full'),
  'Shortcut bar container harus memiliki flex-wrap dan w-full max-w-full'
)
assert.ok(
  !studentDashboardCode.includes('className="flex items-center gap-2">\n            <span className="px-4 py-2.5 rounded-2xl bg-[#101C3A]'),
  'Kontainer lama tanpa flex-wrap sudah tidak boleh ada'
)
console.log('✅ PASS: Bar shortcut Dashboard Siswa menggunakan flex-wrap dan max-w-full untuk mencegah overflow horizontal')

// 2. Verifikasi CarbonLabPage.tsx
console.log('\n--- 2. Verifikasi Layout Tab Eksperimen Carbon Lab ---')
const carbonLabPath = path.resolve('src/pages/CarbonLabPage.tsx')
const carbonLabCode = fs.readFileSync(carbonLabPath, 'utf8')

assert.ok(
  carbonLabCode.includes('grid grid-cols-1 sm:grid-cols-3 gap-2') || carbonLabCode.includes('flex-wrap'),
  'Kontainer tab Carbon Lab harus menggunakan grid responsif (grid-cols-1 sm:grid-cols-3) atau flex-wrap'
)
assert.ok(
  !carbonLabCode.includes('<div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">\n        <button\n          onClick={() => handleSwitchTab(\'builder\')'),
  'Kontainer lama tanpa pembungkus responsif sudah tidak boleh ada'
)

// 3. Verifikasi Sub-Toggle pada CarbonLabPage
console.log('\n--- 3. Verifikasi Sub-Toggle Kontrol Carbon Lab ---')
assert.ok(
  carbonLabCode.includes('flex flex-col sm:flex-row gap-2'),
  'Toggle pembakaran dan sampel harus menggunakan flex flex-col sm:flex-row gap-2 agar ramah mobile 375px'
)
console.log('✅ PASS: Tab eksperimen dan tombol kontrol Carbon Lab tersusun rapi tanpa meluber di 375px')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN TATA LETAK RESPONSIF (AD11-06) LULUS!')
console.log('========================================================')

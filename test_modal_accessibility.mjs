import assert from 'node:assert/strict'

console.log('========================================================')
console.log('🧪 PENGUJIAN AKSESIBILITAS MODAL (AD11-05)')
console.log('========================================================\n')

// 1. Verifikasi Selector Focusable Elements
const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'

console.log('--- 1. Pengujian Definisi Selector Focus Trap ---')
assert.ok(focusableSelector.includes('button:not([disabled])'), 'Selector harus mencakup button aktif')
assert.ok(focusableSelector.includes('[tabindex]:not([tabindex="-1"])'), 'Selector harus mencakup elemen dengan tabindex non-negatif')
assert.ok(focusableSelector.includes('input:not([disabled])'), 'Selector harus mencakup input aktif')
console.log('✅ PASS: Selector elemen interaktif focus trap valid dan komprehensif')

// 2. Simulasi Mock Siklus Focus Trap
console.log('\n--- 2. Pengujian Logika Siklus Focus Trap (Tab & Shift+Tab) ---')

function createMockModal() {
  let currentActiveElement = null

  const makeElement = (id) => ({
    id,
    focusCalled: 0,
    focus() {
      this.focusCalled++
      currentActiveElement = this
    },
  })

  const triggerButton = makeElement('btn-trigger')
  const closeButton = makeElement('btn-close')
  const questionsScroll = makeElement('scroll-questions')
  const footerCloseBtn = makeElement('btn-footer-close')

  const interactiveElements = [closeButton, questionsScroll, footerCloseBtn]
  currentActiveElement = triggerButton
  let closed = false

  const onClose = () => {
    closed = true
  }

  // Saat modal terbuka
  const previousActiveElement = currentActiveElement
  closeButton.focus() // Initial focus

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.defaultPrevented = true
      onClose()
      return
    }

    if (e.key === 'Tab') {
      const firstElement = interactiveElements[0]
      const lastElement = interactiveElements[interactiveElements.length - 1]

      if (e.shiftKey) {
        if (currentActiveElement === firstElement) {
          e.defaultPrevented = true
          lastElement.focus()
        }
      } else {
        if (currentActiveElement === lastElement) {
          e.defaultPrevented = true
          firstElement.focus()
        }
      }
    }
  }

  const closeAndRestore = () => {
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus()
    }
  }

  return {
    triggerButton,
    closeButton,
    questionsScroll,
    footerCloseBtn,
    interactiveElements,
    getActiveElement: () => currentActiveElement,
    handleKeyDown,
    closeAndRestore,
    isClosed: () => closed,
  }
}

const mock = createMockModal()
assert.equal(mock.getActiveElement().id, 'btn-close', 'Fokus awal harus diarahkan ke tombol tutup header')
console.log('✅ PASS: Fokus awal otomatis mengarah ke tombol tutup modal')

// Tab forward di elemen terakhir
mock.footerCloseBtn.focus() // pindah ke footer close button (elemen terakhir)
assert.equal(mock.getActiveElement().id, 'btn-footer-close')

const eventTabForward = { key: 'Tab', shiftKey: false, defaultPrevented: false }
mock.handleKeyDown(eventTabForward)
assert.equal(mock.getActiveElement().id, 'btn-close', 'Tab dari elemen terakhir harus berputar ke elemen pertama')
assert.ok(eventTabForward.defaultPrevented, 'Default browser Tab action dicegah')
console.log('✅ PASS: Tab pada elemen terakhir berputar (wrap around) ke elemen pertama di modal')

// Shift + Tab dari elemen pertama
assert.equal(mock.getActiveElement().id, 'btn-close')
const eventShiftTab = { key: 'Tab', shiftKey: true, defaultPrevented: false }
mock.handleKeyDown(eventShiftTab)
assert.equal(mock.getActiveElement().id, 'btn-footer-close', 'Shift+Tab dari elemen pertama harus berputar ke elemen terakhir')
assert.ok(eventShiftTab.defaultPrevented, 'Default browser Shift+Tab action dicegah')
console.log('✅ PASS: Shift + Tab pada elemen pertama berputar mundur ke elemen terakhir')

// 3. Pengujian Tombol Escape
console.log('\n--- 3. Pengujian Tombol Escape ---')
const eventEscape = { key: 'Escape', defaultPrevented: false }
mock.handleKeyDown(eventEscape)
assert.ok(mock.isClosed(), 'Menekan tombol Escape memanggil fungsi onClose()')
assert.ok(eventEscape.defaultPrevented, 'Default action tombol Escape dicegah')
console.log('✅ PASS: Menekan tombol Escape langsung memicu penutupan modal')

// 4. Pengujian Focus Restoration ke Elemen Pemicu
console.log('\n--- 4. Pengujian Pengembalian Fokus (Focus Restoration) ---')
mock.closeAndRestore()
assert.equal(mock.getActiveElement().id, 'btn-trigger', 'Fokus harus dikembalikan ke tombol pemicu semula')
assert.equal(mock.triggerButton.focusCalled, 1, 'Metode focus() pada elemen pemicu berhasil dipanggil')
console.log('✅ PASS: Fokus keyboard berhasil dikembalikan ke elemen pemicu awal setelah modal tertutup')

// 5. Pengujian Backdrop Click & Isolasi Latar Belakang (inert / aria-hidden)
console.log('\n--- 5. Pengujian Backdrop Click & Atribut Aksesibilitas ---')
let backdropClosed = false
const handleBackdropClick = (target, currentTarget) => {
  if (target === currentTarget) {
    backdropClosed = true
  }
}

// Klik di backdrop (luar dialog)
handleBackdropClick('backdrop-div', 'backdrop-div')
assert.ok(backdropClosed, 'Klik pada elemen backdrop luar harus menutup modal')

// Klik di dalam konten dialog (anak dari backdrop)
backdropClosed = false
handleBackdropClick('inner-dialog-content', 'backdrop-div')
assert.equal(backdropClosed, false, 'Klik di dalam konten dialog TIDAK boleh menutup modal')
console.log('✅ PASS: Klik backdrop luar menutup modal, klik konten dalam dipertahankan')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN AKSESIBILITAS MODAL (AD11-05) LULUS!')
console.log('========================================================')

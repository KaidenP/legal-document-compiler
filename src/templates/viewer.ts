let currentDoc: string | null = null
let selectedDocument: { name: string; html?: string; pdf?: string } | null = null
let globalFormatPreference: string | null = null

const SELECTED_DOC_KEY = 'selected-document'
const GLOBAL_FORMAT_KEY = 'global-format-preference'
const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed'

function initSidebar(): void {
  const isCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  const sidebar = document.getElementById('sidebar')
  const toggle = document.getElementById('sidebarToggle')

  if (!sidebar || !toggle) return

  if (isCollapsed) {
    sidebar.classList.add('collapsed')
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed')
    const collapsed = sidebar.classList.contains('collapsed')
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed.toString())
  })
}

function selectDocument(
  element: HTMLElement,
  doc: { name: string; html?: string; pdf?: string }
): void {
  selectedDocument = doc

  // Update sidebar selection
  document.querySelectorAll('.doc-item').forEach((item) => {
    item.classList.remove('active')
  })
  element.classList.add('active')

  // Update title
  const docTitle = document.getElementById('docTitle')
  if (docTitle) {
    docTitle.textContent = doc.name
  }

  // Update format buttons
  const formatButtonsContainer = document.getElementById('formatButtons')
  if (!formatButtonsContainer) return
  formatButtonsContainer.innerHTML = ''

  const formats: Array<{ name: string; path: string; format: string }> = []
  if (doc.html) formats.push({ name: 'HTML', path: doc.html, format: 'html' })
  if (doc.pdf) formats.push({ name: 'PDF', path: doc.pdf, format: 'pdf' })

  // Get global format preference
  const savedGlobalFormat = localStorage.getItem(GLOBAL_FORMAT_KEY)
  let targetFormat = savedGlobalFormat

  // Verify the global preference exists for this document
  if (
    targetFormat &&
    !formats.some((f) => f.format === targetFormat)
  ) {
    targetFormat = null
  }

  // Use global preference or first available format
  const formatToLoad = targetFormat || formats[0]?.format

  formats.forEach((format) => {
    const btn = document.createElement('button')
    btn.className = 'format-btn'
    btn.textContent = format.name
    btn.onclick = () => loadFormat(format.path, format.format, btn)
    formatButtonsContainer.appendChild(btn)
  })

  // Load target format
  if (formatToLoad) {
    const targetButton = Array.from(formatButtonsContainer.querySelectorAll('button')).find(
      (btn) => btn.textContent?.toUpperCase() === formatToLoad.toUpperCase()
    )
    if (targetButton) {
      (targetButton as HTMLButtonElement).click()
    }
  }

  // Save selection
  localStorage.setItem(SELECTED_DOC_KEY, doc.name)
}

function loadFormat(path: string, format: string, btn: HTMLElement): void {
  // Update active button
  document.querySelectorAll('.format-btn').forEach((b) => {
    b.classList.remove('active')
  })
  btn.classList.add('active')

  // Load document
  const viewer = document.getElementById('viewer') as HTMLIFrameElement | null
  if (viewer) {
    viewer.src = path
  }

  const docStatus = document.getElementById('docStatus')
  if (docStatus) {
    docStatus.textContent = `Viewing: ${format.toUpperCase()}`
  }

  currentDoc = path
  globalFormatPreference = format

  // Save global format preference
  localStorage.setItem(GLOBAL_FORMAT_KEY, format)
}

async function detectServerRestart(): Promise<void> {
  let serverStartTime: number | null = null

  try {
    const response = await fetch('/health', { cache: 'no-store' })
    const data = (await response.json()) as { startTime: number }
    serverStartTime = data.startTime
  } catch {
    console.error('Failed to fetch initial health check')
  }

  setInterval(async () => {
    try {
      const response = await fetch('/health', { cache: 'no-store' })
      const data = (await response.json()) as { startTime: number }

      if (serverStartTime !== null && data.startTime > serverStartTime) {
        window.location.reload()
      }
    } catch {
      // Server is unreachable
    }
  }, 500)
}

function restoreDocument(): void {
  const savedDocName = localStorage.getItem(SELECTED_DOC_KEY)
  let restored = false

  if (savedDocName) {
    const docItems = document.querySelectorAll('.doc-item')
    for (const docItem of docItems) {
      const docNameEl = docItem.querySelector('.doc-name')
      if (docNameEl?.textContent === savedDocName) {
        (docItem as HTMLElement).click()
        restored = true
        break
      }
    }
  }

  if (!restored) {
    // Fallback: select first document
    const firstDoc = document.querySelector('.doc-item') as HTMLElement | null
    if (firstDoc) {
      firstDoc.click()
    }
  }
}

// Expose to global scope for inline event handlers
(window as any).selectDocument = selectDocument;
(window as any).loadFormat = loadFormat

// Load global format preference
globalFormatPreference = localStorage.getItem(GLOBAL_FORMAT_KEY)

// Initialize
initSidebar()
detectServerRestart()
restoreDocument()

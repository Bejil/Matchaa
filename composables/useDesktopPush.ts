export function useDesktopPush() {
  const promptOpen = useState<boolean>('desktop-push:prompt-open', () => false)
  const promptSource = useState<'public' | 'pro'>('desktop-push:prompt-source', () => 'public')
  const PUBLIC_PROMPT_ACTION_COUNT_KEY = 'matchaa-desktop-push-public-action-count'
  const PUBLIC_PROMPT_EVERY_ACTIONS = 5
  function isSupported(): boolean {
    return import.meta.client && typeof window !== 'undefined' && 'Notification' in window
  }

  function permission(): NotificationPermission | 'unsupported' {
    if (!isSupported()) {
      return 'unsupported'
    }
    return Notification.permission
  }

  function isSecureContextAvailable(): boolean {
    if (!import.meta.client || typeof window === 'undefined') {
      return false
    }
    return window.isSecureContext === true
  }

  function requestPermissionFromUserGesture(): Promise<NotificationPermission | 'unsupported'> {
    if (!isSupported()) {
      return Promise.resolve('unsupported')
    }
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Promise.resolve(Notification.permission)
    }
    return new Promise<NotificationPermission>((resolve) => {
      try {
        let settled = false
        const done = (value: NotificationPermission) => {
          if (settled) {
            return
          }
          settled = true
          resolve(value)
        }
        const maybePromise = Notification.requestPermission((value) => done(value))
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then((value) => done(value)).catch(() => done(Notification.permission))
        }
      } catch {
        resolve(Notification.permission)
      }
    })
  }

  async function requestPermissionIfNeeded(): Promise<NotificationPermission | 'unsupported'> {
    if (!isSupported()) {
      return 'unsupported'
    }
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission
    }
    return requestPermissionFromUserGesture()
  }

  function openPermissionPromptIfNeeded(source: 'public' | 'pro' = 'public'): boolean {
    if (!isSupported()) {
      return false
    }
    if (Notification.permission === 'granted') {
      return false
    }
    if (promptOpen.value) {
      return false
    }
    if (source === 'public') {
      if (import.meta.client) {
        const raw = localStorage.getItem(PUBLIC_PROMPT_ACTION_COUNT_KEY)
        const prevCount = raw ? Number(raw) : 0
        const nextCount = Number.isFinite(prevCount) ? prevCount + 1 : 1
        if (nextCount < PUBLIC_PROMPT_EVERY_ACTIONS) {
          localStorage.setItem(PUBLIC_PROMPT_ACTION_COUNT_KEY, String(nextCount))
          return false
        }
        localStorage.setItem(PUBLIC_PROMPT_ACTION_COUNT_KEY, '0')
      }
    }
    promptSource.value = source
    promptOpen.value = true
    return true
  }

  async function confirmPermissionFromPrompt(): Promise<NotificationPermission | 'unsupported'> {
    const result = await requestPermissionFromUserGesture()
    promptOpen.value = false
    return result
  }

  function closePermissionPrompt() {
    promptOpen.value = false
  }

  function notify(input: { title: string; body: string; tag?: string }) {
    if (!isSupported() || Notification.permission !== 'granted') {
      return null
    }
    try {
      return new Notification(input.title, {
        body: input.body,
        tag: input.tag,
      })
    } catch {
      return null
    }
  }

  function sendTestNotification(source: 'public' | 'pro' = 'public'): boolean {
    const n = notify({
      title: source === 'pro' ? 'Test notification Espace Pro' : 'Test notification Matchaa',
      body: source === 'pro'
        ? 'Si vous voyez ceci, vos notifications prospects fonctionnent.'
        : 'Si vous voyez ceci, vos notifications messages fonctionnent.',
    })
    return Boolean(n)
  }

  function diagnostics() {
    return {
      supported: isSupported(),
      secureContext: isSecureContextAvailable(),
      permission: permission(),
    }
  }

  return {
    isSupported,
    permission,
    requestPermissionIfNeeded,
    requestPermissionFromUserGesture,
    isSecureContextAvailable,
    openPermissionPromptIfNeeded,
    confirmPermissionFromPrompt,
    closePermissionPrompt,
    notify,
    sendTestNotification,
    diagnostics,
    promptOpen,
    promptSource,
  }
}

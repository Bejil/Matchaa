<template>
  <nav class="account-nav" :class="{ 'account-nav--compact': compact }" aria-label="Sections du compte">
    <template v-if="as === 'links'">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="{ path: '/compte', query: { tab: item.id } }"
        class="account-nav__item"
        :class="{ 'is-active': activeTab === item.id }"
        @click="onClickItem(item.id)"
      >
        <span class="account-nav__ic" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
        <span v-if="item.showBadge" class="account-nav__badge">
          {{ item.count }}
        </span>
      </NuxtLink>
    </template>
    <template v-else>
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="account-nav__item"
        :class="{ 'is-active': activeTab === item.id }"
        @click="onClickItem(item.id)"
      >
        <span class="account-nav__ic" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
        <span v-if="item.showBadge" class="account-nav__badge">
          {{ item.count }}
        </span>
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
type CompteTab = 'recherches' | 'favoris' | 'messages' | 'parametres'

const props = withDefaults(
  defineProps<{
    activeTab?: CompteTab
    as?: 'buttons' | 'links'
    recherchesCount?: number
    favorisCount?: number
    messagesCount?: number
    compact?: boolean
  }>(),
  {
    activeTab: undefined,
    as: 'buttons',
    recherchesCount: 0,
    favorisCount: 0,
    messagesCount: 0,
    compact: false,
  },
)

const emit = defineEmits<{
  select: [tab: CompteTab]
}>()

const items = computed(() => [
  { id: 'recherches' as const, label: 'Recherches', icon: '🔎', count: props.recherchesCount, showBadge: true },
  { id: 'favoris' as const, label: 'Favoris', icon: '★', count: props.favorisCount, showBadge: true },
  { id: 'messages' as const, label: 'Messages', icon: '✉️', count: props.messagesCount, showBadge: true },
  { id: 'parametres' as const, label: 'Paramètres', icon: '⚙️', count: 0, showBadge: false },
])

function onClickItem(tab: CompteTab) {
  emit('select', tab)
}
</script>

<style scoped>
.account-nav {
  display: grid;
  gap: 0.35rem;
}

.account-nav__item {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-align: left;
  border: none;
  background: transparent;
  text-decoration: none;
  color: var(--color-text);
  padding: 0.58rem 0.65rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.account-nav__item:hover {
  background: var(--color-surface-muted, #f8f8f8);
  text-decoration: none;
}

.account-nav__item.is-active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.account-nav__ic {
  width: 1.1rem;
  text-align: center;
}

.account-nav__badge {
  margin-left: auto;
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  color: var(--color-text-muted);
  font-size: 0.74rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.account-nav__item.is-active .account-nav__badge {
  background: var(--color-accent);
  color: #fff;
}

.account-nav--compact {
  gap: 0.2rem;
}

.account-nav--compact .account-nav__item {
  padding: 0.5rem 0.6rem;
  font-size: 0.875rem;
}
</style>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__col">
        <NuxtLink to="/" class="footer__brand" aria-label="Accueil Matchaa">
          <svg class="footer__logo-mark" viewBox="0 0 231.41 162.08" aria-hidden="true" focusable="false">
            <g>
              <path d="M169.95,139.25c21.47,5.03,42.34,10.48,61.47,22.68l-53.79-11.06c-31.71-5.17-62.77-6.63-94.77-3.69-28.17,2.59-54.32,8.81-82.85,14.89,18.57-12.19,39.23-17.37,60.21-22.41v-40.72c-3.47,1.09-6.73,1.25-9.1-.23s-4.2-7.01-1.51-9.18l60.2-48.7c2.44-1.98,5.92-3.95,9.1-1.36l35.45,28.93.63-7.81c5.57-.19,9.85-.18,15.82.08l.23,21.03,10.01,9c1.58,1.42.03,6.33-1.57,7.57-2.41,1.86-6.06,2.21-9.52.72v40.27h-.01ZM113.22,109.15l-.2-14.61-14.82-.09.1,14.68,14.92.02ZM132.3,109.08l-.15-14.67-14.6.08.27,14.69,14.49-.1h-.01ZM113.25,127.81l-.25-14.22-14.8.09.14,14.13s14.91,0,14.91,0ZM132.32,127.66l-.24-14.15-14.43.03-.05,14.33,14.72-.21h0Z" />
              <path d="M165.81,54.02c-21.65-12.98-26.47-29.63-17.86-54.02,12.03,5.28,21.5,15.45,23.67,28.68,1.45,8.79-1.06,16.82-5.82,25.34h.01Z" />
              <path d="M212.02,19.16c-1.43,23.7-15,39.72-37.82,38.12.57-23.93,14.6-36.68,37.82-38.12h0Z" />
            </g>
          </svg>
          <span class="footer__logo">{{ siteName }}</span>
        </NuxtLink>
        <p class="footer__tagline">Votre recherche immobilière, simplifiée.</p>
        <ul class="footer__social" aria-label="Réseaux sociaux">
          <li>
            <a href="#" class="footer__social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#" class="footer__social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#" class="footer__social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#" class="footer__social-link" aria-label="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">À propos</h2>
        <ul class="footer__links">
          <li><NuxtLink to="/infos/qui-sommes-nous">Qui sommes-nous ?</NuxtLink></li>
          <li><NuxtLink to="/infos/contact">Nous contacter</NuxtLink></li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">Informations légales</h2>
        <ul class="footer__links">
          <li><NuxtLink to="/infos/mentions-legales">Mentions légales</NuxtLink></li>
          <li><NuxtLink to="/infos/confidentialite">Politique de confidentialité</NuxtLink></li>
          <li><NuxtLink to="/infos/cookies">Paramétrer les cookies</NuxtLink></li>
          <li><NuxtLink to="/infos/info-cookies">Info cookies</NuxtLink></li>
          <li><NuxtLink to="/infos/cgu">Conditions générales d’utilisations</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© {{ year }} {{ siteName }}. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const siteStore = useSiteStore()
const siteName = computed(() => siteStore.siteName)
const year = new Date().getFullYear()
</script>

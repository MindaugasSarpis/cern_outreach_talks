<!-- The page number on every slide but the cover, the films and the last. A per-slide layer, so it is
     printed on each page of the PDF as well (a global layer is not), and a top one: the slides'
     dark veil would cover a bottom layer. -->
<template>
  <div v-if="$page > 1 && $page < $slidev.nav.total && !$frontmatter.bare" class="rep-page">LHCb Vilnius · 2026 m. ataskaita · {{ $page }}</div>
</template>

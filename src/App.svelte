<script lang="ts">
  import Router from 'svelte-spa-router'
  import  routes  from './lib/routes'
  import { theme, currentUser } from './lib/pocketbase';

  theme.subscribe((value) => {
    document.documentElement.setAttribute("data-theme", value)
  })
  
 
  if (currentUser) {
    theme.set($currentUser?.theme ?? 'wintry')
  }

</script>

<main class="h-screen">
  <Router {routes}/>
</main>

<style>
  
</style>

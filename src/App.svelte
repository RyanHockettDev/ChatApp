<script lang="ts">
  import Router from 'svelte-spa-router'
  import  routes  from './lib/routes'
  import { currentUser } from './lib/pocketbase';
  import { theme } from './lib/theme';


  
  $: document.documentElement.setAttribute("data-theme", $theme)
 
  if (currentUser) {
    theme.set($currentUser?.theme ?? 'wintry')
  }

</script>

<main class="h-screen">
  
  <Router {routes}/>
</main>

<style>
  
</style>

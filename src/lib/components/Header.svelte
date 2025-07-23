<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentUser, pb } from '../pocketbase';
    import { push } from 'svelte-spa-router'
    import { Popover } from '@skeletonlabs/skeleton-svelte'

    let openState:boolean = false;

    // Prevents unauthorized users from accessing routes with the header in them
    onMount(() => {
      if (!get(currentUser)) {
        push('/')
      }
    })
    
    function signOut(){
      pb.authStore.clear()
    }

    function popoverClose() {
      openState = false;
    }

</script>
<nav class="flex items-center justify-between  bg-primary-500 p-3">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <svg class="w-[48px] h-[48px] text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
    </svg>
    <span class="font-semibold text-4xl tracking-tight">ChatApp</span>
  </div>
  
  <Popover
  open={openState}
  onOpenChange={(e) => (openState = e.open)}
  positioning={{ placement: 'bottom-start' }}
  triggerBase="btn preset-tonal-tertiary"
  triggerAriaLabel="Navigation menu"
  contentBase="card bg-tertiary-50 mx-4 max-w-[240px] border border-2"
  arrow
  arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
  {#snippet trigger()}
          MENU
          <svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
       {/snippet}
  {#snippet content()}
    <header class="border-b">
      <p class="font-bold text-lg px-4">Signed in as:</p>
      <p class="px-4">{$currentUser?.name}</p>
    </header>
    <section class="flex flex-col">
    <a href="/#/settings" class="py-2 px-4 border-t">Settings</a>
    <a href="/#/" class="py-2 px-4 border-t" onclick={signOut}>Sign out</a>
    </section>
  {/snippet}
</Popover>
  
</nav>
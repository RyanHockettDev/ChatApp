<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentUser, pb } from '../pocketbase';
    import { push, location } from 'svelte-spa-router'
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

    let modal:boolean = true;
    let linkClass="py-2 mx-20 focus:outline-none focus:text-2xl focus:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] focus:shadow-secondary-700/90 transition duration-600 ease-out focus:inset-shadow-sm focus:inset-shadow-secondary-600/20 hover:text-2xl hover:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] hover:shadow-secondary-700/90 hover:inset-shadow-sm hover:inset-shadow-secondary-600/90"

</script>
<nav class="flex items-center justify-between bg-primary-500 mx-4 p-3 shadow-[10px_10px_7px_1px_rgba(0,0,0,0.25)] shadow-surface-400/80">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <svg class="w-[48px] h-[48px] text-white-800 dark:stroke-black mt-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
    </svg>
    <span class="font-semibold text-4xl">ChatApp</span>
  </div>
  
  <Popover
  modal = {modal}
  open={openState}
  onOpenChange={(e) => (openState = e.open)}
  positioning={{ placement: 'bottom-start' }}
  triggerBase="px-4 py-2 transition duration-200 ease-out font-bold mr-6 bg-white focus:outline-none focus:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] 
  focus:shadow-primary-700/90 focus:text-lg hover:shadow-[10px_10px_5px_1px_rgb(0,0,0,)] hover:shadow-primary-700/90 hover:text-lg dark:text-black"
  triggerAriaLabel="Navigation menu"
  contentBase="bg-secondary-100/90 px-2 pb-2 w-[360px] flex flex-col focus:outline-none shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] 
  shadow-secondary-700/40 dark:text-black"
  arrow
  arrowBackground="!bg-surface-200 dark:!bg-surface-800"
> 

  {#snippet trigger()}
          MENU
       {/snippet}
  {#snippet content()}
    <header class="border-b text-xl flex items-center justify-between">
      <div class="">
        <p class="font-bold px-4">Signed in as:</p>
        <p class="px-4">{$currentUser?.name}</p>
      </div>
      <button onclick={popoverClose} class="font-medium mx-4 hover:text-shadow-secondary-400/50 hover:text-shadow-[4px_2px_rgb(0,0,0)] hover:text-2xl focus:text-shadow-secondary-400/50 focus:outline-none focus:text-shadow-[4px_2px_rgb(0,0,0)] focus:text-2xl" aria-label="Close menu">
        X
      </button>
      
      
    </header>
    <section class="flex flex-col text-center text-xl mt-2">
    {#if get(location) != "/settings"}
    <a href="/#/settings" class="{linkClass}" aria-label="Account settings">Settings</a>
    {/if}
    {#if get(location) != "/chat"}
    <a href="/#/chat" class="{linkClass}" aria-label="Main chat">Main Chat</a>
    {/if}
    <a href="/#/" class="{linkClass}" onclick={signOut} aria-label="Sign out of ChatApp">Sign out</a>
    </section>
  {/snippet}
</Popover>
  
</nav>
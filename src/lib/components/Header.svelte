<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentUser, pb } from '../pocketbase';
    import { push } from 'svelte-spa-router'

    // Prevents unauthorized users from accessing routes with the header in them
    onMount(() => {
      if (!get(currentUser)) {
        push('/')
      }
    })
    
    function signOut(){
      pb.authStore.clear()
    }



</script>
<nav class="flex items-center justify-between  bg-primary-500 p-3">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <svg class="w-[48px] h-[48px] text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
    </svg>
    <span class="font-semibold text-4xl tracking-tight">ChatApp</span>
  </div>
  
  <div class="flex items-center justify-center">
    <div class=" relative inline-block text-left dropdown">
      <span class="rounded-md shadow-sm">
        <button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" 
          type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
          <span>Menu</span>
          <svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button
          ></span>
        <div class="hidden dropdown-menu">
          <div class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
            <div class="px-4 py-3">
              <p class="text-sm leading-5">Signed in as</p>
              <p class="text-sm font-medium leading-5 text-gray-900 truncate">{$currentUser?.name}</p>
            </div>
            <div class="py-1">
              <a href="/settings" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
              <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span>
              <a href="/chat" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Main Chat</a></div>
            <div class="py-1">
              <a href="/" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" onclick={signOut} >Sign out</a></div>
          </div>
        </div>
    </div>
  </div>
</nav>
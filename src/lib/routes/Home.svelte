<script lang="ts">
    import {currentUser} from '../pocketbase'
    import {push} from 'svelte-spa-router'
    import LoginForm from '../components/LoginForm.svelte'
    import SignUpForm from '../components/SignUpForm.svelte';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';


    onMount(() => {
      if (get(currentUser)) {
        push('/chat')
      }
    })

    let selection = false;

    function toggleSelection() {
        
        selection == false ? selection = true : selection = false
        
    }

</script>
<div class="h-screen flex place-content-center">
<div class="bg-primary-200/60 dark:bg-primary-500/60 shadow-[14px_14px_5px_1px_rgba(0,0,0,0.25)]
         shadow-surface-500/40 w-full sm:w-[40%] my-auto mx-6 p-6">
    <div class="place-items-center border-b border-primary-500 dark:border-primary-200 pb-4">
    <h1 class="mb-3 text-5xl">ChatApp</h1>
    {#if !selection}
    <h2>Log in below to start chatting!</h2>
    {:else}
    <h2>Enter your info to sign up!</h2>
    {/if}
    </div>
    
    {#if !selection}
        <LoginForm/>
        
    {:else}
        <SignUpForm/>
    {/if}
    <p class="mt-4 text-center">{!selection ? "New user?  " : "Already registered?  "}<button class="bg-white focus:outline-none focus:shadow-[7px_7px_3px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         text-surface-900 text-sm  p-1.5 focus:text-base dark:focus:shadow-primary-950/40 transition duration-200 ease-in-out 
         hover:shadow-[7px_7px_3px_1px_rgba(0,0,0,0.25)] hover:shadow-primary-500/30 dark:hover:shadow-primary-950/40 hover:text-base mx-3" onclick={toggleSelection} aria-label="Switch to {!selection ? "Sign Up" : "Login"} form">{!selection ? "Sign Up" : "Login"}</button></p>
</div>
</div>

<style></style>
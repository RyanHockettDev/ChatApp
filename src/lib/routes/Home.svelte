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
        if (!selection){
            selection = true;
        } else {
            selection = false;
        }
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
        <p class="mt-3 text-center">New user? <button class=" ml-2 p-1 hover:shadow-md hover:text-base focus:outline-none 
            focus:shadow-md focus:text-base shadow-sm shadow-primary-500 text-sm dark:shadow-primary-800" onclick={toggleSelection}>Sign Up</button></p>
    {:else}
        <SignUpForm/>
        <p class="mt-3 text-center">Already registerd? <button class="ml-2 p-1 hover:shadow-md hover:text-base focus:outline-none 
            focus:shadow-md focus:text-base shadow-sm shadow-primary-500 text-sm dark:shadow-primary-800" onclick={toggleSelection}>Login</button></p>
    {/if}
</div>
</div>

<style></style>
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
<div class=" bg-stone-100 border w-[40%] my-auto p-6 rounded-lg">
    <div class="place-items-center">
    <h1 class="mb-3 text-5xl">ChatApp</h1>
    {#if !selection}
    <h2>Log in below to start chatting!</h2>
    {:else}
    <h2>Enter your info to sign up!</h2>
    {/if}
    </div>
    <hr class="hr mt-5">
    <div class="divider"></div>
    {#if !selection}
        <LoginForm/>
        <p class="mt-3 text-center">New user? <button class="border rounded-lg ml-2 p-1 hover:bg-stone-300  text-sm"on:click={toggleSelection}>Sign Up</button></p>
    {:else}
        <SignUpForm/>
        <p class="mt-3 text-center">Already registerd? <button class="border rounded-md ml-2 p-1 hover:bg-stone-300"on:click={toggleSelection}>Login</button></p>
    {/if}
</div>
</div>
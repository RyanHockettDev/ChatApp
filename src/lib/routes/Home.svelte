<script lang="ts">

    import { currentUser, pb } from '../pocketbase';
    import { push } from 'svelte-spa-router';
    import LoginForm from './LoginForm.svelte'
    import SignUpForm from './SignUpForm.svelte';

   // if (currentUser) {
    //    push("/chat");
   // }

    let selection = false;

    function selectSignUp() {
        selection = true;
    }

</script>

<div class=" bg-stone-100 border w-full lg:w-100 p-6">

    <h2 >Welcome to</h2>
    <h1 class="mb-3">ChatApp</h1>
    {#if !selection}
    <h2>Log in below to start chatting!</h2>
    {:else}
    <h2>Enter your info to sign up!</h2>
    {/if}
    <hr class="hr mt-5">
    <div class="divider"></div>
    {#if !selection}
        <LoginForm/>
        <p class="mt-3">New user? <button class="border rounded-lg ml-2 p-1 hover:bg-stone-100 "on:click={selectSignUp}>Sign Up</button></p>
    {:else}
        <SignUpForm/>
    {/if}
</div>

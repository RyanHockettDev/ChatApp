<script lang="ts">
    import {currentUser, pb } from '../pocketbase';
    import { push } from 'svelte-spa-router'

   // if(currentUser){
    //    push("/chat")
    //}

    let loginForm = {
        email: "",
        password: "",      
    };

    let message = "";

    async function login() {
        if (!loginForm.email || !loginForm.password) {
            message = "Enter email and password"
        } else {
            try{
                await pb.collection('users').authWithPassword(loginForm.email, loginForm.password);
                push("/chat")
            } catch(err){
                console.log(err)
                message="Incorrect emaill or password"
            }
        }
    };

</script>
   
<form class="max-w-sm mx-auto mt-6" on:submit|preventDefault={login}>
    <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email:</label>
        <input bind:value={loginForm.email} type="email" id="email" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@gmail.com" required />
    </div>
    <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password:</label>
        <input bind:value={loginForm.password} type="password" id="password" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    {#if message}
        <p class="text-red-500 mb-5" >{message}</p>
    {/if}
    
    <button type="submit" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none 
    focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log in</button>
</form>
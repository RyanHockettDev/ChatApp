<script lang="ts">
    import { pb, currentUser, theme } from '../pocketbase';
    import { push } from 'svelte-spa-router'
  
    
   

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
                const user = pb.authStore.record;
                theme.set(user?.theme)
                push("/chat")
            } catch(err){
                console.log(err)
                message="Incorrect email or password"
            }
        }
    };

</script>
   
<form class="max-w-sm mx-auto mt-6" on:submit|preventDefault={login}>
    <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email:</label>
        <input bind:value={loginForm.email} type="email" id="email" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 dark:shadow-primary-950/20 dark:focus:shadow-primary-950/40" placeholder="example@gmail.com" required />
    </div>      
    <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password:</label>
        <input bind:value={loginForm.password} type="password" id="password" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] 
        focus:shadow-primary-500/30 shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 
        dark:shadow-primary-950/20 dark:focus:shadow-primary-950/40" required />
    </div>
    
    {#if message}
        <div class="text-center">
        <p class="text-red-600 mb-5" >{message}</p>
        </div>
    {/if}
    <div class="text-center">
        <button type="submit" class="bg-white text-gray-900 focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-lg hover:shadow-primary-500/30 hover:text-lg font-medium text-base px-5 py-1 text-center 
         dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40 dark:hover:shadow-primary-900/40">Log in</button>
    </div>
</form>
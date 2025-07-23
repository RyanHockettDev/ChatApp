<script lang="ts">

    import { pb } from "../pocketbase";
    import { push } from "svelte-spa-router"

 


    let signUpForm = {
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        theme: "wintry"
    };

    let message = "";

    async function signUp() {
        //Error handling for missing fields
        if (!signUpForm.email || !signUpForm.password || !signUpForm.passwordConfirm || !signUpForm.name) {
                message = "Please fill out all fields"
            }else {
                try{
                    // CRUD - Create new user
                    await pb.collection('users').create(signUpForm);
                    //Log user in after creation
                    await pb.collection('users').authWithPassword(signUpForm.email, signUpForm.password);
                    document.documentElement.setAttribute("data-theme", "crimson")
                    //redirect with spa-router to main chat page
                    push("/chat")
                } catch (err) {
                    console.log(err);
                }
            }  
    };

    //Password matching validation
    $: if (signUpForm.password !== signUpForm.passwordConfirm && signUpForm.passwordConfirm !== ""){
        message = "Passwords do not match"
    } else {
        message = ""
    }

</script>
<form class="max-w-sm mx-auto mt-6" on:submit|preventDefault={signUp}>
    <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
        <input bind:value={signUpForm.email} type="email" id="email" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40" placeholder="example@gmail.com" required />
    </div>
    <div class="mb-5">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name:</label>
        <input bind:value={signUpForm.name} type="text" id="name" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40" required />
    </div>
    <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
        <input bind:value={signUpForm.password} type="password" id="password" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40" required />
    </div>
    <div class="mb-5">
        <label for="passwordConfirm" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Retype password:</label>
        <input bind:value={signUpForm.passwordConfirm} type="password" id="passwordConfirm" class="bg-white focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-base text-surface-900 text-sm rounded-lg block w-full p-2.5 dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40" required />
    </div>
    
    {#if message}
        <div class="text-center">
        <p class="text-error-600 mb-5" >{message}</p>
        </div>
    {/if}
    <div class="text-center">
    <button type="submit" class="bg-white text-gray-900 focus:outline-none shadow-[10px_5px_4px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         shadow-primary-500/10 focus:text-lg hover:shadow-primary-500/30 hover:text-lg font-medium text-base px-5 py-1 text-center 
         dark:shadow-primary-900/20 dark:focus:shadow-primary-900/40 dark:hover:shadow-primary-950/40">Sign Up</button>
    </div>
</form>
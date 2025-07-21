<script lang="ts">

    import { pb } from "../pocketbase";
    import { push } from "svelte-spa-router"

 


    let signUpForm = {
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
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
        <input bind:value={signUpForm.email} type="email" id="email" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@gmail.com" required />
    </div>
    <div class="mb-5">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name:</label>
        <input bind:value={signUpForm.name} type="text" id="name" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
        <input bind:value={signUpForm.password} type="password" id="password" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    <div class="mb-5">
        <label for="passwordConfirm" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Retype password:</label>
        <input bind:value={signUpForm.passwordConfirm} type="password" id="passwordConfirm" class="bg-primary-50 border border-black-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    
    {#if message}
        <div class="text-center">
        <p class="text-red-600 mb-5" >{message}</p>
        </div>
    {/if}
    <div class="text-center">
    <button type="submit" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none 
    focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-1 text-center 
    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up</button>
    </div>
</form>
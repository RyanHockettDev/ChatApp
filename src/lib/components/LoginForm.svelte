<script lang="ts">
    import { pb } from '../pocketbase';
    import { push } from 'svelte-spa-router'
    import {Tooltip} from '@skeletonlabs/skeleton-svelte'
    import { theme } from '../theme';
    
  
    
   

    let loginForm = {
        email: "",
        password: "",      
    };

    let message:string = "";
    
    let type = "password";

    let openState:boolean = false;

    async function login() {
        if (!loginForm.email || !loginForm.password) {
            message = "Enter email and password";
        } else {
            try{
                await pb.collection('users').authWithPassword(loginForm.email, loginForm.password);
                const user = pb.authStore.record;
                theme.set(user?.theme);
                push("/chat");
            } catch(err){
                console.log(err);
                message="Incorrect email or password";
            }
        }
    };

    function toggleType() {
        const passwordEl = document.getElementById("password");

        if (passwordEl?.getAttribute("type") == "password"){
            passwordEl?.setAttribute("type", "text");
            type = "text";
        } else {
            type = "password";
            passwordEl?.setAttribute("type", "password");
        }
    }

    let inputClass = "bg-white focus:outline-none focus:shadow-[10px_10px_4px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30 text-surface-900 text-base rounded-lg block w-full p-1.5 focus:p-2.5 dark:focus:shadow-primary-950/40 transition duration-200 ease-in-out"
</script>
   
<form class="max-w-sm mx-auto mt-6" on:submit|preventDefault={login}>
    <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email:</label>
        <input bind:value={loginForm.email} type="email" id="email" class="{inputClass}" placeholder="example@gmail.com" required />
    </div>      
    <div class="mb-5">
        <label for="password" class="flex mb-2 font-medium text-gray-900 dark:text-white">Your password: 
            <Tooltip
                open={openState}
                onOpenChange={(e) => (openState = e.open)}
                positioning={{ placement: 'right' }}
                triggerAriaLabel="Click to show/hide password"
                triggerBase="focus:outline-none focus:[&>.child]:border hover:[&>.child]:border"
                contentBase="card preset-filled shadow-[7px_7px_5px_1px_rgba(0,0,0,0.25)]shadow-surface-500/40 px-4 py-2"
                openDelay={150}
                arrow
                aria-label="{type == "password" ? "Show " : "Hide "}password"
                onclick={toggleType}
                >
                {#snippet trigger()}
                    {#if type === "password"}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="child size-5 mx-2 mt-1">
                            <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clip-rule="evenodd" />
                            <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 mx-2 mt-1 focus:outline-none">
                            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                            <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
                        </svg>
                    {/if}
                {/snippet}
                {#snippet content()}Click to show/hide password{/snippet}
            </Tooltip>
            
            
                
           
        </label>
        <input bind:value={loginForm.password} type="password" id="password" class="{inputClass}" required />
    </div>
    
    {#if message}
        <div class="text-center">
        <p class="text-error-600 mb-5" >{message}</p>
        </div>
    {/if}
    <div class="text-center">
        <button type="submit" class="w-[50%] bg-white focus:outline-none focus:shadow-[7px_7px_3px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-500/30
         text-surface-900 text-base  p-1.5 focus:text-lg dark:focus:shadow-primary-950/40 transition duration-200 ease-in-out 
         hover:shadow-[7px_7px_3px_1px_rgba(0,0,0,0.25)] hover:shadow-primary-500/30 dark:hover:shadow-primary-950/40 hover:text-lg">Log in</button>
    </div>
</form>
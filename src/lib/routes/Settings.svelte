<script lang="ts">
    import { get } from "svelte/store";
    import Header from "../components/Header.svelte";
    import { currentUser, pb } from "../pocketbase";
    import { theme } from "../theme";
    import { message } from "../message";
    import { push } from 'svelte-spa-router';
    import { Accordion, Tooltip } from "@skeletonlabs/skeleton-svelte";
    import  { PencilAlt, X, Eye, EyeOff }  from 'svelte-heros'

    if (!get(currentUser)){
        push('/');
    };

    

    let nameForm = {
        name: "", 
    }

    let passwordForm = {
        oldPassword: "",
        password: "",
        passwordConfirm: ""
    }

    let themeForm = {
        theme: $theme,
    }


    function toast(msg:string, stat:string) {
        const toaster = document.getElementById("toaster")
        toaster?.classList.add(stat)
        $message = msg;
        setTimeout(() => {
            $message = "filler";
            toaster?.classList.remove(stat)
        }, 3000)
    }

    
    // --------------- Update user profile settings - handler functions ----------------
    async function updateUsername(){
        const user = $currentUser?.id
        
            if (nameForm.name == $currentUser?.name) {
                   toast("That's already your name!", "bg-warning-600/70")
            }else if (user && nameForm.name != ""){{ 
                try{
                    await pb.collection('users').update(user, nameForm )
                    nameForm.name = ""
                    toast("Username updated!", "bg-success-500/80")
                }catch(err){
            
                toast("Oops! Something went wrong", "bg-error-500/60")
                }
            }   
        }
    }  
             
    async function updatePassword(){
        const user = $currentUser?.id
        if(user){
            try{
                await pb.collection('users').update(user, passwordForm )
            
                passwordForm.oldPassword = ""
                passwordForm.password = ""
                passwordForm.passwordConfirm = ""
                toast("Password updated!", "bg-success-500/80")
            } catch(err){
                toast("Incorrect password", "bg-error-500/60")
            }
            
        }  
    }

    async function updateTheme(){
        const user = $currentUser?.id
        if(user && $theme){
            await pb.collection('users').update(user, themeForm )
            toast("Theme saved!", "bg-success-500")
        }  
    }

    // --------------- Variables for Accordion, Tooltip, and Password matching toast ----------------
    let value:string[]= [];
    
    let openState = false;
    
    let type = "password";
    let passwordMsg = ""
    let passwordStatus = ""

    // Function to toggle the type setting on password fields to enable/disable visibility
    function toggleType() {
        const passwordEl = document.getElementById("oldPassword");
        const newPasswordEl = document.getElementById("newPassword");
        const confPassword = document.getElementById("newPasswordConfirm");
        
        if (passwordEl?.getAttribute("type") == "password"){
            passwordEl?.setAttribute("type", "text");
            newPasswordEl?.setAttribute("type", "text");
            confPassword?.setAttribute("type", "text");
            type = "text";
        } else {
            passwordEl?.setAttribute("type", "password");
            newPasswordEl?.setAttribute("type", "password");
            confPassword?.setAttribute("type", "password");
            type = "password";
        }
    }

    //function to watch and validate password confirmation
    $: if (passwordForm.password !== passwordForm.passwordConfirm && passwordForm.passwordConfirm !== ""){
        passwordMsg = "Passwords do not match!";
        passwordStatus = "error"
    } else if (passwordForm.passwordConfirm !== "") {
        passwordMsg = "Passwords match!";
        passwordStatus = "success"
        setTimeout(() => {
            passwordMsg = ""
        }, 3000)
    }

    // Class variables for cleaner DOM readability
    const iconClass = "m-1 focus:outline-none focus:size-7 focus:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-700/90 transition duration-200 ease-in-out focus:inset-shadow-sm focus:inset-shadow-primary-600/20 hover:size-7 hover:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] hover:shadow-primary-700/90 hover:inset-shadow-sm hover:inset-shadow-primary-600/90"
    const inputClass = "mb-3 bg-white focus:outline-none focus:shadow-[10px_10px_4px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-800/30 text-surface-900 text-base rounded-lg block w-[60%] p-1.5 focus:p-2.5 dark:focus:shadow-primary-950/40 transition duration-200 ease-in-out"
    const buttonClass = "w-[50%] text-sm focus:outline-none focus:text-lg focus:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] focus:shadow-primary-700/90 transition duration-200 ease-in-out focus:inset-shadow-sm focus:inset-shadow-primary-600/20 hover:text-lg hover:shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] hover:shadow-primary-700/90 hover:inset-shadow-sm hover:inset-shadow-primary-600/90"
    const formClass = "flex flex-col p-2 items-center shadow-[10px_10px_5px_1px_rgba(0,0,0,0.25)] shadow-primary-700/90 inset-shadow-sm inset-shadow-primary-600/60"
</script>

<Header/>
<div class="mt-8 p-2 text-lg rounded-xl text-surface-50 text-center w-[40%] mx-auto dark:text-surface-300" id="toaster">{$message}</div>
<section class="mx-auto mt-10 flex flex-col space-y-4 sm:text-lg text-sm items-center bg-primary-500 text-white rounded-none w-[340px] sm:w-[50%] dark:bg-surface-500 shadow-[14px_14px_7px_1px_rgba(0,0,0,0.25)] shadow-surface-500">
    
    <div class="flex justify-between items-center w-full transition ease-in-out duration-600">
        
       <Accordion {value} onValueChange={(e) => (value = e.value)} collapsible>
        {#snippet iconOpen()}
            <X class={iconClass}/>
        {/snippet}
        {#snippet iconClosed()}
            <PencilAlt class={iconClass}/>
        {/snippet}
        
        
        <Accordion.Item value="username" controlBase="flex w-full justify-between items-center" indicatorBase="flex items-center justify-center">
            <!-- Control -->
             
            {#snippet lead()}Username:{/snippet}
            {#snippet control()}{$currentUser?.name}{/snippet}
            <!-- Panel -->
            {#snippet panel()}
                <form on:submit|preventDefault={updateUsername} class={formClass}>
                    <label for="name" class="text-white block mb-2 text-sm font-medium dark:text-white">New username:</label>
                    <input bind:value={nameForm.name} type="text" id="name" class="{inputClass}" required />
                    <button type="submit" class={buttonClass}>Update name</button>
                </form>
            {/snippet}
        </Accordion.Item>
        
        
        <hr class="hr my-2" />
            <div class="flex justify-between px-4 py-2">
                <h1>Email:</h1>
                <h1>{$currentUser?.email}</h1>
                <div></div>
            </div>
        <hr class="hr my-2" />
        
        
        <Accordion.Item value="password" controlBase="flex w-full justify-between items-center" indicatorBase="flex items-center justify-center">
            {#snippet lead()}Password:{/snippet}
            {#snippet control()}************{/snippet}
            {#snippet panel()}
                <form on:submit|preventDefault={updatePassword} class={formClass}>
                    <label for="oldPassword" class="flex mb-2 items-center font-medium text-sm dark:text-white">Old password:
                        <Tooltip
                            open={openState}
                            onOpenChange={(e) => (openState = e.open)}
                            positioning={{ placement: 'right' }}
                            triggerAriaLabel="Click to show/hide password"
                            triggerBase="focus:outline-none focus:[&>.child]:border hover:[&>.child]:border items-center"
                            contentBase="card preset-filled shadow-[7px_7px_5px_1px_rgba(0,0,0,0.25)]shadow-surface-500/40 px-4 py-2"
                            openDelay={150}
                            arrow
                            aria-label="{type == "password" ? "Show " : "Hide "}password"
                            onclick={toggleType}
                            >
                            {#snippet trigger()}
                                {#if type === "password"}
                                <EyeOff class="{iconClass} size-5 hover:size-6 focus:size-6"/>
                                    
                                {:else}
                                    <Eye class="{iconClass} size-5 hover:size-6 focus:size-6"/>
                                {/if}
                            {/snippet}
                            {#snippet content()}Click to show/hide password{/snippet}
                        </Tooltip>
                    </label>
                    <input bind:value={passwordForm.oldPassword} type="password" id="oldPassword" class="{inputClass}" required />
                    
                    <label for="newPassword" class="text-white block mb-2 text-sm font-medium dark:text-white">New password:</label>
                        <input bind:value={passwordForm.password} type="password" id="newPassword" class="{inputClass}" required />
                    
                    <label for="newPasswordConfirm" class="text-white block mb-2 text-sm font-medium dark:text-white">Retype new password:</label>
                        <input bind:value={passwordForm.passwordConfirm} type="password" id="newPasswordConfirm" class="{inputClass}" required />
                    
                    {#if passwordMsg }
                        <div class="text-center flex justify-center">
                        <p class="{passwordStatus == "error" ? "text-error-600" : "text-success-600"} my-1 font-medium rounded-full bg-white px-2" id="info">{passwordMsg}</p>
                        </div>
                    {/if}
                </form>
            {/snippet}
        </Accordion.Item>
        
        <hr class="hr my-2" />
        
        <Accordion.Item value="theme" controlBase="flex w-full justify-between items-center" indicatorBase="flex items-center justify-center">
            {#snippet lead()}Color theme:{/snippet}
            {#snippet control()}{$theme}{/snippet}
            {#snippet panel()}
                <form on:submit|preventDefault={updateTheme} class="{formClass} pl-6">
                    <label for="theme" class="text-white block mb-2 text-sm font-medium dark:text-white">Select a theme</label>
                    <select bind:value={$theme} id="theme" class="{inputClass} text-center" required >
                        <option value="wintry">Wintry</option>
                        <option value="mona">Mona</option>
                        <option value="pine">Pine</option>
                        <option value="crimson">Crimson</option>
                        <option value="mint">Mint</option>
                        <option value="legacy">Legacy</option>
                    </select>
                    <button type="submit" class={buttonClass}>Save theme</button>
                </form>
            {/snippet}
        </Accordion.Item>
        </Accordion>
        
        
    </div>  

</section>

<script lang="ts">
    import { currentUser, pb } from './pocketbase';

    let email: string;
    let password: string;

    async function login() {
        await pb.collection('users').authWithPassword(email, password);
    }
    
    async function signUp() {
        try{
            const data = {
                email,
                password,
                passwordConfirm: password,
            }
            const createdUser = await pb.collection('users').create(data);
            await login()
        } catch (err) {
            console.error(err);
        }
    }

    function signOut() {
        pb.authStore.clear();
    }

</script>

{#if $currentUser}
    <p>Signed in as {$currentUser.name}</p>
    <button on:click={signOut}>Sign out</button>
{:else}
    <form on:submit|preventDefault>
        <input
            placeholder="Email@example.com"
            type="email"
            bind:value={email}
        />

        <input 
            placeholder="Password"
            type="password"
            bind:value={password}
        />
        <button on:click={signUp}>Sign Up</button>
        <button on:click={login}>Login</button>

    </form>
{/if}
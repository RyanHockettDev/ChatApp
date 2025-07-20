<script lang="ts">

    import { currentUser, pb } from '../pocketbase';
    import { location } from 'svelte-spa-router';
    import { Button } from '@skeletonlabs/skeleton'

    if (currentUser) {
        location.hash = "/chat";
    }

    let selectSignUp = false;

</script>
<Button>Home</Button>
<h2>Welcome to</h2>
<h1>ChatApp</h1>
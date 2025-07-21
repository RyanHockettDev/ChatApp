<script lang="ts">

    import { onMount, onDestroy } from "svelte";
    import { currentUser, pb } from '../pocketbase';

    let messages: any[] = [];
    let newMessage: string;
    let unsubscribe: () => void;

    onMount(async () => {
        const resultList = await pb.collection('messages').getList(1, 50, {
            sort: 'created',
            expand: 'user',
        });
        messages = resultList.items;

        unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
            if (action === 'create'){
                const user = await pb.collection('users').getOne(record.user);
                record.expand = { user };
                messages = [...messages, record];
            }
            if( action === 'delete'){
                messages = messages.filter((m) => m.id !== record.id);
            }
        })
    });

    onDestroy(() => {
        unsubscribe?.();
    })

    async function createMessage() {
        
        const data = {
            text: newMessage,
            user: $currentUser?.id
        };
        if (!newMessage){
            return
        }
        const createdMessage = await pb.collection('messages').create(data);
        newMessage = ''
    }

</script>
<div class="h-[90%] flex justify-around ">
    <div class="lg:w-[60%] w-[90%] m-3 border border-primary-800 border-4 rounded-lg relative overflow-auto">
        {#each messages as message (message.id)}
            <div class="wrap-normal p-2">
                <p class="lg:w-[45%] rounded-lg bg-tertiary-200/70 p-2 wrap-anywhere">{message.text}</p>
                <small>@{message.expand?.user?.name}</small>
            </div>
        {/each}
        <form on:submit|preventDefault={createMessage} class="w-full sticky bottom-0 left-0 h-15 border-primary-800 border-t-2 flex justify-between bg-tertiary-100 ">
            <input placeholder="Type here to chat" size="50" type="text" bind:value={newMessage} class="w-[77%] bg-tertiary-100 h-full rounded p-2">
            <button type='submit' class="btn text-center w-[21%] text-white bg-secondary-500 text-xl">SEND</button>
        </form>
    </div>
</div>
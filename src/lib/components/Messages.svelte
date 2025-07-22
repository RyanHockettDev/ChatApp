<script lang="ts">

    import { onMount, onDestroy, tick } from "svelte";
    import { currentUser, pb } from '../pocketbase';

    let container;
    let isAtBottom = true;

    let messages: any[] = [];
    let newMessage: string;
    let unsubscribe: () => void;

    onMount(async () => {
        const resultList = await pb.collection('messages').getList(1, 25, {
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
    };

</script>
<div class="h-[86%] flex justify-around ">
    <div class="lg:w-[60%] w-[90%] m-3 border border-primary-500 border-4 rounded-lg flex flex-col justify-content-end overflow-y-auto">
        {#each messages as message (message.id)}
            {#if message.expand?.user?.email == $currentUser?.email}
            <div class="wrap-normal p-2 flex flex-col items-end content-end">
                <p class="lg:max-w-[90%] rounded-lg bg-secondary-100/70 p-2 wrap-anywhere">{message.text}</p>
                <small>@{message.expand?.user?.name}</small>
            </div>
            {:else}
                <div class="wrap-normal p-2 flex flex-col">
                <p class="lg:max-w-[90%] rounded-lg bg-tertiary-200/70 p-2 wrap-anywhere">{message.text}</p>
                <small>@{message.expand?.user?.name}</small>
                </div>
            {/if}
        {/each}
        <form on:submit|preventDefault={createMessage} class="w-full sticky bottom-0 left-0 h-[7%] border-primary-500 border-t-4 flex justify-between bg-tertiary-100 ">
            <input placeholder="Type here to chat" size="50" type="text" bind:value={newMessage} class="w-[77%] bg-tertiary-100 h-full rounded p-2 focus:bg-tertiary-450">
            <button type='submit' class=" text-center w-[21%] text-white bg-primary-500 text-xl hover:bg-primary-700">SEND</button>
        </form>
    </div>
</div>
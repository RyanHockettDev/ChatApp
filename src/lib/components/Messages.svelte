<script lang="ts">

    import { onMount, onDestroy, tick } from "svelte";
    import { currentUser, pb } from '../pocketbase';
    import {Tooltip} from '@skeletonlabs/skeleton-svelte'
    
    let openState:boolean = false; // Variable for tooltip open state
    let messages: any[] = []; // Array of messages to be displayed in the chat
    let flagMode:boolean = false; // Variable for flag mode state
    let newMessage: string; // Variable for created new message: bound to form input
    let element: HTMLElement; // HTML element binding for autoscroll feature
    let shouldScroll: boolean = true; // Variable dependency for autoscrolling 
 
    

    onMount(async () => {
        // Pulls 50 messages from messages collection
        const resultList = await pb.collection('messages').getList(1, 50, {
            sort: '-created', // Sorts by creation timestamp, descending (newest messages first)
            expand: 'user',
        });
        messages = resultList.items.reverse(); //Reverse the list in order to display them from bottom of chat
        
        // Watching for new or deleted messages
        pb.collection('messages').subscribe('*', async ({ action, record }) => {
            if (action === 'create'){ // New messages added to db collection are also added to messages array
                const user = await pb.collection('users').getOne(record.user);
                record.expand = { user };
                messages = await [...messages, record];
                scrollToBottom() // Scrolls to bottom after any new message is created, scroll position dependent 
            }
            if( action === 'delete'){ // If a message is deleted, it is filtered from the array
                messages = messages.filter((m) => m.id !== record.id);
            }
        })

        // Watching for new message flags
        pb.collection('message_flags').subscribe('*', async ({action, record}) => {
            if (action === 'create'){ // When a new flag is created, the db collection is searched for flags with a matching message.id
                const filter = `message = "${record.message}"`
                const resultList = await pb.collection('message_flags').getFullList({
                    filter: filter
                })
                // If a message is flagged by more than 1 user, message is removed from chat
                const flagCount = resultList.length
                if (flagCount > 1){
                    await pb.collection('messages').delete(record.message);
                    for (const flag of resultList) {
                    await pb.collection('message_flags').delete(flag.id)
                    }
                }
            }
        })
        scrollToBottom(); // shouldScroll was initialized as true, so scrollToBottom fires once on mount
    });

    onDestroy(() => {
        pb.collection('messages').unsubscribe('*');
        pb.collection('message_flags').unsubscribe('*');
    });

    async function createMessage() {
        const data = {
            text: newMessage,
            user: $currentUser?.id
        };
        if (!(newMessage.trim())){ // Prevents empty chat messages (including space-only messages)
            return
        }
        await pb.collection('messages').create(data);
        
        newMessage = '';
    };

    async function createFlag(messageID:string) {
        if(!flagMode){
            return;
        }else {
            const data = {
                user: $currentUser?.id,
                message: messageID
            };
            try{
                await pb.collection('message_flags').create(data);
            } catch(error){
                
            }
            
        }
    }

    // Enables flag mode. When enabled, users can click on individual messages to flag them as inappropriate
    function toggleFlagMode() {
        const flag = document.getElementById("flag")

        if (flagMode == false){
            flagMode = true;
            flag?.setAttribute("fill", "white")
        }else {
            flagMode = false;
            flag?.setAttribute("fill", "none")
        }
    }

   
    const scrollToBottom = async () => {
        await tick();
        if(shouldScroll){
            element.scroll({top: element.scrollHeight, behavior: 'smooth'})
        }
        
    }

    // If user has scrolled up, calls to scrollToBottom will not scroll down. Initialized to true above to scroll once on mount
    function setShouldScroll() {
        if(element.scrollHeight - element.scrollTop - element.clientHeight > 5){
            shouldScroll = false;
        } else {
            shouldScroll = true;
        }          
    }


</script>
<div class="h-[85%] flex z-auto">
    <div class="lg:w-[60%] w-[90%] mx-auto mt-3 border border-primary-500 border-4 rounded-lg relative">
        <div bind:this={element} class='flex flex-col grow overflow-y-auto min-h-0 h-[92%]' on:scroll={setShouldScroll}>
        {#each messages as message, i (message.id)}
           
            <div class="{i === 0 ? 'mt-auto' : ''} {message.expand?.user?.id == $currentUser?.id ? "items-end content-end" : "items-start content-start"}wrap-normal p-2 flex flex-col" >
                <button on:click={() => createFlag(message.id)} class="lg:max-w-[90%] rounded-lg {message.expand?.user?.id == $currentUser?.id ? "bg-secondary-100/70" : "bg-tertiary-200/70"} p-2 wrap-anywhere hover:cursor-default" aria-label="Enable flag mode, then click message to flag as inappropriate">{message.text}</button>
                <small>@{message.expand?.user?.name}</small>
            </div>
            
        {/each}
        </div>
        <form on:submit|preventDefault={createMessage} class="w-full absolute bottom-0 left-0 border-primary-500 border-t-4  bg-primary-500 ">
            <Tooltip
                open={openState}
                onOpenChange={(e) => (openState = e.open)}
                positioning={{ placement: 'top' }}
                contentBase="card preset-filled p-4"
                openDelay={200}
                arrow
                >
                {#snippet trigger()}<button type=button class="btn " aria-label="Flag Messages Mode" on:click={toggleFlagMode} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-5 hover:stroke-tertiary-300" id="flag">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
            </button>{/snippet}
                {#snippet content()}Click to enable "flag mode", then click a message to flag it as inappropriate{/snippet}
            </Tooltip>
            
            <input placeholder="Type here to chat" size="50" type="text" bind:value={newMessage} class="focus:outline-none focus:bg-tertiary-200 sm:w-[70%] w-[65%] bg-tertiary-100 h-full p-2">
            <button type='submit' class=" text-center w-[10%] sm:w-[20%] text-white bg-primary-500 text-xl hover:text-tertiary-300">SEND</button>
        </form>
        
    </div>
    
    
</div>

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

        flagMode == false ? flagMode = true : flagMode = false
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
<div class="h-[85%] flex">
    <div class="lg:w-[60%] w-[90%] mx-auto mt-5 bg-surface-100 dark:bg-surface-500 shadow-[14px_14px_7px_1px_rgba(0,0,0,0.25)] shadow-surface-500 relative">
        <div bind:this={element} class='flex flex-col grow overflow-y-auto min-h-0 h-[92%]' on:scroll={setShouldScroll}>
        {#each messages as message, i (message.id)}
           
            <div class="{i === 0 ? 'mt-auto' : ''} {message.expand?.user?.id == $currentUser?.id ? "items-end content-end" : "items-start content-start"}wrap-normal mb-2 flex flex-col" >
                {#if i == 0 || messages[i-1]?.expand?.user?.id != message.expand?.user?.id}
                <small class="p-2 mt-2">@{message.expand?.user?.name}</small>
                {/if}
                <button on:click={() => createFlag(message.id)} class="lg:max-w-[90%] {message.expand?.user?.id == $currentUser?.id ? "bg-primary-100 rounded-l-xl rounded-br-xl dark:bg-primary-300" : "bg-white rounded-r-xl rounded-bl-xl dark:bg-surface-300"} 
                    p-2 wrap-anywhere hover:cursor-default mb-2 mx-2" aria-label="Click to flag the following message: {message.text} written by {message.expand?.user?.name}" tabindex={flagMode == false ? -1 : null }>{message.text}</button>
                
            </div>
            
        {/each}
        </div>
        <form on:submit|preventDefault={createMessage} class="w-full absolute bottom-0 left-0 my-2 px-2 flex flex-row justify-around items-center bg-surface-100 dark:bg-surface-500">
            <Tooltip
                open={openState}
                onOpenChange={(e) => (openState = e.open)}
                positioning={{ placement: 'top' }}
                triggerBase="focus:outline-none bg-error-500 p-4 mx-2 hover:p-5 focus:shadow-[7px_10px_7px_1px_rgba(0,0,0,0.25)] hover:shadow-[7px_10px_7px_1px_rgba(0,0,0,0.25)] shadow-surface-500/60 focus:shadow-[7px_10px_7px_3px_rgba(0,0,0,0.25)] 
                    focus:shadow-surface-500/90 dark:bg-error-500/90 dark:shadow-surface-700/50 dark:focus:shadow-surface-900/50 focus:[&>.child]:size-7 focus:[&>.child]:stroke-3 
                    hover:[&>.child]:size-7 hover:[&>.child]:stroke-3 transition ease-in-out duration-200"
                contentBase="card preset-filled p-4"
                openDelay={200}
                arrow
                aria-label="Click to {flagMode == false ? "enable" : "disable"} message flagging mode - messages can be tabbed while flagging mode is enable"
                onclick={toggleFlagMode}
                >
                {#snippet trigger()}
                        <svg xmlns="http://www.w3.org/2000/svg" fill={flagMode == false ? "none" : "white"} viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="child size-5   " id="flag">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                {/snippet}
                {#snippet content()}Click to enable "flag mode", then click a message to flag it as inappropriate{/snippet}
            </Tooltip>
            
            <input placeholder="Type here to chat"  bind:value={newMessage} class="focus:outline-none bg-surface-200 p-2 w-[70%] py-4 max-w-[70%] 
                focus:shadow-[14px_14px_7px_1px_rgba(0,0,0,0.25)] focus:shadow-surface-500/90 dark:bg-surface-400 dark:focus:shadow-surface-900/50 focus:text-lg transition ease-in-out duration-200" aria-label="Type here to send messages in the chat">
            <button type='submit' class="text-center text-white bg-primary-500/90 text-lg p-2 m-2 hover:text-xl 
            focus:shadow-[7px_10px_7px_1px_rgba(0,0,0,0.25)] hover:shadow-[7px_10px_7px_1px_rgba(0,0,0,0.25)] focus:outline-none focus:text-xl 
            focus:shadow-surface-500/90 dark:bg-primary-400/90 dark:focus:shadow-surface-900/50 transition ease-in-out duration-200" 
            aria-label="Submit your message to the chat">SEND</button>
        </form>
        
    </div>
    
    
</div>

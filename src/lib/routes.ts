import Chat from './routes/Chat.svelte'
import Home from './routes/Home.svelte'
import Settings from './routes/Settings.svelte';

export default {

    '/': Home,
    '/chat': Chat,
    '/settings': Settings,

};
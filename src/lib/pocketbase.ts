import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://ryanhockettdev.com');

export const currentUser = writable(pb.authStore.record);

export const theme = writable("wintry")

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.record)
    
    
});
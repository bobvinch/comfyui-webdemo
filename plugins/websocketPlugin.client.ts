import io, {Socket} from 'socket.io-client'


export default defineNuxtPlugin((nuxtAPP) => {
    const socket: Socket = io(useRuntimeConfig().public.baseSocketurl as string, {autoConnect: false});
    return {
        provide: {
            socket: socket,
        }
    }

})
import { defineStore } from "pinia";


export const useChatHistoryStore = defineStore({
    id: "chatHistory",
    state: () => ({
        activeIndex: 0,
        showHistory:false,
        chatHistory: [{
            title: "New Chat",
            subtitle:"",
            messages: [] as ChatGPTMessage[]
        }]
    }),

    persist: true,

    getters: {
        getHistoryById: (state) => (index: number) => {
            return state.chatHistory[index];
        }


    },
    actions: {

        // 创建新的对话菜单
        addNewMenu() {
            this.activeIndex=0
            const chatHistory={
                title:"New Chat",
                subtitle:"",
                messages:[]
            }
            this.chatHistory.unshift(chatHistory)
        },

        deleteMenu(index:number) {
            this.chatHistory.splice(index,1)
            this.activeIndex=0
            if(this.chatHistory.length===0){
                this.addNewMenu()
            }
        },
        //更新数组中的标题
        updateMenuTitle(title:string,subtitle:string){
            this.chatHistory[this.activeIndex].subtitle=subtitle
            this.chatHistory[this.activeIndex].title=title

        },
        clearAllChat() {
            this.chatHistory = []
            this.addNewMenu()
        },

    },
});

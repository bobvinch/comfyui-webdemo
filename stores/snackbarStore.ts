import { defineStore } from "pinia";

type MessageType = "" | "info" | "success" | "error" | "warning";

//消息接口
interface SnackMessage{
  isShow:boolean;
  message:string;
  type:MessageType;
  timeout:number //-1表示一直显示
}

export const useSnackbarStore = defineStore({
  id: "snackbarStore",
  state: ():SnackMessage => ({
    isShow: false,
    message: "",
    type: "warning",
    timeout:4000
  }),

  persist: [{ storage: persistedState.localStorage, paths: [""] }],

  getters: {},
  actions: {
    showMessage(message:string) {
      this.isShow = true;
      this.message = message;
      this.type = "";
    },

    showErrorMessage(message:string) {
      this.isShow = true;
      this.message = message;
      this.type = "error";
    },
    showSuccessMessage(message:string) {
      this.isShow = true;
      this.message = message;
      this.type = "success";
    },
    showInfoMessage(message:string) {
      this.isShow = true;
      this.message = message;
      this.type = "info";
    },
    showWarningMessage(message:string) {
      this.isShow = true;
      this.message = message;
      this.type = "warning";
    },
  },
});

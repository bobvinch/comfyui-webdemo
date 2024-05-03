

/**
 * 全局消息通知
 */
export const showSuccessMessage=(message:string)=>{
const snackBarStore =useSnackbarStore()
    snackBarStore.showSuccessMessage(message)
}

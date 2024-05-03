import {useChatGPTStore} from "~/stores/chatGPTStore";
import {useGlobalConfig} from "#build/imports";

export interface ChatGPTMessage {
    content: string;
    role: "user" | "assistant" | "system";
}

export const showHistory = () => {
    const chatHistoryStore = useChatHistoryStore()
    chatHistoryStore.showHistory = true
}
export const HideHistory = () => {
    const chatHistoryStore = useChatHistoryStore()
    chatHistoryStore.showHistory = false
}
// Read the stream from the server
const _useGPTReadStream = async (
    reader: any,
    target: Ref<string> | Ref<any[]>
): Promise<any> => {
    // TextDecoder is a built-in object that allows you to convert a stream of bytes into a string
    const decoder = new TextDecoder("utf-8");
    // Destructure the value returned by reader.read()
    const {done, value} = await reader.read();
    // console.log(await reader.read())
    // If the stream is done reading, release the lock on the reader
    if (done) {
        reader.releaseLock();
        return 'finished'
    }
    // Convert the stream of bytes into a string
    const chunk = decoder.decode(value, {stream: true});
    // Split the string into an array of strings
    // console.log("chunk",chunk)
    const jsons = chunk
        .split("data:")
        .map((data) => {
            // Trim any whitespace
            const trimData = data.trim();
            // If the string is empty, return undefined
            if (trimData === "") return undefined;
            // If the string is [DONE], return undefined
            if (trimData === "[DONE]") return undefined;
            // Otherwise, parse the string as JSON
            return JSON.parse(data.trim());
        })
        // Filter out any undefined values
        .filter((data) => data);
    // Combine the data into a single string
    // Update the ref to the target element with the new string
    const response = jsons
        .map((jn) => jn.choices.map((choice: any) => choice.delta.content).join(""))
        .join("");
    if (target.value instanceof Array) {
        target.value[target.value.length - 1].content += response;
    } else {
        target.value = target.value += response;
    }
    // Repeat the process
    return _useGPTReadStream(reader, target);
};

// Count the number of code blocks and complete the last one if it is not completed
export const countAndCompleteCodeBlocks = (text: string) => {
    const codeBlocks = text.split("```").length - 1;
    if (codeBlocks && codeBlocks % 2 !== 0) {
        return text + "\n```\n";
    }
    return text;
};
/**
 * 使用GPT改良提示词
 * @param orignaiPrompt
 * @param streamModel
 * @param options
 */
export const useGPTGernateDrawPropmt = async (orignaiPrompt: string, streamModel: Ref<ChatGPTMessage[]>,options?:{
    scence?:string,
    features?:string,
}): Promise<ChatGPTMessage | any> => {
    const requestMessages = [] as ChatGPTMessage[]
    const presets = {
        role: "system",
        content: useGlobalConfig.LLM.presetPrompts.aidraw
    } as ChatGPTMessage
    if (!orignaiPrompt || !orignaiPrompt.trim()) {
        return
    }
    const newPrompt = {
        role: "user",
        content: orignaiPrompt.trim()+`${options?.scence?'\n场景：'+options?.scence:''}\n\n${options?.features?'\n人物特征：'+options?.features:''}`
    } as ChatGPTMessage
    requestMessages.push(presets)
    requestMessages.push(newPrompt)
    return await useGPTCreateCompletion(requestMessages, streamModel)
}

export const useGPTCreateCompletion = async (requestMessages: ChatGPTMessage[], messages: Ref<ChatGPTMessage[]>): Promise<ChatGPTMessage> => {
    const chatGPTStore = useChatGPTStore()
    const snackbarStore = useSnackbarStore()
    //如果代理连接不存在
    if (!chatGPTStore.apiKey ||  !chatGPTStore.getApiKey || !chatGPTStore.getProxyUrl) {
        await chatGPTStore.init(useAuthStore().user!._id!, useAuthStore().user!.username!)
    }
    const proxyUrl = chatGPTStore.getProxyUrl
    // console.log(requestMessages,proxyUrl)
    return new Promise(async (resolve, reject) => {
        try {
            // Create a completion (axios is not used here because it does not support streaming)
            console.log(proxyUrl)
            const completion = await fetch(`${proxyUrl}/v1/chat/completions`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${chatGPTStore.getApiKey}`,
                },
                method: "POST",
                body: JSON.stringify({
                    messages: requestMessages,
                    model: chatGPTStore.getActiveModel.name,
                    stream: true,
                }),
            });
            // Handle errors
            if (!completion.ok) {
                const errorData = await completion.json();
                snackbarStore.showErrorMessage(errorData.error?.message);
                return;
            }
            // Create a reader
            const reader = completion.body?.getReader();
            if (!reader) {
                snackbarStore.showErrorMessage("Cannot read the stream.");
            }
            // Add the bot message
            messages.value.push({
                content: "",
                role: "assistant",
            });
            // Read the stream
            _useGPTReadStream(reader, messages).then(res => {
                if (res === 'finished') {
                    resolve(messages.value[messages.value.length - 1])
                }
            });

        } catch (error: any) {
            snackbarStore.showErrorMessage(error.message);
        }

    })

};
/**
 * 使用GPT创作文案,赋值给响应式变量的同时会返回最终的结果
 */
export const useGPTCreateContent = async (orignaiPrompt: string, streamModel: Ref<ChatGPTMessage[]>): Promise<ChatGPTMessage | any> => {
    const requestMessages = [] as ChatGPTMessage[]
    const presets = {
        role: "system",
        content: "你是一名出色的AI推文写手，善于创作各种的AI推文"
    } as ChatGPTMessage
    if (!orignaiPrompt || !orignaiPrompt.trim()) {
        return
    }
    const newPrompt = {
        role: "user",
        content: orignaiPrompt.trim()
    } as ChatGPTMessage
    requestMessages.push(presets)
    requestMessages.push(newPrompt)
    return await useGPTCreateCompletion(requestMessages, streamModel)
}
/**
 * 服务端请求，然后通过pinia共享，创建oneapi用户
 * @returns
 * @param oneAPIUser
 */
export const useGPTcreatbyuniId = async (oneAPIUser: OneAPIUser) => {
    return await Client_POST('/oneapi/users/creatbyuniId', oneAPIUser)
}

/**
 * 服务端请求，然后通过pinia共享，根据用户id查询token，没有则创建,
 * @returns
 * @param oneAPIUser
 */
export const useGPTcreatToken = async (oneAPIUser: OneAPIToken) => {
    return await Client_POST('/oneapi/tokens', oneAPIUser)
}

export interface OneAPIUser {
    username: string,
    password: string,
    quota: number,
    github_id: string
}

/**
 * oneapi token
 */
export interface OneAPIToken {
    user_id: number,
    key: string,
    status: number,
    name: string,
    created_time: number,
    accessed_time: number,
    expired_time: number,
    remain_quota: number,
    unlimited_quota: boolean,
    used_quota?: number
}

/**
 * 大模型接口
 */
export interface Model {
    title: string
    name: string
    icon: string
    iconpath: string
}

/**
 * 提示词接口
 */
export interface Propmpt {
    act: string
    prompt: string
    type?: "system" | "user"

}

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation"
}

const ChatWelcome = ({name, type}: ChatWelcomeProps) => {
    return ( 
        <div className="space-y-2 px-4 mb-4 ml-6">
            <p className ="text-xl lg:text-3xl font-bold" >
                {type === "channel" ? `Welcome to the "${name}" channel!`:
                `Welcome to the conversation!`}
            </p>
            <p className="text-slate-600 dark:text-slate-400 lg:text-2xl">
                {type === "channel" ? `Type the first message in the "${name}" channel!`:
                `Be the firs one to say hello to "${name}"!`}
                
            </p>
        </div>
     );
}
 
export default ChatWelcome;
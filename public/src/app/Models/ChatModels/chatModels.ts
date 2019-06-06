export class MessageProp {
    message: string;
    userName: string;
    isSent = false;
}

export class ChatHistoryMessage {
    userName: string;
    data: string;
}

export class NewMessage {
    grpId: string;
    message: string;
    username: string;
}

export class JoinGroupResult {
    isValidGroup: boolean;
    groupId: string;
}

export class ChatHistoryResult {
    groupName: string;
    msgCount: number;
    userIdCount: number;
    messages: ChatHistoryMessage[];
}

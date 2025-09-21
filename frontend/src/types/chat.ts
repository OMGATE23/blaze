export interface ChatMessage {
  session_id: string;
  conv_id: string;
  msg_type: "input" | "output";
  actions: string[];
  tools: string[];
  content: MessageContent[];
  status: "progress" | "success" | "error";
  msg_id: string;
}

export type MessageContent =
  | TextContent
  | ImageContent
  | FileContent
  | ToolContent;

export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "low" | "high" | "auto";
  };
}

export interface FileContent {
  type: "file";
  file: {
    file_id: string;
    filename: string;
  };
}

export interface ToolContent {
  tool_name: string;
  tool_args: Record<string, unknown>;
  tool_response: unknown;
  tool_status: "progress" | "success" | "error";
}

export interface ChatInput {
  session_id: string;
  conv_id: string;
  system_prompt?: string;
  sender: "user";
  tools: string[];
  content: MessageContent[];
  status: "progress" | "success" | "error";
  msg_id: string;
  msg_type: "input";
}

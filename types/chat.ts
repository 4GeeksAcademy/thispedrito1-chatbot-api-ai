export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface SessionStats {
  prompt: number;
  completion: number;
  total: number;
  modelName: string;
  totalTime: number;
  requestCount: number;
  averageTime: number;
}
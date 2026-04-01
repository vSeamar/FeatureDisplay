"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  active: boolean;
}

const cannedResponses = [
  `Great question! Based on your current sprint and deadlines, here are my recommendations:

**1. Fix authentication redirect bug** (Urgent)
Blocking 3 other tasks and affects all users. Estimated effort: 2 hours.

**2. Complete API v2.0 contract submission** (High - Due Mar 10)
External deadline that cannot be moved. Coordinate with Alex on the remaining endpoints.

**3. Review push notification PR** (High)
Jake has been waiting 2 days for review. Quick win that unblocks mobile team progress.

**4. Update database migration scripts** (Medium)
Required before the March 20 release. Start early to allow time for testing.

I'd suggest tackling #1 first thing in the morning, then moving to #2 before lunch. Afternoons can be split between #3 and #4. Would you like me to create tasks for these in your sprint board?`,

  `Here's your Sprint 14 progress summary:

---

**Sprint 14 Summary** | March 2-20, 2026

**Velocity:** 32 story points completed (target: 40)
**Completion:** 78% of planned work

**Completed Items (18 tasks)**
- User authentication flow refactoring
- Push notification registration
- API endpoint documentation
- Dashboard analytics widget
- Database schema migration v1
- 13 additional bug fixes and improvements

**In Progress (8 tasks)**
- Offline mode foundations (60% complete)
- Rich notification templates (40% complete)
- Performance optimization audit (30% complete)

**Blockers**
- iOS certificate renewal pending (blocks push testing)
- Waiting on third-party API access for payment integration

**Key Metrics**
- Average task completion time: 2.4 days (improved from 2.8)
- Code review turnaround: 6 hours average
- Bug escape rate: 3% (down from 5%)

**Recommendations**
1. Consider descoping 2-3 lower priority items to hit the sprint goal
2. Schedule a focused pairing session for the offline mode work
3. Escalate the iOS certificate issue to management

Would you like me to generate a more detailed report or share this with your team?`,

  `I've analyzed your team's workload distribution. Here's what I found:

**Workload Balance Assessment**

| Team Member | Current Tasks | Story Points | Status |
|------------|--------------|-------------|--------|
| Sarah Chen | 6 tasks | 14 pts | Slightly overloaded |
| Alex Rivera | 4 tasks | 10 pts | Balanced |
| Maria Santos | 5 tasks | 8 pts | Balanced |
| Jake Wilson | 7 tasks | 18 pts | Overloaded |
| Emily Park | 3 tasks | 6 pts | Has capacity |

**Recommendations:**
- Move 2 tasks from Jake to Emily to balance the load
- Sarah's frontend tasks could benefit from pair programming with Maria
- Consider splitting the large "offline mode" epic into smaller deliverables

Should I suggest specific task reassignments?`,

  `I've drafted a retrospective agenda based on Sprint 14's data:

**Sprint 14 Retrospective**

**What went well:**
- Team velocity improved 5% over last sprint
- Zero production incidents during the release
- Code review turnaround decreased to 6 hours

**What could be improved:**
- Sprint planning accuracy (we over-committed by 20%)
- Cross-team dependency management
- Documentation updates lagging behind code changes

**Action items to discuss:**
1. Should we adopt planning poker for better estimation?
2. Create a shared dependency tracker with the platform team
3. Implement "docs-as-code" approach with automated checks

I can generate talking points for each topic. Would that be helpful?`,

  `Based on your project data, here's a risk assessment:

**Project Risk Analysis**

**High Risk:**
- Release v2.0 timeline is tight with 5 unfinished tasks
- Payment integration blocked on third-party access

**Medium Risk:**
- Team velocity may dip next sprint (2 members on PTO)
- Technical debt in auth module increasing

**Low Risk:**
- Design system migration on track
- QA coverage improving steadily

I recommend scheduling a risk mitigation meeting this week to address the high-risk items. Want me to draft an agenda?`,
];

const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "Sprint Planning Help",
    lastMessage: "Here are my recommendations for task prioritization...",
    date: "Today",
    active: true,
  },
  {
    id: "2",
    title: "Bug Triage",
    lastMessage: "I've categorized the 12 open bugs by severity...",
    date: "Yesterday",
    active: false,
  },
  {
    id: "3",
    title: "Performance Review",
    lastMessage: "Based on the metrics, the team has improved...",
    date: "Mar 25",
    active: false,
  },
];

const initialMessages: Message[] = [
  {
    id: "sys",
    role: "system",
    content:
      "I'm TaskFlow AI, your project management assistant. I can help with task prioritization, sprint planning, generating reports, and more. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "u1",
    role: "user",
    content: "What tasks should I prioritize this week?",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
  },
  {
    id: "a1",
    role: "assistant",
    content: cannedResponses[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "u2",
    role: "user",
    content: "Can you create a summary of this sprint's progress?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "a2",
    role: "assistant",
    content: cannedResponses[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState("1");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseIndexRef = useRef(2);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response after delay
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const responseIdx = responseIndexRef.current % cannedResponses.length;
      responseIndexRef.current += 1;
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: cannedResponses[responseIdx],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: "New Conversation",
      lastMessage: "",
      date: "Now",
      active: true,
    };
    setConversations((prev) =>
      [newConv, ...prev.map((c) => ({ ...c, active: false }))]
    );
    setActiveConversation(newId);
    setMessages([
      {
        id: "sys-new",
        role: "system",
        content:
          "I'm TaskFlow AI, your project management assistant. I can help with task prioritization, sprint planning, generating reports, and more. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    responseIndexRef.current = 0;
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("---")) {
        elements.push(
          <hr key={i} className="my-3 border-border" />
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={i} className="font-semibold mt-2">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      } else if (line.startsWith("| ")) {
        // Table row
        const cells = line
          .split("|")
          .filter((c) => c.trim() !== "");
        const isSeparator = cells.every((c) => /^[\s-]+$/.test(c));
        if (!isSeparator) {
          elements.push(
            <div
              key={i}
              className="grid gap-2 py-1 text-xs font-mono"
              style={{
                gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
              }}
            >
              {cells.map((cell, j) => (
                <span key={j} className="truncate">
                  {cell.trim()}
                </span>
              ))}
            </div>
          );
        }
      } else if (/^\*\*\d+\./.test(line)) {
        const text = line.replace(/\*\*/g, "");
        elements.push(
          <p key={i} className="mt-2 font-semibold">
            {text}
          </p>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <p key={i} className="ml-4 before:content-['•'] before:mr-2 before:text-muted-foreground">
            {renderInlineFormatting(line.slice(2))}
          </p>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i}>{renderInlineFormatting(line)}</p>
        );
      }
    });

    return elements;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        parts.push(
          <strong key={keyIdx++}>{boldMatch[1]}</strong>
        );
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }

    return parts;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/40">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">
              Your intelligent project management companion.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleNewChat}>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Chat Sidebar */}
        <div className="space-y-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Conversations
          </p>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversation(conv.id);
                setConversations((prev) =>
                  prev.map((c) => ({
                    ...c,
                    active: c.id === conv.id,
                  }))
                );
                // Restore initial messages for the first conversation only
                if (conv.id === "1") {
                  setMessages(initialMessages);
                  responseIndexRef.current = 2;
                }
              }}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                conv.id === activeConversation
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
            >
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm truncate",
                    conv.id === activeConversation && "font-medium"
                  )}
                >
                  {conv.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {conv.date}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <Card className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              if (msg.role === "system") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                      <Bot className="h-4 w-4 text-purple-500" />
                      <p className="text-xs text-muted-foreground">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end gap-3">
                    <div className="max-w-[75%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">
                      <p className="text-sm">{msg.content}</p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                );
              }

              // Assistant message
              return (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-950/40">
                      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[75%] space-y-2">
                    <div className="rounded-2xl rounded-bl-md border bg-card px-4 py-3">
                      <div className="text-sm leading-relaxed space-y-1">
                        {renderFormattedContent(msg.content)}
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => handleCopy(msg.id, msg.content)}
                      >
                        {copiedId === msg.id ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Copy className="mr-1 h-3 w-3" />
                        )}
                        {copiedId === msg.id ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-purple-100 dark:bg-purple-950/40">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md border bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t bg-background p-4">
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask TaskFlow AI anything..."
                  className="min-h-[44px] max-h-[160px] resize-none pr-4"
                  rows={1}
                />
              </div>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-[44px] w-[44px] shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                Powered by AI — Responses may not always be accurate.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

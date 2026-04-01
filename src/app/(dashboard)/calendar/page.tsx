"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  color: string;
  description?: string;
}

const colorMap: Record<string, { dot: string; bg: string; text: string }> = {
  blue: {
    dot: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  purple: {
    dot: "bg-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
  },
  red: {
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
  },
  green: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  orange: {
    dot: "bg-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
  },
};

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Sprint Planning",
    date: new Date(2026, 2, 2),
    time: "10:00 AM",
    color: "blue",
    description: "Plan tasks and goals for Sprint 14.",
  },
  {
    id: "2",
    title: "Design Review",
    date: new Date(2026, 2, 5),
    time: "2:00 PM",
    color: "purple",
    description: "Review mockups for the new dashboard redesign.",
  },
  {
    id: "3",
    title: "API Deadline",
    date: new Date(2026, 2, 10),
    time: "11:59 PM",
    color: "red",
    description: "Final deadline for API v2.0 contract submission.",
  },
  {
    id: "4",
    title: "Team Standup",
    date: new Date(2026, 2, 3),
    time: "9:15 AM",
    color: "green",
    description: "Weekly team standup and blockers review.",
  },
  {
    id: "5",
    title: "Team Standup",
    date: new Date(2026, 2, 10),
    time: "9:15 AM",
    color: "green",
    description: "Weekly team standup and blockers review.",
  },
  {
    id: "6",
    title: "Team Standup",
    date: new Date(2026, 2, 17),
    time: "9:15 AM",
    color: "green",
    description: "Weekly team standup and blockers review.",
  },
  {
    id: "7",
    title: "Team Standup",
    date: new Date(2026, 2, 24),
    time: "9:15 AM",
    color: "green",
    description: "Weekly team standup and blockers review.",
  },
  {
    id: "8",
    title: "Product Demo",
    date: new Date(2026, 2, 15),
    time: "3:00 PM",
    color: "orange",
    description: "Demo new features to stakeholders.",
  },
  {
    id: "9",
    title: "Release v2.0",
    date: new Date(2026, 2, 20),
    time: "6:00 AM",
    color: "red",
    description: "Production release of version 2.0.",
  },
  {
    id: "10",
    title: "Retrospective",
    date: new Date(2026, 2, 25),
    time: "4:00 PM",
    color: "blue",
    description: "Sprint 14 retrospective and lessons learned.",
  },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    color: "blue",
    description: "",
  });

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const getEventsForDay = (date: Date) => {
    return events.filter((e) => isSameDay(e.date, date));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const handlePrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const [year, month, day] = newEvent.date.split("-").map(Number);
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: new Date(year, month - 1, day),
      time: newEvent.time || undefined,
      color: newEvent.color,
      description: newEvent.description || undefined,
    };
    setEvents((prev) => [...prev, event]);
    setNewEvent({ title: "", date: "", time: "", color: "blue", description: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your events and deadlines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event on your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {Object.keys(colorMap).map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setNewEvent((prev) => ({ ...prev, color }))
                        }
                        className={cn(
                          "h-8 w-8 rounded-full transition-transform hover:scale-110",
                          colorMap[color].dot,
                          newEvent.color === color &&
                            "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-desc">Description</Label>
                  <Textarea
                    id="event-desc"
                    placeholder="Optional description..."
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Calendar Grid */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(new Date(2026, 2, 1));
                    setSelectedDate(new Date());
                  }}
                  className="text-xs"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day names header */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);
                const selected =
                  selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative flex min-h-[80px] flex-col items-start border-t p-1.5 text-left transition-colors hover:bg-muted/50",
                      !inMonth && "opacity-30",
                      selected && "bg-muted",
                      idx % 7 !== 0 && "border-l"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm",
                        today &&
                          "bg-primary text-primary-foreground font-semibold",
                        selected && !today && "bg-accent font-medium"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {/* Event dots / labels */}
                    <div className="mt-0.5 flex w-full flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight",
                            colorMap[ev.color]?.bg,
                            colorMap[ev.color]?.text
                          )}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="px-1 text-[10px] text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel: Selected Day Events */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d")
                  : "Select a day"}
              </CardTitle>
              {selectedDate && (
                <p className="text-xs text-muted-foreground">
                  {selectedDayEvents.length === 0
                    ? "No events scheduled"
                    : `${selectedDayEvents.length} event${selectedDayEvents.length > 1 ? "s" : ""}`}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedDate && (
                <p className="text-sm text-muted-foreground">
                  Click a day on the calendar to see its events.
                </p>
              )}
              {selectedDayEvents.length === 0 && selectedDate && (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No events on this day.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewEvent((prev) => ({
                        ...prev,
                        date: format(selectedDate, "yyyy-MM-dd"),
                      }));
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Event
                  </Button>
                </div>
              )}
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={cn(
                    "rounded-lg border p-3",
                    colorMap[ev.color]?.bg
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2.5 w-2.5 rounded-full shrink-0",
                            colorMap[ev.color]?.dot
                          )}
                        />
                        <h4
                          className={cn(
                            "text-sm font-semibold truncate",
                            colorMap[ev.color]?.text
                          )}
                        >
                          {ev.title}
                        </h4>
                      </div>
                      {ev.time && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {ev.time}
                        </p>
                      )}
                      {ev.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {events
                .filter((e) => e.date >= new Date(2026, 2, 1))
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedDate(ev.date)}
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted"
                  >
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        colorMap[ev.color]?.dot
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(ev.date, "MMM d")}
                        {ev.time ? ` at ${ev.time}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

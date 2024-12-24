"use client";

import { useEffect, useState } from "react";
import { PlusIcon, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/services/SupabaseServices";
import { format } from "date-fns";

interface ModalOpen {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventToEdit: Event | null;
  onModalClose: () => void;
}

const EventModal = ({
  open,
  setOpen,
  eventToEdit,
  onModalClose,
}: ModalOpen) => {
  const [testSuite, setTestSuite] = useState(
    eventToEdit?.title || "Unit test suite"
  );
  const [date, setDate] = useState<Date | null>(eventToEdit?.date || null);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    eventToEdit?.selectedDays || ["Mon"]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const testSuiteList = [
    "Unit test suite",
    "Integration test suite",
    "System test suite",
    "Regression test suite,",
    "Performance test suite",
    "Usability test suite",
    "Acceptance test suite",
    "API test suite",
  ];

  useEffect(() => {
    if (eventToEdit) {
      setTestSuite(eventToEdit.title);
      setDate(eventToEdit.date);
      if (eventToEdit.date) {
        const dayName = format(eventToEdit.date, "EEE");
        setSelectedDays([dayName]);
      }
    } else {
      setTestSuite("Unit test suite");
      setDate(null);
      setSelectedDays(["Mon"]);
    }
  }, [eventToEdit, open]);

  const handleSaveChange = async () => {
    if (!testSuite || !date || selectedDays.length === 0) {
      setAlertMessage("Please fill in all the required fields.");
      setAlertOpen(true);
      return;
    }

    setIsLoading(true);

    const eventData = {
      id: eventToEdit?.id,
      title: testSuite,
      time: date,
      selectedDays: selectedDays,
    };

    try {
      const events = await (eventToEdit?.id
        ? updateEvent(eventData)
        : createEvent(eventData));

      console.log("event", events);
      if (events) {
        setAlertMessage(
          eventToEdit
            ? "Event updated successfully!"
            : "Event created successfully!"
        );
        setAlertOpen(true);
        setOpen(false);
        onModalClose();
      } else {
        setAlertMessage(
          eventToEdit ? "Failed to update event." : "Failed to create event."
        );
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setAlertMessage(`An error occurred while saving the event. ${error}`);
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit?.id) return;

    setIsLoading(true);
    try {
      await deleteEvent(eventToEdit.id);
      setAlertMessage("Event deleted successfully!");
      setAlertOpen(true);
      setOpen(false);
      onModalClose();
    } catch (error) {
      console.error("Error deleting event:", error);
      setAlertMessage("An error occurred while deleting the event.");
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) onModalClose();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-[#0040FF] hover:bg-[#0040FF]/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Schedule Test
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>
              {eventToEdit ? "Edit Schedule" : "Schedule Detail"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Test Suite</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {testSuite}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                  {testSuiteList.map((suite, index) => {
                    return (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setTestSuite(suite)}
                      >
                        {suite}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 w-full p-2 border-2 border-gray-100 rounded-lg">
              <Label className="font-bold">Start Date and Time</Label>
              <DateTimePicker date={date} setDate={setDate} />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Run Weekly on Every</Label>
                  <Button variant="link" className="text-gray-500">
                    Custom Interval
                  </Button>
                </div>
                <div className="flex gap-2">
                  {weekDays.map((day) => (
                    <Button
                      key={day}
                      variant={"outline"}
                      className={`px-4 ${
                        selectedDays.includes(day)
                          ? "bg-[#0040FF] text-white"
                          : ""
                      }`}
                      onClick={() => {
                        if (selectedDays.includes(day)) {
                          setSelectedDays(
                            selectedDays.filter((d) => d !== day)
                          );
                        } else {
                          setSelectedDays([...selectedDays, day]);
                        }
                      }}
                      disabled={isLoading}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between mt-6">
            {eventToEdit ? (
              <Button
                variant="destructive"
                className="w-1/2"
                disabled={isLoading}
                onClick={handleDelete}
              >
                Delete Schedule
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-1/2"
                disabled={isLoading}
                onClick={() => {
                  setOpen(false);
                  onModalClose();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              className="w-1/2 bg-[#0040FF]"
              onClick={handleSaveChange}
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : eventToEdit
                ? "Update Changes"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventModal;

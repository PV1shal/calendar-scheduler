import { useState } from "react";
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
import { createEvent } from "@/services/SupabaseServices";

interface ModalOpen {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EventModal = ({ open, setOpen }: ModalOpen) => {
  const [testSuite, setTestSuite] = useState("Unit test suite");
  const [date, setDate] = useState<Date | null>(null); // Use null for optional date
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon"]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
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

  const handleSaveChange = async () => {
    if (!testSuite || !date || selectedDays.length === 0) {
      setAlertMessage("Please fill in all the required fields.");
      setAlertOpen(true);
      return;
    }

    setIsLoading(true);

    const eventData = {
      title: testSuite,
      time: date,
      selectedDays: selectedDays,
    };

    try {
      const events = await createEvent(eventData);

      if (events) {
        setAlertMessage("Event created successfully!");
        setAlertOpen(true);
        setOpen(false); // Close the modal on success
      } else {
        setAlertMessage("Failed to create event.");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setAlertMessage("An error occurred while creating the event.");
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#0040FF] hover:bg-[#0040FF]/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Schedule Test
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Schedule Detail</DialogTitle>
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
              <DateTimePicker setDate={setDate} />

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
            <Button
              variant="destructive"
              className="w-1/2 text-red-500 hover:text-white border-2 bg-transparent"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              Cancel Schedule
            </Button>
            <Button
              className="w-1/2 bg-[#0040FF]"
              onClick={handleSaveChange}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shadcn Alert Dialog */}
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

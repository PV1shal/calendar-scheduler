# Calendar Scheduler

## Steps to setup
1. cd into project
2. Install packages using

    ```npm install```
3. Start the server using

    ``` npm run dev ```

## File Structre:
- I wanted to develop the app in a component.modular like fashion which is why I've developed 3 major components:
    1. **CalendarComponent.tsx**
        - This will be the maincomponent that will hold the grid i.e. the calendar.
    2. **EventModalComponent.tsx**
        - This is a Modal made with the help of shadcn to create a new schedule.
    3. **DateTimePicker.tsx**
        - This is a custom date time picker made with the help of calender and input from shadcn. 
        - The time picker is made in such a way that it works only in 12hr format and no wrong time can be entered.
- I've also added a service folder that has the handler for everythign related to supabase such as adding new schedule and get all schedules. It can be found in 
    ```/services/SupabaseServices.tsx```

    1. **getAllEvents**
        - Helps is getting all the event from supabase.
    2. **createEvent**
        - Helps in scheduling a new test.
    3. **getNextOccurrence**
        - A help function that helps in calculating the dates of the upcoming 'day'.
    4. **updateEvent**
        - Helps in updaing schedule test.
        - Can be improved to a batch update in the future as DB is designed with that in mind.
    5. **deleteEvent**
        - Helps in updaing schedule test.
        - Can be improved to a batch delete in the future as DB is designed with that in mind.
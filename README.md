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
    
# Excel → JSON Angular Project

## Project Overview

We have started an **Angular 18** project aimed at processing Excel files, rounding hours according to specified rules, and outputting the results in JSON format.

The project has a simple structure:  
- We work in **a single component** (`AppComponent`), so no routing or separate modules are needed.  
- The **logic is implemented in TypeScript**.  
- The **user interface is built with HTML and CSS**.  
- **Bootstrap** and **SweetAlert** are used for styling and interactive notifications.



- Upload Excel files (`.xlsx` format)  
- Process interventions according to the following rules:
  1. Minimum 1 hour, except for consecutive interventions  
  2. Interventions longer than 1 hour are rounded to the nearest 10 minutes  
  3. Monthly total hours are rounded up to 30-minute blocks  
- Generate JSON objects with aggregated data per worker  
- Download the JSON file  
- Display results on the web interface in a formatted or table-like JSON view

---

## Technologies Used

- **Angular 18**  
- **TypeScript** (logic implementation)  
- **HTML + CSS** (user interface)  
- **Bootstrap** (styling and responsiveness)  
- **SweetAlert** (user notifications, e.g., successful processing)


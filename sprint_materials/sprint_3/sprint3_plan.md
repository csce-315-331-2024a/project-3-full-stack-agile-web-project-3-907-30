# SPRINT THREE: 4/18/24 - 4/28/24

## Sprint Goal:

The main goal of the third sprint of this project is to deliver a final product that implements all necessary functionality, is accessible to a wide range of users, and adds novel features.

### MVP (Minimum Viable Product)

A product in which all users have a robust and fully-featured experience. Managers can fully interact with their ordering, menu item, and inventory systems. Customers can place orders from their view, implementing their rewards in this experience as well. The system integrates the functionality of outside API's to enrich the user experience.

### Sprint 3 Backlog

**Legend: #. = Corresponding story, En = N hours estimated to complete, Sy = y status (0 not complete, 1 complete), Tn = N hours spent on the task**

Ex:

- [ ] Story
  - [ ] task
    - [ ] sub-task

- [x] As a manager, I want to make any item on sale to increase orders. - Gabe
  - [x] Make GUI edit menu item view have an option to put the item on sale E1 P2 T2 - Gabe
  - [x] Have a function that updates menu item’s prices when they go on sale E1 P2 T2 - Gabe
  - [x] Make GUI menu item sale view have a date range option using a calendar date selection to determine how long the sale will last E1 P2 T2 - Gabe
  - [x] Make menu item return to default price when sale window passes E2 P2 T2 - Gabe
- [X] As an employee, I want to be able to see what items I have sold the least to tailor my sales strategy around it. - Margo
  - [X] Make Employee GUI view that shows employee information E1 P3 S1 - Margo
  - [X] Make function that queries the information stored for a given, logged-in employee E1 P3 S1 - Margo
- [x] As a customer, I want to see items that are on promotion so that I could make an informed purchasing decision. - Chris
  - [x] Make the Customer POS view highlight the items that are on sale in some way E1 P2 T1 - Chris
  - [x] Make function that queries all of the items that are on sale E1 P2 T2 - Chris

### Chores (part of the backlog, but have no story points associated with them)
- [X] Allow managers to input date ranges for trends - Margo E2 P1 S2
- [X] Try to make interactable way to update menu items - Aaron E2 P2 S1 T4
- [X] Add front-end for customers to see their past orders - Margo E1 P1 S1
- [X] Move all trend functionality to api’s  - Margo E1 P3 S1
- [x] Clean up Allergen UI for customer view with Halal and Vegan - Chris E1 P2 T1
- [X] Clean up logic for excess report form - Aaron E1 P2 S1
- [X] Add bounds checking to manager trend inputs - Chris E1 P2 T1
- [X] Clean up menu management card - Aaron E1 P2 S1 T1
- [x] Fix duplicate customers being added - Gabe E1 P1 T1
- [ ] Fix menu item makeup - Gabe E2 P2 T0
- [x] Remove Google Translate loading circle - Adam E1 P3 T1
- [X] Allows employees to remove items from order in receipt  - Akshay E1 P1 T1
- [X] Allow customers to make orders in the customer view page - Akshay T3
- [X] Customers can create orders - Akshay E2 P1 T1
- [X] Customers can remove items from orders - Akshay E1 P1 T1
- [X] Allow modifications in all ordering views - Akshay E3 P1 T2
- [X] Recommend items based on weather - Margo E2 P2 S1
- [x] View all orders; view a single order (including status: pending, fulfilled, canceled, etc.) - Adam E2 P1 T3
- [x] Modify an order (add/remove items, change status, etc.) - Adam E3 P1 T3
- [x] Remove an order from the order history - Akshay E1 P1 T1
- [x] Inventory management - Adam
- [x] Add a new item to the inventory - Adam E2 P1 T1
- [x] View all inventory items; view a single inventory item - Adam E1 P1 T1
- [x] Modify an item in the inventory (name, quantity, supplier, etc.) - Adam E1 P1 T2
- [x] Remove an item from the inventory - Adam E1 P1 T1
- [X] Menu management - Aaron E3 P1 T4
- [X] Add a menu item - Aaron E1 P1 T5
- [X] View current menu items - Aaron E1 P1 T1
- [X] Modify a menu item (name, price, ingredients, description, status, etc.) - Aaron E2 P1 T4
- [X] Remove an item from the menu - Aaron E1 P1 T1
- [X] Add/update/remove seasonal menu items, "seasonal" := defined availability window, visible on all applicable views - Chris E3 P2 T3
- [x] Mobile friendly for customer view - Adam E3 P1 T2
- [x] Fix WAVE accessibility issues - Gabe E3 P1 T2
- [x] Fix accessibility checker issues - Gabe E3 P1 T2
- [X] Add more tests with playwright - Margo E3 P1 S2
- [X] Measure code coverage with playwright - Margo E1 P1 S3
- [x] Remove user in user management - Adam E1 P1 T1
- [x] Add pictures to static menu board - Adam E2 P2 T2
- [X] Link to external site - Akshay E1 P3 T1
- [X] One more API functionality - Akshay E3 P3 T2
- [x] Host documentation - Chris E3 P1 T2
- [x] Add deprecated column when removing menu items to prevent side effects - Gabe E2 P2 T1

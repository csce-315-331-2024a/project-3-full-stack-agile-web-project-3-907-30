# SPRINT TWO: 4/4/24 - 4/14/24

## Sprint Goal:
The main goal of the second sprint of this project is to have a product that implements the higher-level features expected from a robust POS/restaurant management system, along with a more complete customer interaction system. 

### MVP (Minimum Viable Product)
A product in which, along with the basic operations implemented in the previous sprint, will have upgrades in every user aspect. Trend functionality will be added to the manager view. The customer view will be completed and rounded out by adding an ordering system, implementing the use of points, and adding more external API support to create a more robust customer experinece. 

### Sprint 2 Backlog
**Legend: #. = Corresponding story, En = N hours estimated to complete, Sy = y status (0 not complete, 1 complete), Tn = N hours spent on the task**
Ex:
- [ ] Story
  - [ ] task
    - [ ] sub-task
- [ ] 2. As a manager, I want to be able to view past orders and see what is selling the least, so we can advertise it more. - Aaron
  - [ ] 2. Make function that queries the menu items that have sold the least and the amounts that they have sold in ascending order (least sales first); have 10 item cutoff (bottom 10 sellers) E1 P2 T0 - Aaron
  - [ ] 2. Add functionality to the function that queries the menu items that contribute the smallest percentage to the total revenue as well, for a more accurate view of the weak links E1 P2 T0 - Aaron
  - [ ] 2. Have GUI make the items that pop up interactable; eg if you click corn dogs because they’re selling poorly, it should take you to the menu items view where you can edit the corndog item or add a promotion to it E3 P2 T0 - Aaron
- [ ] 4. As a manager, I want to be able to see what employees have made the most orders so I can see which employee is most valuable. - Adam
  - [ ] 4. Make Manager GUI page that shows employee performance E2 P1 T0 - Adam
  - [ ] 4. Make function that queries the employees with the most total orders made E1 P1 T0 - Adam
- [ ] 5. As a manager I want to be able to see trends in sales data so I can estimate inventory purchasing and present to business owners. - Adam, Gabe, Margo, Aaron
  - [ ] 5. Make Manager GUI page that has a menu of available trend reports E3 P1 T0 - Adam
  - [ ] 5. Make functions for the following trend reports:
    - [x] 5. What sells together E2 P1 T2 - Gabe
    - [X] 5. Product Usage Chart E2 P1 T1 - Margo
    - [X] 5. Sales Report E2 P1 T2 - Margo
    - [ ] 5. Excess Report E2 P1 T0 - Aaron
    - [ ] 5. Restock Report E2 P1 T0 - Aaron
    - [x] 5. Days with the most sales in a given month E2 P1 T1 - Gabe
- [x] 7. As an employee, I want to be able to make orders so I can translate a customer’s desires to the kitchen. - Akshay
  - [x] 7. Make Employee GUI POS system that allows employees to create, delete, customize, and see the information contained within an order E1 P1 T0 - Akshay
  - [x] 7. Make functions that can create, delete, view, and modify the orders in the database E1 P1 T0 - Akshay
  - [x] 7. Have GUI call and display the results of that function when a customer is selecting a given item E1 P1 T0 - Akshay
- [X] 10. As an employee, I want to be able to view product information so I can inform the customer without leaving. - Margo
  - [X] 10. Make a function that queries all of the relevant characteristics of a menu item like allergen information.  E1 P2 T1 - Margo
  - [X] 10. Have GUI show this information to the employee when they click on a menu item at POS. E1 P2 T2 - Margo
- [ ] 14. As a customer, I want to be able to log in to see my past orders and points so that I can re-order or just see what I like. - Gabe
  - [ ] 14. Make Customer GUI “login” view that asks for relevant information (phone number)  E2 P1 T0 - Gabe
  - [x] 14. Implement encrypted database login functionality for customers to login E3 P1 T4 - Gabe
  - [x] 14. Implement login and logout routes and corresponding hooks E1 P1 Tx - Gabe (deprecated)
  - [ ] 14. Make Customer GUI information view that shows all of the relevant information (general and rewards) on a customer’s account E2 P3 S1 - Gabe
  - [x] 14. Create new tables and/or columns in the database holding the extra rewards information E2 P3 T1 - Gabe
  - [ ] 14. Make function that queries a customer’s general information E1 P2 T0 - Gabe
  - [ ] 14. Make function that queries a customer’s purchase history   E1 P2 T0 - Gabe
  - [ ] 14. Make a function that queries a customer’s rewards information  E1 P3 S1 - Gabe
- [ ] 16. As a customer, I want to see allergy and dietary information so I can make an informed decision about what to eat. - Chris
  - [ ] 16. Have GUI show allergy alerts when the customer selects an item E2 P2 T0 - Chris
  - [ ] 16. Make function that retrieves the allergy information for a menu item E1 P2 T0 - Chris
- [ ] 17. As a customer, I want to gain points for previous transactions, so I can use that information to get discounted items. - Akshay
  - [ ] 17. Have GUI give feedback to logged-in customers showing how many points they have earned for an order E1 P3 T0 - Akshay
  - [ ] 17. Have Customer GUI view that shows the rewards they can get with their point balance E2 P3 T0 - Akshay
  - [ ] 17. Make function to query what rewards are available with the point total of the given customer E1 P3 T0 - Akshay
- [ ] 19. As a user who is blind, I want to be able to use the website with the help of a screen reader, so that I know what is being displayed.
  - [ ] 19. Add screen reader functionality to all GUI items in sprint 2 E1 P1 T0 - Gabe
- [ ] 20. As a user who has poor vision, I want to be able to see and use the website without any additional help, so I can order correctly.
  - [ ] 20. Make sure that all views have high color contrast and easily legible font in sprint 2 E1 P1 T0 - Gabe
- [ ] 21. As a non-english speaking user, I want to be able to read the site in my native language so that I can order what I want without a substantial barrier. - Chris
  - [ ] 21. Add google translate functionality to all GUI items in sprint 2 E2 P1 T0 - Chris

### Chores (part of the backlog, but have no story points associated with them)
- [X] As a customer, I’d like to be able to see the weather E4 P2 T2 - Margo
- [ ] Start reconfiguring database for sale items E1 P2 T0 - Gabe
- [ ] Configure database for customer points/rewards E3 P2 T0 - Gabe
- [x] Clean up the UI for ordering  - Adam
  - [x] Add tabs to customer and employee ordering E3 P2 T2 - Adam
  - [x] Make menu board on theme E1 P2 T2 - Adam

# SPRINT ONE: 3/22/24 - 3/29/24

## Sprint Goal:
The main goal of the first sprint of this project is to create and deploy a working product that has the basic features of our previous POS system implemented. Our product will be hosted on a website and accessible by the necessary parties at any time after this sprint's deliverable date has passed. 

### MVP (Minimum Viable Product)
A product where a customer, manager, or employee can securely login and access the basic functions of our system in addition to a passive menu board view. This product will be hosted online and available to anyone who needs to access it from 3/29/24.

### Sprint 1 Backlog
**Legend: En = N hours estimated to complete, Sy = y status (0 not complete, 1 complete), Tn = N hours spent on the task**
- [x] Make Manager GUI login view that prompts a username and password and uses google oauth to make a secure login E3 S0 T3 - Adam
- [X] Modify schema to hold Google OAuth necessary information E2 S0 T3 - Adam
- [X] Implement login and logout routes and corresponding hooks E1 S0 T2 - Adam
- [X] Managers can view all employee accounts that have logged into the POS system E2 S0 T1 - Aaron
- [X] Managers can make accounts "employees" through a button click in the manager view E1  S0 T1 - Adam
- [x] Restrict access of manager page from employees E1 S0 T1 - Gabe
- [X] Make an interactive Employee GUI POS system that allows employees to create an order E1 S0 T3 - Akshay
- [X] Make functions that can create and view the orders in the database E1 S0 T1 - Akshay
- [X] Have GUI at POS give the option of selecting the number of items that will be added to an order when creating it E1 S0 T1 - Aaron
- [X] Make POS system have a clear order button that removes all of the items in the order list  E1 S0 T1 - Akshay
- [X] Have GUI at POS show the subtotal, tax, and final total for an order as the order is being built  E1 S0 T1 - Aaron
- [X] Make a function that quickly queries the stock information of the inventory items that make up a menu item and alerts if there is low / no stock  E1 S0 T1 - Margo
- [X] Have GUI call this function when an employee selects a menu item for an order E1 S0 T1 - Margo
- [X] Make Employee GUI login view using Google OAuth E2 S0 T1 - Akshay
- [X] Implement login and logout routes and corresponding hooks E3 S0 T1 - Akshay
- [x] Store session information in cookies when logged in E1 S0 T5 - Gabe
- [X] Save current user’s information during their session to be used in their tasks (making an order should assign the currently logged in employee to the order) E1 S0 T1 - Margo
- [X] Make function that queries all of a menu item’s relevant information E2 S0 T1 - Margo
- [X] Have GUI call and display the results of that function when a customer is selecting a given item E1 S0 T2 - Chris
- [x] Make sure GUI has obvious design that clearly shows what an item looks like, and shows the item’s information obviously when selected E2 S0 T7- Chris
- [X] Add screen reader functionality to all GUI items in sprint 1 E1 S0 T1 - Chris
- [ ] Make sure that all views have high color contrast and easily legible font in sprint 1 E1 S0 T0 - Gabe

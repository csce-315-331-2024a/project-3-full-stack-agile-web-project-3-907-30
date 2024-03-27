import csv
import random
from datetime import datetime, timedelta

random.seed(78)

# the choices
menuMap = {
    # main entrees
    0: ["Bacon Cheeseburger", 8.29, 200000],
    1: ["Classic Hamburger", 6.89, 200000],
    2: ["Double Stack Burger", 9.99, 100000],
    3: ["Gig Em Patty Melt", 7.59, 300000],
    4: ["Cheeseburger", 6.89, 90000],
    5: ["Black Bean Burger", 8.38, 30000],
    6: ["Revs Grilled Chicken Sandwich", 8.39, 30000],
    7: ["Spicy Chicken Sandwich", 8.39, 80000],
    8: ["Agie Chicken Club", 8.39, 70000],
    9: ["2 Corn Dog Value Meal", 4.99, 50000],
    10: ["2 Hot Dog Value Meal", 4.99, 50000],
    11: ["3 Tender Entree", 4.99, 90000],
    12: ["3 Chicken Tender Combo", 7.99, 150000],
    13: ["French Fries", 1.99, 200000],
    14: ["Aggie Shake (Oreo)", 4.49, 70000],
    15: ["Aggie Shake (Chocolate)", 4.49, 40000],
    16: ["Aggie Shake (Vanilla)", 4.49, 70000],
    17: ["Aggie Shake (Strawberry)", 4.49, 40000],
    18: ["Cookie Ice Cream Sundae", 4.69, 20000],
    19: ["Double Scoop Ice Cream", 3.29, 10000],
    20: ["Root Beer Float", 5.49, 10000],
    21: ["Aquafina Water 16OZ", 1.79, 100000],
    22: ["Aquafina Water 20 OZ", 2.19, 50000],
    23: ["20 oz Fountain Drink", 1.99, 200000],
    24: ["Chicken Wraps", 6.00, 70000],
    25: ["Fish Sandiwch", 7.99, 70000],
    26: ["Tuna Melt", 7.99, 20000]
}

# rev's hours
openTime = datetime.strptime('10:00AM', '%I:%M%p')
closeTime = datetime.strptime('9:00PM', '%I:%M%p')
timeDiff = closeTime - openTime

# range of sales days
firstDay = datetime(2022, 1, 1)
lastDay = datetime(2024, 3, 1)
# peak days are at the start of each semester
peakOne = datetime(2022, 1, 17)
peakTwo = datetime(2022, 8, 21)
peakThree = datetime(2023, 1, 17)
peakFour = datetime(2023, 8, 21)
peakDays = [peakOne, peakTwo, peakThree, peakFour] # make sure you're comparing datetimes to datetimes NOT STRINGS

# used to write the metadata for order
# orders : [ orderId, orderDate, orderTime, orderTotal, customerId, employeeId]
metaOrders = open("scripts/orders.sql","w",newline='')
metaOrders.write("INSERT INTO orders\n")
metaOrders.write("VALUES\n")

# used to make the order up as menu items
# orders_menu : [ orderId, menuId]
buildOrders = open("scripts/orders_menu.sql","w",newline='')
buildOrders.write("INSERT INTO orders_menu\n")
buildOrders.write("VALUES\n")

# # update the customers' number of orders and total spent
# customerData = open("scripts/update_customers.sql","w",newline='')
# # make a map to hold all customer data tuple(num_orders, total_spent)
# customerMap = {i:(0,0) for i in range(0,400)}

# initialize order ID
orderId = 0

# begin populating orders
currentDay = firstDay
lastOrderDay = lastDay - timedelta(days=1)

while currentDay < lastDay :
    # nuber of orders for a given day
    numOrders = random.randint(50,150)
    if currentDay in peakDays : numOrders = 200
    for i in range(0,numOrders) :
        # number of items on a given order
        numItems = random.randint(4,8)
        for g in range(0,numItems) : 
            # choose a menu item
            menuId = random.randint(0,26)
            if((currentDay == lastOrderDay) & (i == numOrders - 1) & (g == numItems -1)) : 
                buildOrders.write("("+str(orderId)+","+str(menuId)+");\n")

            else : buildOrders.write("("+str(orderId)+","+str(menuId)+"),\n")

        # choose a random employee
        employeeId = random.randint(0,13)

        # choose a random customer
        customerId = random.randint(0,398)

        orderTime = openTime + timedelta(minutes=random.randint(0, (closeTime - openTime).seconds//60))
        if((currentDay == lastOrderDay) & (i == numOrders - 1)) : metaOrders.write("("+str(orderId)+","+"'"+
        currentDay.strftime('%Y-%m-%d')+"'"+","+"'"+orderTime.strftime('%H:%M:%S')+"'"+","+"0"+","+
        str(customerId)+","+str(employeeId)+");\n")
            
        else : metaOrders.write("("+str(orderId)+","+"'"+
        currentDay.strftime('%Y-%m-%d')+"'"+","+"'"+orderTime.strftime('%H:%M:%S')+"'"+","+"0"+","+
        str(customerId)+","+str(employeeId)+"),\n")

        #increment order count
        orderId += 1

    # move to next day
    currentDay += timedelta(days=1)
import csv
import random
import string
from datetime import datetime, timedelta
import hashlib

# inventory : [ invId, inventoryName, inventoryPrice, fillLevel, currentLevel, timesRefilled, 
#             dateRefilled, hasDairy, hasNuts, hasEggs, isVegan, isHalal]
# OMIT inventoryMap i: row[4], it is randomized now
inventoryMap = {
    # utensils and miscellanious
    0: ["napkin", 0.01, 10000, 5000, 200, "2023-12-25", False, False, False, True, True],
    1: ["fork", 0.01, 1000, 2000, 90, "2023-12-12", False, False, False, True, True],
    2: ["knife", 0.01, 1000, 2000, 90, "2023-12-12", False, False, False, True, True],
    3: ["spoon", 0.01, 1000, 2000, 90, "2023-12-12", False, False, False, True, True],
    4: ["cup", 0.01, 2000, 3000, 110, "2023-12-17", False, False, False, True, True],
    5: ["straw", 0.01, 10000, 20000, 250, "2023-12-25", False, False, False, True, True],

    # condiments
    6: ["kethcup", 0.01, 30000, 60000, 90, "2023-12-15", False, False, False, True, True],
    7: ["mustard", 0.01, 30000, 60000, 90, "2023-12-15", False, False, False, True, True],
    8: ["salt", 0.01, 30000, 20000, 90, "2023-12-15", False, False, False, True, True],
    9: ["pepper", 0.01, 30000, 23000, 90, "2023-12-15", False, False, False, True, True],
    10: ["honey mustard", 0.01, 30000, 60000, 90, "2023-12-15", False, False, False, True, True],
    11: ["gig em sauce", 0.01, 30000, 60000, 90, "2023-12-15", False, False, False, True, True],

    # ingredients
    12: ["burger patty", 0.30, 8000, 10000, 90, "2023-12-15", False, False, False, False, True],
    13: ["bun", 0.10, 1000, 2000, 200, "2023-12-25", False, False, False, True, True],
    14: ["chicken tender", 0.25, 8000, 10000, 90, "2023-12-15", False, False, True, False, True],
    15: ["lettuce", 0.03, 20000, 30000, 90, "2023-12-15", False, False, False, True, True],
    16: ["tomato", 0.03, 20000, 30000, 90, "2023-12-15", False, False, False, True, True],
    17: ["onion", 0.03, 20000, 12000, 90, "2023-12-15", False, False, False, True, True],
    18: ["egg", 0.03, 20000, 30000, 90, "2023-12-15", False, False, True, False, True],
    19: ["shake base", 0.05, 5000, 2300, 90, "2023-12-15", True, False, False, False, True],
    20: ["ice cream", 0.05, 5000, 7000, 90, "2023-12-15", True, False, False, False, True],
    21: ["fries", 0.10, 15000, 17000, 90, "2023-12-15", False, False, False, True, True],
    22: ["black bean patty", 0.35, 2000, 3000, 90, "2023-12-15", False, False, False, True, True],
    23: ["nuts", 0.01, 2000, 3000, 90, "2023-12-15", False, True, False, True, True],
    24: ["corndog", 0.15, 3000, 4000, 90, "2023-12-15", False, False, True, False, False],
    25: ["hot dog", 0.15, 4000, 5000, 90, "2023-12-15", False, False, False, False, False],
    26: ["hot dog bun", 0.10, 300, 400, 200, "2023-12-25", False, False, False, True, True],
    27: ["texas toast", 0.15, 1000, 2000, 90, "2023-12-15", False, False, False, True, True],
    28: ["bacon", 0.08, 7000, 9000, 90, "2023-12-15", False, False, False, False, False],
    29: ["cheese", 0.05, 9000, 8000, 90, "2023-12-15", True, False, False, False, True],
    30: ["pickle", 0.05, 7000, 8000, 90, "2023-12-15", False, False, False, True, True],
    31: ["grilled chicken", 0.22, 6000, 7000, 90, "2023-12-15", False, False, False, False, True],

    #i forgot these, my bad
    32: ["buffalo sauce", 0.01, 30000, 60000, 90, "2023-12-15", True, False, False, False, True],
    33: ["ranch", 0.01, 30000, 60000, 90, "2023-12-15", True, False, False, False, True],
    34: ["avocado", 0.04, 3000, 4000, 90, "2023-12-25", False, False, False, True, True],
    35: ["20oz soda", 0.02, 10000, 9000, 90, "2023-12-15", False, False, False, True, True],
    36: ["cookie", 0.09, 2000, 1420, 90, "2023-12-20", True, False, True, False, True],
    37: ["16oz aquafina", 0.10, 2000, 3000, 90, "2023-12-15", False, False, False, True, True],
    38: ["20oz aquafina", 0.15, 2000, 3000, 90, "2023-12-15", False, False, False, True, True],
    39: ["tortilla", 0.10, 500, 1000, 200, "2023-12-15", False, False, False, True, True],
    40: ["tuna", 0.15, 1000, 2000, 90, "2023-12-15", False, False, False, False, True],
    41: ["fish patty", 0.20, 1000, 900, 90, "2023-12-15", False, False, True, False, True],
    42: ["tartar sauce", 0.01, 2000, 1000, 90, "2023-12-15", False, False, False, True, True]
}

# menu_item : [ menuId, menuName, menuPrice, timesOrdered]

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
    25: ["Fish Sandwich", 7.99, 70000],
    26: ["Tuna Melt", 7.99, 20000]
}

# employees : [ employeeId, employeeName, email, picutre isManager, isAdmin]

employeeMap = {
    0: ["Gabriel Floreslovo", "gabr13lenstation@tamu.edu", "", True, True],
    1: ["Akshay Belhe", "abelhe8900@tamu.edu", "",True, True],
    2: ["Aaron Mathews", "aaronmathews@tamu.edu", "", True, True],
    3: ["Chris Avila", "cristopavila@tamu.edu", "", True, True],
    4: ["Margo Gongora", "ngongora@tamu.edu", "", True, True],
    5: ["Adam Teo", "adamt321@tamu.edu", "", True, True],
    # 6: ["Tom Hanks", "a57d651965c260432aa0c7db2c3fc1721cff9597598a13320caf4b58d45ad7c5", False],
    # 7: ["Zinadine Zidane", "90a29fcd1a03013f9aecdefb692bd2d1018922ec056de895e8a826674b173276", False],
    # 8: ["Guy Fieri", "73475b8d813be68df73cc2fcc649b8c593876d994df9b6cc658a792471b16b12", False],
    # 9: ["Aubrey Graham", "2c0af00bdeda6f51ed0db8d045a8447fabad6823c896122457f8d019c60e0050", False],
    # 10: ["Jordan Carter", "58e63d5a26777ac925ba9ff33a4478a6b5b2aa7528b979eb5626cfc7def5b258", False],
    # 11: ["Jimmy Neutron", "8b5121371333198880722f04a35148877aa85eecd79f2b31cea63ad1ffda4058", False],
    # 12: ["Beyonce Knowles", "675dd504215d8485c2f8e81615810b484d6072c982f774a444378fb763f19e80", True],
    # 13: ["Guy Guy", "819cc9e3cc8f45f9815ee1ed6a81e66696b6aab4e16fd5d00ed2d9eba2270e09", False]
}

# inv_menu : [ menuID, inventoryItemID, amount]
inv_menuMap = {
    0: [ [0,13,12,29,28], [3,2,1,1,2]],
    1: [ [0,13,12,15,16,17,30], [3,2,1,1,2,1,3]],
    2: [ [0,27,12,11,17,29], [3,2,1,1,1,1]],
    3: [ [0,13,12,29,30], [3,2,2,2,2]],
    4: [ [0,13,22,16,16,17,30], [3,2,1,1,2,1,3]],
    5: [ [0,13,12,11,29,30], [3,2,1,1,1,2]],
    6: [ [0,13,31,15,17], [3,2,1,1,1]],
    7: [ [0,13,14,31,32,15], [3,2,2,1,1,1]],
    8: [ [0,13,14,29,28,34], [3,2,2,1,1,1]],
    9: [ [0,24,6,7], [3,2,1,1]],
    10: [ [0,26,25,6,7], [3,2,2,2,2]],
    11: [ [0,14,11], [3,3,1]],
    12: [ [0,14,21,11,4,35], [3,3,1,1,1,1]],
    13: [ [0,21], [3,1]],
    14: [ [0,4,3,19], [3,1,1,1]],
    15: [ [0,4,3,19], [3,1,1,1]],
    16: [ [0,4,3,19], [3,1,1,1]],
    17: [ [0,4,3,19], [3,1,1,1]],
    18: [ [0,36,20], [3,2,1]],
    19: [ [0,20], [3,2]],
    20: [ [0,4,20,35], [3,1,2,1]],
    21: [ [0,37], [3,1]],
    22: [ [0,38], [3,1]],
    23: [ [0,4,35], [3,1,1]],
    24: [ [0,39,14,15,16,33], [3,2,2,2,2,2]],
    25: [ [0,27,15,16,29], [3,2,1,1,1]],
    26: [ [0,13,41,29,42], [3,2,1,1,1]]
}

# customers : [ customerId, customerName, phoneNumber, numOrders, totalSpent]

# using to randomly generate customer base
firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Alexander', 'Isabella',
               'Daniel', 'Mia', 'Joseph', 'Charlotte', 'David', 'Abigail', 'Benjamin', 'Emily', 'Christopher', 'Harper']

lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
              'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson']

# for debugging
random.seed(78)

# populate menu items table
with open("scripts/menu_items.sql", "w", newline = '') as writeFile :
    # write header 
    writeFile.write("INSERT INTO menu_items\n")
    writeFile.write("VALUES\n")

    # write each entry:
    for i, (ID, row) in enumerate(menuMap.items()):
        if(i < len(menuMap) - 1) : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+str(row[1])+","+str(row[2])+"),\n")
        else : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+str(row[1])+","+str(row[2])+");\n")

# populate menu_pairs table
with open("scripts/menu_pairs.sql", "w", newline = '') as writeFile :
    # write header
    writeFile.write("INSERT INTO menu_pairs\n")
    writeFile.write("VALUES\n")
    
    # list menuMap as its keys (menu_ids)
    menuIds = list(menuMap.keys())
    menuNames = [row[0] for row in menuMap.values()]
    # write each entry:
    pairId = 0
    for i in range(len(menuIds)):
        for j in range(i+1, len(menuIds)):
            if(i < len(menuIds) - 2) : writeFile.write("("+str(pairId)+","+str(menuIds[i])+","+str(menuIds[j])+","+"'"+menuNames[i]+"'"+","+"'"+menuNames[j]+"'"+"),\n")
            else : writeFile.write("("+str(pairId)+","+str(menuIds[i])+","+str(menuIds[j])+","+"'"+menuNames[i]+"'"+","+"'"+menuNames[j]+"'"+");\n")
            pairId = pairId + 1

# populate employees table
with open("scripts/employees.sql", "w", newline ='') as writeFile :
    writeFile.write("INSERT INTO employees\n")
    writeFile.write("VALUES\n")

    for i, (ID, row) in enumerate(employeeMap.items()):
        if(i < len(employeeMap) - 1) : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+"'"+row[1]+"'"+","+"'"+row[2]+"'"+","+"'"+str(row[3])+"'"+","+"'"+str(row[4])+"'"+"),\n")
        else : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+"'"+row[1]+"'"+","+"'"+row[2]+"'"+","+"'"+str(row[3])+"'"+","+"'"+str(row[4])+"'"+");\n")

# populate inventory table
with open("scripts/inventory.sql", "w", newline = '') as writeFile :
    writeFile.write("INSERT INTO inventory\n")
    writeFile.write("VALUES\n")

    for i, (ID, row) in enumerate(inventoryMap.items()):
        if(row[2] - row[1] > 10000) : timesFilled = random.randint(1,100)
        else : timesFilled = random.randint(100,200)

        if(i < len(inventoryMap) - 1) : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+str(row[1])+
            ","+str(row[2])+","+str(row[3])+","+str(timesFilled)+","+"'"+row[5]+"'"+","+"'"+str(row[6])+"'"+","+"'"+str(row[7])+
            "'"+","+"'"+str(row[8])+"'"+","+"'"+str(row[9])+"'"+","+"'"+str(row[10])+"'"+"),\n")
        else : writeFile.write("("+str(ID)+","+"'"+row[0]+"'"+","+str(row[1])+
            ","+str(row[2])+","+str(row[3])+","+str(timesFilled)+","+"'"+row[5]+"'"+","+"'"+str(row[6])+"'"+","+"'"+str(row[7])+
            "'"+","+"'"+str(row[8])+"'"+","+"'"+str(row[9])+"'"+","+"'"+str(row[10])+"'"+");\n")


# populate customers table
with open("scripts/customers.sql", "w", newline='')as writeFile :
    writeFile.write("INSERT INTO customers\n")
    writeFile.write("VALUES\n")

    for i in range(0,400):
        # make a name
        customerName = random.choice(firstNames) + " " + random.choice(lastNames)
        phoneNumber = str(random.randint(111,999)) + str(random.randint(111,999)) + str(random.randint(1111,9999))
        phoneBytes = phoneNumber.encode('utf-8') #get string in bits
        sha256 = hashlib.sha256() 
        sha256.update(phoneBytes)
        phoneHash = sha256.hexdigest()
        if(i < 399) : writeFile.write("("+str(i)+","+"'"+customerName+"'"+","+"'"+phoneHash+"'"+"),\n")
        else : writeFile.write("("+str(i)+","+"'"+customerName+"'"+","+"'"+phoneHash+"'"+");\n")

# populate inv_menu_items join table
with open("scripts/inv_menu.sql", "w", newline='')as writeFile :
    writeFile.write("INSERT INTO inv_menu\n")
    writeFile.write("VALUES\n")

    for i, (ID, row) in enumerate(inv_menuMap.items()) :
        invItems = row[0]
        invAmount = row[1]
        if(i < len(inv_menuMap) - 1) : 
            for g in range(0,len(invItems)) :
                writeFile.write("("+str(ID)+","+str(invItems[g])+","+str(invAmount[g])+"),\n")
        else : 
            for g in range(0,len(invItems)) :
                if(g == len(invItems) - 1) : writeFile.write("("+str(ID)+","+str(invItems[g])+","+str(invAmount[g])+");\n")
                else : writeFile.write("("+str(ID)+","+str(invItems[g])+","+str(invAmount[g])+"),\n")


# order table needs a seperate sql file to use the already populated tables
import random
from datetime import datetime, timedelta
import hashlib

employeeMap = {
    0: ["LeBron James", "iamthegoat999", True],
    1: ["Lionel Messi", "lapulga777", True],
    2: ["Michael Jordan", "jorgambler23", False],
    3: ["Jon Doe", "regularguy321", False],
    4: ["Jane Doe", "normalestgal321", False],
    5: ["Zendaya Coleman", "tallperson99", True],
    6: ["Tom Hanks", "broimwoody89", False],
    7: ["Zinadine Zidane", "bigbaldhead900", False],
    8: ["Guy Fieri", "icancookgood100", False],
    9: ["Aubrey Graham", "anitamaxwynn333", False],
    10: ["Jordan Carter", "vampanthem555", False],
    11: ["Jimmy Neutron", "supersmart111", False],
    12: ["Beyonce Knowles", "queenb123", True],
    13: ["Guy Guy", "imthatguyguy222", False]
}


# populate employees table
with open("scripts/hashtest.sql", "w", newline ='') as writeFile :
    for i, (ID, row) in enumerate(employeeMap.items()):
        hashedPass = hashlib.sha256()
        hashedPass.update(row[1].encode('utf-8'))
        print(hashedPass.hexdigest())
        queryString = "UPDATE employees SET emp_password = '{}' WHERE emp_id = {};\n".format(hashedPass.hexdigest(),i)
        writeFile.write(queryString)


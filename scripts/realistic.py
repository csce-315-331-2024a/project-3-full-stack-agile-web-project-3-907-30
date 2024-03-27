from datetime import date, time, timedelta, datetime

def parse_week_range(week_number: int): 
    start_date = date.fromisoformat("2023-01-01")
    end_date = start_date + timedelta(days=6)

    start_date += timedelta(weeks=week_number) 

    # Include the 31st in the last week
    if (week_number == 51):
        end_date = date.fromisoformat("2023-12-31")
    else:
        end_date = end_date + timedelta(weeks=week_number)

    return (start_date, end_date)


def parse_time_range(time_number: int):

    # Decision tree for setting start time and end time
    if (time_number < 11):
        start_time = f"{time_number}:00 AM"
        end_time = f"{time_number + 1}:00 AM"
    elif (time_number == 11):
        start_time = "11:00 AM"
        end_time = "12:00 PM"
    else:
        start_time = f"{time_number-12 if time_number != 12 else 12}:00 PM"
        end_time = f"{time_number-11}:00 PM"

    return start_time, end_time

def export_to_sql_52_weeks() -> None: 
    with open(f"weeks.sql",mode="w") as sql_parser:
        # Go through range of 52 weeks and make a select query for each week
        for num in range(0, 52):
            start_date, end_date = parse_week_range(num)
            sql_parser.write(f"SELECT COUNT(*) as WEEK_{num+1}_ORDERS FROM orders WHERE order_date >= '{start_date}' AND order_date <= '{end_date}';\n")
    # Closes automatically


def export_to_sql_by_hour() -> None:
    with open(f"hours.sql", mode="w") as sql_parser:
        # Query for AM times
        for num in range(10, 21):
            start_time, end_time = parse_time_range(num)
            sql_parser.write(f"""
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '{start_time}' <= order_time AND order_time < '{end_time}') 
    as "{start_time.replace(" ", "_")}",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '{start_time}' <= order_time AND order_time < '{end_time}')
    as price; 
            """)


    # Closes automatically


if __name__ == '__main__':
    # Parse and print
    export_to_sql_52_weeks()
    export_to_sql_by_hour()

    
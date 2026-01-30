from db import create_table
from crud import create_student, read_students, update_student, delete_student

create_table()

create_student(1, "Raghunath", "ECE", 4)
print(read_students())

update_student(1, "CSE")
print(read_students())

delete_student(1)
print(read_students())

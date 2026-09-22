# from fastapi import FastAPI

# app = FastAPI()


# @app.get("/")
# def home():
#     return {"message": "Student API is working"}
# ---------------------------------------------------------
# crude operation :
# ---------------------------------------------------------
# GET :
# ---------------------------

# from fastapi import FastAPI

# app = FastAPI()

# students = [
#     {"id": 1, "name": "jyoti", "course": "python"},
#     {"id": 2, "name": "mikuu", "course": "React"},
# ]


# @app.get("/")
# def home():
#     return {"message": "Student API is working!"}


# @app.get("/students")
# def get_students():
#     return students


# @app.get("/students/{student_id}")
# def get_student(student_id: int):

#     for student in students:
#         if student["id"] == student_id:
#             return student

#     return {"message": "Student not found"}

# ----------------------------
# POST
# ----------------------------
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
students = []


class Student(BaseModel):
    id: int
    name: str
    course: str


@app.post("/students")
def add_student(student: Student):

    students.append(student.model_dump())

    return {"message": "Student added successfully", "student": student}

# ------------------------------------------------------------------------------
# PUT API :
# ------------------------------------------------------------------------------


@app.put("/students/{student_id}")
def update_student(student_id: int, student: Student):

    for i in range(len(students)):

        if students[i]["id"] == student_id:

            students[i] = student.model_dump()

            return {
                "message": "Student updated successfully",
                "student": students[i],
            }

    return {"message": "Student not found"}

# -------------------------------------------------
# DELET :
# -------------------------------------------------
@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    for i in range(len(students)):

        if students[i]["id"] == student_id:

            delete_student = students.pop(i)

            return {
                "message": "student deleted successfully",
                "student": delete_student
            }

    return {"message": "Student not found"}
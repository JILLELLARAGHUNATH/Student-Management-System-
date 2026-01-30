from db import get_connection


def create_student(student_id, name, department, year):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO student VALUES (?, ?, ?, ?)",
        (student_id, name, department, year)
    )
    conn.commit()
    conn.close()


def read_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student")
    records = cursor.fetchall()
    conn.close()
    students = []
    for record in records:
        students.append({
            'id': record[0],
            'name': record[1],
            'department': record[2],
            'year': record[3]
        })
    return students


def update_student(student_id, name=None, department=None, year=None):
    conn = get_connection()
    cursor = conn.cursor()
    updates = []
    params = []
    if name is not None:
        updates.append("name=?")
        params.append(name)
    if department is not None:
        updates.append("department=?")
        params.append(department)
    if year is not None:
        updates.append("year=?")
        params.append(year)
    if updates:
        query = f"UPDATE student SET {', '.join(updates)} WHERE id=?"
        params.append(student_id)
        cursor.execute(query, params)
        conn.commit()
    conn.close()


def search_students(query):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM student
        WHERE id LIKE ? OR name LIKE ? OR department LIKE ? OR year LIKE ?
    """, (f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'))
    records = cursor.fetchall()
    conn.close()
    students = []
    for record in records:
        students.append({
            'id': record[0],
            'name': record[1],
            'department': record[2],
            'year': record[3]
        })
    return students


def delete_student(student_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM student WHERE id=?",
        (student_id,)
    )
    conn.commit()
    conn.close()

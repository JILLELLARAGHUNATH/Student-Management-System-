from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import DatabaseManager

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this in production!

# In-memory user store for demo (replace with DB in production)
users = {
    'admin': generate_password_hash('admin123')
}

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    user_hash = users.get(username)
    if user_hash and check_password_hash(user_hash, password):
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token})
    return jsonify({'error': 'Invalid credentials'}), 401

# Decorator for protected routes
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[-1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

db = DatabaseManager()

@app.route('/students', methods=['GET'])
@token_required
def get_students(current_user):
    query = request.args.get('q')
    try:
        if query:
            students = db.search_students(query)
        else:
            students = db.get_all_students()
        students_list = [
            {
                'id': s[0],
                'roll_number': s[1],
                'name': s[2],
                'email': s[3],
                'phone': s[4],
                'department': s[5],
                'year': s[6],
                'cgpa': s[7],
                'address': s[8],
                'status': s[9],
                'enrollment_date': s[10],
                'parent_name': s[11],
                'parent_contact': s[12],
                'parent_email': s[13],
                'dob': s[14],
                'gender': s[15],
                'emergency_contact': s[16],
                'admission_date': s[17],
                'notes': s[18]
            } for s in students
        ]
        return jsonify({'students': students_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/students', methods=['POST'])
@token_required
def create_student(current_user):
    data = request.get_json()
    try:
        db.add_student(data)
        return jsonify({'message': 'Student added successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/students/<int:student_id>', methods=['GET'])
@token_required
def get_student(current_user, student_id):
    try:
        student = db.get_student(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        student_dict = {
            'id': student[0],
            'roll_number': student[1],
            'name': student[2],
            'email': student[3],
            'phone': student[4],
            'department': student[5],
            'year': student[6],
            'cgpa': student[7],
            'address': student[8],
            'status': student[9],
            'enrollment_date': student[10],
            'parent_name': student[11],
            'parent_contact': student[12],
            'parent_email': student[13],
            'dob': student[14],
            'gender': student[15],
            'emergency_contact': student[16],
            'admission_date': student[17],
            'notes': student[18]
        }
        return jsonify({'student': student_dict})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/students/<int:student_id>', methods=['PUT'])
@token_required
def update_student(current_user, student_id):
    data = request.get_json()
    try:
        db.update_student(student_id, data)
        return jsonify({'message': 'Student updated successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/students/<int:student_id>', methods=['DELETE'])
@token_required
def delete_student(current_user, student_id):
    try:
        db.delete_student(student_id)
        return jsonify({'message': 'Student deleted successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
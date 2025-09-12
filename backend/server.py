from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
import sqlite3
import os
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
bcrypt = Bcrypt(app)

# --- Configuration ---
app.config['SECRET_KEY'] = 'your_super_secret_key' # In a real app, use a secure, environment-specific key
db_folder = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(db_folder, 'viccalary.db')

# --- Database Helper ---
def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# --- Routes ---

@app.route('/')
def hello_world():
    return 'Hello, VicCalary Backend!'

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    c = conn.cursor()

    # Check if user already exists
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    if user:
        conn.close()
        return jsonify({'error': 'User with this email already exists'}), 409

    # Hash the password
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert new user
    try:
        c.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (email, password_hash))
        user_id = c.lastrowid

        # Create a corresponding profile
        c.execute('INSERT INTO profiles (user_id, name) VALUES (?, ?)', (user_id, '')) # Start with an empty name

        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'An error occurred during user creation.'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    c = conn.cursor()

    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()

    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create JWT token
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token})

@app.route('/auth/logout', methods=['POST'])
def logout():
    # In a stateless JWT system, the client is responsible for deleting the token.
    # The backend can provide a simple confirmation.
    return jsonify({'message': 'Logout successful'}), 200

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'error': 'Token is invalid!'}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated

@app.route('/user/profile', methods=['GET', 'POST'])
@token_required
def user_profile(current_user_id):
    conn = get_db_connection()
    c = conn.cursor()

    if request.method == 'POST':
        profile_data = request.get_json()
        # Ensure dietary_preferences is a string
        if isinstance(profile_data.get('dietaryPreferences'), list):
            profile_data['dietaryPreferences'] = ",".join(profile_data['dietaryPreferences'])

        c.execute('''
            UPDATE profiles
            SET name = ?, age = ?, weight = ?, weight_unit = ?, height = ?,
                height_unit = ?, gender = ?, goal = ?, activity_level = ?,
                dietary_preferences = ?, allergies = ?, sleep_hours = ?,
                smoking = ?, alcohol = ?, budget = ?, updated_at = ?
            WHERE user_id = ?
        ''', (
            profile_data.get('name'), profile_data.get('age'), profile_data.get('weight'),
            profile_data.get('weightUnit'), profile_data.get('height'), profile_data.get('heightUnit'),
            profile_data.get('gender'), profile_data.get('goal'), profile_data.get('activityLevel'),
            profile_data.get('dietaryPreferences'), profile_data.get('allergies'),
            profile_data.get('sleepHours'), profile_data.get('smoking'), profile_data.get('alcohol'),
            profile_data.get('budget'), datetime.utcnow(), current_user_id
        ))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Profile updated successfully'}), 200

    # GET request
    c.execute('SELECT * FROM profiles WHERE user_id = ?', (current_user_id,))
    profile = c.fetchone()
    conn.close()
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404

    return jsonify(dict(profile))

if __name__ == '__main__':
    app.run(debug=True, port=5000)

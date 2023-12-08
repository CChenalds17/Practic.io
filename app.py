from flask import Flask, redirect, render_template, request, session
import sqlite3
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import datetime

from helpers import login_required, hhmm

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Check that db tables all exist
con = sqlite3.connect("practicio.db")
cur = con.cursor()

# Check if users table exists #
# Query db for users table
users_res = cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
users_table_rows = users_res.fetchall()
# If users table does not exist
if len(users_table_rows) != 1:
    # Create users table
    cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, username TEXT NOT NULL, hash TEXT NOT NULL)")
    con.commit()

# Check if goals table exists #
# Query db for goals table
goals_res = cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='goals'")
goals_table_rows = goals_res.fetchall()
# If goals table does not exist
if len(goals_table_rows) != 1:
    # Create goals table
    cur.execute("CREATE TABLE goals (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, start_timestamp TEXT NOT NULL, goal_duration INTEGER NOT NULL, goals TEXT NOT NULL)")
    con.commit()

# Check if summaries table exists #
# Query db for summaries table
summaries_res = cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='summaries'")
summaries_table_rows = summaries_res.fetchall()
# If summaries table does not exist
if len(summaries_table_rows) != 1:
    # Create summaries table
    cur.execute("CREATE TABLE summaries (goals_id INTEGER UNIQUE NOT NULL, title TEXT NOT NULL, end_timestamp TEXT NOT NULL, session_duration INTEGER NOT NULL, achieved TEXT NOT NULL)")
    con.commit()
con.close()


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Redirect to /practice"""
    return redirect("/practice")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget user_id
    session.clear()

    # Reached via POST
    if request.method == "POST":
        username = request.form.get("username")

        # Ensure username and password were submitted
        if not username:
            return render_template("error.html", error_msg="403: Must provide username")
        elif not request.form.get("password"):
            return render_template("error.html", error_msg="403: Must provide password")
        
        # Query database for username and password hash
        con = sqlite3.connect("practicio.db")
        cur = con.cursor()
        res = cur.execute("SELECT id, hash FROM users WHERE username = ?", (username,))
        rows = res.fetchall()
        con.close()
        
        # If username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0][1], request.form.get("password")):
            return render_template("error.html", error_msg="Invalid username and/or password")
        
        # Remember which user has logged in
        session["user_id"] = rows[0][0]

        # Redirect user to home page
        return redirect("/")
    
    # Reached via GET
    else:
        return render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    # Forget any user_id
    session.clear()

    # Reached via POST
    if request.method == "POST":
        username = request.form.get("username")
        
        # Ensure username was submitted
        if not username:
            return render_template("error.html", error_msg="403: Must provide username")
        elif not request.form.get("password") or not request.form.get("confirmation"):
            return render_template("error.html", error_msg="403: Must provide password and confirmation")
        
        pw_hash = generate_password_hash(request.form.get("password"))

        # Query database for username
        con = sqlite3.connect("practicio.db")
        cur = con.cursor()
        res = cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        rows = res.fetchall()
        con.close()

        # Ensure username doesn't already exist
        if len(rows) > 0:
            return render_template("error.html", error_msg="400: Username already exists")

        # Ensure password and confirmation match
        if request.form.get("password") != request.form.get("confirmation"):
            return render_template("error.html", error_msg="400: Passwords do not match")

        # Insert new user into users table
        con = sqlite3.connect("practicio.db")
        cur = con.cursor()
        res = cur.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (username, pw_hash))
        con.commit()
        res = cur.execute("SELECT id FROM users WHERE username = ?", (username,))
        user_id = res.fetchone()[0]
        print(user_id)
        con.close()

        # Remember which user has logged in
        session["user_id"] = user_id

        # Redirect user to home page
        return redirect("/")
    
    # Reached via GET
    else:
        return render_template("register.html")


@app.route("/practice", methods=["GET", "POST"])
@login_required
def practice():
    # Reached via POST
    if request.method == "POST":
        hours = request.form.get("hours")
        mins = request.form.get("minutes")
        goals = request.form.get("goals")
        if not hours or not mins or not goals:
            return render_template("error.html", error_msg="403: All fields are required")
        hours = int(hours)
        mins = int(mins)
        # Validate duration
        if hours < 0 or mins < 0 or hours > 24 or mins > 59 or hours == 0 and mins == 0:
            return render_template("error.html", error_msg="403: Invalid duration")
        
        # Insert goals into db
        goal_duration = hours * 60 + mins

        # Insert new data into goals table
        con = sqlite3.connect("practicio.db")
        cur = con.cursor()
        res = cur.execute("INSERT INTO goals (user_id, start_timestamp, goal_duration, goals) VALUES (?, ?, ?, ?)", (session["user_id"], datetime.datetime.now().replace(microsecond=0), goal_duration, goals))
        con.commit()
        res = cur.execute("SELECT id, start_timestamp FROM goals WHERE user_id = ? ORDER BY id DESC LIMIT 1", (session["user_id"],))
        goals_id, start_timestamp = res.fetchone()
        con.close()

        return render_template("practice.html", title=start_timestamp[:-3], goals_id=goals_id)

    # Reached via GET
    else:
        return render_template("practice-form.html")


@app.route("/history", methods=["GET", "POST"])
@login_required
def history():
    # Reached via POST
    if request.method == "POST":
        goals_id = request.form.get("goals-id")
        end_timestamp = request.form.get("end-timestamp")
        session_title = request.form.get("session-title")
        session_duration = request.form.get("session-duration")
        achieved = request.form.get("achieved")

        # Insert summary into db

        # Insert new data into summaries table
        con = sqlite3.connect("practicio.db")
        cur = con.cursor()
        res = cur.execute("INSERT INTO summaries (goals_id, title, end_timestamp, session_duration, achieved) VALUES (?, ?, ?, ?, ?)", (goals_id, session_title, end_timestamp, session_duration, achieved))
        con.commit()
        con.close()

        return redirect("/history")
    
    # Reached via GET
    else:

        # Query database for total duration and count
        con = sqlite3.connect("practicio.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        # goals_id | title | end_timestamp | session_duration | achieved | id | user_id | start_timestamp | goal_duration | goals
        cur.execute("SELECT * FROM summaries JOIN goals ON summaries.goals_id = goals.id WHERE user_id = ?", (session["user_id"],))
        rows = cur.fetchall()
        con.close()
        total_mins, total_count = 0, 0
        for row in rows:
            total_mins += row["session_duration"]
            total_count += 1
        rows = [dict(row) for row in rows]

        avg_mins = int(total_mins / total_count) if total_count != 0 else 0
        total_time = hhmm(total_mins)
        avg_time = hhmm(avg_mins)

        return render_template("history.html", total_time=total_time, avg_time=avg_time, rows=rows)


@app.route("/profile")
@login_required
def profile():
    """Display profile information"""
    # Query database for username
    con = sqlite3.connect("practicio.db")
    cur = con.cursor()
    res = cur.execute("SELECT username FROM users WHERE id = ?", (session["user_id"],))
    rows = res.fetchone()
    con.close()
    
    return render_template("profile.html", username=rows[0])
## Overview
I chose to make my project as a Flask app using a mix of Python, HTML, CSS, and Javascript. It has flask app file `app.py`, and central layout file `layout.html`. Additionally, it uses a SQL database `practicio.db`, helper functions in `helpers.py`, and CSS in `styles.css`. 

## App.py

### practicio.db
I used the sqlite3 library to work with a SQL database for the back-end. I have 3 tables: users, goals, and summaries, each of which stores necessary information corresponding to each step. Of note, I keep track of practice sessions by matching up goals_id (between the goals and summaries table, in case the user abandons a practice session), and matching up user_id (between the goals and users table to keep history specific to user). 

At the beginning of this program, I made sure to check that the necessary tables exist in `practicio.db`; if they don't exist, the program creates them in the database. 

### Log In, Log Out, and Register
I implemented logging in, logging out, and registering for an account using the `flask_session` library, similar to CS50 Finance. There is both server-side and client-side validation that all fields are entered and matching as needed, and I used the `werkzeug.security` library to hash user passwords (so I don't store them as plaintext). 

### /practice
When visiting the `practice` page, users are first prompted with a form asking them to submit their goals (via GET). Once submitted (via POST), they are taken to a page with practice tools (random scale generator and metronome). 

### /history
Practice summaries are submitted via the action `/history`. It either stores summary information in the database (via POST) or fetches information from practicio.db about the user's past practice history and displays them (via GET). 

### /profile
Displays the user's username and the 'Log Out' button.

## practice.html, practice.js
To make sure the metronome didn't lag every once in a while, I scheduled each click in advance, and I made the sound something that sounded similar to other metronomes and isn't super annoying by using an oscillator and adjusting the attack and decay.

## Additional Notes:
I realize I was very ambitious with goals and possible features in my Final Project Proposal -- I just wanted to say that I spent a combined total of 48+ hours on this (including CS50 hackathon and multiple other 12-hour days), and ran into many small but time-consuming bugs, such as getting flask_session to work in the first place, using a Jinja variable in my JS code, making a scheduler so my metronome wouldn't experience occasional lag, etc. I've had a blast working on this project (despite/as evidenced by how much time I've put into it)! If you compare it to my initial goals, it may not seem like I went above and beyond, but I just wanted to make clear those represented very ambitious best-case-scenario stretch goals :)
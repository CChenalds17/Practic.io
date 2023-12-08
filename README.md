# Practic.io ![Logo](static/logo.png)
Practic.io revolutionizes music practice by consolidating essential tools like a random scale generator and metronome into a single, user-friendly platform. This innovative app goes beyond conventional practice utilities, doubling as a practice journal where musicians can document progress and set goals. Practic.io is the ultimate companion for efficient and purposeful practice sessions, empowering musicians to elevate their skills with ease.

[Demo Link (YouTube)](https://youtu.be/3alPmr_yjLw)

## Setup
### Installation
1. [Install Python](https://www.python.org/downloads/) (tested on Python 3.11.5)
2. Open your command line (Windows) or terminal (Mac)
3. Clone the repository (skip this step if you already have the files)
```
$ git clone https://github.com/CChenalds17/Practicio
```
4. Install the requirements
```
$ pip install -r Practicio/requirements.txt
```
### Deployment
1. Move into the Practicio directory

Windows:
```
$ dir Practicio/
```
Mac: 
```
$ cd Practicio/
```
2. Run the flask app
```
$ flask run
```
3. Open the link that is outputted in your terminal/command line via CTRL + Click (Windows), or ⌘ + Click (Mac)

Ex:
```
$  * Serving Flask app 'app.py'
$  * Debug mode: off
$ WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
$  * Running on http://127.0.0.1:5000
$ Press CTRL+C to quit
```
4. Practice away!

5. To close the app, go back to your terminal/command line and press CTRL+C (⌃ + C on Mac)

## Usage
### Register
1. Register for an account by clicking the 'Register' button on the top right
### Practice
1. Enter your desired practice duration (in hh:mm)
2. Enter your practice goals
3. Hit the 'Start Practicing!' button
4. Utilize one of our (ever-growing number of) practice tools!

    * Random Scale Generator: 
        
        *i.* Select whether you want major scales, minor scales, or both

        *ii.* Select whether or not you want to group enharmonic keys

        *iii.* Generate a scale!
    
    * Metronome:

        *i.* Use the slider to select your BPM (for finer control, use your arrow keys after clicking into the slider)

        *ii.* Play/pause as desired

5. Observe how long you have been practicing at the bottom left
6. Once finished, click the 'End Session' button
7. Optionally change the title for this session (default is the starting timestamp)
8. Enter what you achieved this practice session
9. If desired, go back to practicing without a hitch
10. Once done, hit 'Finalize'
### History
1. View your practice history and metrics! (starting with your most recent practice session)

    * Total time practiced
    * Avarege practice time
    * Select a specific practice session for more details (goals, achieved, etc.)
### Log Out
1. If desired, navigate to the profile tab and click the 'Log Out' button
    

## Planned Improvements
- Add recording feature
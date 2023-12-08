from flask import session, redirect
from functools import wraps

def login_required(f):
    """
    Decorates routes to require login.
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

def hhmm(mins):
    """Format duration as hh:mm"""
    out_hrs = mins // 60
    out_mins = mins - out_hrs * 60

    formatted_hrs = str(out_hrs)
    formatted_mins = str(out_mins)

    if out_hrs < 10:
        formatted_hrs = "0" + formatted_hrs
    if out_mins < 10:
        formatted_mins = "0" + formatted_mins


    return f"{formatted_hrs}:{formatted_mins}"

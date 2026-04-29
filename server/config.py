# config.py
import os
from datetime import timedelta

class Config:
    # SQLite configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'eventra.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Other configuration settings (keep your existing ones)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Remove any MySQL-specific configs
    # JWT settings
    JWT_EXPIRATION_HOURS = 24
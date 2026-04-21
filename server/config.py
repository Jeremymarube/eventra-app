import pymysql
pymysql.install_as_MySQLdb()

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://user:password@localhost/eventra_db"
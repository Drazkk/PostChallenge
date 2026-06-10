from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:brian123@localhost:5432/posts_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text, nullable=False)


@app.route("/")
def home():
    try:
        db.session.execute(db.text("SELECT 1"))
        return "Conexion a PostgreSQL OK"
    except Exception as e:
        return f"Error: {str(e)}"


@app.route("/posts", methods=["POST"])
def create_post():

    data = request.get_json()

    post = Post(
        name=data["name"],
        description=data["description"]
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({
        "id": post.id,
        "name": post.name,
        "description": post.description
    }), 201
@app.route("/posts", methods=["GET"])
def get_posts():

    posts = Post.query.all()

    return jsonify([
        {
            "id": post.id,
            "name": post.name,
            "description": post.description
        }
        for post in posts
    ])
#buscar y eliminar posts por id 
@app.route("/posts/<int:id>", methods=["DELETE"])
def delete_post(id):

    post = Post.query.get_or_404(id)
#Guardado antes de borrado
    deleted_post = {
        "id": post.id,
        "name": post.name,
        "description": post.description
    }
##eliminacion
    db.session.delete(post)
    db.session.commit()

    return jsonify(deleted_post)


if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)
    
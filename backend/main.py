from app.app import app


def load_ai_modules():
    from app.ai.installation import install
    from app.ai.model import load_models
    install()
    load_models()


if __name__ == "__main__":
    load_ai_modules()
    app.run(debug=True)

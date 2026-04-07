import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from dotenv import load_dotenv

load_dotenv()

# Make sure your Cloudinary credentials are set in settings.py
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

def upload_image(file, folder="Kryptoverse", public_id=None):
    try:
        upload_result = cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            resource_type="image"
        )
        return upload_result.get("secure_url")
    except Exception as e:
        raise Exception(f"Image upload failed: {str(e)}")

def upload_video(file, folder="videos", public_id=None):
    try:
        upload_result = cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            resource_type="video"
        )
        return upload_result.get("secure_url")
    except Exception as e:
        raise Exception(f"Video upload failed: {str(e)}")

def delete_file(public_id, resource_type="image"):
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return True
    except Exception as e:
        raise Exception(f"File deletion failed: {str(e)}")

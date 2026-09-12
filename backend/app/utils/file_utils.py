import os
import uuid


ALLOWED_IMAGE_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp",
}


def get_file_extension(filename):
    if "." not in filename:
        return None

    return filename.rsplit(".", 1)[1].lower()


def is_allowed_image(filename):
    extension = get_file_extension(filename)

    return extension in ALLOWED_IMAGE_EXTENSIONS


def generate_image_filename(original_filename):
    extension = get_file_extension(original_filename)

    unique_name = uuid.uuid4().hex

    return f"{unique_name}.{extension}"


def delete_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)
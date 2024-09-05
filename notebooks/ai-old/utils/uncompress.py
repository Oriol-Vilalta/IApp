import tarfile
import zipfile
import os


# This file uses the tarfile and the zipfile libraries to uncompress
# files independently of their extension.


# Definition of the extension
TAR_EXTENSIONS = ('.tar', '.tgz', '.tar.gz')
ZIP_EXTENSIONS = ('zip')


# Uncompress a tar type file
def uncompress_tar(file_path, extract_path):
    with tarfile.open(file_path, 'r:*') as tar:
        tar.extractall(path=extract_path)


# Uncompress a zip file.
def uncompress_zip(file_path, extract_path):
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

# Uncompress a file independently of the extension
def uncompress_file(file_path, extract_path):
    if not os.path.exists(extract_path):
        os.makedirs(extract_path)

    if file_path.endswith(TAR_EXTENSIONS):
        uncompress_tar(file_path, extract_path)
    elif file_path.endswith(ZIP_EXTENSIONS):
        uncompress_zip(file_path, extract_path)
    else:
        print("Unsupported file format")



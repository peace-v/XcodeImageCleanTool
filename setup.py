from setuptools import setup, find_packages

setup(
    name="XcodeImageCleanTool",
    version="1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Imagehash>=3.4',
        'Flask>=0.12.1',
        'Pillow>=4.1.0',
    ]
)

# Use NVIDIA's official CUDA runtime base image
FROM nvidia/cuda:11.8.0-runtime-ubuntu20.04

# Set working directory inside the container
WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    git  \
    libgl1-mesa-glx  \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and setuptools
RUN python3 -m pip install --upgrade pip setuptools

# Copy requirements and install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the app into the container
COPY . .

# Expose port 8000 for the app
EXPOSE 8000

# Command to run the app (assuming you're using Uvicorn with FastAPI or similar)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

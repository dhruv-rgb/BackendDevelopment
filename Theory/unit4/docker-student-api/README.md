# Docker student API

Build with `docker build -t student-api .` and run with `docker run --rm -p 8000:8000 student-api`. The service provides `/health` and `/students/{student_id}`. The container installs pinned major-version ranges and runs as a non-root user.

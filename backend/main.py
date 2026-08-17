from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import ipaddress
import socket
import re

app = FastAPI(
    title="CyberShield API",
    description="Authorized security assessment backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def resolve_target(target: str):
    target = target.strip()

    # Check whether the target is an IP address
    try:
        ip = ipaddress.ip_address(target)

        if ip.version != 4:
            raise ValueError

        return target, target

    except ValueError:
        pass

    # Basic hostname validation
    hostname_pattern = r"^[a-zA-Z0-9][a-zA-Z0-9.-]+$"

    if not re.match(hostname_pattern, target):
        raise HTTPException(
            status_code=400,
            detail="Invalid IP address or hostname."
        )

    try:
        resolved_ip = socket.gethostbyname(target)
        return target, resolved_ip

    except socket.gaierror:
        raise HTTPException(
            status_code=400,
            detail="Could not resolve the hostname."
        )


@app.get("/")
def home():
    return {
        "message": "CyberShield API is running",
        "status": "online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/resolve")
def resolve(target: str):

    original_target, resolved_ip = resolve_target(target)

    return {
        "target": original_target,
        "ip": resolved_ip,
        "status": "resolved"
    }


@app.get("/scan")
def scan_target(target: str):

    original_target, resolved_ip = resolve_target(target)

    try:
        result = subprocess.run(
            [
                "nmap",
                "-sV",
                resolved_ip
            ],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=result.stderr
            )

        return {
            "target": original_target,
            "ip": resolved_ip,
            "status": "scan_completed",
            "output": result.stdout
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="The scan timed out."
        )

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="Nmap was not found."
        )
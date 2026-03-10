# Security Policy

## Supported Scope

QR Share is a client-side utility for sharing short text between nearby devices using QR codes.

Security boundaries for v1:

- payloads are stored in the URL fragment
- payloads are decoded locally in the browser
- there is no backend or account system
- there is no encryption
- there is no promise of secrecy

## What QR Share Is Not For

QR Share is not suitable for:

- high-value secrets
- long-term secret storage
- secure credential exchange in public environments
- large or sensitive file transfer

Anyone who can scan the QR code or view the generated URL can read the content.

## Reporting A Vulnerability

If you find a security issue, please report it privately to the maintainer before opening a public issue.

Include:

- a short description of the issue
- impact
- reproduction steps
- affected browser or environment details

## Dependency Hygiene

This project aims to keep dependencies minimal and to keep `npm audit`, linting, type-checking, and tests passing in the default branch.

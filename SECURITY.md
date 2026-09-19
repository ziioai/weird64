# Security policy

## Supported versions

Security fixes are provided for the latest released version. Older 0.x releases
may not receive backports.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting flow:

<https://github.com/ziioai/weird64/security/advisories/new>

Include the affected version, impact, reproduction steps, and any suggested
mitigation. You should receive an acknowledgement within seven days. We will
coordinate disclosure and credit with you after evaluating the report.

Weird64 is an encoding library, not an encryption or authentication library.
Reports that rely only on encoded data being readable are not vulnerabilities;
claims of malformed-input crashes, denial of service, supply-chain compromise,
or unexpected code execution are in scope.

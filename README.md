# Web-Security-Vulnerabilities-Subject
Educational cybersecurity project made for a university course to show common web application vulnerabilities and how to protect against them using both insecure and secure versions of the application.
This project includes two different web applications:
1- A Vulnerable Web App that contains intentional security weaknesses for educational and testing purposes.
2- A Secure Web App that shows safer coding methods and basic protection techniques.

The main goal of this project is to help students learn:
* How common web vulnerabilities happen
* How insecure code can be exploited by attackers
* How developers can improve security and protect web applications from common attacks

# Included Vulnerabilities

1. (SQL Injection)

This part of the project shows how unsafe database queries can create security problems and allow attackers to bypass login systems or access data.

Features:
* Login system connected to a MySQL database
* Product search and filtering using URL parameters
* Simple SQL Injection testing examples
* Login bypass simulation
* Examples using UNION SELECT
* Comparison between secure and insecure database queries
Technologies Used:
* Node.js
* Express.js
* MySQL
* HTML / CSS / JavaScript

2. (Information Disclosure)

This section explains how sensitive information can be exposed by mistake in web applications because of weak security practices.

Examples Included:
* Exposed system messages
* Debug information leaks
* Sensitive file exposure simulation
* Weak error handling examples
* Comparison between secure and insecure handling methods

3. (XXE (XML External Entity) Injection)

This part demonstrates XML-related vulnerabilities and shows the difference between unsafe and secure XML processing.

Features:
* XML upload and parsing simulation
* Example of a vulnerable XML parser
* Secure XML parser implementation
* Educational XXE payload examples

# Educational Purpose:
This project was created for:

* Learning cybersecurity concepts
* University project and presentation purposes
* Increasing awareness about web security
* Learning secure coding practices
* Practicing ethical hacking in a controlled environment

All testing and demonstrations in this project are done locally in a safe educational environment only.

# Technologies
* Node.js
* Express.js
* MySQL
* HTML5
* CSS3
* JavaScript
* REST APIs

# Security Topics Covered
* SQL Injection
* Authentication Bypass
* UNION-Based SQL Injection
* Information Leakage
* Error Handling
* XML Parsing Security
* XXE Injection
* Secure Coding Practices
* Input Validation
* Parameterized Queries


# Important Notice

This project was created only for:

* Educational purposes
* Ethical cybersecurity learning
* Testing in local environments only

# Project Structure

```bash
Web_Security_Project/
│
├── Vulnerables Web App/
│   ├── SQL Injection Demo
│   ├── Information Disclosure Demo
│   ├── XXE Injection Demo
│   ├── MySQL Database
│   └── Vulnerable Server Logic
│
├── SecureWebApp/
│   ├── Protected SQL Queries
│   ├── Secure Error Handling
│   ├── Safer XML Processing
│   └── Security Improvements
│
├── package.json
|__ package-lock
└── README.md


Author: Khaled Saadeh
Cybersecurity Student — The University of Jordan
(License: This project is intended for educational and academic use only)

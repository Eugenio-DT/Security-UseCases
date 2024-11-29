# User Account Brute-force

<br>

- [Spin-up the use-case](#spin-up-the-use-case)
- [Use-case](#use-case)
  - [Introduction and Goals](#introduction-and-goals)
  - [Prerequisites](#prerequisites)
  - [Scenario Description](#scenario-description)
  - [Attack Simulation](#attack-simulation)
  - [Monitor USer Sign-ins](#monitor-user-sign-ins)
  - [Detect the Attack](#detect-the-attack)
  - [Generate a Security Event]()
- [Summary](#summary)

<br>

## Spin-up the use-case
The present use-case leverages on the [ACE-Box](https://github.com/Dynatrace/ace-box/tree/dev) framework to setup and configure the Dynatrace environment and all the needed resources to reproduce the intended scenario.

In order to prepare the environment and resources to reproduce the use-case, it's needed to configure the ACE-Box to spin-up an external use-case by following the instructions available [here](https://github.com/Dynatrace/ace-box/blob/dev/Readme.md).

The present use-case must be configured as an ACE-Box custom use-case, and it is defined in the following [repository](https://github.com/dynatrace-ace/ace-box-ext-demo-threat-detection.git).

*Notes*:
  - If you can't access the [ACE-Box](https://github.com/Dynatrace/ace-box/tree/dev) repository, [here's]() how to request access
  - If you can't access the [Use-case](https://github.com/dynatrace-ace/ace-box-ext-demo-threat-detection.git) repository, [here's]() how to request access

<br><br>

## Use-case

### Introduction and Goals
This use-case aims at demonstrating how to use Dynatrace platform to detect brute-froce attacks towards user accounts by analyzing and querying Microsoft Entra ID sign-in logs.

The main **goals** of the present use-case are:
1. Show how to setup and use Dyntrace to monitor sign-in user activities through Microsoft Entra ID sign-in logs
2. Show how to automatically detect brute-force attempts towards users and raise custom security events
3. Demonstrate how to extract counter metrics from ingested logs through OpenPipeline

<br>

### Prerequisites
- Knowledge of [Dynatrace Query Language](https://docs.dynatrace.com/docs/discover-dynatrace/references/dynatrace-query-language)

<br>

### Scenario Description
A user account brute-force attack is a malicious activity in which an attacker attempts to gain unauthorized access to user accounts by systematically trying numerous passwords. In a brute-force attack, the attacker uses automated tools to rapidly test a wide range of password combinations against one or more user accounts. The goal is to guess the correct password, which could be successful if weak passwords are used or if no smart lock-out protection mechanisms are enforced.

Brute-force attacks are a common method used by attackers to exploit accounts with poor password security, especially if users choose simple or predictable passwords

#### Attack Pattern Detection - Key Indicators
- **Multiple failed login attempts and time window**: a high volume of failed login attempts for a single user account within a short time frame (5 minutes), indicating the use of automated scripts or tools to attempt guessing the password.

- **Sign-in error code**: failed sign-ins reporting specific error codes that indicates a wrong credential has been provided by the user


#### Detection Logic
1. Identify, separately for each user, all the `5-minutes` time windows in which there are at least `15` failed sign-in with a specific error code
2. Check if the same users have performed any successful sign-in within the identified attackWindow or in the next 30-minutes

<br>

### Attack Simulation
To simulate the brute-force attack, there are two possibilities:

1. Go to the Dynatrace environment, browse to the Dynatrace Workflow section and open the "_Brute-force Azure Sign-In Logs Upload_" workflow.

    <img src="./images/Brute-force%20Azure%20Sign-In%20Logs%20Upload.png" width="500">

    This is a simple workflow which is executing a javascript code to generate and upload a set of mocked Microsoft Entra ID sign-in logs simulating a brute-force attack towards a target user.

    Then, click the `Run` button on the top of the page and wait for the execution to be completed.
    
    <br>

2. Send Microsoft Entra ID interactive sign-in logs to Dynatrace. Follow the instructions [here]() to setup the log streaming.
    
    Run the [brute-force-simulator.ps1](./additional-resources/brute-force-simulator.ps1) to simulate the attack towards the connected Azure tenant with a test user of your choice.
    
    Please replace all the `<placeholders>` within the script before running.

<br>

### Monitor User Sign-ins
...

<br>

### Detect the Attack
...

<br>

### Generate a Security Event
...

<br><br>

## Summary
...
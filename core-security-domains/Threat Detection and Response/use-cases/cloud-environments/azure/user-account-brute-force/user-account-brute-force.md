# User Account Brute-force

<br>

- [Spin-up the use-case](#spin-up-the-use-case)
- [Use-case](#use-case)
  - [Introduction and Goals](#introduction-and-goals)
  - [Prerequisites](#prerequisites)
  - [Scenario Description](#scenario-description)
  - [Attack Simulation](#attack-simulation)
  - [Monitor User Sign-ins](#monitor-user-sign-ins)
  - [Detect the Attack](#detect-the-attack)
  - [Automate the Detection](#automate-the-detection)
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
This use-case aims at demonstrating how to use Dynatrace platform to detect brute-froce attacks towards user accounts by analyzing and querying [Microsoft Entra ID sign-in logs](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins).

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

**Note**: the time window duration and the number of failed sign-ins are configured as thresholds and they can be changed and fine-tuned.

<br>

### Attack Simulation
To simulate the brute-force attack, there are two possibilities:

1. Go to the Dynatrace environment, browse to the Dynatrace Workflow section and open the "_Brute-force Azure Sign-In Logs Upload_" workflow.

    <img src="./images/workflow-logs-upload.png" width="500">

    This is a simple workflow which is executing a javascript code to generate and upload a set of mocked Microsoft Entra ID sign-in logs simulating a brute-force attack towards a target user.

    Then, click the `Run` button on the top of the page and wait for the execution to be completed.
    
    <br>

2. Send Microsoft Entra ID interactive sign-in logs to Dynatrace. Follow the instructions [here](https://docs.dynatrace.com/docs/analyze-explore-automate/logs/lma-log-ingestion/lma-log-ingestion-via-api/lma-cloud-provider-log-forwarding#microsoft-azure) to setup the log streaming.
    
    Run the [brute-force-simulator.ps1](./additional-resources/brute-force-simulator.ps1) to simulate the attack towards the connected Azure tenant with a test user of your choice.
    
    Please replace all the `<placeholders>` within the script before running.

<br>

### Monitor User Sign-ins
Once we have uploaded the logs, let's take a look at them.

Head to the Dashboards App and open the _Azure Monitoring Dashboard_. Set the timeframe to the last hour and let's take a look at the logs.

First of all, the dashboard offers a summary of the latest logs, counting the total amount, the failing and successful ones:

<img src="./images/dashboard-summary.png" width="800">

In addition, by scrolling down you can get details on the location from where the sign-in activities were performed, the device OS and browser used and the accessed application.

On top of that, the dashboard has a further section that focuses on failed sign-in attempts and provides the trend over time and a ranking of the most failing users within the selected timeframe:

<img src="./images/dashboard-failed-sign-ins-time.png" width="800">

<br>

<img src="./images/dashboard-most-failing-users.png" width="800">

<br>

By taking a closer look at the last sections, it seems that there is an anomalous situation for user `riley.ward@example.com`, as he has performed `26` failed sign-in attempts over the last 30 minutes and it is possible that he has been subject to a brute-force attack. Let's have a deep dive.

<br>

### Detect the Attack
Go to the Notebook section and open the _User Account Brute-force_ notebook.

This notebook aims at providing an overview of the malicious pattern to be detected in the logs, and a step-by-step description of the detection logic. Once opened, let's reload the entire notebook content by clicking on the button at the top right part of the screen.

**Note**: to get the DQL query details, just click on the _Show input_ button on the target section

<br>

1. The first section highlights the number of failed sign-in attempts for each user within the last 30-minutes. Again, it is possible to see that `riley.ward@example.com` has performed `26` failed sign-in attempts, while other users have failed some sign-in attempt but this is a normal behaviour:

    <img src="./images/notebook-failed-user-sign-in-count.png" width="800">

<br>

2. The second section enters in the core of the brute-force detection logic and it identifies all the `5-minutes` time windows in which there are at least `15` failed sign-in with a specific error code:

    <img src="./images/notebook-attack-windows-raw.png" width="800">
    
    <br>

    <img src="./images/notebook-attack-windows.png" width="900">

    <br>
    Those windows represent a potential time frame where a brute-force attack has been attempted towards the target user.

<br>

3. The third sections aims at fetchin all seccessful sign-ins performed by the target user within the last 30-minutes:

    <img src="./images/notebook-successful-signins.png" width="800">

    <br>

    As reported by the above image, the same user has performed two successful sign-ins. In addition since they fall within the identified potential attack time windows, they can be considered as risky sign-ins, because they could represent the successful sign-ins performed by the attacker that have guessed the user credentials.

<br>

4. The fourth and final section is cross-referencing all the data and checks if the same user have performed any successful sign-in within the identified attackWindow or in the next 30-minutes. As said, user `riley.ward@example.com` is matching those conditions and the query output reports the two risky sign-in attempts:

    <img src="./images/notebook-results.png" width="800">

<br>

### Automate the Detection
...

<br><br>

## Summary
...
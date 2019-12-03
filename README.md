
# ChatServerClient 

A Group chatting website

[![Build Status](https://dev.azure.com/mostofacefalo/Test/_apis/build/status/ChatClient-CI?branchName=master)](https://dev.azure.com/mostofacefalo/Test/_build/latest?definitionId=3&branchName=master)

[Hosted on Azure] (https://chatclient-prod.azurewebsites.net)

## Technical Details:

> Angular CLI: 8.2.2
> Node: 10.16.3
> SignalR client lib for Angular

### Features:
* Login and Register
* Create/View Group
* Join/Leave a Group 
* Enter a group for chatting
* View Group Full Message history

### Implementation description :
The angular project is basically the client app for the chat server. It calls different apis on Chatserver e.g call the login endpoint to get the token and then use it for further communications with the server. It opens signalR Hub connection and send message to connected groups. 

The CI-CD pipeline for this project is integrate with this repo. Any changes in master branch will trigger a build on Azure dev ops and then once the build is successful it will create a release and then deploy it to prod stage. 



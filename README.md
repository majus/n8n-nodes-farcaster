# What is it?

n8n is a no-code automation tool which allows to easily build complex workflows even for non-developer.
But there was a lack of convenient ways to build Farcaseter frames there, **until now**.

This set of n8n nodes allow to easily build Farcaster frames on the fly and handle user submissions.
With help of hundreds of other nodes already supported in n8n, the possibilities for building workflows are practically endless!
 
# How it's made?

I've cloned the official n8n nodes starter repository, removed the examples and introduced my nodes from scratch there.
There two nodes implemented:
- FramesBuilder — allows to dynamically build an HTML with a set of meta tags according tothe Farcaster specification
- EthereumTxBuilder — allows to build a transaction object to be sent back to the Farcaster in order to initiate an Ethereum transaction

Currently, the following Ethereum blockchains are supported:
- Mainnet
- Base
- Optimism

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 16. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
	```
	npm install n8n -g
	```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## More information

Refer to n8n [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

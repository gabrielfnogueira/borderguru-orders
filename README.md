# borderguru-orders

This is a simple API for managing orders and customers.

## Developing

After cloning this repo and `cd`ing into it:

`npm install # or yarn install`

then

`npm start # or yarn start`

## Running

You can build and run it without installing npm modules using `docker-compose`

`make up`

To create and seed the database, run

`make db-restore`

To run the tests, run

`make tests`

To stop the containers, run

`make stop`

To stop the containers and remove them, run

`make destruct`

## Questions

### Why did you pick your first particular design? What assumptions did you make, and what tradeoffs did you consider?

I decided to build it using Node.js (with Express) and MongoDB because I'm more familiarized with this stack (it's the one I'm using at work).
I consider using MySQL, because it still makes more sense to me thinking in relational data (I guess it's because all those years working with Microsoft SQL Server).
From that, I assumed that `customers` should be a separated collection from the start.

### What did you consider when you had to design the second solution? And which assumptions and tradeoffs you made?

Given the fact that I already designed `customers` on a different collection, all I had to do was build its routes for the CRUD operation and for the 'custom selections'.

### What do you like (and dislike) about Node/Javascript compared to other programming languages?

I like the fact that it's just Javascript, so any front-end dev could easily migrate to it. What I dislike is that it's Javascript, so for someone with a background in strong typed languages (like me) it feels confusing and harder to track bugs at first.

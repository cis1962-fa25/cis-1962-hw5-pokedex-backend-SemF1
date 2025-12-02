# Homework 5 AI Synthesis Activity

Only complete one of the assignments below! You can delete the other assignment in this document once you've made your choice.

## Activity: You used AI

## Part 1  
Screenshots are in /AIChats

## Part 2  
I used AI throughout the backend setup, mainly when connecting Express, Redis, and JWT together. I started off unsure about how to structure everything, like whether to use one big server.ts or split it into routes, and ChatGPT helped me organize the project into separate route files (pokemon, box, token) with clean imports. I also used it when my Redis connection wasn’t working and I kept getting “Cannot find module” and “Top-level await” errors. It walked me through fixing my TypeScript config and rewriting my redis.ts file so it connected properly to my cloud instance.

Later, I used it to debug when my /pokemon/:name route was returning huge nested JSON objects. It explained how to simplify the data from multiple PokéAPI endpoints, only returning the important fields like id, name, types, sprite, flavor, and a few moves. That cleaned up my responses and made them match the assignment spec. I also asked how to handle JWT auth for the box routes and how to structure my Redis keys so entries wouldn’t overlap between users. The AI showed me the {pennkey}:pokedex:{entryId} pattern and helped me build the middleware that verifies tokens before letting users access their box.

it helped me test everything in PowerShell. It explained how to do multi-line Invoke-WebRequest commands with backticks so I could run POST /token, GET /pokemon, and all my /box endpoints cleanly.

## Part 3  
The responses were correct and matched what the assignment required. For example, when I asked about Redis key structure, it explained exactly how to isolate users by namespacing their entries with the pennkey. When I asked about simplifying Pokemon data, it gave me the logic for combining getPokemonByName() and getPokemonSpeciesByName() and returning a smaller JSON payload. I didn’t have to edit much, just adjusted naming details to fit my routes.

When I ran into the linting issue (You are linting "./src" but all of the files matching the glob pattern "./src" are ignored), it also helped me convert my ESLint config to the new flat eslint.config.mjs format that works with ESLint v9. That fixed the “no files found” errors instantly. Every fix it gave matched the official TypeScript + Express setup, and I verified the changes by running the server and seeing Redis connect successfully.

## Part 4  
One thing I learned from this homework was how JWT authentication actually integrates into Express middleware. Before this, I understood tokens conceptually, but not how to extract them from headers and attach the decoded user to the request object. I also learned about namespacing in Redis and how simple key patterns can replace relational logic when storing user data.

Another new concept was Zod validation for query parameters. I’ve used it before for body validation, but this was my first time using it to validate query strings like limit and offset for pagination. It also helped me understand how PokeAPI structures its data. I didn’t realize how much information was embedded until I wrote the synthesis logic myself.

Using AI helped me focus on the main parts of the assignment, designing routes, handling auth, and testing responses instead of wasting time on setup issues. I feel like I got a really good grasp of coding routes now. I made sure I understood every change before using it, and all my tests passed with clean, minimal responses.


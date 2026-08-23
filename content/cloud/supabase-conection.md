---

title: Supabase PostgreSQL Connection: IPv6, Pooler and Persistent Connections
date: 2026-08-23
tags:

- backend
- postgresql
- supabase
- drizzle
- nodejs
- networking

summary: Understanding Supabase direct connections, IPv6 DNS resolution, connection pooling, and why a Node.js database client can keep a process alive.

---

# Connecting Drizzle ORM to Supabase PostgreSQL

While connecting a Node.js application using Drizzle ORM and `postgres-js` to Supabase PostgreSQL, I ran into a DNS error that initially looked like an invalid database URL.

The error was:

```text
Error: getaddrinfo ENOTFOUND db.hofexqcmtciwqynhbeyl.supabase.co
```

The interesting part was that the Supabase hostname was actually valid.

The problem turned out to be related to **IPv6 connectivity and the type of Supabase connection being used**.

## Initial Connection

The initial setup was straightforward:

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(DATABASE_URL);

const db = drizzle({ client });

export default db;
```

The database URL was a Supabase direct PostgreSQL connection:

```text
postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

At first glance, everything looked correct.

## The Error

The application failed with:

```text
getaddrinfo ENOTFOUND db.hofexqcmtciwqynhbeyl.supabase.co
```

`ENOTFOUND` comes from Node.js DNS resolution.

It means that Node could not obtain a usable address for the hostname.

This does **not necessarily mean that the hostname itself is invalid**.

## Investigating DNS

I checked the hostname manually using:

```bash
nslookup db.<project-ref>.supabase.co
```

The lookup succeeded and returned an IPv6 address:

```text
Name:
db.<project-ref>.supabase.co

Address:
2406:da1c:16f1:f602:36a:85ec:6d07:e65b
```

This was the important clue.

The Supabase direct database endpoint was resolving to **IPv6**.

## Why `nslookup` Worked but Node Failed

One confusing part was that:

```bash
nslookup db.<project-ref>.supabase.co
```

worked, while Node reported:

```text
getaddrinfo ENOTFOUND
```

These operations don't necessarily use DNS resolution in exactly the same way.

`nslookup` communicates directly with the configured DNS server.

Node's `getaddrinfo()` goes through the operating system's name-resolution mechanisms.

Therefore, it is possible to have:

```text
nslookup
    ↓
DNS server
    ↓
IPv6 address found
```

while:

```text
Node.js
    ↓
Windows resolver
    ↓
unable to obtain a usable address
    ↓
ENOTFOUND
```

This was why the database hostname could be valid while the Node application still failed.

## Direct Connection and IPv6

Supabase's direct PostgreSQL connection uses a hostname similar to:

```text
db.<project-ref>.supabase.co
```

In this situation, the hostname resolved to an IPv6 address.

Therefore, the connection path looked roughly like:

```text
Node.js
   │
   ▼
Windows DNS resolver
   │
   ▼
Supabase direct hostname
   │
   ▼
IPv6 address
   │
   ▼
PostgreSQL :5432
```

If the environment does not have proper IPv6 connectivity, the direct database connection can fail.

## The Supabase Pooler

Supabase provides connection poolers for environments where a direct connection is not suitable.

Instead of connecting directly to PostgreSQL:

```text
Application
     │
     ▼
Supabase PostgreSQL
```

the application connects through the pooler:

```text
Application
     │
     ▼
Supabase Pooler
     │
     ▼
PostgreSQL
```

The pooler provides an intermediary connection layer and is useful for clients that cannot directly connect to the database endpoint.

Supabase's documentation specifically indicates using the pooler when the environment uses IPv4 connectivity and the direct connection requires IPv6.

## Switching to the Pooler

Instead of using:

```text
db.<project-ref>.supabase.co
```

I switched the `DATABASE_URL` to the connection string provided by Supabase for the pooler.

The application code itself did not need to change:

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

const db = drizzle({ client });

export default db;
```

This was an important lesson.

The problem was not:

* Drizzle
* PostgreSQL queries
* The schema
* `postgres-js`
* The database password

The problem was the **network connection path to the database**.

## Verifying the Connection

After switching to the pooler, I executed a simple PostgreSQL query:

```sql
SELECT now();
```

The result was:

```text
Result(1) [
  {
    now: '2026-08-23 16:36:57.746358+00'
  }
]
```

This proved that the complete connection path was working:

```text
Node.js
   ↓
postgres-js
   ↓
Supabase Pooler
   ↓
PostgreSQL
   ↓
SELECT now()
   ↓
Response
```

At this point the original DNS/connection problem was solved.

## Why the Node Process Stayed Alive

Another interesting behavior appeared after the query succeeded.

The query returned successfully, but the Node.js process appeared to remain running.

This initially looked like the application was stuck.

However, a PostgreSQL client can maintain connections or sockets for future database operations.

The application can therefore look like:

```text
Node.js process
      │
      ├── Application code
      │
      └── PostgreSQL client/socket
              │
              ▼
        Supabase Pooler
```

The process does not necessarily terminate immediately after one query.

This is generally desirable for a server application.

A web server should not create and destroy a database connection for every request.

Instead, the application can reuse its database client:

```text
Request 1 ──┐
Request 2 ──┤
Request 3 ──┼──> postgres-js ──> pooler ──> PostgreSQL
Request 4 ──┤
Request 5 ──┘
```

## Closing the Client in a Test Script

For a small standalone script, I can explicitly close the database client:

```ts
const result = await db.execute(sql`SELECT now()`);

console.log(result);

await client.end();

console.log("DONE");
```

This tells `postgres-js` that the application has finished using the database.

For a long-running server, however, I generally should **not** close the database connection after every query.

## Direct Connection vs Pooler

The main distinction I learned is:

| Connection        | Purpose                                                             |
| ----------------- | ------------------------------------------------------------------- |
| Direct connection | Direct access to PostgreSQL                                         |
| Pooler connection | Connection through Supabase's pooling layer                         |
| Direct connection | Can require IPv6 connectivity                                       |
| Pooler            | Useful for IPv4 environments and applications with many connections |

The exact choice depends on the deployment environment and Supabase's current connection recommendations.

## What I Learned

The biggest lesson was that database errors are not always database problems.

When I saw:

```text
ENOTFOUND
```

my first instinct was to question the database URL.

But the URL was valid.

The actual chain was:

```text
Valid Supabase hostname
        ↓
Hostname resolves to IPv6
        ↓
Environment has an IPv4-oriented connection path
        ↓
Node cannot establish the expected resolution/connection
        ↓
getaddrinfo ENOTFOUND
```

Using the Supabase pooler provided the appropriate connection path.

Another important lesson is to distinguish between:

```text
DNS resolution
```

and:

```text
Network connectivity
```

and:

```text
Database authentication
```

and:

```text
Database query execution
```

They are separate layers.

A failure in one layer can happen before the next layer is ever reached.

## A Useful Debugging Checklist

When PostgreSQL gives a connection error, check the layers individually:

1. Is the database hostname correct?
2. Does DNS resolve the hostname?
3. Does Node resolve the hostname?
4. Is the returned address IPv4 or IPv6?
5. Does the machine have connectivity to that address?
6. Is PostgreSQL port `5432` reachable?
7. Is the username/password correct?
8. Can a simple query such as `SELECT now()` execute?
9. If using Supabase, should the pooler be used instead of the direct connection?

This prevents immediately changing application code when the real problem is at the networking layer.

## Final Connection Setup

My current Drizzle connection is intentionally simple:

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

const db = drizzle({ client });

export default db;
```

The important part is choosing the **correct Supabase connection URL for the environment**.

The code can remain the same while the connection endpoint changes.

## Next Steps

* Learn more about PostgreSQL connection pooling
* Understand IPv4 vs IPv6 in more depth
* Learn how DNS resolution works inside Node.js
* Understand how `postgres-js` manages connections
* Explore Supabase transaction vs session pooling
* Test the same application from Docker and a cloud deployment
* Learn how connection limits affect production applications

The key takeaway:

> **When `ENOTFOUND` appears, don't immediately assume the URL is wrong. Check DNS, IP version, network connectivity, and the runtime environment before changing the database code.**

---

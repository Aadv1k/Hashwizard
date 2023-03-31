# hashwizard

is a suite of tools and APIs that allow you to interact with `hashing`

## Get

### Server

```shell
node ./index.js
```

```shell
--port=3000 # explicitly specify the port
--no-dump # disables fetching initial load
```

**NOTE**: this will attempt to cache the entir rainbow table from a MongoDB Atlas database, if the line is commented out the `/api/crack` will instead directly query the database. This measure is put in place to reduce the average response time from `00:00:41` to `00:00:10`

### Test

```shell
node ./tests/*.test.js
```

## API

### `/api/hash/`

hash the provided text using the `{hash}` function



- `/:hash`: the hash function to use; supports md5, sha256, sha1, sha224, sha256, sha384, sha512, sha3-224, sha3-256, sha3-384, sha3-512, shake128, shake256

#### Query params

- `text=`: string of characters to hash

#### Success

```json
{
   "hash" : "5d41402abc4b2a76b9719d911017c592",
   "status" : 200,
   "text" : "hello"
}
```

#### Error

```json
{
   "error" : "invalid-hash-function",
   "message" : "the hash function specified is not valid",
   "status" : 400
},

{
   "error" : "missing-text-param",
   "message" : "the text parameter was not provided for `/api/hash`",
   "status" : 400
}
```

### `/api/crack/`

Attempts to crack a given hash via a custom 20+ MB [Rainbow table](https://en.wikipedia.org/wiki/Rainbow_table)

- `/:hash`: the hash function to use; supports md5, sha256 and sha1

### Query params

- `hash=`: Hash to be cracked

#### Success

```json
{
   "hash" : "5d41402abc4b2a76b9719d911017c592",
   "status" : 200,
   "text" : "hello"
},

{
   "hash" : "e",
   "message" : "was unable to crack the given hash",
   "status" : 200,
   "text" : null
}
```

#### Error

```json
{
   "error" : "missing-hash-param",
   "message" : "the hash parameter was not provided for `/api/crack`",
   "status" : 400
},

{
   "error" : "invalid-hash-function",
   "message" : "the hash function specified is not valid",
   "status" : 400
}
```

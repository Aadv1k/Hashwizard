# hashwizard

is a suite of tools and APIs that allow you to interact with `hashing`

## Get

### Server

```shell
node ./index.js
```

### Test

```shell
node ./tests/*.test.js
```

## API

### `/api/hash/`

hash the provided text using the `{hash}` function

#### URL Params

- `/:hash`: the hash function to use; supports `md5` and `sha256`

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

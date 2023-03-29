# hashwizard

is a suite of tools and APIs that allow you to interact with `hashing`

## API

### `/api/hash/`

hash the provided text using the `{hash}` function

#### URL Params

- `/:hash`: the hash function to use; supports `md5` and `sha256`

#### Query params

- `text=`: string of characters to hash

#### Success

```json
{}
```

#### Error

```json
{}
````





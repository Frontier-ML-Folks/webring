# FMLF Webring API

The web ring is hosted at [`https://webring.chaldea.moe`](https://webring.chaldea.moe). Its API returns the member list as JSON and provides redirects to member websites.

## Endpoints

### `GET /api/members`

Returns the full member list as a JSON array.

```sh
curl https://webring.chaldea.moe/api/members
```

Each member has these fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Stable identifier used by the navigation endpoints. |
| `name` | string | Display name. |
| `github` | string | GitHub username. |
| `website` | string | Website URL used as the redirect destination. |
| `description` | string, optional | Short member description. |
| `twitter` | string, optional | X/Twitter URL. |
| `email` | string, optional | Email address. |
| `codeberg` | string, optional | Codeberg URL. |

Example response:

```json
[
  {
    "id": "mhxxx",
    "name": "mysteriousheroinexxx",
    "github": "mysteriousheroinexxx",
    "website": "https://mysteriousheroinexxx.github.io/",
    "description": "Your friendly neighbourhood zig guy",
    "twitter": "https://x.com/mhxxxmorgan",
    "email": "mysteriousheroinexxx@proton.me",
    "codeberg": "https://codeberg.org/mysteriousheroinexxx"
  }
]
```

### `GET /api/next?from={id}`

Redirects to the next member's website in the configured member order. The final member wraps around to the first.

```sh
curl -i 'https://webring.chaldea.moe/api/next?from=mhxxx'
```

### `GET /api/prev?from={id}`

Redirects to the previous member's website. The first member wraps around to the final member.

```sh
curl -i 'https://webring.chaldea.moe/api/prev?from=mhxxx'
```

### `GET /api/random`

Redirects to a randomly selected member's website.

```sh
curl -i 'https://webring.chaldea.moe/api/random'
```

Optionally provide `from` to exclude that member from the random selection:

```sh
curl -i 'https://webring.chaldea.moe/api/random?from=mhxxx'
```

For example, a website can link visitors into the ring with:

```html
<a href="https://webring.chaldea.moe/api/prev?from=mhxxx">Previous</a>
<a href="https://webring.chaldea.moe/api/next?from=mhxxx">Next</a>
<a href="https://webring.chaldea.moe/api/random?from=mhxxx">Random</a>
```

## Responses and errors

- Successful navigation returns **302 Found**, with the destination in the `Location` header. Browsers follow this redirect automatically.
- `/api/next` and `/api/prev` return **400 Bad Request** with `Missing member ID` if `from` is omitted.
- Navigation returns **404 Not Found** if `from` is not a known member ID, or if there are fewer than two members.
- Any other path returns **404 Not Found** with `Not Found`.

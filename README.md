# DHT node

Node.js implementation of a Distributed Hash Table using Chord (without a finger table).

## Usage

You should have [node](https://nodejs.org/en/download/package-manager/) and [yarn](https://yarnpkg.com/lang/en/docs/install/) (or npm) installed. Clone the repository and install all dependencies with

```bash
  yarn install
```

Then you can run a node through

```bash
  yarn start [-- opts]
```

`opts` can be

- `-i, --id <value>` The node's identifier inside the ring. Defaults to the sha256 hash of the node's IP in hex.
- `-n, --node <ip:port>` Direction of an existing node inside the ring to whom to connect. If omitted, it's assumed that the node it's the first node in the ring.
- `-c, --client <port>` Port to which the node listens. Defaults no 8080.

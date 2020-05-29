# nodecloud-rfcs

Current development methodology of NodeCloud is a manual and VERY error prone way of defining and unifying APIs.

Reasons to why it’s an error prone methodology,

- Manually adding tons of APIs and their implementation
- Keeping track of the counterparts of each cloud provider, right now we don’t have a proper of keeping track
  SDK changes should be manually tracked and changed in the corresponding implementations in NodeCloud

## Proposal

- Implement a parser which can read configuration file that contain the API to be used from specific SDKs.
- This config file can be any format as long as it gives us the flexibility to define the API definitions that we want. Eg: TypeScript, toml, yaml?
- A parser can parse the definitions in the file and decide what APIs to use from each SDK.
- A generator can make use of the output from the parser and generate JavaScript for the unified APIs thus automating the code gen.

MIT @ leopardslab

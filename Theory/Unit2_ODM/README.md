# Unit 2: Mongoose ODM

This model demonstrates schema validation, trimming/lowercasing, a unique email index, enum constraints, timestamps, and an instance method. Install with `npm install`, set `MONGO_URI`, then run `npm start`. The example inserts a temporary valid record and removes it afterward. In production, create unique indexes during deployment and handle duplicate-key errors because uniqueness is enforced by MongoDB, not by the validator alone.

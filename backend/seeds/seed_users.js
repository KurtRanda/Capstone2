exports.seed = function (knex) {
    return knex("users")
      .del()
      .then(function () {
        return knex("users").insert([
          { email: "test@example.com", password: "$2a$10$examplehash", role: "user" }, // Replace with bcrypt hash
        ]);
      });
  };
  
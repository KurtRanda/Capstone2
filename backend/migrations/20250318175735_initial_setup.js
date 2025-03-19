exports.up = function (knex) {
    return knex.schema
      // Users Table
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username", 50).unique();
        table.string("email", 100).notNullable().unique();
        table.text("password").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("role", 20).defaultTo("user");
      })
  
      // Recipes Table
      .createTable("recipes", (table) => {
        table.increments("id").primary();
        table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("recipe_id", 100).notNullable().unique();
        table.string("name", 255).notNullable();
        table.text("image_url");
        table.text("source_url");
        table.double("calories");
        table.integer("servings").defaultTo(1);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.text("diet_labels");
        table.text("health_labels");
        table.text("ingredients");
      })
  
      // Ingredients Table
      .createTable("ingredients", (table) => {
        table.increments("id").primary();
        table.integer("recipe_id").references("id").inTable("recipes").onDelete("CASCADE");
        table.string("name", 255).notNullable();
        table.string("quantity", 50);
        table.string("unit", 50);
        table.timestamp("created_at").defaultTo(knex.fn.now());
      })
  
      // Grocery List Table
      .createTable("grocery_list_items", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.string("ingredient_name", 255).notNullable();
        table.string("quantity", 50);
        table.string("unit", 50);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.boolean("purchased").defaultTo(false);
      });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists("grocery_list_items")
      .dropTableIfExists("ingredients")
      .dropTableIfExists("recipes")
      .dropTableIfExists("users");
  };
  
USE nutrifit_db;

DELETE FROM users WHERE role = 'admin' AND email <> 'tharun@nutrifit.com';

INSERT INTO users (name, email, password_hash, role, profile_complete)
VALUES
  ('Tharun', 'tharun@nutrifit.com', '$2a$10$EYsWKNlVVhypk/Lp2Sp4i.9JrxKb8IzIXbsyq/cjaphzzxYXH.NfW', 'admin', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  profile_complete = VALUES(profile_complete);

INSERT INTO doctors (name, email, password_hash, specialty, experience_years, rating, total_ratings, avatar, available)
VALUES
  ('Dr. Sarah Johnson', 'sarah@nutrifit.com', '$2a$10$NHx6s6V7xWHV2qKv6QaM5egN6ivQxD50s0xBfQ8egw2xszmvF1c7i', 'Clinical Nutritionist', 12, 4.80, 156, 'SJ', 1),
  ('Dr. Michael Chen', 'michael@nutrifit.com', '$2a$10$NHx6s6V7xWHV2qKv6QaM5egN6ivQxD50s0xBfQ8egw2xszmvF1c7i', 'Sports Nutrition', 8, 4.60, 98, 'MC', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO foods (name, category, diet_type, calories, protein, carbs, fat, iron, calcium, vit_c, vit_d, fiber, vit_b12)
VALUES
  ('Oats', 'Grains', 'veg', 150, 5.0, 27.0, 3.0, 1.7, 54, 0.0, 0.0, 4.0, 0.0),
  ('Egg', 'Protein', 'nonveg', 78, 6.0, 0.6, 5.0, 0.9, 28, 0.0, 1.1, 0.0, 0.6),
  ('Chicken Breast', 'Protein', 'nonveg', 165, 31.0, 0.0, 3.6, 0.9, 15, 0.0, 0.2, 0.0, 0.3),
  ('Apple', 'Fruit', 'veg', 95, 0.5, 25.0, 0.3, 0.2, 11, 8.4, 0.0, 4.4, 0.0),
  ('Banana', 'Fruit', 'veg', 105, 1.3, 27.0, 0.3, 0.3, 6, 10.3, 0.0, 3.1, 0.0),
  ('Orange', 'Fruit', 'veg', 62, 1.2, 15.4, 0.2, 0.1, 52, 69.7, 0.0, 3.1, 0.0),
  ('Watermelon', 'Fruit', 'veg', 46, 0.9, 11.5, 0.2, 0.2, 11, 12.3, 0.0, 0.6, 0.0),
  ('Fresh Orange Juice', 'Liquids', 'veg', 110, 2.0, 25.0, 0.5, 0.5, 27, 93.0, 0.0, 0.5, 0.0),
  ('Coconut Water', 'Liquids', 'veg', 44, 1.7, 10.4, 0.2, 0.3, 58, 2.4, 0.0, 2.6, 0.0),
  ('Buttermilk', 'Liquids', 'veg', 99, 3.3, 12.0, 3.4, 0.1, 116, 0.0, 1.0, 0.0, 0.5),
  ('Mixed Fruit Smoothie', 'Liquids', 'veg', 160, 3.0, 32.0, 2.5, 0.6, 60, 24.0, 0.0, 3.2, 0.0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

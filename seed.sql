INSERT INTO
  users (google_id, email, name, picture)
VALUES
  (
    '109140641532501903177',
    'ferdiebergado@gmail.com',
    'ferdie bergado',
    'https://lh3.googleusercontent.com/a/AGNmyxZt9n8sXo7l2m1j5eXqj6i0a9v1kK8uQhH4g=s96-c'
  );

INSERT INTO
  venues (name, location, created_by, updated_by)
VALUES
  (
    'Tanza Oasis Hotel and Resort',
    'Tanza, Cavite',
    1,
    1
  ),
  ('NEAP-NCR RELC', 'Marikina City', 1, 1),
  ('Ecotech Center', 'Cebu City', 1, 1),
  ('Baguio Teachers Camp', 'Baguio City', 1, 1);

INSERT INTO
  positions (name, created_by, updated_by)
VALUES
  ('Senior Education Program Specialist', 1, 1),
  ('Supervising Education Program Specialist', 1, 1);

INSERT INTO
  focals (
    firstname,
    mi,
    lastname,
    sex,
    position_id,
    created_by,
    updated_by
  )
VALUES
  ('Ferdinand', 'S', 'Bergado', 'M', 1, 1, 1),
  ('Bryan', 'R', 'Simara', 'M', 2, 1, 1);

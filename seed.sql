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
    position_id,
    created_by,
    updated_by
  )
VALUES
  ('Ferdinand', 'S', 'Bergado', 1, 1, 1),
  ('Bryan', 'R', 'Simara', 2, 1, 1);

INSERT INTO
  banks (name, created_by, updated_by)
VALUES
  ('Landbank of the Philippines', 1, 1),
  ('Banco de Oro', 1, 1),
  ('Metrobank', 1, 1),
  ('Unionbank', 1, 1),
  ('Bank of the Philippine Islands', 1, 1),
  ('Philippine National Bank', 1, 1),
  ('Chinabank', 1, 1),
  ('Security Bank', 1, 1),
  ('RCBC', 1, 1),
  ('Development Bank of the Philippines', 1, 1),
  ('EastWest Bank', 1, 1);

INSERT INTO
  reports (name)
VALUES
  ('Certification'),
  ('Computation'),
  ('ORS-DV'),
  ('Payroll');

INSERT INTO
  roles (name, created_by, updated_by)
VALUES
  ('Resource Person', 1, 1);

  CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  edad INT
);

INSERT INTO estudiantes (nombre, apellido, edad)
VALUES ('Juan', 'Pérez', 22),
       ('Lucía', 'Gómez', 21);

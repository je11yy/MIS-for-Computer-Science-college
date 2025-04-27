-- Таблица студентов
CREATE TABLE students (
    student_id CHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sex VARCHAR(6) CHECK (sex IN ('male', 'female')),
    entrance_age INT CHECK (entrance_age BETWEEN 10 AND 50),
    entrance_year INT,
    class VARCHAR(20)
);

-- Таблица преподавателей
CREATE TABLE teachers (
    teacher_id CHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Таблица курсов
CREATE TABLE courses (
    course_id CHAR(7) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credit INT CHECK (credit > 0),
    grade INT CHECK (grade BETWEEN 1 AND 12),
    canceled_year INT
);

CREATE TABLE course_teacher (
    course_id CHAR(7),
    teacher_id CHAR(5),
    PRIMARY KEY (course_id, teacher_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- Таблица выбора курсов
CREATE TABLE course_choosing (
    student_id CHAR(10),
    course_id CHAR(7),
    chosen_year INT,
    score NUMERIC(5,2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE SEQUENCE IF NOT EXISTS student_id_seq;
CREATE SEQUENCE IF NOT EXISTS course_id_seq;
CREATE SEQUENCE IF NOT EXISTS teacher_id_seq;

CREATE OR REPLACE FUNCTION get_students()
RETURNS TABLE (
    student_id CHAR(10),
    name VARCHAR,
    sex VARCHAR,
    entrance_age INT,
    entrance_year INT,
    class VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM students;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_student(
    p_student_id CHAR(10)
)
RETURNS TABLE (
    student_id CHAR(10),
    name VARCHAR,
    sex VARCHAR,
    entrance_age INT,
    entrance_year INT,
    class VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM students s WHERE s.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_teachers()
RETURNS TABLE (
    teacher_id CHAR(5),
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM teachers;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_courses()
RETURNS TABLE (
    course_id CHAR(7),
    name VARCHAR,
    credit INT,
    grade INT,
    canceled_year INT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM courses;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_course_choosings()
RETURNS TABLE (
    student_id CHAR(10),
    course_id CHAR(7),
    chosen_year INT,
    score NUMERIC
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM course_choosing;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_student(
    p_name VARCHAR,
    p_sex VARCHAR,
    p_entrance_age INT,
    p_entrance_year INT,
    p_class VARCHAR
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_id VARCHAR;
BEGIN
    v_student_id := 'S' || LPAD(nextval('student_id_seq')::TEXT, 9, '0');

    INSERT INTO students (student_id, name, sex, entrance_age, entrance_year, class)
    VALUES (v_student_id, p_name, p_sex, p_entrance_age, p_entrance_year, p_class);
END;
$$;

-- Обновление студента
CREATE OR REPLACE PROCEDURE update_student(
    p_student_id CHAR(10),
    p_name VARCHAR,
    p_sex VARCHAR,
    p_entrance_age INT,
    p_entrance_year INT,
    p_class VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE students
    SET name = p_name,
        sex = p_sex,
        entrance_age = p_entrance_age,
        entrance_year = p_entrance_year,
        class = p_class
    WHERE student_id = p_student_id;
END;
$$;

-- Удаление студента
CREATE OR REPLACE PROCEDURE delete_student(p_student_id CHAR(10))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM students WHERE student_id = p_student_id;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_course(
    p_name VARCHAR,
    p_credit INT,
    p_grade INT,
    p_canceled_year INT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_course_id VARCHAR;
BEGIN
    v_course_id := 'C' || LPAD(nextval('course_id_seq')::TEXT, 6, '0');

    INSERT INTO courses (course_id, name, credit, grade, canceled_year)
    VALUES (v_course_id, p_name, p_credit, p_grade, p_canceled_year);
END;
$$;

-- Обновление курса
CREATE OR REPLACE PROCEDURE update_course(
    p_course_id CHAR(7),
    p_name VARCHAR,
    p_credit INT,
    p_grade INT,
    p_canceled_year INT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE courses
    SET name = p_name,
        credit = p_credit,
        grade = p_grade,
        canceled_year = p_canceled_year
    WHERE course_id = p_course_id;
END;
$$;

-- Удаление курса
CREATE OR REPLACE PROCEDURE delete_course(p_course_id CHAR(7))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM courses WHERE course_id = p_course_id;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_teacher(
    p_name VARCHAR
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_teacher_id VARCHAR;
BEGIN
    v_teacher_id := 'T' || LPAD(nextval('teacher_id_seq')::TEXT, 4, '0');

    INSERT INTO teachers (teacher_id, name)
    VALUES (v_teacher_id, p_name);
END;
$$;

-- Обновление преподавателя
CREATE OR REPLACE PROCEDURE update_teacher(
    p_teacher_id CHAR(5),
    p_name VARCHAR
) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE teachers
    SET name = p_name
    WHERE teacher_id = p_teacher_id;
END;
$$;

-- Удаление преподавателя
CREATE OR REPLACE PROCEDURE delete_teacher(p_teacher_id CHAR(5))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM teachers WHERE teacher_id = p_teacher_id;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_course_choosing(
    p_student_id CHAR(10),
    p_course_id CHAR(7),
    p_chosen_year INT,
    p_score NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO course_choosing (student_id, course_id, chosen_year, score)
    VALUES (p_student_id, p_course_id, p_chosen_year, p_score);
END;
$$;

-- Обновление выбора курса
CREATE OR REPLACE PROCEDURE update_course_choosing(
    p_student_id CHAR(10),
    p_course_id CHAR(7),
    p_chosen_year INT,
    p_score NUMERIC(5,2)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE course_choosing
    SET chosen_year = p_chosen_year,
        score = p_score
    WHERE student_id = p_student_id
      AND course_id = p_course_id;
END;
$$;

-- Удаление выбора курса
CREATE OR REPLACE PROCEDURE delete_course_choosing(
    p_student_id CHAR(10),
    p_course_id CHAR(7)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM course_choosing
    WHERE student_id = p_student_id
      AND course_id = p_course_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_student_courses(p_student_id CHAR(10))
RETURNS TABLE (
    id CHAR(7),
    name VARCHAR(100),
    credit INT,
    chosen_year INT,
    score NUMERIC(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.course_id AS id,
        c.name,
        c.credit,
        cc.chosen_year AS chosen_year,
        cc.score
    FROM 
        students s
    JOIN 
        course_choosing cc ON s.student_id = cc.student_id
    JOIN 
        courses c ON cc.course_id = c.course_id
    WHERE 
        s.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;


-- Преподаватели
CALL insert_teacher('Dr. John Smith');
CALL insert_teacher('Prof. Maria Johnson');
CALL insert_teacher('Dr. Hiroshi Suzuki');
CALL insert_teacher('Dr. Anja Müller');

-- Курсы
CALL insert_course('Mathematics', 3, 1, NULL);
CALL insert_course('Physics', 4, 2, 2022);
CALL insert_course('Literature', 2, 3, NULL);
CALL insert_course('Biology', 3, 2, 2023);
CALL insert_course('Computer Science', 5, 4, NULL);
CALL insert_course('History', 3, 1, NULL);
CALL insert_course('Chemistry', 4, 3, 2021);
CALL insert_course('Philosophy', 2, 5, NULL);

-- Студенты
CALL insert_student('Oliver García', 'male', 20, 2020, 'A');
CALL insert_student('Sophie Dupont', 'female', 21, 2020, 'B');
CALL insert_student('Takashi Yamamoto', 'male', 19, 2019, 'C');
CALL insert_student('Isabella Rossi', 'female', 22, 2021, 'A');
CALL insert_student('Liam O’Connor', 'male', 23, 2020, 'B');
CALL insert_student('Amina Ahmed', 'female', 20, 2017, 'A');
CALL insert_student('David Müller', 'male', 24, 2018, 'C');
CALL insert_student('Yuki Tanaka', 'female', 22, 2022, 'B');
CALL insert_student('Rafael Oliveira', 'male', 21, 2021, 'A');
CALL insert_student('Zoe Patel', 'female', 19, 2020, 'C');
CALL insert_student('Lucas Silva', 'male', 20, 2020, 'B');

-- Выбор курсов студентами
CALL insert_course_choosing('S000000001', 'C000001', 2020, 85.5);
CALL insert_course_choosing('S000000002', 'C000002', 2020, 90.0);
CALL insert_course_choosing('S000000003', 'C000003', 2019, 87.0);
CALL insert_course_choosing('S000000004', 'C000004', 2021, 88.5);
CALL insert_course_choosing('S000000005', 'C000005', 2020, 92.0);
CALL insert_course_choosing('S000000006', 'C000006', 2017, 89.0);
CALL insert_course_choosing('S000000007', 'C000007', 2018, 91.5);
CALL insert_course_choosing('S000000008', 'C000001', 2022, 84.0);
CALL insert_course_choosing('S000000009', 'C000005', 2021, 86.0);
CALL insert_course_choosing('S000000010', 'C000003', 2020, 78.0);
CALL insert_course_choosing('S000000011', 'C000008', 2020, 82.0);
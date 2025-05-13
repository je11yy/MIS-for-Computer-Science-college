-- TABLES

CREATE TABLE students (
    student_id CHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sex VARCHAR(6) CHECK (sex IN ('male', 'female')),
    entrance_age INT CHECK (entrance_age BETWEEN 10 AND 50),
    entrance_year INT,
    class VARCHAR(20)
);

CREATE TABLE teachers (
    teacher_id CHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
    course_id CHAR(7) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credit INT CHECK (credit > 0),
    grade NUMERIC(5,2),
    canceled_year INT
);

CREATE TABLE course_teacher (
    course_id CHAR(7),
    teacher_id CHAR(5),
    PRIMARY KEY (course_id, teacher_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

CREATE TABLE course_choosing (
    student_id CHAR(10),
    course_id CHAR(7),
    chosen_year INT,
    score NUMERIC(5,2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL,
    student_id CHAR(10), 
    teacher_id CHAR(5),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- SEQUENCES

CREATE SEQUENCE IF NOT EXISTS student_id_seq;
CREATE SEQUENCE IF NOT EXISTS course_id_seq;
CREATE SEQUENCE IF NOT EXISTS teacher_id_seq;

-- STUDENTS RELATED FUNCTIONS

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
    RETURN QUERY SELECT * FROM students ORDER BY students.student_id;
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

CREATE OR REPLACE FUNCTION get_students_average_score_by_class(
    p_class VARCHAR
)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    avg_score NUMERIC(5,2);
BEGIN
    SELECT ROUND(AVG(cc.score), 2)
    INTO avg_score
    FROM students s
    JOIN course_choosing cc ON s.student_id = cc.student_id
    WHERE s.class = p_class;

    RETURN avg_score;
END;
$$ LANGUAGE plpgsql;

-- STUDENTS RELATED PROCEDURES

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

CREATE OR REPLACE PROCEDURE delete_student(p_student_id CHAR(10))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM students WHERE student_id = p_student_id;
END;
$$;

CREATE OR REPLACE PROCEDURE update_student_course_score(
    p_student_id CHAR(10),
    p_course_id CHAR(7),
    p_score NUMERIC(5,2)
) AS $$
BEGIN
    UPDATE course_choosing
    SET score = p_score
    WHERE student_id = p_student_id
      AND course_id = p_course_id;
END;
$$ LANGUAGE plpgsql; 

-- TEACHERS RELATED FUNCTIONS

CREATE OR REPLACE FUNCTION get_teacher(
    p_teacher_id CHAR(5)
)
RETURNS TABLE (
    teacher_id CHAR(5),
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM teachers s WHERE s.teacher_id = p_teacher_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_teachers()
RETURNS TABLE (
    teacher_id CHAR(5),
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM teachers ORDER BY teachers.teacher_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_teacher(
    p_name VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
    v_teacher_id VARCHAR;
BEGIN
    v_teacher_id := 'T' || LPAD(nextval('teacher_id_seq')::TEXT, 4, '0');

    INSERT INTO teachers (teacher_id, name)
    VALUES (v_teacher_id, p_name);

    RETURN v_teacher_id;
END;
$$ LANGUAGE plpgsql;

-- TEACHERS RELATED PROCEDURES

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

CREATE OR REPLACE PROCEDURE delete_teacher(p_teacher_id CHAR(5))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM teachers WHERE teacher_id = p_teacher_id;
END;
$$;

-- COURSES RELATED FUNCTIONS

CREATE OR REPLACE FUNCTION get_courses()
RETURNS TABLE (
    course_id CHAR(7),
    name VARCHAR,
    credit INT,
    grade NUMERIC,
    canceled_year INT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM courses ORDER BY courses.course_id;
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
    RETURN QUERY SELECT * FROM course_choosing ORDER BY course_choosing.student_id, course_choosing.course_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_course(p_course_id CHAR(7))
RETURNS TABLE (
    course_id CHAR(7),
    name VARCHAR,
    credit INT,
    grade NUMERIC,
    canceled_year INT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM courses c WHERE c.course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_course_scores(p_course_id CHAR(7))
RETURNS TABLE (
    student_id CHAR(10),
    student_name VARCHAR,
    score NUMERIC(5,2),
    chosen_year INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.student_id,
        s.name,
        cc.score,
        cc.chosen_year
    FROM
        course_choosing cc
    JOIN
        students s ON cc.student_id = s.student_id
    WHERE
        cc.course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_courses_by_teacher(
    p_teacher_id CHAR(5)
)
RETURNS TABLE (
    course_id CHAR(7),
    name VARCHAR,
    credit INT,
    grade NUMERIC,
    canceled_year INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.course_id,
        c.name,
        c.credit,
        c.grade,
        c.canceled_year
    FROM 
        courses c
    JOIN 
        course_teacher ct ON c.course_id = ct.course_id
    WHERE 
        ct.teacher_id = p_teacher_id;
END;
$$ LANGUAGE plpgsql;

-- COURSES RELATED PROCEDURES

CREATE OR REPLACE PROCEDURE insert_course(
    p_name VARCHAR,
    p_credit INT,
    p_grade NUMERIC,
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

CREATE OR REPLACE PROCEDURE update_course(
    p_course_id CHAR(7),
    p_name VARCHAR,
    p_credit INT,
    p_grade NUMERIC,
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

CREATE OR REPLACE PROCEDURE delete_course(p_course_id CHAR(7))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM courses WHERE course_id = p_course_id;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_course_teacher(
    p_course_id CHAR(7),
    p_teacher_id CHAR(5)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO course_teacher (course_id, teacher_id)
    VALUES (p_course_id, p_teacher_id);
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

CREATE OR REPLACE PROCEDURE insert_course_choosing_if_not_exists(
    p_student_id CHAR(10),
    p_course_id CHAR(7)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_year INT := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM course_choosing
        WHERE student_id = p_student_id AND course_id = p_course_id
    ) THEN
        INSERT INTO course_choosing (student_id, course_id, chosen_year, score)
        VALUES (p_student_id, p_course_id, v_current_year, NULL);
    END IF;
END;
$$;

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

-- OTHER FUNCTIONS

CREATE OR REPLACE FUNCTION get_user(
    p_username VARCHAR
)
RETURNS TABLE (
    username VARCHAR,
    password TEXT,
    role VARCHAR,
    student_id CHAR(10),
    teacher_id CHAR(5)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.username,
        u.password_hash AS password,
        u.role,
        u.student_id,
        u.teacher_id
    FROM
        users u
    WHERE
        u.username = p_username;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_statistics()
RETURNS TABLE (
    total_students INT,
    total_teachers INT,
    total_courses INT,
    total_classes INT,
    average_score NUMERIC(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INT FROM students),
        (SELECT COUNT(*)::INT FROM teachers),
        (SELECT COUNT(*)::INT FROM courses),
        (SELECT COUNT(DISTINCT class)::INT FROM students),
        (SELECT ROUND(AVG(score), 2) FROM course_choosing WHERE score IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- OTHER PROCEDURES

CREATE OR REPLACE PROCEDURE insert_user(
    p_username VARCHAR,
    p_password_hash TEXT,
    p_role VARCHAR,
    p_student_id CHAR(10),
    p_teacher_id CHAR(5)
) AS $$
BEGIN
    INSERT INTO users (username, password_hash, role, student_id, teacher_id)
    VALUES (p_username, p_password_hash, p_role, p_student_id, p_teacher_id);
END;
$$ LANGUAGE plpgsql;

-- FILLING

SELECT * FROM insert_teacher('Dr. John Smith');
SELECT * FROM insert_teacher('Prof. Maria Johnson');
SELECT * FROM insert_teacher('Dr. Hiroshi Suzuki');
SELECT * FROM insert_teacher('Dr. Anja Müller');
SELECT * FROM insert_teacher('Prof. Elena Petrova');
SELECT * FROM insert_teacher('Dr. Markus Schmidt');
SELECT * FROM insert_teacher('Dr. Chen Wei');
SELECT * FROM insert_teacher('Prof. Laura García');

CALL insert_course('Mathematics', 3, 0.0, NULL);
CALL insert_course('Physics', 4, 0.0, 2022);
CALL insert_course('Literature', 3, 0.0, NULL);
CALL insert_course('Biology', 3, 0.0, 2023);
CALL insert_course('Computer Science', 5, 0.0, NULL);
CALL insert_course('History', 3, 0.0, NULL);
CALL insert_course('Chemistry', 4, 0.0, 2021);
CALL insert_course('Philosophy', 2, 0.0, NULL);
CALL insert_course('Economics', 3, 0.0, NULL);
CALL insert_course('Art History', 2, 0.0, NULL);
CALL insert_course('Environmental Science', 4, 0.0, NULL);
CALL insert_course('Sociology', 3, 0.0, NULL);
CALL insert_course('Political Science', 3, 0.0, NULL);
CALL insert_course('Music Theory', 2, 0.0, NULL);
CALL insert_course('Statistics', 4, 0.0, NULL);
CALL insert_course('Psychology', 3, 0.0, NULL);

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
CALL insert_student('Emma Johansson', 'female', 21, 2021, 'C');
CALL insert_student('Noah Müller', 'male', 22, 2020, 'A');
CALL insert_student('Chloe Dubois', 'female', 20, 2022, 'B');
CALL insert_student('Mateo Rossi', 'male', 23, 2019, 'C');
CALL insert_student('Lena Schmidt', 'female', 19, 2023, 'A');
CALL insert_student('Ethan Brown', 'male', 21, 2021, 'B');
CALL insert_student('Sofia García', 'female', 22, 2020, 'C');
CALL insert_student('Lucas Wang', 'male', 20, 2022, 'A');
CALL insert_student('Isabelle Martin', 'female', 23, 2019, 'B');
CALL insert_student('Daniel Kim', 'male', 21, 2021, 'C');

CALL insert_course_teacher('C000009', 'T00005'); -- Economics - Prof. Elena Petrova
CALL insert_course_teacher('C000010', 'T00006'); -- Art History - Dr. Markus Schmidt
CALL insert_course_teacher('C000011', 'T00007'); -- Environmental Science - Dr. Chen Wei
CALL insert_course_teacher('C000012', 'T00008'); -- Sociology - Prof. Laura García
CALL insert_course_teacher('C000013', 'T00005'); -- Political Science - Prof. Elena Petrova
CALL insert_course_teacher('C000014', 'T00006'); -- Music Theory - Dr. Markus Schmidt
CALL insert_course_teacher('C000015', 'T00007'); -- Statistics - Dr. Chen Wei
CALL insert_course_teacher('C000016', 'T00008'); -- Psychology - Prof. Laura García
CALL insert_course_teacher('C000001', 'T00005'); -- Prof. Elena Petrova
CALL insert_course_teacher('C000001', 'T00007'); -- Dr. Chen Wei
CALL insert_course_teacher('C000002', 'T00006'); -- Dr. Markus Schmidt
CALL insert_course_teacher('C000003', 'T00007'); -- Dr. Chen Wei
CALL insert_course_teacher('C000003', 'T00008'); -- Prof. Laura García
CALL insert_course_teacher('C000004', 'T00005'); -- Prof. Elena Petrova
CALL insert_course_teacher('C000005', 'T00006'); -- Dr. Markus Schmidt
CALL insert_course_teacher('C000009', 'T00008'); -- Prof. Laura García

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
CALL insert_course_choosing('S000000012', 'C000009', 2021, 88.0);
CALL insert_course_choosing('S000000013', 'C000010', 2020, 92.5);
CALL insert_course_choosing('S000000014', 'C000011', 2022, 85.0);
CALL insert_course_choosing('S000000015', 'C000012', 2019, 90.0);
CALL insert_course_choosing('S000000016', 'C000013', 2023, 87.5);
CALL insert_course_choosing('S000000017', 'C000014', 2021, 89.0);
CALL insert_course_choosing('S000000018', 'C000015', 2020, 91.5);
CALL insert_course_choosing('S000000019', 'C000016', 2022, 86.0);
CALL insert_course_choosing('S000000020', 'C000009', 2019, 93.0);
CALL insert_course_choosing('S000000012', 'C000010', 2021, 88.5);
CALL insert_course_choosing('S000000013', 'C000011', 2020, 90.0);
CALL insert_course_choosing('S000000014', 'C000012', 2022, 84.0);
CALL insert_course_choosing('S000000015', 'C000013', 2019, 89.5);
CALL insert_course_choosing('S000000016', 'C000014', 2023, 87.0);
CALL insert_course_choosing('S000000017', 'C000015', 2021, 92.0);
CALL insert_course_choosing('S000000018', 'C000016', 2020, 85.5);
CALL insert_course_choosing('S000000019', 'C000009', 2022, 90.0);
CALL insert_course_choosing('S000000020', 'C000010', 2019, 88.0);
CALL insert_course_choosing('S000000012', 'C000001', 2021, 91.0); -- Mathematics
CALL insert_course_choosing('S000000012', 'C000004', 2021, 87.0); -- Literature
CALL insert_course_choosing('S000000013', 'C000002', 2020, 85.5); -- Comp. Sci.
CALL insert_course_choosing('S000000013', 'C000003', 2020, 86.0); -- Chemistry
CALL insert_course_choosing('S000000014', 'C000004', 2022, 89.5); -- Literature
CALL insert_course_choosing('S000000014', 'C000005', 2022, 90.5); -- History
CALL insert_course_choosing('S000000015', 'C000001', 2019, 80.0); -- Mathematics
CALL insert_course_choosing('S000000015', 'C000003', 2019, 82.5); -- Chemistry
CALL insert_course_choosing('S000000016', 'C000002', 2023, 88.0); -- Comp. Sci.
CALL insert_course_choosing('S000000016', 'C000005', 2023, 85.5); -- History
CALL insert_course_choosing('S000000017', 'C000001', 2021, 84.0); -- Mathematics
CALL insert_course_choosing('S000000017', 'C000004', 2021, 82.0); -- Literature
CALL insert_course_choosing('S000000018', 'C000002', 2020, 86.5); -- Comp. Sci.
CALL insert_course_choosing('S000000018', 'C000003', 2020, 87.0); -- Chemistry
CALL insert_course_choosing('S000000019', 'C000005', 2022, 83.0); -- History
CALL insert_course_choosing('S000000019', 'C000001', 2022, 89.5); -- Mathematics
CALL insert_course_choosing('S000000020', 'C000004', 2019, 91.0); -- Literature
CALL insert_course_choosing('S000000020', 'C000002', 2019, 88.5); -- Comp. Sci.
CALL insert_course_choosing('S000000021', 'C000003', 2021, 90.0); -- Chemistry
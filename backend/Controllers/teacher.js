const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT library
const router = express.Router();
const sequelize = require('../db/connectDB');
const { QueryTypes } = require('sequelize');
const auth = require('../Middleware/auth'); // Import the auth middleware

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login Email:', email);
        console.log('Login Password:', password);

        const [results] = await sequelize.query(
            'SELECT * FROM teachers WHERE email = :email AND password = :password',
            {
                replacements: { email, password },
                type: QueryTypes.SELECT,
            }
        );

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('Login Results:', results);

        const teacher = results;
        console.log('Teacher Found:', teacher);

        const token = jwt.sign(
            { id: teacher.TeacherID, email: teacher.email },
            'hardcoded-secret-key',

        );

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error.message, error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password, subject, courseTitle, courseDescription, courseType } = req.body; // Include course details in the request body
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        // Insert teacher into the teachers table
        const [teacherResults, teacherMetadata] = await sequelize.query(
            'INSERT INTO teachers (name, email, password, subject) VALUES (:name, :email, :password, :subject)',
            {
                replacements: { name, email, password, subject },
                type: QueryTypes.INSERT,
                transaction, // Use the transaction
            }
        );

        const teacherId = teacherResults; // Get the inserted teacher's ID

        // Insert course into the courses table
        const [courseResults, courseMetadata] = await sequelize.query(
            'INSERT INTO courses (title, description, type, teacherId) VALUES (:title, :description, :type, :teacherId)',
            {
                replacements: {
                    title: courseTitle,
                    description: courseDescription,
                    type: courseType,
                    teacherId: teacherId,
                },
                type: QueryTypes.INSERT,
                transaction, // Use the transaction
            }
        );

        // Commit the transaction
        await transaction.commit();

        res.status(201).json({ message: 'Teacher and course created successfully', teacherId, courseId: courseResults[0] });
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-student',auth, async (req, res) => {
    const { name, age, grade, progress } = req.body; // Include new fields in the request body
    const teacherId = req.user.id; // Get the teacher's ID from req.user (set by auth middleware)
    try {
        const results = await sequelize.query(
            'INSERT INTO students (name, age, grade, progress) VALUES (:name, :age, :grade, :progress)', // Add new fields to the query
            {
                replacements: { name, age, grade, progress }, // Add new fields to replacements
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Student added successfully', studentId: results[0] });
    } catch (error) {
        console.error('Error during adding student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-parent', async (req, res) => {
    const { name, studentId } = req.body; // Include new fields in the request body
    try {
        const results = await sequelize.query(
            'INSERT INTO parents (name, studentId) VALUES (:name, :studentId)', // Add new fields to the query
            {
                replacements: { name, studentId }, // Add new fields to replacements
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Parent added successfully', parentId: results[0] });
    } catch (error) {
        console.error('Error during adding parent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-quiz', auth, async (req, res) => {
    const { title, totalQuestions, courseId } = req.body; // Include quiz details in the request body
    const teacherId = req.user.id; // Get the teacher's ID from req.user (set by auth middleware)

    try {
        const results = await sequelize.query(
            'INSERT INTO quizzes (Title, TotalQuestions, CourseID) VALUES (:title, :totalQuestions, :courseId)', // Updated query to match schema
            {
                replacements: { title, totalQuestions, courseId}, // Add TotalQuestions to replacements
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Quiz added successfully', quizId: results });
    } catch (error) {
        console.error('Error during adding quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-result', auth, async (req, res) => {
    const { studentId, quizId, score, takenOn } = req.body; // Include result details in the request body

    try {
        const results = await sequelize.query(
            'INSERT INTO results (StudentID, QuizID, Score, TakenOn) VALUES (:studentId, :quizId, :score, :takenOn)', // Add result details to the query
            {
                replacements: { studentId, quizId, score, takenOn }, // Add result details to replacements
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Result added successfully', resultId: results[0] });
    } catch (error) {
        console.error('Error during adding result:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/students', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM students', { type: QueryTypes.SELECT });
        res.status(200).json({ students: results });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/students/:studentId', auth, async (req, res) => {
    const { studentId } = req.params;
    const { name, age, grade, progress } = req.body; // Remove teacherId from the request body
    const teacherId = req.user.id; // Get teacherId from req.user

    try {
        const results = await sequelize.query(
            'UPDATE students SET name = :name, age = :age, grade = :grade, progress = :progress WHERE StudentID = :studentId',
            {
                replacements: { name, age, grade, progress, studentId },
                type: QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const results = await sequelize.query(
        'SELECT * FROM students WHERE StudentID = :studentId',
        {
          replacements: { studentId },
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.status(200).json({ student: results }); // Return the student details
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.delete('/students/:studentId', auth, async (req, res) => {
    const { studentId } = req.params;

    try {
        await sequelize.query(
            'DELETE FROM students WHERE StudentID = :studentId',
            {
                replacements: { studentId },
                type: QueryTypes.DELETE,
            }
        );
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM courses', { type: QueryTypes.SELECT });
        res.status(200).json({ courses: results });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/courses/:courseId', async (req, res) => {
    const { courseId } = req.params; // Extract courseId from the request parameters

    try {
        // Fetch the course details by courseId
        const results = await sequelize.query(
            'SELECT * FROM courses WHERE CourseID = :courseId',
            {
                replacements: { courseId },
                type: QueryTypes.SELECT,
            }
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ course: results[0] }); // Return the course details
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-course', auth, async (req, res) => {
    const { title, description, type } = req.body;

    try {
        // Insert the course into the database
        const results = await sequelize.query(
            'INSERT INTO courses (Title, Description, Type) VALUES (:title, :description, :type)',
            {
                replacements: { title, description, type },
                type: QueryTypes.INSERT,
            }
        );

        res.status(201).json({ message: 'Course added successfully', courseId: results });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.put('/courses/:courseId', auth, async (req, res) => {
    const { courseId } = req.params;
    const { title, description, type } = req.body; // Remove teacherId from the request body
    const teacherId = req.user.id; // Get teacherId from req.user

    try {
        const results = await sequelize.query(
            'UPDATE courses SET title = :title, description = :description, type = :type, teacherId = :teacherId WHERE CourseID = :courseId',
            {
                replacements: { title, description, type, teacherId, courseId },
                type: QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/courses/:courseId', auth, async (req, res) => {
    const { courseId } = req.params;

    try {
        await sequelize.query(
            'DELETE FROM courses WHERE CourseID = :courseId',
            {
                replacements: { courseId },
                type: QueryTypes.DELETE,
            }
        );
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/quizzes/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        const results = await sequelize.query(
            'SELECT * FROM quizzes WHERE QuizId = :quizId',
            {
                replacements: { quizId },
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json({ quiz: results[0] });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/quizzes/:quizId', auth, async (req, res) => {
    const { quizId } = req.params;
    const { title, courseId, totalQuestions } = req.body; // Include only fields from the schema

    try {
        const results = await sequelize.query(
            'UPDATE quizzes SET Title = :title, CourseID = :courseId, TotalQuestions = :totalQuestions WHERE QuizID = :quizId',
            {
                replacements: { title, courseId, totalQuestions, quizId },
                type: QueryTypes.UPDATE,    
            }
        );
        res.status(200).json({ message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/quizzes/:quizId', auth, async (req, res) => {
    const { quizId } = req.params;

    try {
        await sequelize.query(
            'DELETE FROM quizzes WHERE QuizID = :quizId',
            {
                replacements: { quizId },
                type: QueryTypes.DELETE,
            }
        );
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/quizzes', async (req, res) => {
    try {
      const results = await sequelize.query('SELECT * FROM quizzes', { type: QueryTypes.SELECT });
       // Log the quizzes data to the console
      res.status(200).json({ quizzes: results }); // Return the list of quizzes
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/results/:resultId', async (req, res) => {
    const { resultId } = req.params;
    try {
        const results = await sequelize.query(
            'SELECT * FROM results WHERE resultId = :resultId',
            {
                replacements: { resultId },
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json({ results: results[0] });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/results', async (req, res) => {
    try {
      const results = await sequelize.query('SELECT * FROM results', { type: QueryTypes.SELECT });
      res.status(200).json({ results: results }); // Return the list of results
    } catch (error) {
      console.error('Error fetching results:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.put('/results/:resultId', auth, async (req, res) => {
    const { resultId } = req.params;
    const { studentId, quizId, score, takenOn } = req.body;

    try {
        const results = await sequelize.query(
            'UPDATE results SET StudentID = :studentId, QuizID = :quizId, Score = :score, TakenOn = :takenOn WHERE ResultID = :resultId',
            {
                replacements: { studentId, quizId, score, takenOn, resultId },
                type: QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Result updated successfully' });
    } catch (error) {
        console.error('Error updating result:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/results/:resultId', async (req, res) => {
    const { resultId } = req.params;
  
    try {
      const results = await sequelize.query(
        'SELECT * FROM results WHERE ResultID = :resultId',
        {
          replacements: { resultId },
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json({ result: results[0] }); // Return the result details
    } catch (error) {
      console.error('Error fetching result details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.delete('/results/:resultId', auth, async (req, res) => {
    const { resultId } = req.params;

    try {
        await sequelize.query(
            'DELETE FROM results WHERE ResultID = :resultId',
            {
                replacements: { resultId },
                type: QueryTypes.DELETE,
            }
        );
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/parents', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM parents', { type: QueryTypes.SELECT });
        res.status(200).json({ parents: results });
    } catch (error) {
        console.error('Error fetching parents:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/parents/:parentId', async (req, res) => {
    const { parentId } = req.params;
  
    try {
      const results = await sequelize.query(
        'SELECT * FROM parents WHERE ParentID = :parentId',
        {
          replacements: { parentId },
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Parent not found' });
      }
  
      res.status(200).json({ parent: results[0] }); // Return the parent details
    } catch (error) {
      console.error('Error fetching parent details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.put('/parents/:parentId', auth, async (req, res) => {
    const { parentId } = req.params;
    const { name, studentId } = req.body;

    try {
        const results = await sequelize.query(
            'UPDATE parents SET name = :name, studentId = :studentId WHERE ParentID = :parentId',
            {
                replacements: { name, studentId, parentId },
                type: QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Parent updated successfully' });
    } catch (error) {
        console.error('Error updating parent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/parents/:parentId', auth, async (req, res) => {
    const { parentId } = req.params;

    try {
        await sequelize.query(
            'DELETE FROM parents WHERE ParentID = :parentId',
            {
                replacements: { parentId },
                type: QueryTypes.DELETE,
            }
        );
        res.status(200).json({ message: 'Parent deleted successfully' });
    } catch (error) {
        console.error('Error deleting parent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/teachers', async (req, res) => {
    try {
        const results = await sequelize.query('SELECT * FROM teachers', { type: QueryTypes.SELECT });
        res.status(200).json({ teachers: results });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/quizzes/:quizId', async (req, res) => {
    const { quizId } = req.params;
  
    try {
      const results = await sequelize.query(
        'SELECT * FROM quizzes WHERE QuizID = :quizId',
        {
          replacements: { quizId },
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.status(200).json({ quiz: results[0] }); // Return the quiz details
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/quiz-results/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        const results = await sequelize.query(
            'SELECT * FROM results WHERE QuizID = :quizId',
            {
                replacements: { quizId },
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json({ results: results });
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router
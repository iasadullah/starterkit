CREATE OR REPLACE FUNCTION create_course(course_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_course_id UUID;
  module_data JSONB;
  lesson_data JSONB;
  quiz_data JSONB;
  question_data JSONB;
  media_item_data JSONB;
  question_type question_type;
BEGIN
  -- Insert course
  INSERT INTO courses (id, title, description, category, is_published, created_by)
  VALUES (
    (course_data->>'id')::UUID,
    course_data->>'title',
    course_data->>'description',
    course_data->>'category',
    (course_data->>'is_published')::boolean,
    (course_data->>'created_by')::UUID
  )
  RETURNING id INTO new_course_id;

  -- Insert modules
  FOR module_data IN SELECT * FROM jsonb_array_elements(course_data->'modules')
  LOOP
    INSERT INTO course_modules (id, course_id, title, description, position)
    VALUES (
      (module_data->>'id')::UUID,
      new_course_id,
      module_data->>'title',
      module_data->>'description',
      (module_data->>'position')::integer
    );

    -- Insert lessons
    FOR lesson_data IN SELECT * FROM jsonb_array_elements(module_data->'lessons')
    LOOP
      INSERT INTO lessons (id, module_id, title, content, position, is_prerequisite, is_published)
      VALUES (
        (lesson_data->>'id')::UUID,
        (module_data->>'id')::UUID,
        lesson_data->>'title',
        lesson_data->>'content',
        (lesson_data->>'position')::integer,
        (lesson_data->>'is_prerequisite')::boolean,
        (lesson_data->>'is_published')::boolean
      );

      -- Insert media items
      FOR media_item_data IN SELECT * FROM jsonb_array_elements(lesson_data->'media_items')
      LOOP
        INSERT INTO media_library (id, url, type, uploaded_by, course_id)
        VALUES (
          (media_item_data->>'id')::UUID,
          media_item_data->>'url',
          (media_item_data->>'type')::media_type,
          (course_data->>'created_by')::UUID,
          new_course_id
        );
      END LOOP;

      -- Insert quizzes
      FOR quiz_data IN SELECT * FROM jsonb_array_elements(lesson_data->'quizzes')
      LOOP
        INSERT INTO quizzes (id, lesson_id, title, max_attempts)
        VALUES (
          (quiz_data->>'id')::UUID,
          (lesson_data->>'id')::UUID,
          quiz_data->>'title',
          (quiz_data->>'max_attempts')::integer
        );

        -- Insert questions
        FOR question_data IN SELECT * FROM jsonb_array_elements(quiz_data->'questions')
        LOOP
          -- Convert the question type to the correct enum value
          CASE question_data->>'type'
            WHEN 'multiple_choice' THEN question_type := 'multiple_choice'::question_type;
            WHEN 'true_false' THEN question_type := 'true_false'::question_type;
            WHEN 'essay' THEN question_type := 'essay'::question_type;
            -- Add more cases as needed
            ELSE
              RAISE EXCEPTION 'Invalid question type: %', question_data->>'type';
          END CASE;

          INSERT INTO questions (id, quiz_id, type, question_text, options, correct_answer)
          VALUES (
            (question_data->>'id')::UUID,
            (quiz_data->>'id')::UUID,
            question_type,
            question_data->>'question_text',
            question_data->'options',
            question_data->'correct_answer'
          );
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;

  RETURN new_course_id;
END;
$$;
-- Test the create_course function
DO $$
DECLARE
  sample_course JSONB := '{
    "id": "038d7837-0c61-42e3-a893-2cbdd994f3c4",
    "title": "Introduction to Web Development",
    "description": "Learn the basics of HTML, CSS, and JavaScript",
    "category": "Programming",
    "created_by": "038d7837-0c61-42e3-a893-2cbdd994f3c4",
    "is_published": false,
    "modules": [
      {
        "id": "223e4567-e89b-12d3-a456-426614174001",
        "title": "HTML Basics",
        "description": "Learn the fundamentals of HTML",
        "position": 0,
        "lessons": [
          {
            "id": "323e4567-e89b-12d3-a456-426614174002",
            "title": "Introduction to HTML Tags",
            "content": "<p>In this lesson, we will cover basic HTML tags.</p>",
            "position": 0,
            "is_prerequisite": true,
            "is_published": true,
            "media_items": [
              {
                "id": "423e4567-e89b-12d3-a456-426614174003",
                "type": "image",
                "url": "https://example.com/html-structure.png",
                "name": "HTML Structure Diagram"
              }
            ],
            "quizzes": [
              {
                "id": "523e4567-e89b-12d3-a456-426614174004",
                "title": "HTML Basics Quiz",
                "max_attempts": 3,
                "questions": [
                  {
                    "id": "623e4567-e89b-12d3-a456-426614174005",
                    "type": "multiple_choice",
                    "question_text": "Which tag is used for the largest heading?",
                    "options": [
                      {"id": "1", "text": "<h1>", "is_correct": true},
                      {"id": "2", "text": "<h6>", "is_correct": false},
                      {"id": "3", "text": "<p>", "is_correct": false}
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }';
  new_course_id UUID;
BEGIN
  -- Call the function with our sample data
  new_course_id := create_course(sample_course);

  -- Output the result
  RAISE NOTICE 'New course created with ID: %', new_course_id;

  -- Verify the data was inserted correctly
  RAISE NOTICE 'Course title: %', (SELECT title FROM courses WHERE id = new_course_id);
  RAISE NOTICE 'Number of modules: %', (SELECT COUNT(*) FROM course_modules WHERE course_id = new_course_id);
  RAISE NOTICE 'Number of lessons: %', (SELECT COUNT(*) FROM lessons WHERE module_id IN (SELECT id FROM course_modules WHERE course_id = new_course_id));
  RAISE NOTICE 'Number of media items: %', (SELECT COUNT(*) FROM media_library WHERE course_id = new_course_id);
  RAISE NOTICE 'Number of quizzes: %', (SELECT COUNT(*) FROM quizzes WHERE lesson_id IN (SELECT id FROM lessons WHERE module_id IN (SELECT id FROM course_modules WHERE course_id = new_course_id)));
  RAISE NOTICE 'Number of questions: %', (SELECT COUNT(*) FROM questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id IN (SELECT id FROM lessons WHERE module_id IN (SELECT id FROM course_modules WHERE course_id = new_course_id))));
END $$;

-- After running the test, you can clean up the test data:
-- DELETE FROM courses WHERE id = '038d7837-0c61-42e3-a893-2cbdd994f3c4';
-- Note: This will cascade delete all related data due to foreign key constraints

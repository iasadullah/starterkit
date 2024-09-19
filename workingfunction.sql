
DECLARE
  new_course_id UUID;
  new_module_id UUID;
  new_lesson_id UUID;
  new_quiz_id UUID;
  module_data JSONB;
  lesson_data JSONB;
  quiz_data JSONB;
  question_data JSONB;
  media_item_data JSONB;
  file_extension TEXT;
BEGIN
  -- Generate a new UUID for the course
  new_course_id := gen_random_uuid();

  -- Insert course
  INSERT INTO courses (id, title, description, category, is_published, created_by)
  VALUES (
    new_course_id,
    course_data->>'title',
    course_data->>'description',
    course_data->>'category',
    COALESCE((course_data->>'is_published')::boolean, false),
    COALESCE((course_data->>'created_by')::UUID, '00000000-0000-0000-0000-000000000000'::UUID)
  );

  -- Insert modules
  FOR module_data IN SELECT * FROM jsonb_array_elements(course_data->'modules')
  LOOP
    new_module_id := gen_random_uuid();
    INSERT INTO course_modules (id, course_id, title, description, position)
    VALUES (
      new_module_id,
      new_course_id,
      module_data->>'title',
      module_data->>'description',
      COALESCE((module_data->>'position')::integer, 0)
    );

    -- Insert lessons
    FOR lesson_data IN SELECT * FROM jsonb_array_elements(module_data->'lessons')
    LOOP
      new_lesson_id := gen_random_uuid();
      INSERT INTO lessons (id, module_id, title, content, position, is_prerequisite, is_published)
      VALUES (
        new_lesson_id,
        new_module_id,
        lesson_data->>'title',
        lesson_data->>'content',
        COALESCE((lesson_data->>'position')::integer, 0),
        COALESCE((lesson_data->>'is_prerequisite')::boolean, false),
        COALESCE((lesson_data->>'is_published')::boolean, false)
      );

      -- Insert media items
      IF jsonb_array_length(lesson_data->'media_items') > 0 THEN
        FOR media_item_data IN SELECT * FROM jsonb_array_elements(lesson_data->'media_items')
        LOOP
          -- Extract file extension from URL
          file_extension := lower(substring(media_item_data->>'url' from '\.([^.]+)$'));

          INSERT INTO media_library (id, url, type, file_extension, uploaded_by, course_id)
          VALUES (
            gen_random_uuid(),
            media_item_data->>'url',
            CASE
              WHEN file_extension IN ('jpg', 'jpeg', 'png', 'gif', 'webp') THEN 'image'
              WHEN file_extension IN ('mp4', 'avi', 'mov', 'webm') THEN 'video'
              WHEN file_extension IN ('pdf', 'doc', 'docx', 'txt') THEN 'document'
              WHEN file_extension IN ('mp3', 'wav', 'ogg') THEN 'audio'
              WHEN file_extension IN ('xls', 'xlsx', 'csv') THEN 'spreadsheet'
              WHEN file_extension IN ('ppt', 'pptx') THEN 'presentation'
              ELSE 'document'  -- Default to document if unknown
            END::media_type,
            file_extension,
            COALESCE((course_data->>'created_by')::UUID, '00000000-0000-0000-0000-000000000000'::UUID),
            new_course_id
          );
        END LOOP;
      END IF;

      -- Insert quizzes (unchanged)
      IF jsonb_array_length(lesson_data->'quizzes') > 0 THEN
        FOR quiz_data IN SELECT * FROM jsonb_array_elements(lesson_data->'quizzes')
        LOOP
          new_quiz_id := gen_random_uuid();
          INSERT INTO quizzes (id, lesson_id, title, max_attempts)
          VALUES (
            new_quiz_id,
            new_lesson_id,
            quiz_data->>'title',
            COALESCE((quiz_data->>'max_attempts')::integer, 1)
          );

          -- Insert questions (unchanged)
          IF jsonb_array_length(quiz_data->'questions') > 0 THEN
            FOR question_data IN SELECT * FROM jsonb_array_elements(quiz_data->'questions')
            LOOP
              INSERT INTO questions (id, quiz_id, type, question_text, options, correct_answer)
              VALUES (
                gen_random_uuid(),
                new_quiz_id,
                (question_data->>'type')::question_type,
                question_data->>'question_text',
                question_data->'options',
                question_data->'correct_answer'
              );
            END LOOP;
          END IF;
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;

  RETURN new_course_id;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating course: %', SQLERRM;
    RETURN NULL;
END;

-- Test the create_course function

CREATE OR REPLACE FUNCTION get_all_courses()
RETURNS TABLE (
    course_id UUID,
    title VARCHAR(255),
    description TEXT,
    is_published BOOLEAN,
    created_at TIMESTAMP,
    creator_id UUID,
    creator_name VARCHAR(511),  -- To accommodate concatenated first_name and last_name
    creator_email VARCHAR(255)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS course_id,
        c.title,
        c.description,
        c.is_published,
        c.created_at,
        u.id AS creator_id,
        (u.first_name || ' ' || u.last_name)::VARCHAR(511) AS creator_name,
        u.email AS creator_email
    FROM
        courses c
    JOIN
        users u ON c.created_by = u.id
    ORDER BY
        c.created_at DESC;
END;
$$;
